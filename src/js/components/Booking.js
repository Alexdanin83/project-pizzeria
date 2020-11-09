
import {select,templates} from '../settings.js';
import amountWidget from './amountWidget.js';
//import utils from '../utils.js';
class Booking{
  constructor(bookingWidget){
    const thisBooking  = this;
    thisBooking.render(bookingWidget);
    thisBooking.initWidgets();
  }
  render(bookingWidget){
    const thisBooking  = this;
    const generateHTML = templates.bookingWidget();

    //pytanie dla chego nie wykorzysujemy
    //const generateHTMLfromDom = utils.createDOMFromHTML(generateHTML);
    thisBooking.dom = {};
    thisBooking.dom = bookingWidget;
    thisBooking.dom.innerHTML = generateHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.querySelector(select.booking.hoursAmount);
    console.log(thisBooking.dom);
    //thisBooking.dom = utils.createDOMFromHTML(generateHTML);
  }
  initWidgets() {
    const thisBooking  = this;
    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount =  new amountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;
