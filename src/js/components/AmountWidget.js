import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';
// zapisujemy że clasa amount widget jest rozszerzeniem BaseWidget za pomoća słowa extends
class AmountWidget extends BaseWidget{
  constructor(element){
    //wywolamy konstruktor z argumentami klasy nadrzędnej
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements(element);
    //thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();
    //thisWidget.announce();
    //console.log('thisWidget.input.value:', thisWidget.input.value);
    //console.log('AmountWidget:', thisWidget);
    //console.log('AmountWidget:', element);
  }
  getElements(){
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  isValid(value){
    //czy value nie jest nie liczbą
    return !isNaN(value)
    && value>= settings.amountWidget.defaultMin
    && value <= settings.amountWidget.defaultMax;
  }

  renderValue(){
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  }
  initActions() {
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.dom.input.value);
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value-1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value+1);
    });
  }
}
export default AmountWidget;
