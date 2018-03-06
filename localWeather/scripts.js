$(document).ready(function(){
	let latLng = [];
	let location = '';

	function getTempDesc(temperature){
		switch (true) {
			case temperature < 32:
				return 'freezing';
				break;
			case 32 < temperature && temperature < 60:
				return 'cold';
				break;
			case 60 < temperature && temperature < 80:
				return 'comfortable';
				break;
			case 80 < temperature && temperature < 100:
				return 'hot';
				break;
			case 100 < temperature:
				return 'sweltering';
				break;
		}
	};

	function getWindDesc(wind){
		switch (true) {
			case wind < 4:
				return 'mild';
				break;
			case 4 < wind && wind < 8:
				return 'breezy';
				break;
			case 8 < wind && wind < 12:
				return 'windy';
				break;
			case 12 < wind && wind < 16:
				return 'blustery';
				break;
			case 16 < wind:
				return 'gusty';
				break;
		}
	};

	function displayMessage(messageText) {
		$('#messageDisplay').animate({opacity: 0}, 600, function(){
			$(this).children('h5').remove();
			const $message = $('<h5>', {
				class: 'list-group-item list-group-item-info mx-auto',
				text: messageText
			});
			$('#messageDisplay').html($message);
			$('#messageDisplay').animate({opacity: 1}, 600);
		});
	};

	function getWeatherByLatLng(latLng){
		$.when($.get(`https://api.opencagedata.com/geocode/v1/json?q=${latLng[0]}+${latLng[1]}&key=b79b1abe44204c99b963ebc85971e53e`))
			.then(response => {
				location = response.results[0].formatted;
				displayMessage(location);
				getWeather(latLng);							
			})
			.fail(error => {
				displayMessage('Oops, we couldn\'t find that location');
				console.log(error);
			});	
	};

	function getWeatherByLocation(location){
		$.when($.get(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=b79b1abe44204c99b963ebc85971e53e`))
			.then(response => {
				latLng = [response.results[0].geometry.lat, response.results[0].geometry.lng];
				location = response.results[0].formatted;
				displayMessage(location);
				getWeather(latLng);
			})
			.fail(error => {
				displayMessage('Oops, we couldn\'t find that location');
				console.log(error);
			});
	}

	function getWeather(latLng) {
		$.when($.get(`https://fcc-weather-api.glitch.me/api/current?lat=${latLng[0]}&lon=${latLng[1]}`))
			.then(response => {
				const weatherDescription = response.weather[0].description;
				const temperature = (response.main.temp * 1.8) + 32;
				const wind = response.wind.speed;
				const temperatureDescription = getTempDesc(temperature);
				const windDescription = getWindDesc(wind);
				// then find gifs
				getGifs('weatherDescription', weatherDescription, 'Weather: ');
				getGifs('temperatureDescription', temperatureDescription, 'Temperature: ', temperature);
				getGifs('windDescription', windDescription, 'Wind: ');
			})
			.fail(error => {
				displayMessage('Unable to find weather');
				console.log(error);
			});
	};

	function getGifs(description, descriptionText, label, temperature){
	  $.when($.get(`https://api.giphy.com/v1/gifs/search?q=${descriptionText}&api_key=fLBc8pLLd3UMGWIvHv1hRu2tlwKbGBvE&limit=50`))
			.then((data) => {
				const randNum = Math.floor(Math.random() * 50);
				const $newGifContainer = $("<li>", {
					class: 'list-group-item list-group-item-info'
				});

				const $newGif = $("<iframe>", {
					src: data.data[randNum].embed_url, 
					width: '300', 
					height: '300', 
					class: 'giphy-embed', 
					frameBorder: '0',
				});

				$newGifContainer.append($newGif);

				const $descriptionText = $("<li>", {
					text: label + descriptionText,
					class: 'list-group-item list-group-item-info'
				});

				if (temperature) {
					const $tempDisplay = $("<span>", {
						class: 'badge badge-light ml-2', 
						id: 'tempDisplay',
						text: `${temperature.toFixed(1)} F`,
						'data-temp': temperature.toFixed(1),
						'data-scale': 'F'
					});
					$descriptionText.append($tempDisplay);
				}

				$(`#${description}`).append($newGifContainer);
				$(`#${description}`).append($descriptionText);
			})
			.done(() => {
				$(`#${description}`).animate({opacity:1},2200);
			})
			.fail(error => {
				const $newGif = $("<li>", {
					text: "Unable to find a great Gif", 
					width: '300', 
					height: '300', 
					class: 'list-group-item list-group-item-warning'
				});
				$(`#${description}`).append($newGif);
				console.log(error);
			});
	};


	$('input').keyup(event => { // adds an event listener to the input
		event.preventDefault(); // stops default action
		if (event.keyCode === 13) { // if the key pressed is the enter key
			$('#check').click(); // call the click function of the input field
		}
	});

	$('#check').on('click', () => {
		// get location from input
		location = $('#query').val();
		// if no location display a message to prompt a location
		if (location === '') {
			$('#delete').click();
			displayMessage('Please enter something in the search field.');
			return;
		} else {
			displayMessage('Let\'s see what we can find....');
		}
		// reset input
		$('#query').val('');

		// if there are gifs or a message present present delete them
    if ($('#weatherDescription li').length || $('#locationDisplay h5').length) {
      $('#delete').click();
    }

		getWeatherByLocation(location);
	});

	$('#getMoreGifs').on('click', () => {
		if (latLng.length === 0) {
			displayMessage('Please enter something in the search field.');
			return;
		}
		$('#weatherDescription li').animate({opacity:0}, 600, function(){
			$(this).remove();
		});
    $('#temperatureDescription li').animate({opacity:0}, 600, function(){
			$(this).remove();
		});
		$('#windDescription li').animate({opacity:0}, 600, function(){
			$(this).remove();
		});
		getWeather(latLng);
	});

  $('#delete').on('click', function(){
    $('#weatherDescription li').animate({opacity:0}, 600, function(){
			$(this).remove();
		});
    $('#temperatureDescription li').animate({opacity:0}, 600, function(){
			$(this).remove();
		});
		$('#windDescription li').animate({opacity:0}, 600, function(){
			$(this).remove();
		});
		$('#messageDisplay h5').animate({opacity:0}, 600, function(){
			$(this).remove();
		});
		latLng = [];
		location = '';
  });
  
  $('#changeTemp').on('click', () => {
    const tempDisplay = $('#tempDisplay');
		const currentTemp = tempDisplay.data('temp');
		tempDisplay.animate({opacity:0}, 600, function(){
			if (tempDisplay.data('scale') === 'F') {
				const newTemp = ((currentTemp - 32) * (5 / 9)).toFixed(1);
				tempDisplay.html(`${newTemp} C`);
				tempDisplay.data('scale', 'C');
				tempDisplay.data('temp', newTemp);
			} else {
				const newTemp = ((currentTemp * (9 / 5)) + 32).toFixed(1);
				tempDisplay.html(`${newTemp} F`);
				tempDisplay.data('scale', 'F');
				tempDisplay.data('temp', newTemp);
			}
			tempDisplay.animate({opacity:1}, 600);
		})
	});
	
	if ('geolocation' in navigator) {
		displayMessage('Finding your local weather');
		let successHandler = function(position){
			latLng = [position.coords.latitude, position.coords.longitude];
			getWeatherByLatLng(latLng);
		}
		const errorHandler = function(){
			displayMessage("We couldn't get your location automatically, please search above!");
		}
		navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
	} else {
		displayMessage("We couldn't get your location automatically, please search above!");
	}
});




