/* 
 *  Hair Demo in a hangout session - this shit has to be efficient
 */


var App = function(canvas) {
    var _canvas = canvas,
        _ctx = _canvas.getContext('2d'),
        _mouseX,
        _mouseY;
    
    function Rope() {
        
            var ctx = _ctx;
    
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
            this.mS = ctx;
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
                
                console.log('sanity - inside rope init');

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

//                    alert("calculate " + this)
                    var newx = Math.cos(this._rotation)*xx + Math.sin(this._rotation)*yy;
                    var newy = -Math.sin(this._rotation)*xx + Math.cos(this._rotation)*yy;

                    return [newx,newy];

            }

            this.calculateAngle = function() {

                    var adjside = _mouseX-this.targetX;

                    var oppside = -1*(_mouseY-this.targetY);

                    var angle = Math.atan2(oppside, adjside) - Math.PI/2;

                    return angle;
            }

            this.draw = function(obj)  {
                
//                console.log('sanity - drawing branch ' + _mouseX);

                    this.pm = 120;

                    this._rotation = -(_mouseX - this.targetX)/400;
                    this.targetX += (_mouseX - this.targetX)/20;
                    this.targetY += (_mouseY - this.targetY)/20;

                    this.accForces();
                    this.verlet();
                    ///checkColl();
                    for (var j = 0; j <= this.div;j++) {
                            this.satConstraints();
                    }

                    ctx.lineWidth = 0.1;
                    ctx.strokeStyle = 'rgba(10,10,10,1)';

                    ctx.beginPath();

                    for (var i = 0; i <= this.div; i++) {
                            ctx.lineTo(this.pX[i], this.pY[i]);

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

                    ctx.stroke();
                    ctx.closePath();

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
//                console.log('sanity - rope acct forces');
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

    function RenderEngine() {
        
            var ctx = _ctx;
	
            this._objects = [];
            this.fLen = 1000;
            this.theta = 90;
            this.phi = 0;
            this.zrot = 0;
            this._scale = 1.5;
            this._origox = 600/2;
            this._origoy = 400/2;
            this._minx = 0;
            this._miny = 0;
            this._maxx = 0;
            this._maxy = 0;

            this.render = function() {
                
//                    alert("minx " + this._minx + " miny " + this._miny);
//                    console.log('sanity - rendering ' + ctx);

                    this._minx -=2;
                    this._maxx +=2;
                    this._miny -=2;
                    this._maxy +=2;

                    if(this._minx<0)
                            this._minx = 0;
                    if(this._maxx > window.innerWidth)
                            this._maxx = window.innerWidth;
                    if(this._miny<0)
                            this._miny = 0;
                    if(this._maxy > window.innerHeight)
                            this._maxy = window.innerHeight;


                    ctx.clearRect(this._minx,this._miny,this._maxx - this._minx,this._maxy+this._miny);
                    //_man.fillStyle = "rgba(255,0,0,1)";
                    //_man.fillRect(this._minx,this._miny,this._maxx - this._minx,this._maxy+this._miny);

                    this._minx = window.innerWidth;
                    this._miny = window.innerHeight;

                    this._maxx = 0;
                    this._maxy = 0;

                    this.phi+=0.01;
                    this.theta +=0.05;
                    //alert("render");

                    for(var i = 0;i<this._objects.length;i++) {
                            //alert(this._objects[i]);
//                            console.log('sanity - drawing objects');
                            this._objects[i].draw(this);
                            
                    }
                    
            }

            this.addRope = function() {
                
                    var r = new Rope();
                    r.g = 10 + 10 * Math.random();
                    r.pm = 50 + 50 * Math.random();
                    var diff = -100 + 200 * Math.random();
                    r.diffX = Math.cos(((diff+100)/200) * Math.PI)*-80
            //	r.diffY = -10 + 20 * Math.random();
                    r.diffY = Math.sin(((diff+100)/200) * Math.PI)*-80
                    this._objects.push(r);
            }

    }
    
    this.init = function() {
        console.log('sanity - first init');
        
        _mouseX = 100;
        _mouseY = 100;
        
        // do it
        $(_canvas).mousemove(function(evt) {
            _mouseX = evt.clientX;
            _mouseY = evt.clientY;
            console.log('sanity - detecting mousemove');
        });

        var engine = new RenderEngine();
        
        console.log('sanity - adding ropes');
        for(var i = 0; i < 120; i++) {
            engine.addRope();
        }
        console.log('sanity - rendering engine');
//        engine.render();

        setInterval(function() {
//            console.log('sanity - engine render' + engine);
            engine.render();
        }, 1000 / 60);
        console.log('sanity - did everything');
        
    };
    
};