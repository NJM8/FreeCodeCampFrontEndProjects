document.addEventListener('DOMContentLoaded', function(){
  function TicTacToe(){
    this.buttonOne = document.querySelector('#buttonOne');
    this.buttonTwo = document.querySelector('#buttonTwo');
    this.display = document.querySelector('#message');
    this.boardCells = document.querySelectorAll('.boardCell');
    this.lettersTurn = '';
    this.userChoice = '';
    this.playing = false;
    this.computerPlaying = false;
    this.cheating = false;
    this.playCount = 0;
    this.winningCombinations = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
    this.board = {
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
  }

  function updateElementText(element, message){
    element.textContent = message;
  }

  // check each winning combo against the board to see if the user or the computer has a winning play
  function checkForTwoPlaysInWinningCombo(TTT){
    return TTT.winningCombinations.reduce((result, combo) => {
      let userFirst = TTT.board[combo[0]] === TTT.userChoice;
      let userSecond = TTT.board[combo[1]] === TTT.userChoice;
      let userThird = TTT.board[combo[2]] === TTT.userChoice;
      if ((userFirst && userSecond) && TTT.board[combo[2]] !== TTT.lettersTurn) {
        result['user'] = combo;
      }
      if ((userSecond && userThird) && TTT.board[combo[0]] !== TTT.lettersTurn) {
        result['user'] = combo;
      }
      if ((userFirst && userThird) && TTT.board[combo[1]] !== TTT.lettersTurn) {
        result['user'] = combo;
      }

      let computerFirst = TTT.board[combo[0]] === TTT.lettersTurn;
      let computerSecond = TTT.board[combo[1]] === TTT.lettersTurn;
      let computerThird = TTT.board[combo[2]] === TTT.lettersTurn;
      if ((computerFirst && computerSecond) && TTT.board[combo[2]] !== TTT.userChoice) {
        result['computer'] = combo;
      }
      if ((computerSecond && computerThird) && TTT.board[combo[0]] !== TTT.userChoice) {
        result['computer'] = combo;
      }
      if ((computerFirst && computerThird) && TTT.board[combo[1]] !== TTT.userChoice) {
        result['computer'] = combo;
      }
      
      return result;
    }, {});
  }

  // computer first checks if it can win, if so play there, then checks if the user is about to win, if so play there, otherwise get a random valid play location from the board and play there. setTimeout is used so it appears that the computer is thinking, instant play is weird
  function computerPlayTurn(TTT){
    let selection;
    let checkForImminentWinLoss = checkForTwoPlaysInWinningCombo(TTT)
    if (checkForImminentWinLoss.hasOwnProperty('computer')) {
      selection = checkForImminentWinLoss['computer'].find(cell => TTT.board[cell] === 'E')
    } else {
      if (checkForImminentWinLoss.hasOwnProperty('user')) {
        selection = checkForImminentWinLoss['user'].find(cell => TTT.board[cell] === 'E')
      } else {
        let options = Object.keys(TTT.board).filter(key => TTT.board[key] === 'E');
        selection = options[Math.floor(Math.random() * options.length)];
      }
    }
    let element = document.querySelector(`[data-cell="${selection}"]`);
    let mouseDown = new Event('mousedown');
    setTimeout(() => {
      TTT.cheating = false;
      element.dispatchEvent(mouseDown);
    }, 500);
  }

  // let's the user choose a side, changes play buttons to X / O and back after selection
  function chooseASide(event, TTT){
    updateElementText(TTT.display, `You chose ${event.target.textContent}`);
    TTT.userChoice = event.target.textContent;
    let whoGoesFirst = Math.round(Math.random());

    if (whoGoesFirst === 1) {
      TTT.lettersTurn = TTT.userChoice;
    } else {
      TTT.lettersTurn = ( TTT.userChoice === 'X' ? 'O' : 'X' );
    }
    TTT.buttonOne.disabled = true;
    TTT.buttonTwo.disabled = true;
    
    setTimeout(() => {
      updateElementText(TTT.display, `${TTT.lettersTurn}\'s turn`);
      TTT.playing = true;
      TTT.buttonOne.textContent = 'One Player';
      TTT.buttonTwo.textContent = 'Two Player';
      if (TTT.lettersTurn !== TTT.userChoice) {
        computerPlayTurn(TTT);
      }
    }, 1000);    
  }

  function updateBoard(cellNumber, TTT){
    TTT.board[cellNumber] = TTT.lettersTurn;
  }

  function checkForWin(TTT){
    let currentCombinations = TTT.winningCombinations.map(array => array.map(item => TTT.board[item]));

    for (let i = 0; i < 8; i++) {
      let combo = currentCombinations[i];
      if (combo[0] === combo[1] && combo[1] === combo[2]) {
        if (combo[0] === 'E') {
          continue;
        }
        TTT.boardCells.forEach(boardCell => {
          if (TTT.winningCombinations[i].includes(Number(boardCell.dataset.cell))) {
            boardCell.style.color = 'tomato';
          }
        });
        return true;
      }
    } 
    return false;
  }

  function playTurn(event, TTT){
    if (TTT.cheating) {
      return;
    }
    if (!TTT.playing) {
      return;
    }
    if (event.target.textContent === 'O' || event.target.textContent === 'X') {
      return;
    }

    TTT.playCount += 1;
    updateElementText(event.target, TTT.lettersTurn);
    updateBoard(Number(event.target.dataset.cell), TTT);

    if (checkForWin(TTT)) {
      endGame(TTT);
      return;
    }

    if (TTT.playCount === 9) {
      endGame(TTT, true);
      return;
    }

    TTT.lettersTurn === 'X' ? TTT.lettersTurn = 'O' : TTT.lettersTurn = 'X';

    updateElementText(TTT.display, `${TTT.lettersTurn}\'s turn`);

    if (TTT.computerPlaying && TTT.lettersTurn !== TTT.userChoice) {
      TTT.cheating = true;
      computerPlayTurn(TTT);
    }
  }

  function endGame(TTT, draw = false){
    if (draw) {
      updateElementText(TTT.display, 'It was a draw!');
    } else {
      updateElementText(TTT.display, `${TTT.lettersTurn} is the winner!`);
    }

    TTT.buttonOne.disabled = false;
    TTT.buttonTwo.disabled = false;
    TTT.lettersTurn = '';
    TTT.userChoice = '';
    TTT.playing = false;
    TTT.computerPlaying = false;
    TTT.playCount = 0;
    Object.keys(TTT.board).forEach(key => TTT.board[key] = 'E');

    setTimeout(() => {
      TTT.boardCells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = 'white';
      });
      updateElementText(TTT.display, 'Tic Tac Toe');
    }, 2000);
  }

  // kick off one player game, prompts user to choose a side
  function onePlayerGame(TTT){
    TTT.computerPlaying = true;
    TTT.playing = true;
    updateElementText(TTT.display, 'Choose a side.');
    TTT.buttonOne.textContent = 'X';
    TTT.buttonTwo.textContent = 'O';
  }

  // kicks off two player game
  function twoPlayerGame(TTT){
    TTT.lettersTurn = 'X';
    TTT.playing = true;
    updateElementText(TTT.display, 'X\'s turn');
    TTT.buttonOne.disabled = true;
    TTT.buttonTwo.disabled = true;
  }

  function startGame(event, TTT){
    TTT.playing ? chooseASide(event, TTT) : 
      event.target.textContent === 'One Player' ? onePlayerGame(TTT) : twoPlayerGame(TTT);
  }
  
  function createNewGame(){
    const TTT = new TicTacToe();
    TTT.buttonOne.addEventListener('mousedown', (event) => {
      startGame(event, TTT);
    });
    TTT.buttonTwo.addEventListener('mousedown', (event) => {
      startGame(event, TTT);
    });

    for (const cell of TTT.boardCells) {
      cell.addEventListener('mousedown', (event) => {
        playTurn(event, TTT);
      });
    }
  }

  createNewGame();

});
