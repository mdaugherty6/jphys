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
	var bounce = -.6;
	var floorfriction = .998;

	var radius = 30;
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
			var starty = radius+Math.floor(Math.random()*(H-radius));
			var vx =3;
			var vy = -6+Math.random()*12;
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
		var vx = ball
		var otherball = null;

		for (var i = 0; i < num; i++){
			ball = balls[i];
			if (ball != otherball) {
				for (var j = 0; j < num; j++){
					otherball = balls[j];
					if(otherball != ball){
						handleCollision(ball,otherball);

					}
				}
			}
		}
	}

	function handleCollision(ball,otherball){
		var dx = (ball.x + ball.radius) - (otherball.x+otherball.radius);
		var dy = (ball.y + otherball.radius) - (otherball.y+otherball.radius);
		var distance = Math.sqrt(dx*dx+dy*dy);


		var un_normx = (dx/distance);
		var un_normy = (dy/distance);
		var un_tanx = -un_normy;
		var un_tany = un_normx;

		var v_norm = un_normx*ball.vx+un_normy*ball.vy;
		var v_tan = un_tanx*ball.vx+un_tany*ball.vy;
		var ov_norm = un_normx*otherball.vx+un_normy*otherball.vy;
		var ov_tan = un_tanx*otherball.vx+un_tany*otherball.vy;
		console.log(v_tan, ov_tan);
	

		if (distance < (ball.radius + otherball.radius+5)) {
			var nv_tan = v_tan;
			var nov_tan = ov_tan;

			var nv_norm = (ov_norm);

			var nov_norm = (v_norm);

			//find x and y component of normal for ball
			var new_norm_x = nv_norm * un_normx;
			var new_norm_y = nv_norm * un_normy;

			//x & y of normal for otherball
			var other_new_norm_x = nov_norm *un_normx;
			var other_new_norm_y = nov_norm *un_normy;

			//x & y of tangent for ball
			var new_tan_x = nv_tan * un_tanx;
			var new_tan_y = nv_norm * un_tany;

			//x & y of tangent for otherball
			var other_new_tan_x = nov_tan *un_tanx;
			var other_new_tan_y = nov_tan *un_tany;

			//convert to regular coordinates for ball
			var new_ball_velocity_x = new_norm_x+new_tan_x;
			var new_ball_velocity_y = new_norm_y+new_tan_y;

			//regular coords for otherball
			var new_oball_velocity_x = other_new_norm_x+other_new_tan_x;
			var new_oball_velocity_y = other_new_norm_y+other_new_tan_y;

			ball.vx = new_ball_velocity_x;
			ball.vy = new_ball_velocity_y;
			otherball.vx = new_oball_velocity_x;
			otherball.vy = new_oball_velocity_y;
		}
		
	}

	function clearCanvas() {
		ctx.clearRect(0,0,W,H);
	}




});