/*global utils, templates */
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

    const generatedHTML = templates.bookingWidget(thisBooking);

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element; 

    thisBooking.dom.wrapper = utils.createDOMFromHTML(generatedHTML); 

  }
}

export default Booking;
