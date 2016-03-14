/**
 * Created by crawf_000 on 1/31/2016.
 */

var Arrow = function(start, end, power, pod) {
    this.position = new Vector2(start.x, start.y);
    this.podIndex = pod;

    var xcomp = end.x-start.x;
    var ycomp = end.y-start.y;
    var mag = Math.sqrt(Math.pow(xcomp,2) + Math.pow(ycomp,2));
    var launchvel = power;

    this.velocity = new Vector2(xcomp/mag*launchvel,ycomp/mag*launchvel);
    this.bbox = new Bbox(this.position.x, this.position.y, 10, 10);
    this.direction = this.velocity.Direction();
}

var Hunter = function(n, p, a) {
    this.name = n;
    this.hitpoints = 1;
    this.bbox = new Bbox(p.x, p.y, 32, 32);
    this.position = p;
    this.velocity = new Vector2(0,0);
	this.walkSpeed = 3;
    this.arena = a;
    this.temp = new Bbox(0,0,0,0);
    this.podIndex=0;
    this.uuid;

    this.sprite = new Animation("sprites/sheet0_strip2.png", 2, 1, 2);
    this.sprite.width = this.bbox.width;
    this.sprite.height = this.bbox.height;

    this.a_drawing = false;
    this.a_power = 0;

    this.Step = function()
    {
        this.bbox.x = this.position.x;
        this.bbox.y = this.position.y;

        if (this.a_drawing && (this.a_power+0.5)<=24) {
            this.a_power += (0.5);
        }

        this.sprite.Update();
    }

    this.Render = function(ctx) {
        if (arena.IsHitting(this))
            Picasso.DrawBB(ctx, this.bbox, "red");
        else Picasso.DrawBB(ctx, this.bbox, "blue");

        this.sprite.Render(ctx, this.bbox);

        if (this.a_drawing) {
            this.temp.Set(0, 460, this.a_power*20, 20);
            ctx.fillText(""+this.a_power,0,440);
            if (this.a_power<24)
            Picasso.DrawBB(ctx, this.temp, "purple");
            else Picasso.DrawBB(ctx, this.temp, "orange");
        }
    }
	
	this.Walk = function(direction) {
		this.velocity.x = this.walkSpeed*direction;
	}

    this.Draw = function() {
        this.a_drawing=true;
    }

    this.Shoot = function(target) {
        if (this.a_power==0) return;
        var arrow = new Arrow(new Vector2(this.position.x, this.position.y), target, this.a_power, this.podIndex);
        arena.arrow_count+=1;
        arena.quiver[arena.arrow_count-1] = arrow;
        this.a_drawing = false;
        this.a_power=0;
    }
}