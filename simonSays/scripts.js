document.addEventListener('DOMContentLoaded', function(){
  // simple lazy loader for images, grabs datasrc attribute and changes it to src
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
  });

  let playing = false;

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
    playing ? playing = false : playing = true;
  }
  
  function enableStrictMode(){
    if (playing) {
      return;
    }
    strictIndicator.classList.contains('strictOn') ? 
    strictIndicator.classList.remove('strictOn') : strictIndicator.classList.add('strictOn');
  }

  function playSound(event){
    let sound = document.querySelector(`[data-key="${event.target.dataset.id}"]`);
    sound.play();
  }
  
  const toggleBody = document.querySelector('.toggleBody');
  const toggle = document.querySelector('.toggle');
  toggleBody.addEventListener('mousedown', toggleOnOff);

  const strictButton = document.querySelector('#strict');
  const strictIndicator = document.querySelector('.strictIndicator');
  strictButton.addEventListener('mousedown', enableStrictMode); 

  const simonButtons = document.querySelectorAll('.simonButton');
  for (const simonButton of simonButtons) {
    simonButton.addEventListener('mousedown', playSound);
  }
  centerControls();
});

