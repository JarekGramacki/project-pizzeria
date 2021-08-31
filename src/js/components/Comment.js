import {templates, select} from '../settings.js';
import utils from '../utils.js';

class Comment {
  constructor(data) {
    const thisComment = this;
    thisComment.data = data;

    this.render();
  }

  render(){   
    const thisComment = this;

    /*generate HTML based on template */
    const generatedHTML = templates.comment(thisComment.data);

    /*create element using utils.createElementForHTML */
    thisComment.element = utils.createDOMFromHTML(generatedHTML);

    /*find menu container */
    const commentsWrapper = document.querySelector(select.containerOf.homeComments);

    /*add element to menu */
    commentsWrapper.appendChild(thisComment.element);
  }
}

export default Comment;