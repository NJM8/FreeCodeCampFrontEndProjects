document.addEventListener('DOMContentLoaded', function(){
  const search = document.querySelector('#getQuery');

  function getQuery(query) {
    const request = new Request(`http://en.wikipedia.org/w/api.php?action=query&titles=${query}`);
    fetch(request)
      .then(function(response){
        console.log(response);
        return response.json();
      })
      .then(function(data){
				console.log(data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  function getInput(){
    console.log('event');
    let query = document.querySelector('#query').value;
    getQuery(query);
  }

  search.addEventListener('click', getInput);
  search.addEventListener('keyup', function(event){
    event.preventDefault();
    if (event.keyCode === 13) {
      getInput();
    }
  }); 

})