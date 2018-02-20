$(document).ready(function(){
	$('input').keyup(function(event){ // adds an event listener to the input
		event.preventDefault(); // stops default action
		if (event.keyCode === 13) { // if the key pressed is the enter key
			$('#check').click(); // call the click function of the input field
		}
	})

	$('#check').on('click', function(){
		let location = $('#query').val();

		if (location === '') {
			alert("please enter something in the search field.");
			return;
		}

		$('#query').val('');
		$('#delete').click();

		// first get lat and long

		$.when($.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + location[0] + '&key=AIzaSyAa2Fm1SPYpC2qkif3suYQyLYGtBthsYtQ'))
			.then(function(response){
				let latLng = [];
				latLng.push(response.results[0].geometry.location.lat);
				latLng.push(response.results[0].geometry.location.lng);

				// then get weather conditions from FCC weather api

				$.when($.get("https://fcc-weather-api.glitch.me/api/current?lat=" + latLng[0] + "&lon=" + latLng[1]))
					.then(function(response){
						let weatherDescription = response.weather[0].description;
						let tempurature = (response.main.temp * 1.8) + 32;
						let wind = response.wind.speed;
						let tempuratureDescription = '';
						let windDescription = '';

						switch (true) {
							case tempurature < 32:
								tempuratureDescription = 'freezing';
								break;
							case 32 < tempurature && tempurature < 60:
								tempuratureDescription = 'cold';
								break;
							case 60 < tempurature && tempurature < 80:
								tempuratureDescription = 'comfortable';
								break;
							case 80 < tempurature && tempurature < 100:
								tempuratureDescription = 'hot';
								break;
							case 100 < tempurature:
								tempuratureDescription = 'sweltering';
								break;
						}

						switch (true) {
							case wind < 4:
								windDescription = 'mild';
								break;
							case 4 < wind && wind < 8:
								windDescription = 'breezy';
								break;
							case 8 < wind && wind < 12:
								windDescription = 'windy';
								break;
							case 12 < wind && wind < 16:
								windDescription = 'blustery';
								break;
							case 16 < wind:
								windDescription = 'gusty';
								break;
						}

						// then find gifs

						getGifs('weatherDescription', weatherDescription, 'Weather: ');
						getGifs('tempuratureDescription', tempuratureDescription, 'Tempurature: ');
						getGifs('windDescription', windDescription, 'Wind: ');
					});
			})
			.fail(error => {
				alert("Oops, we couldn't find that location");
				console.log(error);
			});	
	});

function getGifs(description, descriptionText, label){
	$.when($.get("http://api.giphy.com/v1/gifs/search?q=" + descriptionText + "&api_key=fLBc8pLLd3UMGWIvHv1hRu2tlwKbGBvE&limit=25"))
		.then(function(data){
      const randNum = Math.floor(Math.random() * 25);
      const $newGifContainer = $("<li>", {
        class: 'list-group-item list-group-item-dark'
      })
			const $newGif = $("<iframe>", {
				src: data.data[randNum].embed_url, 
				width: '300', 
				height: '300', 
				class: 'giphy-embed', 
        frameBorder: '0',
      });
      $newGifContainer.append($newGif);
      const $descriptionText = $('<li>', {
        text: label + descriptionText,
        class: 'list-group-item list-group-item-info'
      })
			$(`#${description}`).append($newGifContainer);
			$(`#${description}`).append($descriptionText);
		})
		.fail(error => {
			const $newGif = $("<li>", {
				text: "Unable to find a great Gif", 
				width: '300', 
        height: '300', 
        class: 'list-group-item list-group-item-warning'
			});
			$('#gifs').append($newGif);
			console.log(error);
		});
}	

$('#delete').on('click', function(){
		$('.giphy-embed').remove();
		$('.description').remove();
	})
})