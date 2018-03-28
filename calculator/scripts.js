document.addEventListener('DOMContentLoaded', function(){
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });

  const display = document.querySelector('#display');
  
  const operations = {
    '+': (x, y) => x + y,
    '÷': (x, y) => x / y,
    '-': (x, y) => x - y,
    'x': (x, y) => x * y
  }
  
  const mdas = {
    'x': 1,
    '÷': 2,
    '+': 3,
    '-': 4
  }
  
  const operators = Object.keys(operations);
  let decimalEntered = false;
  
  function executeInput(event){
    let input = display.textContent.split(' ').filter(item => item !== '' && item);
    if (operators.includes(input[input.length - 1])) {
      input.splice(input.length - 1, 1);
    }
    let ratings = input.map(item => operators.includes(item) ? mdas[item] : 0);
    result = calculateResults(input, ratings);
    if (Number.isInteger(result)) {
      display.textContent = `${result} `;
    } else {
      display.textContent = `${Number(result.toFixed(5))} `;
    }
  }
  
  function calculateResults(input, ratings){
    if (input.length === 1) {
      return input[0];
    } else {
      let count = 1;
      while (count < 5) {
        if (ratings.includes(count)) {
          let location = ratings.indexOf(count);
          let operator = input[location];
          let x = Number(input[location - 1]);
          let y = Number(input[location + 1]);
          let result = operations[operator](x, y);
          input.splice(location - 1, 3, result);
          ratings.splice(location - 1, 3, 0);
          return calculateResults(input, ratings);
        }
        count++;
      }
    }
  }

  const shiftedKeys = {
    56: 1111,
    61: 3333,
    8: 8888
  }

  const validKeys = [8, 18, 191, 55, 56, 57, 52, 53, 54, 173, 49, 50, 51, 190, 48, 13, 61];

  function processKeyPress(event){
    if (!validKeys.includes(event.keyCode)) {
      return;
    }

    event.preventDefault();

    let isShifted = event.shiftKey;
    let element = undefined;
    
    if (isShifted) {
      let shiftedKey = shiftedKeys[event.keyCode];
      element = document.querySelector(`[data-key="${shiftedKey}"]`);
    } else {
      element = document.querySelector(`[data-key="${event.keyCode}"]`);
    }
    let mouseDown = document.createEvent('MouseEvents');
    mouseDown.initEvent('mousedown', true, true);
    element.dispatchEvent(mouseDown);
    setTimeout(() => {
      let mouseUp = document.createEvent('MouseEvents');
      mouseUp.initEvent('mouseup', true, true);
      element.dispatchEvent(mouseUp);
    }, 100);
  }
  
  function appendToDisplay(event){
    let buttonClicked = event.currentTarget.childNodes[0].textContent;
    let currentContent = display.textContent;
    let lastClicked = currentContent[currentContent.length - 2];
    let plusMinusElement = document.querySelector('#plusMinus');
    let isMinus = plusMinusElement.classList.contains('buttonActive') === true;
    if (buttonClicked === '.' && !decimalEntered) {
      decimalEntered = true;
    } else if (buttonClicked === '.' && decimalEntered){
      return;
    } 
    if (operators.includes(buttonClicked) && decimalEntered) {
      decimalEntered = false;
    }
    if (buttonClicked === '±') {
      return;
    }
    if (operators.includes(buttonClicked) && currentContent === '') {
      return; 
    }
    if (operators.includes(buttonClicked) && operators.includes(lastClicked)) {
      display.textContent = currentContent.slice(0, -2);
      display.textContent += ' ';
    }
    if (buttonClicked === 'ac') {
      display.textContent = '';
      return;
    }
    if (buttonClicked === 'ce') {
      display.textContent = currentContent.slice(0, currentContent.length - 2);
      return;
    }
    if (isMinus && operators.includes(buttonClicked)) {
      return;
    } 
    if (isMinus){
      if (currentContent === '' || operators.includes(lastClicked)) {
        display.textContent += `-${buttonClicked} `;
      } else {
        display.textContent += `- ${buttonClicked} `;
        decimalEntered = false;
      }
      let mouseDown = document.createEvent('MouseEvents');
      mouseDown.initEvent('mousedown', true, true);
      plusMinusElement.dispatchEvent(mouseDown);
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
    if (event.currentTarget.classList.contains('link')) {
      event.currentTarget.parentNode.classList.remove('button');
      event.currentTarget.parentNode.classList.add('buttonActive');
    } else {
      event.currentTarget.classList.remove('button');
      event.currentTarget.classList.add('buttonActive');
    }
  }

  function unHighlightButton(event){
    if (event.currentTarget.classList.contains('link')) {
      event.currentTarget.parentNode.classList.remove('buttonActive');
      event.currentTarget.parentNode.classList.add('button');
    } else {
      event.currentTarget.classList.remove('buttonActive');
      event.currentTarget.classList.add('button');
    }
  }

  let buttons = document.querySelectorAll('.calcButtonContainer');

  buttons.forEach(button => button.addEventListener('mousedown', event => {
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

  document.addEventListener('keydown', event => processKeyPress(event, 'down'));
});
