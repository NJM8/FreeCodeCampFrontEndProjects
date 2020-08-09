$(document).ready(function(){
	// set up variables for global use
	let latLng = [];
	let location = '';

	// decide on a tempurature description to send to giffy based on temp
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

	// decide on a wind description to send to giffy based on windspeed
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

	// message function to remove current message, create new message element with passed in message, and animate in new message
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

	// get weather starting with latlng, latlng already needs to be populated by navigator geolocation, only used when finding users location.
	function getWeatherByLatLng(latLng){
		$.when($.get(`https://api.opencagedata.com/geocode/v1/json?q=${latLng[0]}+${latLng[1]}&key=1a098c2cfd15418790c84f062d7126ae`))
			.then(response => {
        console.log(response)
				// save formatted location, display to user and get weather by it's latlng
				location = response.results[0].formatted;
				displayMessage(location);
				getWeather(latLng);							
			})
			.fail(error => {
				displayMessage('Oops, we couldn\'t find that location');
				console.log(error);
			});	
	};

	// get weather starting with location, used by search box input.
	function getWeatherByLocation(location){
		$.when($.get(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=1a098c2cfd15418790c84f062d7126ae`))
			.then(response => {
				// save formatted location and latlng, get weather by latlng
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

	// get the weather
	function getWeather(latLng) {
		$.when($.get(`https://fcc-weather-api.glitch.me/api/current?lat=${latLng[0]}&lon=${latLng[1]}`))
			.then(response => {
				// set weather description, temp, wind speed, and get text descriptions for temp and wind
				const weatherDescription = response.weather[0].description;
				const temperature = (response.main.temp * 1.8) + 32;
				const wind = response.wind.speed;
				const temperatureDescription = getTempDesc(temperature);
				const windDescription = getWindDesc(wind);
				// then find gifs, we are passing in which gif (weather, temp or wind) to match results to proper HTML container, the text to use in the gif search, and then the beginning of the label to label the container. Temp also get passed the temp to serve as a flag and data source to populate the temperature display next to the container label.
				getGifs('weatherDescription', weatherDescription, 'Weather: ');
				getGifs('temperatureDescription', temperatureDescription, 'Temperature: ', temperature);
				getGifs('windDescription', windDescription, 'Wind: ');
			})
			.fail(error => {
				displayMessage('Unable to find weather');
				console.log(error);
			});
	};

	// search giffy for 50 random gifs
	function getGifs(description, descriptionText, label, temperature){
	  $.when($.get(`https://api.giphy.com/v1/gifs/search?q=${descriptionText}&api_key=fLBc8pLLd3UMGWIvHv1hRu2tlwKbGBvE&limit=50`))
			.then((data) => {
				// get a random number and great a new gif container
				const randNum = Math.floor(Math.random() * 50);
				const $newGifContainer = $("<li>", {
					class: 'list-group-item list-group-item-info'
				});

				// create a new iframe to display the gif that matches the random number
				const $newGif = $("<iframe>", {
					src: data.data[randNum].embed_url, 
					width: '300', 
					height: '300', 
					class: 'giphy-embed', 
					frameBorder: '0',
				});

				// add the gif to it's container
				$newGifContainer.append($newGif);

				// create the description label element
				const $descriptionText = $("<li>", {
					text: label + descriptionText,
					class: 'list-group-item list-group-item-info'
				});

				// if there is a tempurature create the temp display element with attributes to track if it's F or C, append it to the description
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

				// append the new gif container and matching description to the proper outer container on the page
				$(`#${description}`).append($newGifContainer);
				$(`#${description}`).append($descriptionText);
			})
			.done(() => {
				// when finished animate in the container
				$(`#${description}`).animate({opacity:1},600);
			})
			.fail(error => {
				// special error message, rather than display the large message, this will show the error message in the gif container.
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

	// event listener on input to respond to return/enter key
	$('input').keyup(event => { 
		event.preventDefault();
		if (event.keyCode === 13) {
			$('#check').click(); 
		}
	});

	// respond to enter or click on search box
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
		// get weather
		getWeatherByLocation(location);
	});

	// handler for getting more gifs, will check if latlng exists (it should if there are gifs), then animate out the current gifs and fire the get weather search by latlng again. We use this function not the getGifs function because we want to serve updated weather data.
	$('#getMoreGifs').on('click', () => {
		if (latLng.length === 0) {
			displayMessage('Please enter something in the search field.');
			return;
		}
		$('#weatherDescription').animate({opacity:0}, 600, function(){
			$(this).children('li').remove();
		});
    $('#temperatureDescription').animate({opacity:0}, 600, function(){
			$(this).children('li').remove();
		});
		$('#windDescription').animate({opacity:0}, 600, function(){
			$(this).children('li').remove();
    });
    setTimeout(() => {
      getWeather(latLng);
    }, 1000)
	});

	// on delete animate out then remove gif containers, reset location and latlng
  $('#delete').on('click', function(){
    $('#weatherDescription').animate({opacity:0}, 600, function(){
			$(this).children('li').remove();
		});
    $('#temperatureDescription').animate({opacity:0}, 600, function(){
			$(this).children('li').remove();
		});
		$('#windDescription').animate({opacity:0}, 600, function(){
			$(this).children('li').remove();
		});
		$('#messageDisplay h5').animate({opacity:0}, 600, function(){
			$(this).children('li').remove();
		});
		latLng = [];
		location = '';
  });
	
	// change the tempurature from F to C or vice versa, using data-attributes to easly do calculations without worrying about string to number conversion errors or having to pull current scale from string. Will animate in and out.
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
	
	// initailize geolocation if users browser supports it and the request to use it is accepted. otherwise prompts user to search by location
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

	// add listener to anchor buttons to prevent focus styling from persisting
	$('.btn').on('keypress', function () {
		$(this).blur();
		$(this).hideFocus = false;
		$(this).css('outline: null');
	});

	$('.btn').on('click', function () {
		$(this).blur();
		$(this).hideFocus = true;
		$(this).css('outline: none');
	});
});




