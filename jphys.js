$(document).ready(function() {
	var W = 800,
		H = 450
		width = String(W)+"px",
		height = String(H)+"px";

	$("#canvas").attr("width",width);
	$("#canvas").attr("height",height);

	//Global Variables
	var canvas = $("#canvas").get(0),
	 	ctx = canvas.getContext('2d'),
		t = 0,
		frameinterval = 15,
		num = 12,		
		gravity = .2,
		bounce = -.8,
		floorfriction = .998,
		// m_factor = 1.003,
		radius_lower = 5,
		radius_upper = 30,
		radius_factor = radius_upper-radius_lower;
		balls = null,
		m1 = 2,
		m2 = 5,
		m3 = 10,
		m4 = 20;

	drawStage();

	setInterval(updateStage, frameinterval);

	//Game Loop
	function updateStage() {
		t+=frameinterval;
		clearCanvas();
		detectCollide(balls);
		updateBalls();
		drawBalls();
	}

	//Mouse Events
		$('#canvas').on('mousedown mouseover mouseup', function mouseState(e) {
		if (e.type == "mousedown") {
			var rect = canvas.getBoundingClientRect();
			canvas_x = event.pageX-rect.left,
			canvas_y = event.pageY-rect.top,
			// radius = radius_lower + Math.random()*radius_factor;
			// if (radius > (radius_lower+radius_upper)/2) var mass = 15; 
			// else mass = 2;
			rad = radiustoMass();
			balls.push(new Ball(canvas_x, canvas_y+Math.floor(rad['r']), rad['r'], 0,0,gravity, randomColor(),rad['m']));
	
		}
			
	 	if (e.type =="mouseover"){
	 		var previousEvent = false;
			canvas.addEventListener('mousemove',function(evt){
				var rect = canvas.getBoundingClientRect(),
					canvas_x = evt.clientX - rect.left,
					canvas_y = evt.clientY - rect.top;
					evt.time = Date.now();
		    		var v = makeVelocityCalculator( evt, previousEvent);
		    		previousEvent = evt;

				for (var i = 0; i <balls.length; i++){
					var ball = balls[i];
					if(ball.hitTest(canvas_x,canvas_y)) {
						ball.x = canvas_x;
						ball.y = canvas_y;
						ball.vx = -v['x']*10;
						ball.vy = -v['y']*10;
						ball.g = 0;
						if(!ball.hitTest(canvas_x,canvas_y)){
						ball.g = gravity;
						}
						}	

					if(!ball.hitTest(canvas_x,canvas_y)){
						ball.g = gravity;
						// balls[i].vx = v['x'];
						// balls[i].vy = v['y'];

					} 
				}
			});
			}
		}); 

		// var previousEvent = false;
		// $(document).mousemove(function(evt) {
		//     evt.time = Date.now();
		//     var v = makeVelocityCalculator( evt, previousEvent);
		//     previousEvent = evt;
		//     console.log(v['x'],v['y']);  
		// });

		function makeVelocityCalculator(e_init, e) {
		    var x = e_init.clientX, new_x,new_y,new_t,
		            x_dist, y_dist, interval,
		          	y = e_init.clientY,
		            t;
		    if (e === false) {return 0;}
		    t = e.time;
		    new_x = e.clientX;
		    new_y = e.clientY;
		    new_t = Date.now();
		    x_dist = new_x - x;
		    y_dist = new_y - y;
		    interval = new_t - t;
		            // update values:
		    x = new_x;
		    y = new_y;
		    var velocity = {
		    	x: x_dist/interval,
		    	y: y_dist/interval,
		    }
		    return velocity;
		    }



//Ball creation
	function Ball(x,y,radius,vx,vy,g,color,mass) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.vx = vx;
		this.vy = vy;
		this.color = color;
		this.origx = x;
		this.origy = y;
		this.g = gravity;
		this.m = mass;
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
			var startx = radius_upper+Math.floor(Math.random()*(W-radius_upper)),
				starty = radius_upper+Math.floor(Math.random()*(H-radius_upper)),
				vx =-6+Math.random()*12,
				vy = -6+Math.random()*12,
				rad = radiustoMass();
			balls.push(new Ball(startx,starty,rad['r'],vx,vy,gravity,randomColor(),rad['m']));
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

	function radiustoMass() {
			var radius = radius_lower + Math.random()*radius_factor;
			var mid = radius_lower+radius_upper;
			if (radius <= mid/4) var mass = m1;
			else if (radius <= mid/2) mass = m2; 
			else if (radius <= 3*mid/4) mass =m3;
			else mass =m4;
			var res = {
				r: radius,
				m: mass
			};
			return res;
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
	//Hit Detection
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
			nov_tan = ov_tan,
			m1 = ball.m,
			m2 = otherball.m;

		if ( ballradius > distance) {

			var nv_norm = (v_norm*(m1-m2)+ov_norm*2*m2)/(ball.m+otherball.m),
				nov_norm = (ov_norm*(m2-m1)+v_norm*2*m1)/(ball.m+otherball.m);
				console.log(nv_norm, nov_norm);


				if (distance < ballradius-1) {
					ball.x += 2*un_normx;
					ball.vx = -ball.vy;
					ball.y += 2*un_normy;
					ball.vy = ball.vx;
					otherball.x -= (2)*un_normx;
					otherball.vx = -otherball.vx;
					otherball.y -= (2)*un_normy;
					otherball.vy = -otherball.vy;
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

		if (Math.abs(dx) <1 && Math.abs(dy)<1) {
			console.log('test')
			// dx += 5;
			// dy += 5;
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