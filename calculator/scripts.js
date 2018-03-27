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
  
  let mdas = {
    '*': 1,
    '÷': 2,
    '+': 3,
    '-': 4
  }
  
  let operators = Object.keys(operations);
  let answerDisplayed = false;
  
  function executeInput(event){
    // think about how to deal with last input being an operator
    let input = display.textContent.split(' ').filter(item => item !== '' && item);
    if (operators.includes(input[input.length - 1])) {
      input.splice(input.length - 1, 1);
    }
    let ratings = input.map(item => operators.includes(item) ? mdas[item] : 0);
    // console.log(input);
    // console.log(ratings);
    result = calculateResults(input, ratings);
    // console.log(`result: ${result}`);
    if (Number.isInteger(result)) {
      display.textContent = result;
    } else {
      display.textContent = Number(result.toFixed(5));
    }
    answerDisplayed = true;
  }
  
  function calculateResults(input, ratings){
    if (input.length === 1) {
      // console.log(`answer: ${input[0]}`);
      return input[0];
    } else {
      let count = 1;
      while (count < 5) {
        if (ratings.includes(count)) {
          // console.log('found');
          let location = ratings.indexOf(count);
          // console.log(location);
          let operator = input[location];
          // console.log(operator);
          let x = Number(input[location - 1]);
          // console.log(x);
          let y = Number(input[location + 1]);
          // console.log(y);
          let result = operations[operator](x, y);
          // console.log(result);
          input.splice(location - 1, 3, result);
          // console.log(input);
          ratings.splice(location - 1, 3, 0);
          // console.log(ratings);
          return calculateResults(input, ratings);
        }
        count++;
      }
    }
  }
  
  function appendToDisplay(event){
    if (answerDisplayed) {
      display.textContent = '';
      answerDisplayed = false;
    }
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
      display.textContent = currentContent.slice(0, -2);
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
});
