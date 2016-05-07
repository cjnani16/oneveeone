var TileMap = function(w,h,ta,td) {
	this.tilesacross	=ta;
	this.tilesdown		=td;
	this.width			=w;
	this.height			=h;
	this.tilewidth      =w/ta;
	this.tileheight		=h/td;

	this.loadedImages = new Array();

	
	this.collidingWithPlayer = false;
	
	this.tiles = [];
	this.tiesheet = new Image("");//sheet source here
	
	for (var i=0;i<this.tilesdown;i++)
	{
		this.tiles[i] = [];
		for (var k=0;k<this.tilesacross;k++)
		{
			this.tiles[i][k] = 1;
		}
	}
	
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
		testt = this.loadedImages;
		var suffix = [0,0,0,0];


		var temp = new Bbox(0,0,0,0);
		for (var i=0;i<this.tilesdown;i++)
		{
			for (var k=0;k<this.tilesacross;k++)
			{
				temp.Set(k*this.tilewidth,i*this.tileheight,this.tilewidth,this.tileheight);
				suffix = [0,0,0,0];
				switch(this.tiles[i][k])
				{
					case 1: 
						if ((k+1) < this.tilesacross && this.tiles[i][k] == this.tiles[i][k+1]) suffix[3]=1;
						if ((i+1) < this.tilesdown && this.tiles[i][k] == this.tiles[i+1][k]) suffix[1]=1;
						if ((k-1) >= 0 && this.tiles[i][k] == this.tiles[i][k-1]) suffix[2]=1;
						if ((i-1) >= 0 && this.tiles[i][k] == this.tiles[i-1][k]) suffix[0]=1;


						var file = "sprites/blocks/dirt"+suffix[0]+suffix[1]+suffix[2]+suffix[3]+".png";
						var index = parseInt(""+suffix[0]+suffix[1]+suffix[2]+suffix[3], 10);

						if (this.loadedImages[index] == undefined) {//load the image if we dont alerady have it
							this.loadedImages[index] = new Image(100,100);
							this.loadedImages[index].src = file;
						}
						Picasso.DrawImageRot(ctx, temp, this.loadedImages[index], Math.PI/2);
						break;

					case 2: Picasso.DrawBB(ctx,temp,"yellow"); break; //basic brown block
				}
				Picasso.DrawText(ctx,"v:"+this.tiles[i][k], temp.x+20, temp.y+20, null, {font:"Arial", size:"10", color:"black"});
			}
		}
	}
}