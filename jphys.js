$(document).ready(function() {
	var W = 600;
	var H = 600;
	var width = String(W)+"px";
	var height = String(H)+"px";

	$("#canvas").attr("width",width);
	$("#canvas").attr("height",height);

	var canvas = $("#canvas").get(0);
	var ctx = canvas.getContext('2d');

	var t = 0;
	var frameinterval = 10;
	var num = 4;
	var startx = 200;
	var starty = 200;
	var radius = 25;
	
	var balls = null;
	var gravity = .3;
	var bounce = -.9;
	var floorfriction = .999;

	drawStage();

	setInterval(updateStage, frameinterval);

	function updateStage() {
		t+=frameinterval;
		clearCanvas();
		updateBalls();
		drawBalls();
	}

	function Ball(x,y,radius,vx,vy,color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.vx = vx;
		this.vy = vy;
		this.color = color;

		this.origx = x;
		this.origy = y;
	}

	function drawBalls(){
		for (var i = 0; i < balls.length; i++) {
			ctx.beginPath();
			ctx.arc(
				balls[i].x,
				balls[i].y,
				balls[i].radius,
				0,
				Math.PI*2,
				false
				);
			ctx.fillStyle = balls[i].color;
			ctx.fill();
		}
	
	}

	function drawStage() {
		balls = new Array();

		for (var i = 0; i<num; i++){
			balls.push(new Ball(startx,starty,radius,-5+Math.random()*10,-5+Math.random()*10,'black'));
		}

		return balls;

	}

	function updateBalls() {

		for (var i =0; i <balls.length; i++){
			ball = balls[i];
			ball.vy += gravity;
			ball.vx *= floorfriction;

			ball.x += ball.vx;
			ball.y += ball.vy;

			if (ball.y + ball.radius > H) {
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

			else if (ball.x + ball.radius > W) {
				ball.x = W - ball.radius;
				ball.vx = -ball.vx;
			}

			else if (ball.x - ball.radius < 0) {
				ball.x = ball.radius;
				ball.vx = -ball.vx;
			}

		}
		


	}

	function clearCanvas() {
		ctx.clearRect(0,0,W,H);
	}


});