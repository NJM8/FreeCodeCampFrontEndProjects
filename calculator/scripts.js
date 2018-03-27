document.addEventListener('DOMContentLoaded', function(){
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });

  let display = document.querySelector('#display');

  let operations = {
    '+': (x, y) => x + y,
    '÷': (x, y) => x / y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y
  }
  let operators = Object.keys(operations);

  function executeInput(event){
    let input = display.textContent.split('');
    display.textContent = 'did';
  }

  function appendToDisplay(event){
    let buttonClicked = event.target.childNodes[0].textContent;
    let currentContent = display.textContent;
    let plusMinusElement = document.querySelector('#plusMinus');
    let isMinus = plusMinusElement.classList.contains('active') === true;
    if (buttonClicked === '±') {
      return;
    }
    if ((buttonClicked === '*' || buttonClicked === '&divide;' || buttonClicked === '+') && currentContent === '') {
      return; 
    }
    if (operators.includes(buttonClicked) && operators.includes(currentContent[currentContent.length - 1])) {
      return;
    }
    if (buttonClicked === 'Clear') {
      display.textContent = '';
      return;
    }
    if (isMinus && operators.includes(buttonClicked)) {
      return;
    } else if (isMinus){
      display.textContent += `-${buttonClicked}`;
      let clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('mousedown', true, true);
      plusMinusElement.dispatchEvent(clickEvent);
    } else {
      display.textContent += buttonClicked;
    }
  }

  function highlightButton(event){
    let isPlusMinus = event.target.childNodes[0].textContent === '±';
    if (isPlusMinus && (event.target.classList.contains('active') || event.target.parentNode.classList.contains('active'))) {
      unHighlightButton(event);
      return;
    }
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
    if (event.target.childNodes[0].textContent === '=') {
      executeInput(event);
    } else {
      appendToDisplay(event);
    }
  }));

  buttons.forEach(button => button.addEventListener('mouseup', event => {
    let isPlusMinus = event.target.childNodes[0].textContent === '±';
    if (isPlusMinus) {
      return;
    }    
    unHighlightButton(event);
  }));

  buttons.forEach(button => button.addEventListener('mouseout', event => {
    let isPlusMinus = event.target.childNodes[0].textContent === '±';
    if (isPlusMinus) {
      return;
    }  
    unHighlightButton(event);
  }));

  let externalLinks = document.querySelectorAll('a');

  externalLinks.forEach(link => link.addEventListener('mousedown', event => highlightButton(event)));
  externalLinks.forEach(link => link.addEventListener('mouseup', event => unHighlightButton(event)));
  externalLinks.forEach(link => link.addEventListener('mouseout', event => unHighlightButton(event)));
})