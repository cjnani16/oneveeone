/**
 * Created by crawf_000 on 1/31/2016.
 */

var Arrow = function(start, end, power, pod) {
    this.position = new Vector2(start.x, start.y);
    this.podIndex = pod;

    var xcomp = end.x-start.x;
    var ycomp = end.y-start.y;
    var mag = Math.sqrt(Math.pow(xcomp,2) + Math.pow(ycomp,2));
    var launchvel = power*2;

    this.velocity = new Vector2(xcomp/mag*launchvel,ycomp/mag*launchvel);
    this.bbox = new Bbox(this.position.x, this.position.y, 10, 10);
    this.direction = this.velocity.Direction();
}

var Hunter = function(n, p, a) {
    this.dir=1;
    this.status=3;
    this.name = n;
    this.hitpoints = 1;
    this.bbox = new Bbox(p.x, p.y, 80, 80);
    this.position = p;
    this.velocity = new Vector2(0,0);
	this.walkSpeed = 3;
    this.arena = a;
    this.temp = new Bbox(0,0,0,0);
    this.podIndex=0;
    this.uuid;

    this.sprites = [    [new Animation("sprites/hunteridlel.png", 12, 1, 50, 50, 15),   new Animation("sprites/hunteridler.png", 12, 1, 100, 100, 15)],     //0=idle
                        [new Animation("sprites/hunterdrawl.png", 20, 1, 50, 50, 0),    new Animation("sprites/hunterdrawr.png", 20, 1, 50, 50, 0)],      //1=draw
                        [new Animation("sprites/huntermovel.png", 12, 1, 50, 50, 15),   new Animation("sprites/huntermover.png", 12, 1, 50, 50, 15)],     //2=move
                        [new Animation("sprites/hunterjumpl.png", 1, 1, 50, 50, 0),     new Animation("sprites/hunterjumpr.png", 1, 1, 50, 50, 0)],       //3=jump
                        [new Animation("sprites/hunterfalll.png", 1, 1, 50, 50, 0),     new Animation("sprites/hunterfallr.png", 1, 1, 50, 50, 0)]]       //4=fall

    for (var i=0; i<5; i++) for (var j=0; j<2; j++) {
        this.sprites[i][j].width = this.bbox.width;
        this.sprites[i][j].height = this.bbox.height;
    }

    this.a_drawing = false;
    this.a_power = 0;

    this.SetStatus = function() {

        if (this.a_drawing) {
            this.status=1;
            this.sprites[1][0].findex.x= (Math.floor((this.a_power/24)*(this.sprites[1][0].xframes-1)));
            this.sprites[1][1].findex.x= (Math.floor((this.a_power/24)*(this.sprites[1][1].xframes-1)));
            return;
        }

        if (this.velocity.x == 0 && Math.floor(Math.abs(this.velocity.y))<=1) {
            this.status=0; return;
        }

        if (this.velocity.y<0) {
            this.status=3; return;
        }

        if (this.velocity.y>0) {
            this.status=4; return;
        }

        if (Math.abs(this.velocity.x)>0) {
            this.status=2;
        }
    }

    this.SetStatus();

    this.Step = function()
    {
        this.bbox.x = this.position.x;
        this.bbox.y = this.position.y;

        if (this.a_drawing && (this.a_power+0.5)<=24) {
            this.a_power += (0.5);
        }

        this.SetStatus();

        //console.log("["+this.status+"]"+"["+this.dir+"]");
        this.sprites[this.status][this.dir].Update();
    }

    this.Render = function(ctx) {
        if (arena.IsHitting(this))
            Picasso.DrawBB(ctx, this.bbox, "red");
        //else Picasso.DrawBB(ctx, this.bbox, "blue");

        this.sprites[this.status][this.dir].Render(ctx, this.bbox);

        Picasso.DrawText(ctx, ""+this.name, this.position.x, this.position.y);

        //charge bar
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