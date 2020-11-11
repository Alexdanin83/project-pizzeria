import BaseWidget from './BaseWidget.js';
import {select, settings} from '../settings.js';
import utils from '../utils.js';
//import flatpickr from 'flatpickr';

class DatePicker extends BaseWidget{
  //element DOM widgetu, początkowa wartość
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(new Date(thisWidget.value),settings.datePicker.maxDaysInFuture);
    //inicjalizacja pluginu flatpickr
    /* global flatpickr */
    flatpickr(thisWidget.dom.input,
      {
        defaultDate: thisWidget.minDate,
        minDate: thisWidget.minDate,
        maxDate: thisWidget.maxDate,
        locale: {
          firstDayOfWeek: 1 // start week on Monday
        },
        disable: [
          function(date) {
            // return true to disable
            return (date.getDay() === 1);
          }
        ],
        onChange: function(selectedDates, dateStr) {
          thisWidget.value = dateStr;
        },
      });
  }
  parseValue(value){
    return parseInt(value);
  }
  isValid(){
    return true;
  }
  renderValue(){
    console.log(BaseWidget.renderValue);
  }

}

export default DatePicker;
