import { settings, select, classNames, templates } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function (){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    // console.log('idFromHash', idFromHash); 

    let pageMatchingHash = thisApp.pages[0].id;
    console.log('page',pageMatchingHash, idFromHash);
    for(let page of thisApp.pages){
      if (page.id == idFromHash){
        pageMatchingHash = page.id;
        break; 
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id); 
        console.log(clickedElement, id);
        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }

    

  },

  activatePage: function(pageId){
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching */
    console.log('pages active', thisApp.pages);
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    } 

    /* add class "active" to matching links, remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    } 
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        //console.log(parsedResponse);

        /*save parasedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execute initMenu method */
        thisApp.initMenu();
      });
      
    const comurl = settings.db.url + '/' + settings.db.comments;

    fetch(comurl)
      .then(function (responseObj) {
        return responseObj.json();
      })
      .then(function (jsonComments) {        
        thisApp.data.comments = jsonComments;
        thisApp.initComments();
      });
  },

  initComments: function(){
    const thisApp = this;

    let html = '';

    for (let comment of thisApp.data.comments) {
      html += templates.comment(comment);
    }

    var elem = document.querySelector(select.containerOf.homeComments);
    elem.innerHTML = html;
    // eslint-disable-next-line no-undef
    new Flickity(elem, {  
      cellAlign: 'center',
      prevNextButtons: false,
      contain: false,
      wrapAround: true,
      setGallerySize: false,
      percentPosition: false,
      watchCSS: false,
      fade: false});
  },

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product.prepareCartProduct());
    });
  },

  init: function () {
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData();
    thisApp.initBooking();    
  },

  initBooking: function(){
    const thisApp = this;
    
    const bookElement = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(bookElement);
  }
};
  
app.init();
app.initCart();
