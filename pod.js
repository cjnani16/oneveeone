/**
 * Created by crawf_000 on 1/31/2016.
 */
Pod = function(num) {
    this.width              = this.height = 500;
    this.name               = "Pod " + num;
    this.bg                 = new Bbox(0,0,this.width, this.height);
	this.map				= new TileMap(this.width, this.height, 15, 15);
}