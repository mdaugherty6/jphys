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
	var frameinterval = 3;
	var num = 5;
	
	//var ball = new Ball(50,50,10,10,-15,'black');
	var balls = null; //array
	var gravity = .2;
	var bounce = -.9;
	var floorfriction = .998;

	setInterval(updateStage, frameinterval);

	function updateStage() {
		t+=frameinterval;
		clearCanvas();
		updateBall();
		drawBall();
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

	function drawBall(){
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

	function drawStage() {
		balls = new Array();

		for (var i = 0; i<num; i++){
			balls
		}
	}

	function updateBall() {
		
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

	function clearCanvas() {
		ctx.clearRect(0,0,W,H);
	}


});