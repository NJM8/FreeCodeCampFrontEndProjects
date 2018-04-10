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
      endGame();
    }
  }
  
  function enableStrictMode(){
    strictIndicator.classList.contains('strictOn') ? 
    strictIndicator.classList.remove('strictOn') : strictIndicator.classList.add('strictOn');
    strictMode ? strictMode = false : strictMode = true;
  }

  function playSound(event){
    let sound = document.querySelector(`[data-key="${event.target.dataset.id}"]`);
    sound.play();
  }

  function checkUserInput(){
    const lastUserInput = userPlays[userPlays.length - 1];
    const lastSimonPlay = simonPlays[simonPlays.length - 1];
    if (lastUserInput === lastSimonPlay) {
      if (simonPlays.length === 20) {
        changeDisplayMessage('You won!!!');
        setTimeout(() => {
          endGame();
        }, 500);
      } else {
        return;
      }
    } else {
      if (strictMode) {
        changeDisplayMessage('Wrong!');
        setTimeout(() => {
          endGame();
        }, 500);
      } else {
        changeDisplayMessage('Try again');
        dontIncreasePlays = true;
        simonSays();
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
    let element = document.querySelector(`[data-id="${id}"`);
    let mousedown = new Event('mousedown');
    element.dispatchEvent(mousedown);
  }

  function simonsTurn(){
    changeDisplayMessage('Simon\'s turn');
    simonSaying = true;
    if (!dontIncreasePlays) {
      const nextPlay = Math.floor(Math.random() * 4) + 1;
      simonPlays.push(nextPlay);
    }
    setTimeout(() => {
      simon = setInterval(simonSays, 1000);
    }, 500);
  }

  function simonSays(){
    simulateInput(simonPlays[count]);
    console.log(count);
    if (count === simonPlays.length) {
      simonSaying = false;
      dontIncreasePlays = false;
      count = 0;
      changeDisplayMessage('Your turn');
      clearInterval(simon);
      return;
    } 
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
    changeDisplayMessage('Game over!');
    setTimeout(() => {
      changeDisplayMessage('Simon Says');
    }, 1500);
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

