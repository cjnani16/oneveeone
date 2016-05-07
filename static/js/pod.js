/**
 * Created by crawf_000 on 1/31/2016.
 */
Pod = function(num) {
    this.width              = 1000;
    this.height             = 1200;
    this.name               = "Pod " + num;
    this.bg                 = new Bbox(0,0,this.width, this.height);
	this.map				= new TileMap(this.width, this.height, 10, 12);

    this.Step = function(box) {this.map.Step(box);}
    this.Render = function(ctx)
    {
        this.bg.width = this.width;
        this.bg.height = this.height;
        Picasso.DrawBB(ctx, this.bg, "#662900"); //draw pod bg
        var sky = new Bbox(0,-500, this.width, 500);
        Picasso.DrawBB(ctx, sky, "#1aa3ff"); //draw pod bg
        this.map.Render(ctx) //draw tilemap
        ctx.fillText(this.name,550,40); //draw pod name

    };
}