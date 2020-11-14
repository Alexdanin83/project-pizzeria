import {settings, select, classNames,templates} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
//import Utils from './components/utils.js';
// tworzenie productu w menu
const app = {
  initPages: function(){
    const thisApp = this;
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/','');
    let pageMachingHash = thisApp.pages[0].id;
    for(let page of thisApp.pages){
      if (page.id == idFromHash){
        pageMachingHash == page.id;
        break;
      }
    }

    thisApp.activatePage(pageMachingHash);

    for (let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();
        /*get page id from href attribute*/
        const id = clickedElement.getAttribute('href').replace('#','');
        /*run thisApp.attribute with that id*/
        thisApp.activatePage(id);
        /*change URL hash*/
        window.location.hash = '#/' + id;
      });
    }
  },
  activatePage: function(pageId){
    const thisApp = this;
    /*add class 'active' to matching pages, remove from non-matching*/
    for (let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /*add class 'active' to matching links, remove from non-matching*/
    for (let link of thisApp.navLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href').id == '#' + pageId);
    }

  },
  initBooking: function(){
    const thisApp = this;
    thisApp.bookingWidget = document.querySelector(select.containerOf.booking);
    new Booking(thisApp.bookingWidget);


  },
  initMenu: function() {
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);

    for (let productData in thisApp.data.products)
    //new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);

    //new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    //const testProduct = new Product();
    //console.log('testProduct:', testProduct);
  },
  initData: function() {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    //console.log(url);
    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        //console.log('parsedResponse', parsedResponse);
        /*save parsedResponse as thisApp.data.products*/
        thisApp.data.products = parsedResponse;
        /*execute initMenu method*/
        thisApp.initMenu();
      });
    //console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);

    });
  },
  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
    //console.log('cart:', thisApp.cart);
    thisApp.initBooking();

  },
};

app.init();
