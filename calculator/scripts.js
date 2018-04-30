document.addEventListener('DOMContentLoaded', function(){
  // lazy load img in background
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });

  // get display element
  const display = document.querySelector('#display');
  
  // operations function object for grabbing and performing operations
  const operations = {
    '+': (x, y) => x + y,
    '÷': (x, y) => x / y,
    '-': (x, y) => x - y,
    'x': (x, y) => x * y
  }
  
  // operations ratings to keep MDAS order
  const mdas = {
    'x': 1,
    '÷': 2,
    '+': 3,
    '-': 4
  }
  
  // operators keys array for checking if input is an operator, init flag for decimal entry to prevent overloading
  const operators = Object.keys(operations);
  let decimalEntered = false;
  
  // get the input and execute it
  function executeInput(event){
    // get input and put into array, filter out empty cell at end due to extra space
    let input = display.textContent.split(' ').filter(item => item !== '' && item);
    // if not enough inputs return immediately
    if (input.length < 3) {
      return;
    }
    // if the last input was an operator trim it off the end
    if (operators.includes(input[input.length - 1])) {
      input.splice(input.length - 1, 1);
    }
    // generate ratings array, element at each index will correspond to MDAS rating of each element in input array, numbers will be 0
    let ratings = input.map(item => operators.includes(item) ? mdas[item] : 0);
    // run calculations 
    result = calculateResults(input, ratings);
    // if the result is a solid number display it, otheriwse trim to 5 decimal places then display, when sent as number to string it will also trim trailing zeros 
    if (Number.isInteger(result)) {
      display.textContent = `${result} `;
    } else {
      display.textContent = `${Number(result.toFixed(5))} `;
    }
  }
  
  // calulate input, recursively process input and ratings array, works to find first highest order operation in ratings, process associated operation in input, splice operation from arrays and call itself again, exits when only 1 number remains.
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

  // custom data-key 'keycode' array to pick up keys that need to be entered with shift
  const shiftedKeys = {
    56: 1111,
    61: 3333,
    8: 8888
  }

  // array of valid keyboard input keycodes
  const validKeys = [8, 18, 191, 55, 56, 57, 52, 53, 54, 173, 49, 50, 51, 190, 48, 13, 61];

  // handle keyboard input to map keypress to calculator button press
  function processKeyPress(event){
    if (!validKeys.includes(event.keyCode)) {
      return;
    }
    // prevent default browser mapping of keys
    event.preventDefault();

    let isShifted = event.shiftKey;
    let element = undefined;
    
    if (isShifted) {
      let shiftedKey = shiftedKeys[event.keyCode];
      element = document.querySelector(`[data-key="${shiftedKey}"]`);
    } else {
      element = document.querySelector(`[data-key="${event.keyCode}"]`);
    }
    let mouseDown = new Event('mousedown');
    element.dispatchEvent(mouseDown);
    // init mouse up and delay 100 ms, keyup seems to fire faster than mouseup so when using keyboard you can barely see calculator key animations
    setTimeout(() => {
      let mouseUp = new Event('mouseup');
      element.dispatchEvent(mouseUp);
    }, 100);
  }

  // flag to only allow number entry on valid minus sign input
  let mustBeNumber = false;

  // handler to add inputs to display
  function appendToDisplay(event){
    let buttonClicked = event.currentTarget.childNodes[0].textContent;
    let currentContent = display.textContent;
    // get the last clicked button, -2 because there should always be a space at the end
    let lastClicked = currentContent[currentContent.length - 2];

    // allow division by zero but on next input clear display
    if (currentContent === 'Infinity ' || currentContent === '-Infinity ') {
      display.textContent = '';
      currentContent = display.textContent;
      lastClicked = currentContent[currentContent.length - 2];
    }
    
    // if user clicks an operator and there are no numbers just return
    if (operators.includes(buttonClicked) && currentContent === '') {
      return; 
    }
    
    // if all clear is clicked clear display, reset decimal flag and return
    if (buttonClicked === 'ac') {
      decimalEntered = false;
      display.textContent = '';
      return;
    }
    
    // if clear last entry is clicked trim last entry, add in trailing space and return;
    if (buttonClicked === 'ce') {
      // reset decimal flag if deleting decimal
      if (lastClicked === '.') {
        decimalEntered = false;
      }
      display.textContent = currentContent.slice(0, currentContent.length - 2);
      if (display.textContent[display.textContent.length - 1] !== ' '){
        display.textContent += ' ';
      }
      return;
    }

    // if a decimal has been entered prevent plus/minus until operator entered
    if (decimalEntered && buttonClicked === '±') {
      return;
    }
    
    // if user clicks a decimal and flag is false, set flag to true and let function continue
    if (buttonClicked === '.' && !decimalEntered) {
      decimalEntered = true;
      // else if decimal is clicked and flag is true, return and prevent decimal input
    } else if (buttonClicked === '.' && decimalEntered){
      return;
    } 

    // when an operator is clicked and the flag is true reset flag so you can enter a decimal on the next number input
    if (operators.includes(buttonClicked) && decimalEntered) {
      decimalEntered = false;
    }

    // If button clicked is not a number and it must be a number prevent input
    if (!Number.isInteger(Number(buttonClicked)) && mustBeNumber) {
      // let decimal period through
      if (buttonClicked !== '.') {
        return;
      }
    }

    // if clicking the plus/minus button and the last entry was an operator or if no current input add minus symbol with no trailing space expecting number input and return
    if (buttonClicked === '±' && (currentContent === '' || operators.includes(lastClicked))) {
      mustBeNumber = true;
      display.textContent += ' -';
      return;
      // else if button is plus/minus and last clicked must be a number, input negative sign as subtraction and return
    } else if (buttonClicked === '±') {
      display.textContent += ' - ';
      return;
    }

    // if entering an operator and last entry was an operator, trim last operator and add space, allow function to continue to add new operator
    if (operators.includes(buttonClicked) && operators.includes(lastClicked)) {
      display.textContent = currentContent.slice(0, -2);
      display.textContent += ' ';
    }

    // if not clicking an operator and last click is not an operator
    if (!operators.includes(buttonClicked) && !operators.includes(lastClicked)) {
      // trim trailing space and add new number
      display.textContent = display.textContent.trim();
      display.textContent += `${buttonClicked} `;
    } else {
      // else just add new symbol or operation
      display.textContent += `${buttonClicked} `;
    }
    // reset flag 
    mustBeNumber = false;
  }

  function highlightButton(event){
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

  function highlightAndExecute(event) {
    highlightButton(event);
    let isEquals = event.currentTarget.childNodes[0].textContent === '=';
    isEquals ? executeInput(event) : appendToDisplay(event);
  }
  
  let buttons = document.querySelectorAll('.calcButtonContainer');
  
  for (const button of buttons) {
    button.addEventListener('mousedown', highlightAndExecute);
    button.addEventListener('mouseup', unHighlightButton);
    button.addEventListener('mouseout', unHighlightButton);
  }

  let externalLinks = document.querySelectorAll('a');

  for (const link of externalLinks) {
    link.addEventListener('mousedown', highlightButton);
    link.addEventListener('mouseup', unHighlightButton);
    link.addEventListener('mouseout', unHighlightButton);
  }

  document.addEventListener('keydown', event => processKeyPress(event));
});
