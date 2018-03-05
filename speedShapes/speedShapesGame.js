$(document).ready(function(){
	var canvas = document.getElementById('game-board');
	canvas.width = 600;
	canvas.height = 500;
	window.ctx = canvas.getContext('2d');
	var playing = false;
	var currentShape = '';
	var score = 0;
	var possibleScore = 30;
	var timeLeft = 30;
	var randomX = 0;
	var randomY = 0;
	var difficulty = 'medium';
	var finalMessage = '';
	var hasGuessed = false;
	var displayedShapeCount = 0;
	var lastFrameTimeMs = 0;
	var timerFPMS = 1000;
	var shapeFPMS = 1000;
	var maxFPS = 10;
	var delta = 0;
	var main;

	var keys = {
		38: 'square', 
		40: 'circle', 
		39: 'triangle',
		37: 'star',

		randomShape: function(){
			var values = Object.values(keys);
			return values[Math.floor(Math.random() * 4)];
		}
	}

	var colors = ['#ff6347', '#00ff7f', '#ff00ff', '#fffacd', '#b22222', '#f0e68c', '#00ffff', '#ffa500', '#d2691e', '#556b2f', '#e9967a', '#ff1493', '#ffd700', '#fafad2', '#20b2aa'];

	var finalMessages = {
		1: 'Ouch! I think some practice is in order. Your final score was ', 
		2: 'Not bad! Your final score was ', 
		3: 'Pretty good! Your final score was ', 
		4: 'Great Job! Your final score was '
	}

	var buildFinalMessage = function(){
		var quarterScore = possibleScore / 4;
		if (score <= (quarterScore)) {
			finalMessage = finalMessages[1];
		} else if ((quarterScore + 1) <= score && score <= (quarterScore * 2)) {
			finalMessage = finalMessages[2];
		} else if ((quarterScore * 2 + 1) <= score && score <= (quarterScore * 3)) {
			finalMessage = finalMessages[3];
		} else if ((quarterScore * 3 + 1) <= score) {
			finalMessage = finalMessages[4];
		}

		finalMessage += score;
		finalMessage += ' out of ';

		if (difficulty === 'easy') {
			finalMessage += '15!';
		} else if (difficulty === 'medium') {
			finalMessage += '30!';
		} else if (difficulty === 'hard') {
			finalMessage += '60!';
		}
	}

	var draw = function(){ 
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (currentShape === 'square') {
			ctx.fillRect(randomX, randomY, 40, 40);
		} else if (currentShape === 'circle') {
			ctx.beginPath();
			ctx.arc(randomX, randomY, 22.5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.closePath();
		} else if (currentShape === 'triangle') {
			var stepOneX = randomX + 30;
			var stepOneY = randomY + 40;
			var StepTwoX = stepOneX - 60;

			ctx.beginPath();
			ctx.moveTo(randomX, randomY);
			ctx.lineTo(stepOneX, stepOneY);
			ctx.lineTo(StepTwoX, stepOneY);
			ctx.fill();
			ctx.closePath();
		} else if (currentShape === 'star') {
			ctx.save();
		    ctx.beginPath();
		    ctx.translate(randomX, randomY);
		    ctx.moveTo(0, 0 - 20);

		    for (var i = 0; i < 5; i++) {
		        ctx.rotate(Math.PI / 5);
		        ctx.lineTo(0, 0 - (20 * 0.4));
		        ctx.rotate(Math.PI / 5);
		        ctx.lineTo(0, 0 - 20);
		    }

		    ctx.closePath();
		    ctx.fill();
		    ctx.restore();
		}
	}

	var timer = function(){
		timeLeft -= 1;
		$('#time-left').text(timeLeft);
	}

	var displayShape = function(){ // seperate functions to set up for each draw		
		hasGuessed = false; // reset hasGuessed to prevent button spamming
		currentShape = keys.randomShape(); // get a random shape to draw
		ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]; // get a random color
		randomX = Math.floor(Math.random() * 525) + 25; // get a random location within the window
		randomY = Math.floor(Math.random() * 425) + 25;

		draw() // draw new shape
	}

	var mainLoop = function(timestamp){
		if (timeLeft === 0) { // when the timer hits zero this will end the game
			playing = false;
			playGame();
			return;
		}

		// controls the frame rate to 10 fps, not to cpu intensive and much faster than we need for a smooth experience, the below reads as "is the current timestamp less than the last one by the amount we want to allow it to run? if so just do another loop and wait for time to pass"
		if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
			main = requestAnimationFrame(mainLoop);
			return;
		}

		// increment the delta each frame so we know the accumulated time change, this ties the frame rate to real time by tracking how much time has passed during each frame
		delta += timestamp - lastFrameTimeMs;
		lastFrameTimeMs = timestamp;

		// when delta is larger than the desired shape display time (based on user difficulty selection)
		if (delta > shapeFPMS) { 
			// if the difficulty is easy, display a new shape every 2 seconds
			if (difficulty === 'easy') {
				if (timeLeft % 2 === 0) {
					displayShape();
				}
			// if the difficulty is medium display a shape every second
			} else if (difficulty === 'medium') {
				displayShape();
			// if the difficulty is hard, display a shape every half second
			} else if (difficulty === 'hard') {
				// displayedShapeCount prevents a new shape every frame count after the first 500 ms delay, this first display shape occurs at 500 ms
				if (displayedShapeCount === 0) {
					displayShape();
					displayedShapeCount += 1;
				// the next displayShape on hard conveniently occurs in sync with our timer so we wait until 1000 ms to display it and make sure we already showed the first shape
				} else if (delta > timerFPMS && displayedShapeCount === 1) {
					displayShape();
					displayedShapeCount = 0;
				}
			}
		}

		// if the delta is larger than the timerFPMS (1000 ms) then reset the delta and increment the timer
		if (delta > timerFPMS) {
			delta = 0;
			timer();
		}

		// repeat the loop
		main = requestAnimationFrame(mainLoop);
	}

	var playGame = function(){
		if (playing){
			$('input').attr('disabled', 'true');
			// display an initial shape at the start as the game loop needs to cycle before it can draw anything
			displayShape(); 
			// on hard mode we also need to display a second initial shape, this will trigger the drawing of the the shape at 100 ms
			if (difficulty === 'hard') {
				displayedShapeCount += 1;
			}
			// kick off game loop
			main = requestAnimationFrame(mainLoop);
		} else {
			cancelAnimationFrame(main);
			buildFinalMessage();
			$('#final-message').text(finalMessage);
			$('#score-modal').modal('show');
			$('input').removeAttr('disabled');
		}
	}

	$(document).on('keyup', function(event){
		// on space bar press start the game
		if (event.keyCode === 32 && !playing) {
			playing = true;
			playGame(playing);
		} else {
			if (!hasGuessed){
				// has guessed prevents button spamming, you can only guess once per shapeDisplay
				hasGuessed = true;
				var shapedGuessed = keys[event.keyCode];
				// if the shape guessed is the current shape update the score and display it
				if (shapedGuessed === currentShape) {
					score += 1;
					$('#score').text(score);
				}	
			} else {
				return;
			}
		}
	});

	$('#score-modal').on('hidden.bs.modal', function(){
		// the modal only displays whene the game is over, so when it closes we can reset the game space
		$('#score').text(0);
		$('#time-left').text(30);
		score = 0;
		timeLeft = 30;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	});

	$('#difficulty1').on('click', function(){
		$('label').removeClass('active');
		$('#difficulty1').parent().addClass('active');
		difficulty = 'easy';
		possibleScore = 15;
		shapeFPMS = 1000;
	});

	$('#difficulty2').on('click', function(){
		$('label').removeClass('active');
		$('#difficulty2').parent().addClass('active');
		difficulty = 'medium';
		possibleScore = 30;
		shapeFPMS = 1000;
	});

	$('#difficulty3').on('click', function(){
		$('label').removeClass('active');
		$('#difficulty3').parent().addClass('active');
		difficulty = 'hard';
		possibleScore = 60;
		shapeFPMS = 500;
	});
})


