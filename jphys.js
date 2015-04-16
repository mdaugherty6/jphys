$(document).ready(function() {
	var W = 800,
		H = 450
		width = String(W)+"px",
		height = String(H)+"px";

	$("#canvas").attr("width",width);
	$("#canvas").attr("height",height);

	var canvas = $("#canvas").get(0),
	 	ctx = canvas.getContext('2d'),
		t = 0,
		frameinterval = 15,

		num = 10,		
		gravity = .1,
		bounce = -.7,
		floorfriction = .998,
		m_factor = 1.003;
		radius = 20
		balls = null;

/* 	canvas.addEventListener('mousemove', function(evt){
		var mousePos = getMousePos(canvas,evt);
		console.log(mousePos['x']);
	}); 
	
		var rect = canvas.getBoundingClientRect();
	function getMousePos(canvas,evt) {
		return {
			x:evt.clientX - rect.left,
			y:evt.clientY - rect.top
		};
	} */

	

	
	drawStage();

	setInterval(updateStage, frameinterval);

	function updateStage() {
		t+=frameinterval;
		clearCanvas();
		detectCollide(balls);
		updateBalls();
		drawBalls();
	}

	
		$('#canvas').on('mousedown mouseover mouseup', function mouseState(e) {
		if (e.type == "mousedown") {
			var rect = canvas.getBoundingClientRect();
			canvas_x = event.pageX-rect.left,
			canvas_y = event.pageY-rect.top,
			radius = 10 + Math.random()*20;
			balls.push(new Ball(canvas_x, canvas_y+Math.floor(radius), radius, 0,0,gravity, randomColor()));
	
		}
			
	 	if (e.type =="mouseover"){
			canvas.addEventListener('mousemove',function(evt){
				var rect = canvas.getBoundingClientRect();
				canvas_x = evt.clientX - rect.left;
				canvas_y = evt.clientY - rect.top;
				console.log(canvas_x);
				for (var i = 0; i <balls.length; i++){
					if(balls[i].hitTest(canvas_x,canvas_y)) {
						console.log('hi');
						balls[i].x = canvas_x;
						balls[i].y = canvas_y;
						balls[i].vx = 0;
						balls[i].vy = 0;
						balls[i].g = 0;
						
						}	
					if(!balls[i].hitTest(canvas_x,canvas_y)) balls[i].g = gravity;
				}
			});
			}
		}); 


	

/* 	function testMouse() {
		var mousePos = getMousePos(canvas,evt);
		for (var i = 0; i < balls.length; i++) {
			if (balls[i].hitTest(mousePos[0],mousePos[1])) console.log('hi!');
		}
	} */



	function Ball(x,y,radius,vx,vy,g,color) {
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
		this.g = gravity;
	}

	Ball.prototype.hitTest = function(hitX,hitY) {
		var dx = this.x - hitX;
		var dy = this.y - hitY;
		return (dx*dx+dy*dy < this.radius*this.radius)
	};

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
			var startx = radius+Math.floor(Math.random()*(W-radius)),
				starty = radius+Math.floor(Math.random()*(H-radius)),
				vx =-6+Math.random()*12,
				vy = -6+Math.random()*12,
				radius = 10 + Math.random()*12;
			balls.push(new Ball(startx,starty,radius,vx,vy,gravity,randomColor()));
		}
		drawBalls();

		return balls;
	}

	function randomColor() {
		var letters = '789ABC'.split(''),
			color = '#';
		for (var i = 0; i < 6; i++){
			color += letters[Math.floor(Math.random()*6)];
		}
		return color;
	}

	function updateBalls() {

		for (var i =0; i <balls.length; i++){
			ball = balls[i];
			var ballbottom = ball.y + ball.radius,
				ballleft = ball.x - ball.radius,
				ballright = ball.x + ball.radius;

			ball.vy += ball.g;
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
			var ball1 = blist[i][0],
				ball2 = blist[i][1];

			handleCollision(ball1,ball2);
			}

	}

	function handleCollision(ball,otherball){


		var dx = (ball.x) - (otherball.x),
			dy = (ball.y) - (otherball.y),
			distance = Math.sqrt(dx*dx+dy*dy),
			ballradius = ball.radius + otherball.radius;
			un_normx = (dx/distance),
			un_normy = (dy/distance),
			//new tan vectors are opposite reciprocal to normal
			un_tanx = -un_normy,
			un_tany = un_normx,
			v_norm = un_normx*ball.vx+un_normy*ball.vy,
			v_tan = un_tanx*ball.vx+un_tany*ball.vy,
			ov_norm = un_normx*otherball.vx+un_normy*otherball.vy,
			ov_tan = un_tanx*otherball.vx+un_tany*otherball.vy,
			
			nv_tan = v_tan,
			nov_tan = ov_tan;

		if ( ballradius > distance) {


			var nv_norm = (ov_norm*m_factor),
				nov_norm = (v_norm*m_factor);

				if (distance < ballradius-1) {
					ball.x += 2*un_normx;
					ball.vx = -ball.vx
					ball.y += 2*un_normy;
					ball.vy = -ball.vy
					otherball.x -= (2)*un_normx;
					otherball.vx = -otherball.vx;
					otherball.y -= (2)*un_normy;
					otherball.vy = -otherball.vy;
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