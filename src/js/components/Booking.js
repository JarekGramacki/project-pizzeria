import { select, templates, } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';



class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.getElements(element);
    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  getElements(element) {
    const thisBooking = this;

    thisBooking.element = element;
  

  }

  render(element) {
    const thisBooking = this; 

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = element; 

    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    
  }

  initWidgets(){
    const thisBooking = this; 

    thisBooking.peopleAmount = new AmountWidget(
      thisBooking.dom.peopleAmount
    );
    thisBooking.dom.peopleAmount.addEventListener('updated',function(){}); 


    thisBooking.hoursAmount = new AmountWidget(
      thisBooking.dom.hoursAmount
    );
    thisBooking.dom.hoursAmount.addEventListener('updated',function(){});



    thisBooking.hourPickerWidget = new HourPicker(
      thisBooking.dom.hourPicker
    );
    thisBooking.dom.hourPicker.addEventListener('updated',function(){});

    thisBooking.datePickerWidget = new DatePicker(
      thisBooking.dom.datePicker
    );
    thisBooking.dom.datePicker.addEventListener('updated',function(){});
  }
}

export default Booking;
