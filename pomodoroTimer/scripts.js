document.addEventListener('DOMContentLoaded', function(){
  let clockContainer = document.querySelector('.clockContainer');
  let controls = document.querySelectorAll('.control');
  let breakLength = document.querySelector('#breakLength');
  let sessionLength = document.querySelector('#sessionLength');
  let start = document.querySelector('#start');
  let reset = document.querySelector('#reset');
  let display = document.querySelector('.title > h1');
  let lastClockElement;
  let resetting = false;
  let timing = false;
  let state = undefined;
  let userBreak;
  let userSession;
  let main;

  const imgClips = {
    1: 'polygon(50% 0, 50% 50%, 55.217% 0, 100% 0, 100% 100%, 0 100%, 0 0)',
    2: 'polygon(50% 0, 50% 50%, 60.594% 0, 100% 0, 100% 100%, 0 100%, 0 0)',
    3: 'polygon(50% 0, 50% 50%, 66.217% 0, 100% 0, 100% 100%, 0 100%, 0 0)',
    4: 'polygon(50% 0, 50% 50%, 72.238% 0, 100% 0, 100% 100%, 0 100%, 0 0)',
    5: 'polygon(50% 0, 50% 50%, 78.849% 0, 100% 0, 100% 100%, 0 100%, 0 0)',
    6: 'polygon(50% 0, 50% 50%, 86.315% 0, 100% 0, 100% 100%, 0 100%, 0 0)',
    7: 'polygon(50% 0, 50% 50%, 95.016% 0, 100% 0, 100% 100%, 0 100%, 0 0)',
    8: 'polygon(50% 0, 50% 50%, 100% 4.899%, 100% 100%, 0 100%, 0 0)',
    9: 'polygon(50% 0, 50% 50%, 100% 13.599%, 100% 100%, 0 100%, 0 0)',
    10: 'polygon(50% 0, 50% 50%, 100% 21.065%, 100% 100%, 0 100%, 0 0)',
    11: 'polygon(50% 0, 50% 50%, 100% 27.677%, 100% 100%, 0 100%, 0 0)',
    12: 'polygon(50% 0, 50% 50%, 100% 33.698%, 100% 100%, 0 100%, 0 0)',
    13: 'polygon(50% 0, 50% 50%, 100% 39.32%, 100% 100%, 0 100%, 0 0)',
    14: 'polygon(50% 0, 50% 50%, 100% 44.698%, 100% 100%, 0 100%, 0 0)',
    15: 'polygon(50% 0, 50% 50%, 100% 50%, 100% 100%, 0 100%, 0 0)',
    16: 'polygon(50% 0, 50% 50%, 100% 55.217%, 100% 100%, 0 100%, 0 0)',
    17: 'polygon(50% 0, 50% 50%, 100% 60.594%, 100% 100%, 0 100%, 0 0)',
    18: 'polygon(50% 0, 50% 50%, 100% 66.217%, 100% 100%, 0 100%, 0 0)',
    19: 'polygon(50% 0, 50% 50%, 100% 72.238%, 100% 100%, 0 100%, 0 0)',
    20: 'polygon(50% 0, 50% 50%, 100% 78.849%, 100% 100%, 0 100%, 0 0)',
    21: 'polygon(50% 0, 50% 50%, 100% 86.315%, 100% 100%, 0 100%, 0 0)',
    22: 'polygon(50% 0, 50% 50%, 100% 95.016%, 100% 100%, 0 100%, 0 0)',
    23: 'polygon(50% 0, 50% 50%, 95.016% 100%, 0 100%, 0 0)',
    24: 'polygon(50% 0, 50% 50%, 86.315% 100%, 0 100%, 0 0)',
    25: 'polygon(50% 0, 50% 50%, 78.849% 100%, 0 100%, 0 0)',
    26: 'polygon(50% 0, 50% 50%, 72.238% 100%, 0 100%, 0 0)',
    27: 'polygon(50% 0, 50% 50%, 66.217% 100%, 0 100%, 0 0)',
    28: 'polygon(50% 0, 50% 50%, 60.594% 100%, 0 100%, 0 0)',
    29: 'polygon(50% 0, 50% 50%, 55.217% 100%, 0 100%, 0 0)',
    30: 'polygon(50% 0, 50% 50%, 50% 100%, 0 100%, 0 0)',
    31: 'polygon(50% 0, 50% 50%, 44.698% 100%, 0 100%, 0 0)',
    32: 'polygon(50% 0, 50% 50%, 39.32% 100%, 0 100%, 0 0)',
    33: 'polygon(50% 0, 50% 50%, 33.698% 100%, 0 100%, 0 0)',
    34: 'polygon(50% 0, 50% 50%, 27.677% 100%, 0 100%, 0 0)',
    35: 'polygon(50% 0, 50% 50%, 21.065% 100%, 0 100%, 0 0)',
    36: 'polygon(50% 0, 50% 50%, 13.599% 100%, 0 100%, 0 0)',
    37: 'polygon(50% 0, 50% 50%, 4.899% 100%, 0 100%, 0 0)',
    38: 'polygon(50% 0, 50% 50%, 0 95.015%, 0 0)',
    39: 'polygon(50% 0, 50% 50%, 0 86.315%, 0 0)',
    40: 'polygon(50% 0, 50% 50%, 0 78.849%, 0 0)',
    41: 'polygon(50% 0, 50% 50%, 0 72.238%, 0 0)',
    42: 'polygon(50% 0, 50% 50%, 0 66.217%, 0 0)',
    43: 'polygon(50% 0, 50% 50%, 0 60.594%, 0 0)',
    44: 'polygon(50% 0, 50% 50%, 0 55.217%, 0 0)',
    45: 'polygon(50% 0, 50% 50%, 0 50%, 0 0)',
    46: 'polygon(50% 0, 50% 50%, 0 44.698%, 0 0)',
    47: 'polygon(50% 0, 50% 50%, 0 39.32%, 0 0)',
    48: 'polygon(50% 0, 50% 50%, 0 33.698%, 0 0)',
    49: 'polygon(50% 0, 50% 50%, 0 27.677%, 0 0)',
    50: 'polygon(50% 0, 50% 50%, 0 21.065%, 0 0)',
    51: 'polygon(50% 0, 50% 50%, 0 13.599%, 0 0)',
    52: 'polygon(50% 0, 50% 50%, 0 4.899%, 0 0)',
    53: 'polygon(50% 0, 50% 50%, 4.899% 0)',
    54: 'polygon(50% 0, 50% 50%, 13.599% 0)',
    55: 'polygon(50% 0, 50% 50%, 21.065% 0)',
    56: 'polygon(50% 0, 50% 50%, 27.677% 0)',
    57: 'polygon(50% 0, 50% 50%, 33.698% 0)',
    58: 'polygon(50% 0, 50% 50%, 39.32% 0)',
    59: 'polygon(50% 0, 50% 50%, 44.698% 0)'
  }


  function addToTimer(event){
    if (state === 'session' || state === 'break') {
      return;
    }
    let clickedOn = event.originalTarget.id;

    if (clickedOn.includes('break')) {
      let thisBreak = breakLength.textContent.split(':');
      if (clickedOn.includes('Minus')) {
        if (thisBreak[0] === '0') {
          return;
        }
        let firstBeer = clockContainer.querySelector('img');
        clockContainer.removeChild(firstBeer);
        thisBreak[0] = (Number(thisBreak[0]) - 1).toString();
      } else {
        let newBeer = document.createElement('img');
        newBeer.src = 'images/pint.png';
        newBeer.setAttribute('alt', 'Pint of Beer');
        let firstBeer = clockContainer.querySelector('img');
        clockContainer.insertBefore(newBeer, firstBeer);
        thisBreak[0] = (Number(thisBreak[0]) + 1).toString();
      }
      breakLength.textContent = thisBreak.join(':');
      return;
    }
    if (clickedOn.includes('session')) {
      let thisSession = sessionLength.textContent.split(':');
      if (clickedOn.includes('Minus')) {
        if (thisSession[0] === '0') {
          return;
        }
        let tomatoes = clockContainer.querySelectorAll('img');
        let lastTomato = tomatoes[tomatoes.length - 1];
        clockContainer.removeChild(lastTomato);
        thisSession[0] = (Number(thisSession[0]) - 1).toString();
      } else {
        let newTomato = document.createElement('img');
        newTomato.src = 'images/tomato.png';
        newTomato.setAttribute('alt', 'Ripe Tomato');
        clockContainer.appendChild(newTomato);
        thisSession[0] = (Number(thisSession[0]) + 1).toString();
      }
      sessionLength.textContent = thisSession.join(':');
      return;
    }
  }

  function resetTimer(){
    state = undefined;
    updateDisplay();
    if (lastClockElement) {
      lastClockElement.style.clipPath = '';
    }
    clearInterval(main);
    resetting = true;
    let numberOfBeers = clockContainer.querySelectorAll('img[src="images/pint.png"]').length;
    let numberOfTomatoes = clockContainer.querySelectorAll('img[src="images/tomato.png"]').length;
    let breakAdd = document.querySelector('#breakAdd');
    let sessionAdd = document.querySelector('#sessionAdd');
    
    while (numberOfBeers < Number(userBreak.split(':')[0])) {
      breakAdd.click();
      numberOfBeers += 1;
    }
    
    while (numberOfTomatoes < Number(userSession.split(':')[0])) {
      sessionAdd.click();
      numberOfTomatoes += 1;
    }
    
    breakLength.textContent = userBreak;
    sessionLength.textContent = userSession;
    resetting = false;
  }

  function decrementTime(state){
    let thisTime;
    if (state === 'session') {
      thisTime = sessionLength.textContent.split(':');
    } else {
      thisTime = breakLength.textContent.split(':');
    } 

    if (thisTime[1] === '00') {
      thisTime[0] = (Number(thisTime[0]) - 1).toString();
      thisTime[1] = '59';
    } else {
      let newTime = (Number(thisTime[1]) - 1).toString();
      if (Number(newTime) < 10) {
        thisTime[1] = `0${newTime}`;
      } else {
        thisTime[1] = newTime;
      }
    }
    if (state === 'session') {
      sessionLength.textContent = thisTime.join(':');
    } else {
      breakLength.textContent = thisTime.join(':');
    } 
  }

  function updateClockAnimation(){
    let thisTime;
    if (state === 'session') {
      thisTime = Number(sessionLength.textContent.split(':')[1]);
    } else {
      thisTime = Number(breakLength.textContent.split(':')[1]);
    }

    if (thisTime === 0) {
      clockContainer.removeChild(lastClockElement);
      let imgElements = clockContainer.querySelectorAll('img');
      lastClockElement = imgElements[imgElements.length - 1];
      return;
    } else {
      lastClockElement.style.clipPath = `${imgClips[60 - thisTime]}`;
      lastClockElement.style.oClipPath = `${imgClips[60 - thisTime]}`;
      lastClockElement.style.msClipPath = `${imgClips[60 - thisTime]}`;
      lastClockElement.style.webkitClipPath = `${imgClips[60 - thisTime]}`;
    }
  }

  function updateDisplay(state){
    display.style.opacity = 0;
    setTimeout(() => {
      switch (state) {
        case 'session':
          display.textContent = 'Time to get some work done.';
          break;
        case 'break':
          display.textContent = 'Take it easy for a bit!';
          break;
        case 'finished':
          display.textContent = 'This Pomodoro session is done.';
          break;
        default:
          display.textContent = 'Pomodoro Timer';
      }
      display.style.opacity = 1;
    }, 500);
  }

  function playSound(){
    let audio;
    switch (state) {
      case 'session':
        audio = document.querySelector('#gong');
        break;
      case 'break':
        audio = document.querySelector('#tone');
        break;
      case 'finished':
        audio = document.querySelector('#bell');
        break;
    }
    audio.play();
  }

  	// main timer loop
	const mainLoop = function(){
    let sessionTimeLeft = Number(document.querySelector('#sessionLength').textContent.replace(':', ''));
    let breakTimeLeft = Number(document.querySelector('#breakLength').textContent.replace(':', ''));  

    if (sessionTimeLeft === 0 && state !== 'break') { // when the timer hits zero this will end the session
      state = 'break';
      playSound();
      updateDisplay(state);
		}
    if (breakTimeLeft === 0) { // when the timer hits zero this will end the break
      state = 'finished';
      playSound();
      updateDisplay(state);
      clearInterval(main);
      return;
		}

    decrementTime(state);
    updateClockAnimation();
  }
  
  function startCountDown(){  
    if (state !== undefined) {
      return;
    }
    state = 'session';
    playSound();
    userBreak = document.querySelector('#breakLength').textContent;
    userSession = document.querySelector('#sessionLength').textContent;
    let imgElements = clockContainer.querySelectorAll('img');
    lastClockElement = imgElements[imgElements.length - 1];
    updateDisplay(state);
    main = setInterval(mainLoop, 1000);
  }

  controls.forEach(control => control.addEventListener('click', event => addToTimer(event)));

  reset.addEventListener('click', resetTimer);
  start.addEventListener('click', startCountDown);

});
