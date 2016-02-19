/**
 * Created by crawf_000 on 1/31/2016.
 */

var Arrow = function(start, end) {
    this.position = new Vector2(start.x, start.y);

    var xcomp = end.x-start.x;
    var ycomp = end.y-start.y;
    var mag = Math.sqrt(Math.pow(xcomp,2) + Math.pow(ycomp,2));
    var launchvel = 20;

    this.velocity = new Vector2(xcomp/mag*launchvel,ycomp/mag*launchvel);
    this.bbox = new Bbox(this.position.x, this.position.y, 10, 10);
}

var Hunter = function(n, p, a) {
    this.name = n;
    this.hitpoints = 1;
    this.bbox = new Bbox(p.x, p.y, 32, 32);
    this.position = p;
    this.velocity = new Vector2(0,0);
	this.walkSpeed = 3;
    this.arena = a;

    this.Step = function()
    {
        this.bbox.x = this.position.x;
        this.bbox.y = this.position.y;
    }

    this.Render = function(ctx) {
        if (arena.IsHitting(this.bbox))
            Picasso.DrawBB(ctx, this.bbox, "red");
        else Picasso.DrawBB(ctx, this.bbox, "blue");
    }
	
	this.Walk = function(direction) {
		this.velocity.x = this.walkSpeed*direction;
	}

    this.Shoot = function(target) {
        var arrow = new Arrow(new Vector2(this.position.x, this.position.y), target);
        arena.arrow_count+=1;
        arena.quiver[arena.arrow_count-1] = arrow;
    }
}