document.addEventListener('DOMContentLoaded', function(){
  // grab elements for containers, buttons, and display
  let clockContainer = document.querySelector('.clockContainer');
  let controls = document.querySelectorAll('.control');
  let breakLength = document.querySelector('#breakLength');
  let sessionLength = document.querySelector('#sessionLength');
  let start = document.querySelector('#start');
  let reset = document.querySelector('#reset');
  let display = document.querySelector('.title > h1');
  // used for storing last element in clock display
  let lastClockElement;
  // stores state of application
  let state = undefined;
  // gets initial length of break and session, will be reset by user selection upon starting timer
  let userBreak = document.querySelector('#breakLength').textContent;
  let userSession = document.querySelector('#sessionLength').textContent;
  // storage for timer interval
  let main;

  // clip paths for clock animation over image
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

  // adds time to break or session timer
  function addToTimer(event){
    // return right away if the timer is active
    if (state !== undefined) {
      return;
    }
    // pull id from element clicked on
    let clickedOn = event.target.id;
    // if the element is a break time control
    if (clickedOn.includes('break')) {
      // get the current break time
      let thisBreak = breakLength.textContent.split(':');
      // is the element clicked is the minus element
      if (clickedOn.includes('Minus')) {
        // check to see if we already have zero elements, if that is the case return
        if (thisBreak[0] === '0') {
          return;
        }
        // grab the first image in the clock container
        let firstBeer = clockContainer.querySelector('img');
        // remove it
        clockContainer.removeChild(firstBeer);
        // decrease the break minute time by 1
        thisBreak[0] = (Number(thisBreak[0]) - 1).toString();
      } else {
        // element clicked must be add so create new img element
        let newBeer = document.createElement('img');
        // set the src and the alt attribute
        newBeer.src = 'images/pint.png';
        newBeer.setAttribute('alt', 'Pint of Beer');
        // grab the first beer to insert new beer before it (or first img if no beers)
        let firstBeer = clockContainer.querySelector('img');
        if (firstBeer) {
          // if there is another element in the container insert our new beer before it
          clockContainer.insertBefore(newBeer, firstBeer);
        } else {
          // there are no other elements so just add the new beer
          clockContainer.appendChild(newBeer);
        }
        // increase break minutes by 1
        thisBreak[0] = (Number(thisBreak[0]) + 1).toString();
      }
      // join the new break time array and set the break time display to it
      breakLength.textContent = thisBreak.join(':');
      return;
    }
    // is the element clicked is a session control
    if (clickedOn.includes('session')) {
      // get he current session length
      let thisSession = sessionLength.textContent.split(':');
      // if we are subtracting from the session time
      if (clickedOn.includes('Minus')) {
        // check to make sure session time does not go negative
        if (thisSession[0] === '0') {
          return;
        }
        // get all images from the clock container
        let tomatoes = clockContainer.querySelectorAll('img');
        // get the last image
        let lastTomato = tomatoes[tomatoes.length - 1];
        // remove it
        clockContainer.removeChild(lastTomato);
        // subtract 1 from session time
        thisSession[0] = (Number(thisSession[0]) - 1).toString();
      } else {
        // we must be adding to the session time so make a new tomato image
        let newTomato = document.createElement('img');
        // set src and alt attributes
        newTomato.src = 'images/tomato.png';
        newTomato.setAttribute('alt', 'Ripe Tomato');
        // add the new image to the end of all images in clock container
        clockContainer.appendChild(newTomato);
        // add 1 to session time
        thisSession[0] = (Number(thisSession[0]) + 1).toString();
      }
      // set session time to the new time
      sessionLength.textContent = thisSession.join(':');
      return;
    }
  }

  function resetTimer(){
    // set state to undefined and clear interval timer
    state = undefined;
    clearInterval(main);
    // update display message
    updateDisplay();
    // reset any clock styling on last element
    if (lastClockElement) {
      lastClockElement.style.clipPath = '';
      lastClockElement.style.oClipPath = '';
      lastClockElement.style.msClipPath = '';
      lastClockElement.style.webkitClipPath = '';
    }
    // get current number of beers and tomatoes
    let numberOfBeers = clockContainer.querySelectorAll('img[src="images/pint.png"]').length;
    let numberOfTomatoes = clockContainer.querySelectorAll('img[src="images/tomato.png"]').length;
    // get add buttons
    let breakAdd = document.querySelector('#breakAdd');
    let sessionAdd = document.querySelector('#sessionAdd');
    // init mousedown event for click simulation
    let mouseDown = new Event('mousedown');
    // while the number of beers is less than what the user started with, add a new beer
    while (numberOfBeers < Number(userBreak.split(':')[0])) {
      breakAdd.dispatchEvent(mouseDown);
      numberOfBeers += 1;
    }
    // while the number of tomatoes is less than what the user started with, add a new tomato
    while (numberOfTomatoes < Number(userSession.split(':')[0])) {
      sessionAdd.dispatchEvent(mouseDown);
      numberOfTomatoes += 1;
    }
    
    // reset break and session displays to stored user variables
    breakLength.textContent = userBreak;
    sessionLength.textContent = userSession;
  }

  // function to decrease time display depending on state
  function decrementTime(){
    // get current time
    let thisTime;
    if (state === 'session') {
      thisTime = sessionLength.textContent.split(':');
    } else {
      thisTime = breakLength.textContent.split(':');
    } 
    // if the seconds are 00, set to 59 and subtract 1 from the minutes
    if (thisTime[1] === '00') {
      thisTime[0] = (Number(thisTime[0]) - 1).toString();
      thisTime[1] = '59';
    } else {
      // create newTime 1 less than old time
      let newTime = (Number(thisTime[1]) - 1).toString();
      // if it is less than 10 pad a zero, if not just set it
      if (Number(newTime) < 10) {
        thisTime[1] = `0${newTime}`;
      } else {
        thisTime[1] = newTime;
      }
    }
    // update display depending on state
    if (state === 'session') {
      sessionLength.textContent = thisTime.join(':');
    } else {
      breakLength.textContent = thisTime.join(':');
    } 
  }

  // function to swap out clip-paths for appearance of a clock on the last element in the clock container
  function updateClockAnimation(){
    // get the current time seconds depending on the state
    let thisTime;
    if (state === 'session') {
      thisTime = Number(sessionLength.textContent.split(':')[1]);
    } else {
      thisTime = Number(breakLength.textContent.split(':')[1]);
    }

    // if the time is 0, remove the last element and update the lastClockElement for the next animation
    if (thisTime === 0) {
      clockContainer.removeChild(lastClockElement);
      let imgElements = clockContainer.querySelectorAll('img');
      lastClockElement = imgElements[imgElements.length - 1];
      return;
    } else {
      // update the current clip path to the next 'second'
      lastClockElement.style.clipPath = `${imgClips[60 - thisTime]}`;
      lastClockElement.style.oClipPath = `${imgClips[60 - thisTime]}`;
      lastClockElement.style.msClipPath = `${imgClips[60 - thisTime]}`;
      lastClockElement.style.webkitClipPath = `${imgClips[60 - thisTime]}`;
    }
  }

  // function to set the message in the display depending on state
  function updateDisplay(){
    // animate out
    display.style.opacity = 0;
    // use timer to wait for fade out, update text
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
      // animate in
      display.style.opacity = 1;
    }, 500);
  }

  // function to play a sound depending on timer state change
  function playSound(){
    let audio;
    // grab the corresponding audio element
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
	let mainLoop = function(){
    // get break time and session time left
    let sessionTimeLeft = Number(document.querySelector('#sessionLength').textContent.replace(':', ''));
    let breakTimeLeft = Number(document.querySelector('#breakLength').textContent.replace(':', ''));  
    // when the session timer hits zero this will end the session, check is to make sure this doesn't run each second when the session is done but the break is running
    if (sessionTimeLeft === 0 && state !== 'break') { 
      // update state, play sound and update display
      state = 'break';
      playSound();
      updateDisplay();
    }
    // when the timer hits zero this will end the break
    if (breakTimeLeft === 0 && state === 'break') { 
      // update state, play sound, update display, clear interval and return to prevent this loop from finishing
      state = 'finished';
      playSound();
      updateDisplay();
      clearInterval(main);
      return;
		}

    // each loop update the time and the animation
    decrementTime();
    updateClockAnimation();
  }
  
  // function to start the countdown
  function startCountDown(){  
    // check to prevent multiple setintervals from being created
    if (state !== undefined) {
      return;
    }
    // set state, play sound, update display
    state = 'session';
    playSound();
    updateDisplay();
    // store users selected break and session time
    userBreak = document.querySelector('#breakLength').textContent;
    userSession = document.querySelector('#sessionLength').textContent;
    storeUserTimes();
    // set last clock element
    let imgElements = clockContainer.querySelectorAll('img');
    lastClockElement = imgElements[imgElements.length - 1];
    // kickoff timer loop
    main = setInterval(mainLoop, 1000);
  }

  function storeUserTimes(){
    localStorage.setItem('NJM8PomodoroTimer', JSON.stringify({'userBreak': userBreak, 'userSession': userSession}));
  }

  function getUserTimes(){
    const userTimes = JSON.parse(localStorage.getItem('NJM8PomodoroTimer'));
    console.log(userTimes);
    if (userTimes) {
      const useSavedTimes = confirm('Would you like to use the times from your previous session?');
      if (useSavedTimes) {
        let previousUserBreak = Number(userTimes.userBreak.split(':')[0]);
        let previousUserSession = Number(userTimes.userSession.split(':')[0]);
        let currentUserBreak = Number(userBreak.split(':')[0]);
        let currentUserSession = Number(userSession.split(':')[0]);
        const mouseDown = new Event('mousedown');
        if (previousUserBreak > currentUserBreak) {
          const breakAdd = document.querySelector('#breakAdd');
          while (previousUserBreak > currentUserBreak) {
            breakAdd.dispatchEvent(mouseDown);
            previousUserBreak--;
          }
        } else {
          const breakMinus = document.querySelector('#breakMinus');
          while (previousUserBreak < currentUserBreak) {
            breakMinus.dispatchEvent(mouseDown);
            previousUserBreak++;
          }
        }
        if (previousUserSession > currentUserSession) {
          const sessionAdd = document.querySelector('#sessionAdd');
          while (previousUserSession > currentUserSession) {
            sessionAdd.dispatchEvent(mouseDown);
            previousUserSession--;
          }
        } else {
          const sessionMinus = document.querySelector('#sessionMinus');
          while (previousUserSession < currentUserSession) {
            sessionMinus.dispatchEvent(mouseDown);
            previousUserSession++;
          }
        }
      }
    }
  }

  for (const control of controls) {
    control.addEventListener('mousedown', addToTimer);
  }

  reset.addEventListener('mousedown', resetTimer);
  start.addEventListener('mousedown', startCountDown);

  getUserTimes();
});
