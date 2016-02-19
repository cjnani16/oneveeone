/**
 * Created by crawf_000 on 1/31/2016.
 */
var Arena = function()
{
    this.podIndex=2;
    this.mainPlayer = new Hunter("Main", new Vector2(50,50), this);
    this.pods = new Array(new Pod(1), new Pod(2), new Pod(3));

    this.quiver = [];
    this.arrow_count = 0;
	
	this.IsHitting = function(box) {
		return this.pods[this.podIndex].map.CheckCollision(box);
	}
	
	this.IsHittingPlayer = function() {
		return this.pods[this.podIndex].map.collidingWithPlayer;
	}

    this.Step = function()
    {

        this.mainPlayer.Step();

        this.pods[this.podIndex].Step(this.mainPlayer.bbox); //update tilesest


        if (this.mainPlayer.position.x+this.mainPlayer.bbox.width > this.pods[this.podIndex].width
            && this.podIndex+1 < this.pods.length)
        {
                this.podIndex+=1;
                this.mainPlayer.position.x = 0;
        }

        if (this.mainPlayer.position.x < 0
            && this.podIndex-1 >= 0)
        {
                this.podIndex-=1;
                this.mainPlayer.position.x = this.pods[this.podIndex].width-this.mainPlayer.bbox.width;
        }

        for (var i = 0; i < this.arrow_count; i++)
        {
            physics(this.quiver[i]);
            this.quiver[i].bbox.x = this.quiver[i].position.x;
            this.quiver[i].bbox.y = this.quiver[i].position.y;
        }
    }

    this.Render = function(ctx)
    {
        var temp = new Bbox(0,0,0,0);

        if (this.podIndex+1 < this.pods.length) { //draw pod preview (right)
            temp.Set((this.pods[this.podIndex].width),90,300,300);
            Picasso.DrawBB(ctx, temp, "orange");
        }

        if (this.podIndex-1 >= 0) { //draw pod preview (left)
            temp.Set(-300,90,300,300);
            Picasso.DrawBB(ctx, temp, "brown");
        }

        this.pods[this.podIndex].Render(ctx); //draw pod

        for (var i = 0; i < this.arrow_count; i++) //draw arrows
        {
            if (arena.IsHitting(this.quiver[i].bbox))
                Picasso.DrawBB(ctx, this.quiver[i].bbox, "red");
            else Picasso.DrawBB(ctx, this.quiver[i].bbox, "black");
        }
    }
}