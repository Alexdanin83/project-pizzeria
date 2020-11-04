import {settings, select} from '../settings.js';
class amountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions(thisWidget.input.value);
    //thisWidget.announce();
    //console.log('thisWidget.input.value:', thisWidget.input.value);
    //console.log('AmountWidget:', thisWidget);
    //console.log('AmountWidget:', element);
  }
  getElements(element){
    const thisWidget = this;
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);
    if (value >= settings.amountWidget.defaultMin && value <= settings.amountWidget.defaultMax){
      //console.log('jestem w walidacji');
      thisWidget.value = newValue;
      thisWidget.announce();
    }
    thisWidget.input.value = thisWidget.value;
  }
  initActions() {
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function(){
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value-1);
    });
    thisWidget.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value+1);
    });
  }
  announce(){
    const thisWidget = this;
    //const event = new Event('updated');
    const event = new CustomEvent('updated',{
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
}
export default amountWidget;
