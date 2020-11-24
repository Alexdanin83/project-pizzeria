import {settings, select, classNames,templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';
class Cart{
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.initActions();
    //console.log('new Cart1', thisCart);
  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    //console.log(thisCart.dom.wrapper)
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList  = document.querySelector(select.cart.productList);
    thisCart.renderTotalsKeys = ['totalNumber','totalPrice','subtotalPrice','deliveryFee'];
    for(let key of thisCart.renderTotalsKeys){
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
  }
  initActions() {
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(event){
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }
  sendOrder(){
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;
    thisCart.payloadProducts = [];


    for (let product in thisCart.products){
      thisCart.payloadProducts.push(thisCart.products[product].getDataProduct);
    }

    const payload = {
      address: 'test',
      totalPrice: thisCart.totalPrice,
      phone: thisCart.dom.phone.value,
      addres: thisCart.dom.address.value,
      totalNumber:thisCart.totalNumber,
      subtotalPrice:thisCart.subtotalPrice,
      totalPrice1:thisCart.totalPrice,
      deliveryFee:thisCart.deliveryFee,
      products: thisCart.payloadProducts,
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
      }).then(function(parsedResponse){
        console.log('parsedResponse',parsedResponse);
      });
  }
  add (menuProduct){
    const thisCart = this;
    /*Generated HTML based on template*/

    const generateHTML = templates.cartProduct(menuProduct);
    console.log('generateHTML'+generateHTML);
    /*create element usi ng utils.createElementFromHTML*/
    const generatedDOM = utils.createDOMFromHTML(generateHTML);
    /*find menu container*//*Wstawiamy w product list szablon*/
    thisCart.dom.productList.appendChild(generatedDOM);


    thisCart.products.push(  new CartProduct(menuProduct,generatedDOM));
    console.log('thisCart product', thisCart.products);
    console.log('product Data', menuProduct);
    console.log('CartProduct**********:',CartProduct.id);
    thisCart.update();
  }
  update(){
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;
    for(let product of thisCart.products)
    {
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber +=product.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log('thisCart.subtotalPrice'+thisCart.subtotalPrice);
    console.log('thisCart.totalNumber'+thisCart.totalNumber);
    console.log('thisCart.totalPrice'+thisCart.totalPrice);
    for(let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }
  remove(cartProduct){
    const thisCart = this;
    const index = thisCart.products[cartProduct];
    console.log('do usunięciq'+index);
    thisCart.products.splice(index, 1);
    //  console.log('po usunięciu'+thisCart.products);
    cartProduct.dom.wrapper.remove();
    thisCart.update();


  }
}

export default Cart;
