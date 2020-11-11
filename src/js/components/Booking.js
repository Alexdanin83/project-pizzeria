
import {select,templates} from '../settings.js';
import amountWidget from './amountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
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

    thisBooking.dom.datePicker = thisBooking.dom.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.querySelector(select.widgets.hourPicker.wrapper);
    console.log(thisBooking.dom);
    //thisBooking.dom = utils.createDOMFromHTML(generateHTML);
  }
  initWidgets() {
    const thisBooking  = this;
    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount =  new amountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }
}

export default Booking;
