document.addEventListener('DOMContentLoaded', function(){
  let buttonOne = document.querySelector('#buttonOne');
  let buttonTwo = document.querySelector('#buttonTwo');
  let display = document.querySelector('#message');
  let boardCells = document.querySelectorAll('.boardCell');
  let whosTurn = '';
  let playing = false;
  let computerPlaying = false;
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

  function twoPlayerGame(){
    whosTurn = 'X';
    playing = true;
    updateElementText(display, 'X\'s turn');
    buttonOne.disabled = true;
    buttonTwo.disabled = true;
  }

  function updateBoard(cellNumber){
    board[cellNumber] = whosTurn;
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
            boardCell.style.color = 'firebrick';
          }
        });
        return true;
      }
    } 

    return false;
  }

  function playTurn(event){
    if (!playing) {
      return;
    }
    if (event.target.textContent === 'O' || event.target.textContent === 'X') {
      return;
    }
    playCount += 1;
    updateElementText(event.target, whosTurn);
    updateBoard(Number(event.target.dataset.cell));

    if (playCount === 9) {
      endGame(true);
      return;
    }

    if (checkForWin()) {
      endGame();
      return;
    }

    whosTurn === 'X' ? whosTurn = 'O' : whosTurn = 'X';

    updateElementText(display, `${whosTurn}\'s turn`);

    if (computerPlaying) {
      computerPlayTurn();
    }
  }

  function endGame(draw = false){
    if (draw) {
      updateElementText(display, 'It was a draw!');
    } else {
      updateElementText(display, `${whosTurn} is the winner!`);
    }

    buttonOne.disabled = false;
    buttonTwo.disabled = false;
    playing = false;
    playCount = 0;
    Object.keys(board).forEach(key => board[key] = 'E');

    setTimeout(function(){
      boardCells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = 'white';
      });
      updateElementText(display, 'Tic Tac Toe');
    }, 2000);
  }

  // buttonOne.addEventListener('mousedown', onePlayerGame);
  buttonTwo.addEventListener('mousedown', twoPlayerGame);
  boardCells.forEach(cell => cell.addEventListener('mousedown', event => playTurn(event)));
});
