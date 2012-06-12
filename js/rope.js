function Rope(ctx) {
    
	// Stick properties
	
	this.mass = 1;
	this.len = 3;
	this.div = 7;
	this.massDiv = this.mass / this.div;
	this.lenDiv = this.len / this.div;
	
	// Circle properties
	
	this.cX = 300;
	this.cY = 200;
	this.cR = 50;
	
	// World Characteristics
	
	this.g  = 110;	//gravity
	this.pm = 100; // Pixels/meter
	this.dt = 1 / 60;
	this.itr = 3; // Number of rigid body iterations
	
	// Program Characteristics
	
	this.pX = [];
	this.pY = [];
	this.oX = [];
	this.oY = [];
	this.aX = [];
	this.aY = [];
	this.mS = _man;
	this.offsetx = 0;
	this.offsety = 0;
	this.x = 0;
	this.y = 0;
	this.diffX = 0;
	this.diffY = 0;
	this.targetX = 0;
	this.targetY = 0;
	this._rotation = 0;
	
	this.init = function() {
            
		for (var i = 0; i <= this.div; i++) {
                    
			this.pX[i] = 10 + (this.lenDiv * this.pm * i);
			this.pY[i] = 10;
			this.oX[i] = 10 + (this.lenDiv * this.pm * i);
			this.oY[i] = 10;
			this.aX[i] = 0;
			this.aY[i] = 0;
		}
		//addChild(mS);
		//addEventListener(Event.ENTER_FRAME, frame);
	}
	
	this.calculateNewCordinates = function(xx,yy) {
		
                //alert("calculate " + this.)
		var newx = Math.cos(this._rotation)*xx + Math.sin(this._rotation)*yy;
		var newy = -Math.sin(this._rotation)*xx + Math.cos(this._rotation)*yy;
		
		return [newx,newy];
		
	}
	
	this.calculateAngle = function() {
            
		var adjside = mouseX-this.targetX;

		var oppside = -1*(mouseY-this.targetY);
		
		var angle = Math.atan2(oppside, adjside) - Math.PI/2;
		
		return angle;
	}
	
	this.draw = function(obj)  {
            
		this.pm = 120;
	
		this._rotation = -(mouseX - this.targetX)/400;
		this.targetX += (mouseX - this.targetX)/20;
		this.targetY += (mouseY - this.targetY)/20;
		
		this.accForces();
		this.verlet();
		///checkColl();
		for (var j = 0; j <= this.div;j++) {
			this.satConstraints();
		}
		

                _man.lineWidth = 0.1 ;
                _man.strokeStyle = 'rgba(255,255,255,1)';

                _man.beginPath();

                for (var i = 0; i <= this.div; i++) {
                        _man.lineTo(this.pX[i], this.pY[i]);

                        if(this.pX[i] < obj._minx)
                        {
                                obj._minx = this.pX[i];
                        }
                        if(this.pX[i] > obj._maxx)
                        {
                                obj._maxx = this.pX[i];
                        }

                        if(this.pY[i] < obj._miny)
                        {
                                obj._miny = this.pY[i];
                        }
                        if(this.pY[i] > obj._maxy)
                        {
                                obj._maxy = this.pY[i];
                        }

                }

                _man.stroke();
                _man.closePath();
		
	}
	
	this.verlet = function() {
            
		for (var i = 0; i <= this.div; i++) {
			
			var tempX = this.pX[i];
			this.pX[i] += ((0.99*this.pX[i] - 0.99*this.oX[i]) + (this.aX[i] * this.pm * this.dt * this.dt));
			var tempY = this.pY[i];
			this.pY[i] += ((0.99*this.pY[i] - 0.99*this.oY[i]) + (this.aY[i] * this.pm * this.dt * this.dt));
			this.oX[i] = tempX;
			this.oY[i] = tempY;
		}
	}
	
	this.accForces = function() {
            
		for (var i = 1; i <= this.div; i++) {
			this.aY[i] = this.g;
		}
	}
	
	this.satConstraints = function() {
		
		var h = this.calculateNewCordinates(this.diffX,this.diffY);
		//alert(h);
		
		this.pX[0] = this.targetX + h[0]  // target x  anchorpoint
		
		this.pY[0] = this.targetY + h[1] // target y
		
		for (var i = 1; i <= this.div; i++) {
			
			var dx = (this.pX[i] - this.pX[i - 1]) / this.pm;
			var dy = (this.pY[i] - this.pY[i - 1]) / this.pm;
			var d = Math.sqrt((dx * dx) + (dy * dy));
			var diff = d - this.lenDiv;
			this.pX[i] -= (dx / d) * 0.5 *this.pm* diff;
			this.pY[i] -= (dy / d) * 0.5 *this.pm* diff;
			this.pX[i - 1] += (dx / d) * 0.5 *this.pm* diff;
			this.pY[i - 1] += (dy / d) * 0.5 *this.pm* diff;
		}
	}
	this.init();
}