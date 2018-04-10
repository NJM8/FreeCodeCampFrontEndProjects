document.addEventListener('DOMContentLoaded', function(){
  // simple lazy loader for images, grabs datasrc attribute and changes it to src
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });

  let on = false;
  let playing = false;
  let strictMode = false;
  let simonSaying = false;
  let dontIncreasePlays = false;
  let count = 0;  
  let simonPlays = [];
  let userPlays = [];
  let simon;  
  let display = document.querySelector('.title');
  let score = document.querySelector('#score');
  const activeClasses = {
    1: 'greenActive', 
    2: 'redActive',
    3: 'yellowActive',
    4: 'blueActive'
  }

  function changeDisplayMessage(msg){
    display.style.opacity = 0;
    setTimeout(() => {
      display.textContent = msg;
      display.style.opacity = 1;
    }, 400);
  }

  function centerControls(){
    const board = document.querySelector('.board');
    const controls = document.querySelector('.controls');
    const boardCenterY = board.getBoundingClientRect().top + (board.getBoundingClientRect().height / 2); 
    const boardCenterX = board.getBoundingClientRect().left + (board.getBoundingClientRect().width / 2); 
    controls.style.top = boardCenterY + (controls.getBoundingClientRect().height / 2);
    controls.style.left = boardCenterX + (controls.getBoundingClientRect().width / 2);
  }

  function toggleOnOff(){
    toggle.classList.contains('toggleOn') ? toggle.classList.remove('toggleOn') : toggle.classList.add('toggleOn');
    on ? on = false : on = true;
    if (!on) {
      if (strictMode) {
        enableStrictMode();
      }
      endGame();
    }
  }
  
  function enableStrictMode(){
    if (!on && !strictMode) {
      return;
    }
    strictIndicator.classList.contains('strictOn') ? 
    strictIndicator.classList.remove('strictOn') : strictIndicator.classList.add('strictOn');
    strictMode ? strictMode = false : strictMode = true;
  }

  function playSound(event){
    let sound = document.querySelector(`[data-key="${event.target.dataset.id}"]`);
    sound.currentTime = 0;
    sound.play();
  }

  function checkUserInput(){
    const lastUserInput = userPlays[userPlays.length - 1];
    const matchingSimonPlay = simonPlays[userPlays.length - 1];
    if (lastUserInput === matchingSimonPlay) {
      if (userPlays.length === simonPlays.length) {
        if (simonPlays.length === 5) {
          changeDisplayMessage('You won!!!');
          endGame();
        } else {
          simonsTurn();
        }
      }
    } else {
      if (strictMode) {
        changeDisplayMessage('Wrong!');
        endGame();
      } else {
        changeDisplayMessage('Try again');
        dontIncreasePlays = true;
        simonsTurn();
      }
    }
  }

  function handleSimonButtonPress(event){
    if (!on) {
      return;
    }

    playSound(event);
    let activeClass = activeClasses[event.target.dataset.id];
    event.target.classList.add(activeClass);

    setTimeout(() => {
      event.target.classList.remove(activeClass);
    }, 700);

    if (simonSaying) {
      return;
    } else {
      userPlays.push(Number(event.target.dataset.id));
    }

    checkUserInput();
  }

  function simulateInput(id){
    let element = document.querySelector(`[data-id="${id}"]`);
    let mousedown = new Event('mousedown');
    element.dispatchEvent(mousedown);
  }

  function simonsTurn(){
    userPlays = [];
    simonSaying = true;
    if (!dontIncreasePlays) {
      const nextPlay = Math.floor(Math.random() * 4) + 1;
      simonPlays.push(nextPlay);
      setTimeout(() => {
        score.textContent = simonPlays.length;
      }, 500);
    }
    setTimeout(() => {
      changeDisplayMessage('Simon\'s turn');
      simon = setInterval(simonSays, 1000);
    }, 1000);
  }

  function simonSays(){
    if (count === simonPlays.length) {
      simonSaying = false;
      dontIncreasePlays = false;
      count = 0;
      changeDisplayMessage('Your turn');
      clearInterval(simon);
      return;
    } 
    simulateInput(simonPlays[count]);
    count++;
  }
  
  function startGame(){
    if (!on) {
      return;
    }
    strictButton.disabled = true;
    startButton.disabled = true;
    playing ? playing = false : playing = true;

    simonsTurn();
  }

  function endGame() {
    clearInterval(simon);
    simonSaying = false;
    dontIncreasePlays = false;
    count = 0;
    strictButton.disabled = false;
    startButton.disabled = false;
    playing = false;
    simonPlays = [];
    userPlays = [];
    score.textContent = 0;
    if (display.textContent !== 'Simon Says') {
      setTimeout(() => {
        changeDisplayMessage('Simon Says');
      }, 1500);
    }
  }
  
  const toggleBody = document.querySelector('.toggleBody');
  const toggle = document.querySelector('.toggle');
  toggleBody.addEventListener('mousedown', toggleOnOff);

  const strictButton = document.querySelector('#strict');
  const strictIndicator = document.querySelector('.strictIndicator');
  strictButton.addEventListener('mousedown', enableStrictMode); 

  const simonButtons = document.querySelectorAll('.simonButton');
  for (const simonButton of simonButtons) {
    simonButton.addEventListener('mousedown', handleSimonButtonPress);
  }

  const startButton = document.querySelector('#start');
  startButton.addEventListener('mousedown', startGame);
  centerControls();
});

