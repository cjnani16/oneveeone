/**
 * Created by crawf_000 on 1/31/2016.
 */
var Arena = function()
{
    this.otherPlayer = new Hunter("Enemy", new Vector2(100,50), this);
    this.mainPlayer = new Hunter("Main", new Vector2(50,50), this);
    this.mainPlayer.podIndex=2;
    this.pods = new Array(new Pod(1), new Pod(2), new Pod(3));

    this.quiver = [];
    this.arrow_count = 0;
    this.a_image = document.getElementById("spr_arrow");
	
	this.IsHitting = function(obj) {//TODO FIX
		return this.pods[obj.podIndex].map.CheckCollision(obj.bbox);
	}

    this.Step = function()
    {
        this.otherPlayer.Step();
        this.mainPlayer.Step();

        this.pods[this.mainPlayer.podIndex].Step(this.mainPlayer.bbox); //update tilesest

        for (var i = 0; i < this.arrow_count; i++)
        {
            physics(this.quiver[i], true);
            this.quiver[i].bbox.x = this.quiver[i].position.x;
            this.quiver[i].bbox.y = this.quiver[i].position.y;

            if (!this.IsHitting(this.quiver[i])) {
                this.quiver[i].direction = this.quiver[i].velocity.Direction();
            }

        }
    }

    this.Render = function(ctx)
    {
        var temp = new Bbox(0,0,0,0);

        if (this.mainPlayer.podIndex+1 < this.pods.length) { //draw pod preview (right)
            temp.Set((this.pods[this.mainPlayer.podIndex].width),90,300,300);
            Picasso.DrawBB(ctx, temp, "orange");
        }

        if (this.mainPlayer.podIndex-1 >= 0) { //draw pod preview (left)
            temp.Set(-300,90,300,300);
            Picasso.DrawBB(ctx, temp, "brown");
        }

        this.pods[this.mainPlayer.podIndex].Render(ctx); //draw pod

        for (var i = 0; i < this.arrow_count; i++) //draw arrows
        {
            if (this.quiver[i].podIndex == this.mainPlayer.podIndex) {
                Picasso.DrawImageRot(ctx, this.quiver[i].position, this.a_image, this.quiver[i].direction);
            }

        }
    }
}