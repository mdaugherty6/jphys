$(document).ready(function() {
	var W = 600;
	var H = 400;
	var width = String(W)+"px";
	var height = String(H)+"px";
	$("#canvas").attr("width",width);
	$("#canvas").attr("height",height);
	var canvas = $("#canvas").get(0);
	var ctx = canvas.getContext('2d');

	var t = 0;
	var frameinterval = 20;
	var num = 2;
	var gravity = .3;
	var bounce = -.9;
	var floorfriction = .999;

	var radius = 20;
	var balls = null;
	drawStage();

	setInterval(updateStage, frameinterval);

	function updateStage() {
		t+=frameinterval;
		clearCanvas();
		updateBalls();
		detectCollide();
		drawBalls();
	}

	function Ball(x,y,radius,vx,vy,color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.vx = vx;
		this.vy = vy;
		this.vmag = Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2));
		this.vangle = Math.atan(vy/vx);
		this.color = color;
		this.origx = x;
		this.origy = y;
	}

	function drawBalls(){
		for (var i = 0; i < balls.length; i++) {
			ball = balls[i];
			ctx.beginPath();
			ctx.arc(
				ball.x,
				ball.y,
				ball.radius,
				0,
				Math.PI*2,
				false
				);
			ctx.fillStyle = ball.color;
			ctx.fill();
		}
	
	}

	function drawStage() {
		balls = new Array();
		for (var i = 0; i<num; i++){
			var startx = radius+Math.floor(Math.random()*(W-radius));
			var starty = H-radius;//radius+Math.floor(Math.random()*(H-radius));
			var vx =-6+Math.random()*12;
			var vy = 0;//-6+Math.random()*12;
			balls.push(new Ball(startx,starty,radius,vx,vy,randomColor()));
		}

		return balls;
	}

	function randomColor() {
		var letters = '789ABC'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++){
			color += letters[Math.floor(Math.random()*6)];
		}
		return color;
	}

	function updateBalls() {

		for (var i =0; i <balls.length; i++){
			ball = balls[i];
			var ballbottom = ball.y + ball.radius;
			var ballleft = ball.x - ball.radius;
			var ballright = ball.x + ball.radius;

			ball.vy += gravity;
			ball.vx *= floorfriction;

			ball.x += ball.vx;
			ball.y += ball.vy;

			// ball.vmag = Math.sqrt(Math.pow(ball.vx,2)+Math.pow(ball.vy,2));
			// ball.vangle = Math.atan(ball.vy/ball.vx);
			// console.log(ball.vmag, ball.vangle);

			//wall and floor detection 
			if (ballbottom > H) {
				ball.y = H - ball.radius;
				ball.vy *= bounce;
				if (ball.x + ball.radius > W) {
					ball.x = W - ball.radius;
					ball.vx = -ball.vx;
				}
				else if (ball.x - ball.radius < 0) {
					ball.x = ball.radius;
					ball.vx = -ball.vx;
			}
			}

			else if (ballright > W) {
				ball.x = W - ball.radius;
				ball.vx = -ball.vx;
			}

			else if (ballleft < 0) {
				ball.x = ball.radius;
				ball.vx = -ball.vx;
			}
		}
	}

	function detectCollide() {
		ball1 = balls[0];
		ball2 = balls[1];
		ball1_right = ball1.x+ball1.radius;
		ball1_left = ball1.x-ball1.radius;
		ball2_right = ball2.x+ball2.radius;
		ball2_left = ball2.x-ball2.radius;

		if(ball1_right > ball2_left && ball1_left < ball2_right) {
			if (ball1.vx > 0 && ball2.vx > 0){
				if (ball1.vx > ball2.vx) ball1.vx = -ball1.vx
				else ball2.vx = - ball2.vx	
			}
			else if (ball1.vx < 0 && ball2.vx < 0){
				if (ball1.vx > ball2.vx) ball2.vx = -ball2.vx
				else ball1.vx = - ball1.vx	
			}
			else{
				ball1.vx = -ball1.vx;
				ball2.vx = -ball2.vx;
			}
			
		}
	}

		

	function clearCanvas() {
		ctx.clearRect(0,0,W,H);
	}


});