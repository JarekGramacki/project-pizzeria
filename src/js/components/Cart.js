import { select, classNames, settings, templates } from '../settings.js';
import CartProduct from './CartProduct.js';
import utils from '../utils.js';
class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = element.querySelector(select.cart.deliveryFee);
    thisCart.dom.subTotalPrice = element.querySelector(select.cart.subtotalPrice);
    thisCart.dom.totalPrice = element.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    thisCart.dom.form = element.querySelector(select.cart.form);
    thisCart.dom.address = element.querySelector(select.cart.address);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function (event) {
      console.log('3. [R] Cart - złapaliśmy event z CardProduct:', event);
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order;

    const payload = {};
    payload.address = thisCart.dom.address.value;
    payload.phone = thisCart.dom.phone.value;
    payload.totalPrice = thisCart.totalPrice;
    payload.subTotalPrice = thisCart.subTotalPrice;
    payload.totalNumber = thisCart.totalNumber;
    payload.deliveryFee = thisCart.deliveryFee;
    payload.products = [];

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);
  }

  remove(product) {
    //console.log('4. [R] Cart - usuwamy produkt (front+back):', product);
    const thisCart = this;
    const cartContainer = thisCart.dom.productList;

    //console.log('5. [R] Cart - usuwamy produkt z frontendu (ui) / z drzewa dom');
    cartContainer.removeChild(product.dom.wrapper);

    // console.log('6. [R] Cart - usuwamy produkt z koszyka - z listy obiektów');
    thisCart.products.splice(thisCart.products.indexOf(product), 1);
    thisCart.update();
  } 

  add(menuProduct) {
    const thisCart = this;

    /*generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);

    /*create element using utils.createElementForHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /*find menu container */
    const cartContainer = thisCart.dom.productList;

    /*add element to menu */
    cartContainer.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));

    thisCart.update();
  }

  update() {
    const thisCart = this;

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subTotalPrice = 0;

    for (let product of thisCart.products) {
      thisCart.totalNumber = thisCart.totalNumber + product.amount;
      thisCart.subTotalPrice = thisCart.subTotalPrice + product.price;
    }

    thisCart.dom.subTotalPrice.innerHTML = thisCart.subTotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    thisCart.totalPrice = thisCart.subTotalPrice + thisCart.deliveryFee;

    if (thisCart.subTotalPrice > 0) {
      thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
      for (let totalPrice of thisCart.dom.totalPrice) {
        totalPrice.innerHTML = thisCart.totalPrice;
      }
    } else {
      thisCart.dom.deliveryFee.innerHTML = 0;
      for (let totalPrice of thisCart.dom.totalPrice) {
        totalPrice.innerHTML = 0;
      }
    }

    // console.log('totalPrice', thisCart.totalPrice);
    //console.log('delifery', thisCart.deliveryFee);
    //console.log('subtotal', thisCart.subTotalPrice);
    //console.log('totalnumber', thisCart.totalNumber);
  }
}

export default Cart;
