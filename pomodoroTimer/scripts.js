document.addEventListener('DOMContentLoaded', function(){
  let clockContainer = document.querySelector('.clockContainer');
  let controls = document.querySelectorAll('.control');

  function addToTimer(event){
    console.log(event);
    let clickedOn = event.originalTarget.id;

    if (clickedOn.includes('break')) {
      if (clickedOn.includes('Minus')) {
        let firstBeer = clockContainer.querySelector('img');
        clockContainer.removeChild(firstBeer);
      } else {
        let newBeer = document.createElement('img');
        newBeer.src = 'images/pint.png';
        newBeer.setAttribute('alt', 'Pint of Beer');
        let firstBeer = clockContainer.querySelector('img');
        clockContainer.insertBefore(newBeer, firstBeer);
      }
    }
  }


  controls.forEach(control => control.addEventListener('click', event => addToTimer(event)));




});
