var TileMap = function(w,h,ta,td) {
	this.tilesacross	=ta;
	this.tilesdown		=td;
	this.width			=w;
	this.height			=h;
	this.tilewidth      =w/ta;
	this.tileheight		=h/td;
	
	this.collidingWithPlayer = false;
	
	this.tiles = [];
	this.tiesheet = new Image("");//sheet source here
	
	for (var i=0;i<this.tilesdown;i++)
	{
		this.tiles[i] = [];
		for (var k=0;k<this.tilesacross;k++)
		{
			this.tiles[i][k] = 0;
		}
	}
	
	this.tiles[5][0]=1; //test code for a simple map, TODO read these from files
	this.tiles[5][1]=2;
	this.tiles[5][2]=1;
	this.tiles[5][3]=2;
	this.tiles[4][3]=1;
	this.tiles[5][4]=1;
	this.tiles[5][5]=1;
	this.tiles[5][6]=2;
	this.tiles[5][7]=1;
	this.tiles[5][8]=2;
	this.tiles[5][9]=1;
	
	this.CheckCollision = function(box) {
		var temp = new Bbox(0,0,0,0);
		
		for (var i=0;i<this.tilesdown;i++) 
		{
			for (var k=0;k<this.tilesacross;k++) 
			{
				temp.Set(k*this.tilewidth,i*this.tileheight,this.tilewidth,this.tileheight);
				
				if (temp.Intersects(box) && this.tiles[i][k]!=0) 
				{
					return true;
				}
			}
		}
		return false;
	}
	
	this.Step = function(box)
	{
		var temp = new Bbox(0,0,0,0);
		this.collidingWithPlayer = false;
		
		for (var i=0;i<this.tilesdown;i++) 
		{
			for (var k=0;k<this.tilesacross;k++) 
			{
				temp.Set(k*this.tilewidth,i*this.tileheight,this.tilewidth,this.tileheight);
				if (temp.Intersects(box) && this.tiles[i][k]!=0) this.collidingWithPlayer = true;
			}
		}
	}

	this.Render = function (ctx)
	{
		var temp = new Bbox(0,0,0,0);
		for (var i=0;i<this.tilesdown;i++)
		{
			for (var k=0;k<this.tilesacross;k++)
			{
				temp.Set(k*this.tilewidth,i*this.tileheight,this.tilewidth,this.tileheight);

				switch(this.tiles[i][k])
				{
					case 1: Picasso.DrawBB(ctx,temp,"green"); break; //basic black block
					case 2: Picasso.DrawBB(ctx,temp,"yellow"); break; //basic brown block
				}
			}
		}
	}
}