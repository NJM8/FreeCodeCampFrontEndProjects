document.addEventListener('DOMContentLoaded', function(){
  let clockContainer = document.querySelector('.clockContainer');
  let controls = document.querySelectorAll('.control');
  let breakLength = document.querySelector('#breakLength');
  let sessionLength = document.querySelector('#sessionLength');
  let start = document.querySelector('#start');
  let reset = document.querySelector('#reset');
  let display = document.querySelector('.title > h1');
  let resetting = false;
  let timing = false;
  let userBreak;
  let userSession;
  let state;
  let main;

  function addToTimer(event){
    if (state === 'session' || state === 'break') {
      return;
    }
    let clickedOn = event.originalTarget.id;

    if (clickedOn.includes('break')) {
      let thisBreak = breakLength.textContent.split(':');
      if (thisBreak[0] === '0' && !resetting) {
        return;
      }
      if (clickedOn.includes('Minus')) {
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
      if (thisSession[0] === '0' && !resetting) {
        return;
      }
      if (clickedOn.includes('Minus')) {
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
    breakLength.textContent = userBreak;
    sessionLength.textContent = userSession;
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

  function updateDisplay(state){
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
  }

  	// main timer loop
	const mainLoop = function(){
    let sessionTimeLeft = Number(document.querySelector('#sessionLength').textContent.replace(':', ''));
    let breakTimeLeft = Number(document.querySelector('#breakLength').textContent.replace(':', ''));  

    if (sessionTimeLeft === 0) { // when the timer hits zero this will end the session
			state = 'break';
      updateDisplay(state);
		}
    if (breakTimeLeft === 0) { // when the timer hits zero this will end the break
      state = 'finished';
      updateDisplay(state);
			return;
		}

    decrementTime(state);
    // updateClockAnimation();
  }
  
  function startCountDown(){    
    state = 'session';
    userBreak = document.querySelector('#breakLength').textContent;
    userSession = document.querySelector('#sessionLength').textContent;
    updateDisplay(state);
    main = setInterval(mainLoop, 1000);
  }

  controls.forEach(control => control.addEventListener('click', event => addToTimer(event)));

  reset.addEventListener('click', resetTimer);
  start.addEventListener('click', startCountDown);

});
