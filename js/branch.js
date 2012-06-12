function Branch()
{
	this.dirX = 10-20*Math.random();
	this.dirZ = 10-20*Math.random();
	this.dirY = 10-20*Math.random();
	this._cc = 0;
	this._cw = 30 - 60 * Math.random();
	this._cords = [];
	
	
	
	this.draw = function(obj)
	{
		
		
		_man.strokeStyle ="rgba(255,255,255,1)";
		_man.lineWidth = 0.06;
		_man.beginPath();
		for(var i = 0;i<this._cords.length;i++)
		{
		//	alert("branch.draw " + this._cords[i]);
			var v = this._cords[i];
			var nx = v.x*Math.cos(obj.theta)*Math.sin(obj.phi)+v.y*Math.sin(obj.theta)*Math.sin(obj.phi)+v.z*Math.cos(obj.phi);
			var ny = -v.x*Math.sin(obj.theta)+v.y*Math.cos(obj.theta);
			var nz = -v.x*Math.cos(obj.theta)*Math.cos(obj.phi)-v.y*Math.sin(obj.theta)*Math.cos(obj.phi)+v.z*Math.sin(obj.phi);

			nx = obj.fLen/(obj.fLen-nx)*ny;	
			ny = -obj.fLen/(obj.fLen-nx)*nz;
			
			
			//alert(nx + " " + ny);
			if(i==0)
				_man.moveTo(obj._origox + nx * obj._scale, obj._origoy + ny * obj._scale);
			_man.lineTo(obj._origox + nx * obj._scale, obj._origoy + ny * obj._scale);
		}
		_man.closePath();
		_man.stroke();
	}
	
	this.createBranch = function()
	{
		for(var i = 0;i<10;i++)
		{
			this._cords[i] = {x:this.dirX * i,y:this.dirY*i,z:this.dirZ*i};
		}
		
	}
	
	this.createBranch();
	
	
}