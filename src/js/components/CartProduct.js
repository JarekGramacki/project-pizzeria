import {select} from './settings.js'; 
import AmountWidget from './components/AmountWidget.js';
class CartProduct {
  constructor(menuProduct, element) {
    const thisCartProduct = this;

    thisCartProduct.id = menuProduct.id;
    thisCartProduct.name = menuProduct.name;
    thisCartProduct.amount = menuProduct.amount;
    thisCartProduct.priceSingle = menuProduct.priceSingle;
    thisCartProduct.price = menuProduct.priceSingle * menuProduct.amount;
    thisCartProduct.params = menuProduct.params;

    thisCartProduct.getElements(element);
    thisCartProduct.initAmountWidget();
    thisCartProduct.initActions();
  }

  getElements(element) {
    const thisCartProduct = this;

    thisCartProduct.dom = {};

    thisCartProduct.dom.wrapper = element;
    thisCartProduct.dom.amountWidget = element.querySelector(
      select.cartProduct.amountWidget
    );
    thisCartProduct.dom.price = element.querySelector(select.cartProduct.price);
    thisCartProduct.dom.edit = element.querySelector(select.cartProduct.edit);
    thisCartProduct.dom.remove = element.querySelector(
      select.cartProduct.remove
    );
  }

  initAmountWidget() {
    const thisCartProduct = this;

    thisCartProduct.amountWidget = new AmountWidget(
      thisCartProduct.dom.amountWidget
    );
    thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
      thisCartProduct.amount = thisCartProduct.amountWidget.value;
      thisCartProduct.price =
        thisCartProduct.amount * thisCartProduct.priceSingle;
      thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
    });
  }

  remove() {
    console.log('1. [R] CartProduct - kliknieto remove na:', this);
    const thisCartProduct = this;

    const event = new CustomEvent('remove', {
      bubbles: true,
      detail: {
        cartProduct: thisCartProduct,
      },
    });

    console.log(
      '2. [R] CartProduct - wysla event z sobą (ref) w detail.cartProduct:',
      event
    );
    thisCartProduct.dom.wrapper.dispatchEvent(event);
  }

  initActions() {
    const thisCartProduct = this;
    thisCartProduct.dom.edit.addEventListener('click', function (event) {
      event.preventDefault();
    });

    thisCartProduct.dom.remove.addEventListener('click', function (event) {
      event.preventDefault();
      thisCartProduct.remove();
    });
  }

  getData() {
    const thisCartProduct = this;

    const productSumary = {
      id: thisCartProduct.id,
      amount: thisCartProduct.amount,
      price: thisCartProduct.price,
      priceSingle: thisCartProduct.priceSingle,
      name: thisCartProduct.name,
      params: thisCartProduct.params,
    };
    return productSumary;
  }
}

export default CartProduct;