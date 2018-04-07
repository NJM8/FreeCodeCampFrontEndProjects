document.addEventListener('DOMContentLoaded', function(){
  let buttonOne = document.querySelector('#buttonOne');
  let buttonTwo = document.querySelector('#buttonTwo');
  let display = document.querySelector('#message');
  let boardCells = document.querySelectorAll('.boardCell');
  let lettersTurn = '';
  let userChoice = '';
  let playing = false;
  let computerPlaying = false;
  let cheating = false;
  let playCount = 0;

  let winningCombinations = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];

  let board = {
    1: 'E', 
    2: 'E', 
    3: 'E', 
    4: 'E', 
    5: 'E', 
    6: 'E', 
    7: 'E', 
    8: 'E', 
    9: 'E'
  }

  // function to set the text in an element 
  function updateElementText(element, message){
    element.textContent = message;
  }

  function computerPlayTurn(){
    let options = Object.keys(board).filter(key => board[key] === 'E');
    let selection = options[Math.floor(Math.random() * options.length)];
    let element = document.querySelector(`[data-cell="${selection}"]`);
    let mouseDown = new Event('mousedown');
    setTimeout(() => {
      cheating = false;
      element.dispatchEvent(mouseDown);
    }, 500);
  }

  function chooseASide(event){
    updateElementText(display, `You chose ${event.target.textContent}`);
    userChoice = event.target.textContent;
    let whoGoesFirst = Math.round(Math.random());

    if (whoGoesFirst === 1) {
      lettersTurn = userChoice;
    } else {
      lettersTurn = ( userChoice === 'X' ? 'O' : 'X' );
    }
    buttonOne.disabled = true;
    buttonTwo.disabled = true;
    
    setTimeout(() => {
      updateElementText(display, `${lettersTurn}\'s turn`);
      playing = true;
      buttonOne.textContent = 'One Player';
      buttonTwo.textContent = 'Two Player';
      buttonOne.removeEventListener('mousedown', chooseASide);
      buttonTwo.removeEventListener('mousedown', chooseASide);
      buttonOne.addEventListener('mousedown', onePlayerGame);
      buttonTwo.addEventListener('mousedown', twoPlayerGame);
      if (lettersTurn !== userChoice) {
        computerPlayTurn();
      }
    }, 1000);    
  }

  function onePlayerGame(){
    computerPlaying = true;
    updateElementText(display, 'Choose a side.');
    buttonOne.textContent = 'X';
    buttonTwo.textContent = 'O';
    buttonOne.removeEventListener('mousedown', onePlayerGame);
    buttonTwo.removeEventListener('mousedown', twoPlayerGame);
    buttonOne.addEventListener('mousedown', chooseASide);
    buttonTwo.addEventListener('mousedown', chooseASide);
  }

  function twoPlayerGame(){
    lettersTurn = 'X';
    playing = true;
    updateElementText(display, 'X\'s turn');
    buttonOne.disabled = true;
    buttonTwo.disabled = true;
  }

  function updateBoard(cellNumber){
    board[cellNumber] = lettersTurn;
  }

  function checkForWin(){
    let currentCombinations = winningCombinations.map(array => array.map(item => board[item]));

    for (let i = 0; i < 8; i++) {
      let combo = currentCombinations[i];
      if (combo[0] === combo[1] && combo[1] === combo[2]) {
        if (combo[0] === 'E') {
          continue;
        }
        boardCells.forEach(boardCell => {
          if (winningCombinations[i].includes(Number(boardCell.dataset.cell))) {
            boardCell.style.color = 'tomato';
          }
        });
        return true;
      }
    } 

    return false;
  }

  function playTurn(event){
    if (cheating) {
      return;
    }
    if (!playing) {
      return;
    }
    if (event.target.textContent === 'O' || event.target.textContent === 'X') {
      return;
    }

    playCount += 1;
    updateElementText(event.target, lettersTurn);
    updateBoard(Number(event.target.dataset.cell));

    if (checkForWin()) {
      endGame();
      return;
    }

    if (playCount === 9) {
      endGame(true);
      return;
    }

    lettersTurn === 'X' ? lettersTurn = 'O' : lettersTurn = 'X';

    updateElementText(display, `${lettersTurn}\'s turn`);

    if (computerPlaying && lettersTurn !== userChoice) {
      cheating = true;
      computerPlayTurn();
    }
  }

  function endGame(draw = false){
    if (draw) {
      updateElementText(display, 'It was a draw!');
    } else {
      updateElementText(display, `${lettersTurn} is the winner!`);
    }

    buttonOne.disabled = false;
    buttonTwo.disabled = false;
    lettersTurn = '';
    userChoice = '';
    playing = false;
    computerPlaying = false;
    playCount = 0;
    Object.keys(board).forEach(key => board[key] = 'E');

    setTimeout(() => {
      boardCells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = 'white';
      });
      updateElementText(display, 'Tic Tac Toe');
    }, 2000);
  }

  buttonOne.addEventListener('mousedown', onePlayerGame);
  buttonTwo.addEventListener('mousedown', twoPlayerGame);
  boardCells.forEach(cell => cell.addEventListener('mousedown', playTurn));
});
