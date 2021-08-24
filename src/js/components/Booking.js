import { classNames, select, settings, templates, } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';



class Booking {
  constructor(wrapper) {
    const thisBooking = this;

    thisBooking.tableSelected = ''; //przygotowanie wlasciwosci do przechowywania informacji o wybranym stoliku 
    
    thisBooking.render(wrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initTables();
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    //console.log('getData params', params); 

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking 
                                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
                                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event
                                     + '?' + params.eventsRepeat.join('&'), 
    };

    //console.log('getData urls', urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponse){
        const bookingsResponse = allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        const eventsRepeatResponse = allResponse[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        //console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    
    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate; 
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    //console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock+= 0.5){
      //console.log('loop', hourBlock); 
    

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }


      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this; 

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true; 
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  render(wrapper) {
    const thisBooking = this; 

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = wrapper; 

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    //console.log('div stolika', thisBooking.dom.tables );
    //dostep do diva stolika 
    
  }

  initTables(){
    const thisBooking = this;

    for(let table of thisBooking.dom.tables){
      //console.log('stolik z div stolika', table);
      table.addEventListener('click', function(event){

        /* Remove 'selected' class from any other element than eventTarget */
        /*do tableId przypisana jest wartosc zero a dalej warunikiem zekonczenia petli jest thisBooking.dom.tables.length czyli 3 bo length ma wartosc 3 nastepnie inkrementacja*/
        for(let tableId = 0; tableId < thisBooking.dom.tables.length; tableId++){
          //console.log('id stolika', tableId);
          //console.log('div stolika z length', thisBooking.dom.tables.length);
          if (thisBooking.dom.tables[tableId] === event.target)
            continue;
          //console.log('div stolika z tableId', thisBooking.dom.tables[tableId]);
          //console.log('event target', event.target);
          thisBooking.dom.tables[tableId].classList.remove(classNames.booking.tableSelected);
        }

        if(table.classList.contains(classNames.booking.tableBooked)){
          alert('Ten stolik jest zajęty');
        }else{
          table.classList.toggle(classNames.booking.tableSelected);
          thisBooking.tableSelected = table.getAttribute('data-table');
        }
      });
    }
  }
  resetTables(){
    const thisBooking = this;
    for(let table of thisBooking.dom.tables){
      table.classList.remove(classNames.booking.tableSelected);
    }
  }

  initWidgets(){
    const thisBooking = this; 

    thisBooking.peopleAmount = new AmountWidget(
      thisBooking.dom.peopleAmount
    );
    
    thisBooking.hoursAmount = new AmountWidget(
      thisBooking.dom.hoursAmount
    );
    


    thisBooking.hourPicker = new HourPicker(
      thisBooking.dom.hourPicker
    );
    

    thisBooking.datePicker = new DatePicker(
      thisBooking.dom.datePicker
    );
    
    
    thisBooking.dom.wrapper.addEventListener('updated',function(){    
      thisBooking.updateDOM();
      thisBooking.resetTables();  
    });

  }
}

export default Booking;
