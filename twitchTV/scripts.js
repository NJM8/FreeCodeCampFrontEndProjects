$(document).ready(function(){

  // bind click event to search button, grab value in input box and call getQuery, reset value
  $('#searchButton').on('click', function(){
    getQuery($('#search').val());
    $('#search').val('');
  })

  // bind event listener to dropdown menu > a links to call getQuery on the clicked value
  $('.dropdown-menu > a').on('click', function(){
    getQuery($(this).text());
  })

  function getQuery(query){
    // first check the api for existance of the username searched
    $.when($.getJSON(`https://wind-bow.gomix.me/twitch-api/users/${query}?callback=?`))
      .then(response => {
        // if username put in incorrectly or not found display error and return
        if (response.error === 'Unprocessable Entity' || response.error === 'Not Found') {
          throw Error('is not a streamer on Twitch');
        }
        // assume username is valid and get current stream status
        $.when($.getJSON(`https://wind-bow.gomix.me/twitch-api/streams/${query}?callback=?`))
          .then(response => {
            // call function with response and query to create new element to display results
            createNewSuccessDisplay(response, query);
          })
          .fail(error => {
            console.log(error);
            createNewErrorDisplay(error.message, query);
          })
      })
      .fail(error => {
        console.log(error);
        createNewErrorDisplay(error.message, query);
      })
  }

  function createNewSuccessDisplay(response, query){
    // create new a tag with btn style and tooltip
    let $display = $('<a>', {
      class: 'btn m-1 results',
      'data-toggle': 'tooltip',
      'data-placement': 'left', 
      title: `Visit ${query} on Twitch TV`,
      href: `https://www.twitch.tv/${query}`, 
      role: 'button', 
      target: '_blank',
      rel: 'noopener'
    });
    
    // if streaming or not attach appropriate message and class to change style
    if (response.stream === null) {
      $display.addClass('btn-secondary');
      $display.text(`${query} is offline right now.`);
    } else {
      $display.addClass('btn-info');
      $display.text(`${query} is now streaming: ${response.stream.channel.status}`);
    }

    // add new display element to results container
    $('#results').append($display);
    // initialize tooltip on hover functionality
    $('[data-toggle="tooltip"]').tooltip()
  }

  // create error display, same style as success so we use an a tag and style like a btn
  function createNewErrorDisplay(message, query){
    let $display = $('<a>', {
      class: 'btn m-1 text-white results',
      text: `Sorry ${query} ${message}`,
      style: 'background-color: #993232'
    });
    // add it to the results container with the rest of them
    $('#results').append($display);    
  }

  // bind event listener to input for enter/return key
  $('input').keyup(event => { 
		event.preventDefault();
		if (event.keyCode === 13) {
			getQuery($('#search').val());
      $('#search').val(''); 
		}
  });
});
