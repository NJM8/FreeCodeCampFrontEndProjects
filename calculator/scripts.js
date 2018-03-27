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
    let input = display.textContent.split(' ');
    console.log(input);
    display.textContent = 'did';
  }

  function appendToDisplay(event){
    let buttonClicked = event.currentTarget.childNodes[0].textContent;
    let currentContent = display.textContent;
    let lastClicked = currentContent[currentContent.length - 2];
    let plusMinusElement = document.querySelector('#plusMinus');
    let isMinus = plusMinusElement.classList.contains('buttonActive') === true;
    if (buttonClicked === '±') {
      return;
    }
    if (operators.includes(buttonClicked) && currentContent === '') {
      return; 
    }
    if (operators.includes(buttonClicked) && operators.includes(lastClicked)) {
      return;
    }
    if (buttonClicked === 'Clear') {
      display.textContent = '';
      return;
    }
    if (isMinus && operators.includes(buttonClicked)) {
      return;
    } 
    if (isMinus){
      display.textContent += `-${buttonClicked} `;
      let clickEvent = document.createEvent('MouseEvents');
      clickEvent.initEvent('mousedown', true, true);
      plusMinusElement.dispatchEvent(clickEvent);
    } else {
      if (!operators.includes(buttonClicked) && !operators.includes(lastClicked)) {
        display.textContent = display.textContent.trim();
        display.textContent += `${buttonClicked} `;
      } else {
        display.textContent += `${buttonClicked} `;
      }
    }
  }

  function highlightButton(event){
    let isPlusMinus = event.currentTarget.childNodes[0].textContent === '±';
    let isActive = event.currentTarget.classList.contains('buttonActive');
    if (isPlusMinus && isActive) {
      unHighlightButton(event);
      return;
    }
    event.currentTarget.classList.remove('button');
    event.currentTarget.classList.add('buttonActive');
  }

  function unHighlightButton(event){
    event.currentTarget.classList.remove('buttonActive');
    event.currentTarget.classList.add('button');
  }

  let buttons = document.querySelectorAll('.calcButtonContainer');

  buttons.forEach(button => button.addEventListener('mousedown', event => {
    console.log(event.currentTarget);
    highlightButton(event);
    let isEquals = event.currentTarget.childNodes[0].textContent === '=';
    if (isEquals) {
      executeInput(event);
    } else {
      appendToDisplay(event);
    }
  }));

  buttons.forEach(button => button.addEventListener('mouseup', event => {
    let isPlusMinus = event.currentTarget.childNodes[0].textContent === '±';
    if (isPlusMinus) {
      return;
    }    
    unHighlightButton(event);
  }));

  buttons.forEach(button => button.addEventListener('mouseout', event => {
    let isPlusMinus = event.currentTarget.childNodes[0].textContent === '±';
    if (isPlusMinus) {
      return;
    }  
    unHighlightButton(event);
  }));

  let externalLinks = document.querySelectorAll('a');

  externalLinks.forEach(link => link.addEventListener('mousedown', event => highlightButton(event)));
  externalLinks.forEach(link => link.addEventListener('mouseup', event => unHighlightButton(event)));
  externalLinks.forEach(link => link.addEventListener('mouseout', event => unHighlightButton(event)));
});
