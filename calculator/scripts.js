document.addEventListener('DOMContentLoaded', function(){
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });

  let display = document.querySelector('#display');

  function appendToDisplay(event){
    let buttonClicked = event.target.childNodes[0].textContent;
    if (buttonClicked === 'Clear') {
      display.textContent = '';
      return;
    }
    display.textContent += buttonClicked;
  }

  function highlightButton(event){
    if (event.target.nodeName === 'DIV') {
      event.target.classList.add('active');
      event.target.classList.remove('slanted');
      event.target.childNodes[0].classList.remove('slantedContent');
      event.target.classList.remove('buttonDefault');
      event.target.classList.add('slantedActive');
      event.target.childNodes[0].classList.add('slantedContentActive');
      event.target.classList.add('buttonDefaultActive');
    } else {
      event.target.parentNode.classList.add('active');
      event.target.parentNode.classList.remove('slanted');
      event.target.classList.remove('slantedContent');
      event.target.parentNode.classList.remove('buttonDefault');
      event.target.parentNode.classList.add('slantedActive');
      event.target.classList.add('slantedContentActive');
      event.target.parentNode.classList.add('buttonDefaultActive');
    }
  }

  function unHighlightButton(event){
    if (event.target.nodeName === 'DIV') {
      setTimeout(() => {
        event.target.classList.remove('active');
        event.target.classList.remove('slantedActive');
        event.target.childNodes[0].classList.remove('slantedContentActive');
        event.target.classList.remove('buttonDefaultActive');
        event.target.classList.add('slanted');
        event.target.childNodes[0].classList.add('slantedContent');
        event.target.classList.add('buttonDefault');
      }, 100);
      
    } else {
      setTimeout(() => {
        event.target.parentNode.classList.remove('slantedActive');
        event.target.classList.remove('slantedContentActive');
        event.target.parentNode.classList.remove('buttonDefaultActive');
        event.target.parentNode.classList.remove('active');
        event.target.parentNode.classList.add('slanted');
        event.target.classList.add('slantedContent');
        event.target.parentNode.classList.add('buttonDefault');
      }, 100);
    }
  }

  let buttons = document.querySelectorAll('.calcButtonContainer');

  buttons.forEach(button => button.addEventListener('mousedown', event => {
    highlightButton(event);
    appendToDisplay(event);
  }));

  buttons.forEach(button => button.addEventListener('mouseup', event => unHighlightButton(event)));
  buttons.forEach(button => button.addEventListener('mouseout', event => unHighlightButton(event)));

  let externalLinks = document.querySelectorAll('a');

  externalLinks.forEach(link => link.addEventListener('mousedown', event => highlightButton(event)));
  externalLinks.forEach(link => link.addEventListener('mouseup', event => unHighlightButton(event)));
  externalLinks.forEach(link => link.addEventListener('mouseout', event => unHighlightButton(event)));
})