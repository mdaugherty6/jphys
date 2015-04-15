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
	var frameinterval = 25;
	var num = 30;
	var gravity = .1;
	var bounce = -.99;
	var floorfriction = .998;

	var radius = 10;
	var balls = null;
	drawStage();

	setInterval(updateStage, frameinterval);

	function updateStage() {
		t+=frameinterval;
		clearCanvas();
		detectCollide(balls);
		updateBalls();
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

		//vectors

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
			var vx =-6+Math.random()*12;
			var vy = -6+Math.random()*12;
			balls.push(new Ball(startx,starty,radius,vx,vy,randomColor()));
		}
		drawBalls();

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

	function detectCollide(balls) {

		var blist = k_combinations(balls,2) 

		for (var i = 0; i < blist.length; i++){
			var ball1 = blist[i][0];
			var ball2 = blist[i][1];

			var origx = (ball1.origx - ball2.origx);
			var origy = (ball1.origy - ball2.origy);
			var origdistance = Math.sqrt(origx*origx+origy*origy);
			var dx = (ball1.x) - (ball2.x);
			var dy = (ball1.y) - (ball2.y);

			var distance = Math.sqrt(dx*dx+dy*dy);

			handleCollision(ball1,ball2);
			}
			// if ( distance < ball.radius*1.8) //console.log('test1');

	}

		//handleCollision(ball3,ball2);
		//console.log(distance,dx, dy);

	function handleCollision(ball,otherball){

		var dx = (ball.x) - (otherball.x);
		var dy = (ball.y) - (otherball.y);

		var distance = Math.sqrt(dx*dx+dy*dy);


		var un_normx = (dx/distance);
		var un_normy = (dy/distance);
		var un_tanx = -un_normy;
		var un_tany = un_normx;

		var v_norm = un_normx*ball.vx+un_normy*ball.vy;
		var v_tan = un_tanx*ball.vx+un_tany*ball.vy;
		var ov_norm = un_normx*otherball.vx+un_normy*otherball.vy;
		var ov_tan = un_tanx*otherball.vx+un_tany*otherball.vy;
	

		var nv_tan = v_tan;
		var nov_tan = ov_tan;

		if ( ball.radius*2 > distance) {


			var nv_norm = (ov_norm*.9),
				nov_norm = (v_norm*.9);

				if (distance < ball.radius*2-1) {
					ball.x += 2*un_normx;
					ball.vx = -ball.vx
					//ball.y += (ball.radius+3)*2*un_normy;
					otherball.x -= (2)*un_normx;
					otherball.vx = -otherball.vy;
					//otherball.y += (ball.radius+3)*2*un_normy;
					//console.log('test');
				}

			//find x and y component of normal for ball
				new_norm_x = nv_norm * un_normx,
			 	new_norm_y = nv_norm * un_normy,

			//x & y of normal for otherball
				other_new_norm_x = nov_norm *un_normx,
				other_new_norm_y = nov_norm *un_normy,

			//x & y of tangent for ball
				new_tan_x = nv_tan * un_tanx,
				new_tan_y = nv_norm * un_tany,

			//x & y of tangent for otherball
				other_new_tan_x = nov_tan *un_tanx,
				other_new_tan_y = nov_tan *un_tany,

			//convert to regular coordinates for ball
				new_ball_velocity_x = new_norm_x+new_tan_x,
				new_ball_velocity_y = new_norm_y+new_tan_y,

			//regular coords for otherball
				new_oball_velocity_x = other_new_norm_x+other_new_tan_x,
				new_oball_velocity_y = other_new_norm_y+other_new_tan_y;

			ball.vx = new_ball_velocity_x;
			ball.vy = new_ball_velocity_y;
			otherball.vx = new_oball_velocity_x;
			otherball.vy = new_oball_velocity_y;
			}
			
		}

	function k_combinations(set, k) {
    var i, j, combs, head, tailcombs;
    
    if (k > set.length || k <= 0) {
        return [];
    }
    
    if (k == set.length) {
        return [set];
    }
    
    if (k == 1) {
        combs = [];
        for (i = 0; i < set.length; i++) {
            combs.push([set[i]]);
        }
        return combs;
    }
    
    // Assert {1 < k < set.length}
    
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
        head = set.slice(i, i+1);
        tailcombs = k_combinations(set.slice(i + 1), k - 1);
        for (j = 0; j < tailcombs.length; j++) {
            combs.push(head.concat(tailcombs[j]));
        }
    }
    return combs;
}

	function clearCanvas() {
		ctx.clearRect(0,0,W,H);
	}




});