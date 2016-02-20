/**
 * Created by crawf_000 on 1/31/2016.
 */
Pod = function(num) {
    this.width              = this.height = 480;
    this.name               = "Pod " + num;
    this.bg                 = new Bbox(0,0,this.width, this.height);
	this.map				= new TileMap(this.width, this.height, 15, 15);

    this.Step = function(box) {this.map.Step(box);}
    this.Render = function(ctx)
    {
        Picasso.DrawBB(ctx, this.bg, "gray"); //draw pod bg
        this.map.Render(ctx) //draw tilemap
        ctx.fillText(this.name,550,40); //draw pod name

    };
}