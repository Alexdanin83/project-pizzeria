
import {settings,select,templates, classNames} from '../settings.js';
import amountWidget from './AmountWidget.js';
import utils from '../utils.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
//import utils from '../utils.js';
class Booking{
  constructor(wrapper){
    const thisBooking  = this;
    thisBooking.render(wrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initBookingForm();
  }

  getData() {
    const thisBooking  = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    const params = {
      booking:[
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
      booking:       settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),//adress end point API return number of reservation
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),// return events
      eventsRepeat:  settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };
    //console.log('url', urls);
    // wysyła dane do servera
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses) {
      // zwróci nam wynik w formacie Json
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      //odpowiedź json po przetworzeniu formatu
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
        //console.log('bookings',bookings);
        //console.log('eventsCurrent',eventsCurrent);
        //console.log('eventsRepeat',eventsRepeat);
      });

  }
  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};
    for (let item of bookings){
      //thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
      for( let i = 0; i <  item.table.length; i++ ){
        thisBooking.makeBooked(item.date, item.hour, item.duration, item.table[i]);
      }
    }
    for (let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    for (let item of eventsRepeat){
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <=maxDate; loopDate = utils.addDays(loopDate,1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    //console.log('thisBooking.booked',thisBooking.booked);
    thisBooking.updateDOM();

  }
  //add table index in array
  makeBooked(date, hour, duration, table){
    const thisBooking = this;
    //sprawdzamy czy są jakieś rekordy w date
    if (typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);



    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
    //console.log(thisBooking.booked);
  }
  render(wrapper){
    const thisBooking  = this;
    const generateHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = wrapper;
    thisBooking.dom.wrapper.innerHTML = generateHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);

  }
  updateDOM(){
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    thisBooking.durationBooking = thisBooking.hoursAmount.correctValue;
    //console.log('thisBooking',thisBooking);
    //console.log('datepicckerValue 113 from booking.js',thisBooking.datePicker.value);
    //console.log('thisBooking.hourPicker.value',thisBooking.hourPicker.value);
    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
     ||
     typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      //czy table ID jest liczbą
      if (!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      //czy element tableId znajduje się w tablicy  za pomocą includes
      if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)){
        /*console.log('allAvailable',allAvailable);
        console.log('thisBooking.booked[thisBooking.date][thisBooking.hour]',thisBooking.booked[thisBooking.date][thisBooking.hour]);
        console.log('tableId',tableId);
        console.log('table',table);*/
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  initBookingForm() {
    const thisBooking  = this;
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    thisBooking.durationBooking = thisBooking.hoursAmount.correctValue;


    for(let table of thisBooking.dom.tables){
    //  if (table.classList.contains('booked') === true) {
      table.addEventListener('click', function(){
        let flagBooking = false;
        let tableId = table.getAttribute(settings.booking.tableIdAttribute);
        if (!isNaN(tableId)){
          tableId = parseInt(tableId);
        }
        let startHour = thisBooking.hour;
        if ((startHour + thisBooking.durationBooking) <= 24) {
          for (let hourBlock = startHour; hourBlock < startHour + thisBooking.durationBooking; hourBlock += 0.5){
            let allAvailable = false;

            if(
              typeof thisBooking.booked[thisBooking.date] == 'undefined'
             ||
             typeof thisBooking.booked[thisBooking.date][hourBlock] == 'undefined'
            ){
              allAvailable = true;
            }

            if (!allAvailable && thisBooking.booked[thisBooking.date][hourBlock].includes(tableId)) {
              flagBooking = true;
            }
          }
          if (flagBooking == true) {alert('Czas rezerwacji stolika ' +tableId + ' pokrywa się z następną rezerwacją');} else {
            table.classList.add(classNames.booking.tableBooked);
            // ręczne rezerwowanie
            table.classList.add(classNames.booking.tableHandBooked);
          }
        }
        else
        {alert('Restauracja jest czynna do godziny 24.00, zmniejsz ilość godzin dla stolika '+ tableId );}

        //console.log('flagBooking',flagBooking);
      });
    //  }
    }
  }
  sendReservation(){
    const thisBooking = this;
    const url = settings.db.url +'/'+ settings.db.booking;
    let bookingState = false;
    let tablesId =[];
    for(let table of thisBooking.dom.tables){
      if (table.classList.contains(classNames.booking.tableHandBooked))
      {
        var tableId = table.getAttribute(settings.booking.tableIdAttribute);
        //czy table ID jest liczbą
        if (!isNaN(tableId)){
          //tableId = parseInt(tableId);
          tablesId.push(parseInt(tableId));
        }
        bookingState = true;
      }
    }
    console.log('tablesId',tablesId);
    if (bookingState == false) {
      alert('Prosimy o wybranie stolika');
      return;
    }


    const payload = {
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      //table: tableId,
      table: tablesId,
      repeat: false,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      // phone: thisBooking.dom.phone.value,
      // address: thisBooking.dom.address.value,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response){
        return response.json();
      })
      .then(function(/*parsedResponse*/){
        thisBooking.getData();
        //thisBooking.makeBoked(parsedResponse.date, parsedResponse.hour, parsedResponse.duration, parsedResponse.table);
        thisBooking.updateDOM();
      });
  }
  deleteHandBooking(){
    const thisBooking = this;
    for(let table of thisBooking.dom.tables){
      if (table.classList.contains(classNames.booking.tableHandBooked))
      {
        table.classList.remove(classNames.booking.tableHandBooked);
      }
    }
  }
  initWidgets() {
    const thisBooking  = this;
    thisBooking.peopleAmount = new amountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount =  new amountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){

      thisBooking.updateDOM();
      //console.log('datepicckerValue172 from booking js',thisBooking.datePicker.value);
    });
    thisBooking.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisBooking.sendReservation();
      thisBooking.deleteHandBooking();
    });
  }
}

export default Booking;
