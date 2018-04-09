document.addEventListener('DOMContentLoaded', function(){
  // simple lazy loader for images, grabs datasrc attribute and changes it to src
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });

  function centerControls(){
    console.log('hi');
    const board = document.querySelector('.board');
    const controls = document.querySelector('.controls');
    const boardCenterY = board.getBoundingClientRect().top + (board.getBoundingClientRect().height / 2); 
    console.log(boardCenterY);
    const boardCenterX = board.getBoundingClientRect().left + (board.getBoundingClientRect().width / 2); 
    console.log(boardCenterX);
    const controlsWidth = controls.getBoundingClientRect().width;
    console.log(controlsWidth);
    const controlsHeight = controls.getBoundingClientRect().height;
    console.log(controlsHeight);
    controls.style.top = boardCenterY + (controlsHeight / 2);
    controls.style.left = boardCenterX + (controlsWidth / 2);
  }






  centerControls();
});

