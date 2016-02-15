/**
 * Created by crawf_000 on 1/31/2016.
 */
var Arena = function()
{
    this.podIndex=2;
    this.mainPlayer = new Hunter("Main", new Vector2(50,50));
    this.pods = new Array(new Pod(1), new Pod(2), new Pod(3));
	
	this.IsHitting = function(box) {
		return this.pods[this.podIndex].map.CheckCollision(box);
	}
	
	this.IsHittingPlayer = function() {
		return this.pods[this.podIndex].map.collidingWithPlayer;
	}

    this.Step = function(ctx, box) {
		var temp = new Bbox(0,0,0,0);
		
		if (this.podIndex+1 < this.pods.length) { //draw pod preview (right)
			temp.Set((this.pods[this.podIndex].width),90,300,300);
			Picasso.DrawBB(ctx, temp, "orange");
		}
		
		if (this.podIndex-1 >= 0) { //draw pod preview (left)
			temp.Set(-300,90,300,300);
			Picasso.DrawBB(ctx, temp, "brown");
		}
	
		Picasso.DrawBB(ctx, arena.pods[arena.podIndex].bg, "gray"); //draw pod bg
		this.pods[this.podIndex].map.Step(ctx, box); //draw tilesest
		
        this.mainPlayer.Step();
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
    }
}