function RenderEngine()
{
	
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
	
	this.render = function()
	{
		//alert("minx " + this._minx + " miny " + this._miny);
		
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
				
				
		_man.clearRect(this._minx,this._miny,this._maxx - this._minx,this._maxy+this._miny);
		//_man.fillStyle = "rgba(255,0,0,1)";
		//_man.fillRect(this._minx,this._miny,this._maxx - this._minx,this._maxy+this._miny);
		
		this._minx = window.innerWidth;
		this._miny = window.innerHeight;
		
		this._maxx = 0;
		this._maxy = 0;
		
		this.phi+=0.01;
		this.theta +=0.05;
		//alert("render");
		
		for(var i = 0;i<this._objects.length;i++)
		{
			//alert(this._objects[i]);
			this._objects[i].draw(this);
		}
	}
	
	this.addBranch = function()
	{
		this._objects.push(new Branch());
	}
	
	this.addRope = function()
	{
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