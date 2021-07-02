class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.getElements(element);
  }

  getElements(element) {
    thisBooking = this;

    thisBooking.element = element; 
  }
}

export default Booking;
