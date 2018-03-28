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
    // if the last input was an operator trim it off the end
    if (operators.includes(input[input.length - 1])) {
      input.splice(input.length - 1, 1);
    }
    // generate ratings array, element at each index will correspond to MDAS rating of each element in input array, numbers will be 0
    let ratings = input.map(item => operators.includes(item) ? mdas[item] : 0);
    // run calculations 
    result = calculateResults(input, ratings);
    // if the result is a solid number
    if (Number.isInteger(result)) {
      // append to display
      display.textContent = `${result} `;
    } else {
      // append to display after trimming to 5 decimal places, when sent as number to string it will also trim trailing zeros
      display.textContent = `${Number(result.toFixed(5))} `;
    }
  }
  
  // calulate input, recursively process arrays
  function calculateResults(input, ratings){
    if (input.length === 1) {
      // calculations done, return result
      return input[0];
    } else {
      // init count to 1, highest precedence in M(1) D(2) A(3) S(4)
      let count = 1;
      while (count < 5) {
        // starting from 1 and counting to 4, if we find the number in the ratings array
        if (ratings.includes(count)) {
          // get the location of the rating
          let location = ratings.indexOf(count);
          // get the corresponding operator in the input array
          let operator = input[location];
          // get the first number argument to the left of the operator
          let x = Number(input[location - 1]);
          // get the second number argument to the right of the operator
          let y = Number(input[location + 1]);
          // perform the calulation, call to the operations object, the operator will grab the function and pass in x, y
          let result = operations[operator](x, y);
          // splice the input starting with the first number arg, trim 3, insert result
          input.splice(location - 1, 3, result);
          // splice ratings array starting with location to the left of the operator found, trim 3, insert 0 
          ratings.splice(location - 1, 3, 0);
          // run calculations again on new arrays
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
    // if not a valid key do nothing
    if (!validKeys.includes(event.keyCode)) {
      return;
    }
    // prevent default browser mapping of keys
    event.preventDefault();

    // init flag for if shift key is pressed, init undefined variable for the element to search for
    let isShifted = event.shiftKey;
    let element = undefined;
    
    if (isShifted) {
      // if shift key is pressed get custom data-key 'keycode' value
      let shiftedKey = shiftedKeys[event.keyCode];
      // get element with custom data-key 'keycode'
      element = document.querySelector(`[data-key="${shiftedKey}"]`);
    } else {
      // get element with regular keycode
      element = document.querySelector(`[data-key="${event.keyCode}"]`);
    }
    // init mouse event and dispatch
    let mouseDown = new Event('mousedown');
    element.dispatchEvent(mouseDown);
    // init mouse up and delay 100 ms, keyup seems to fire faster that mouseup so when using keyboard you can barely see calculator key animations
    setTimeout(() => {
      let mouseUp = new Event('mouseup');
      element.dispatchEvent(mouseUp);
    }, 100);
  }
  
  // handler to add inputs to display
  function appendToDisplay(event){
    // get the button clicked
    let buttonClicked = event.currentTarget.childNodes[0].textContent;
    // get the current content
    let currentContent = display.textContent;
    // get the last clicked button, -2 because there should always be a space at the end
    let lastClicked = currentContent[currentContent.length - 2];
    
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
      display.textContent += ' ';
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

    // if clicking the plus/minus button and the last entry was an operator add minus symbol with no trailing space expecting number input and return
    if (buttonClicked === '±' && operators.includes(lastClicked)) {
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
  }

  // highlight button handler
  function highlightButton(event){
    // if button clicked is a link add active styles to the parent element
    if (event.currentTarget.classList.contains('link')) {
      event.currentTarget.parentNode.classList.remove('button');
      event.currentTarget.parentNode.classList.add('buttonActive');
    } else {
      // add styles to the selected element
      event.currentTarget.classList.remove('button');
      event.currentTarget.classList.add('buttonActive');
    }
  }

  // unhighlight button handler
  function unHighlightButton(event){
    // if button clicked is a link remove active styles from parent element
    if (event.currentTarget.classList.contains('link')) {
      event.currentTarget.parentNode.classList.remove('buttonActive');
      event.currentTarget.parentNode.classList.add('button');
    } else {
      //remove styles from selected element
      event.currentTarget.classList.remove('buttonActive');
      event.currentTarget.classList.add('button');
    }
  }

  // grab all calculator buttons
  let buttons = document.querySelectorAll('.calcButtonContainer');

  // for every button add event listener for highlight animation
  buttons.forEach(button => button.addEventListener('mousedown', event => {
    highlightButton(event);
    // check if equals is pressed
    let isEquals = event.currentTarget.childNodes[0].textContent === '=';
    // if yes process input
    if (isEquals) {
      executeInput(event);
      // else append input to display
    } else {
      appendToDisplay(event);
    }
  }));

  // bind event listener for mouse up to unhighlight
  buttons.forEach(button => button.addEventListener('mouseup', event => {    
    unHighlightButton(event);
  }));

  // bind event listener for mouse out to unhighlight in case of accidental click and drag
  buttons.forEach(button => button.addEventListener('mouseout', event => {
    unHighlightButton(event);
  }));

  // grab external links
  let externalLinks = document.querySelectorAll('a');

  // bind event listeners for styling of click event
  externalLinks.forEach(link => link.addEventListener('mousedown', event => highlightButton(event)));
  externalLinks.forEach(link => link.addEventListener('mouseup', event => unHighlightButton(event)));
  externalLinks.forEach(link => link.addEventListener('mouseout', event => unHighlightButton(event)));

  // bind event listener to document for keyboard input
  document.addEventListener('keydown', event => processKeyPress(event));
});
