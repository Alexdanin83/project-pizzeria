import {select} from '../settings.js';
import amountWidget from './amountWidget.js';
class CartProduct{
  constructor(menuProduct, element){
    const thisCartProduct = this;
    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.price = menuProduct.price;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.params =  JSON.parse(JSON.stringify(menuProduct.params));
    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
    thisCartProduct.getData();

  }
  getData(){
    const thisCartProduct = this;
    thisCartProduct.getDataProduct = {};
    thisCartProduct.getDataProduct.id = thisCartProduct.id;
    thisCartProduct.getDataProduct.name = thisCartProduct.name;
    thisCartProduct.getDataProduct.price = thisCartProduct.price;
    thisCartProduct.getDataProduct.priceSingle = thisCartProduct.priceSingle;
    thisCartProduct.getDataProduct.amount = thisCartProduct.amount;
    thisCartProduct.getDataProduct.params = thisCartProduct.params;
    return thisCartProduct.getDataProduct;
  }
  getElements(element){
    const thisCartProduct = this;
    thisCartProduct.dom = {};
    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
    thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);

  }
  initAmountWidget() {
    const thisCartProduct = this;
    thisCartProduct.amountWidget = new amountWidget(thisCartProduct.dom.amountWidget);
    thisCartProduct.dom.amountWidget.addEventListener('updated', function(){
      //thisCartProduct.processOrder();
      thisCartProduct.amount =thisCartProduct.amountWidget.value;
      thisCartProduct.price = thisCartProduct.priceSingle*thisCartProduct.amount;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }
  remove(){
    const thisCartProduct = this;
    const event = new CustomEvent('remove',{
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }
  initActions(){
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', function(){
      //thisCart.update();
    });
    thisCartProduct.dom.remove.addEventListener('click', function(){
      thisCartProduct.remove();
    });
  }
}
export default CartProduct;
