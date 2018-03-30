document.addEventListener('DOMContentLoaded', function(){
  let clockContainer = document.querySelector('.clockContainer');
  let controls = document.querySelectorAll('.control');

  function addToTimer(event){
    console.log(event);
    let element = document.querySelector('#${event.id}');
  }


  controls.forEach(control => control.addEventListener('click', event => addToTimer(event)));




})