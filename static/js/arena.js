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
    this.a_image = new Image(10,10);
    this.a_image.src = "sprites/arrow.png";
    this.a_imagestill = new Image(10,10);
    this.a_imagestill.src = "sprites/arrowstill.png";
	
	this.IsHitting = function(obj) {//TODO FIX
		return this.pods[obj.podIndex].map.CheckCollision(new Bbox(obj.bbox.x, obj.bbox.y, obj.bbox.width, obj.bbox.height));
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
                var v = new Vector2(this.quiver[i].velocity.x, this.quiver[i].velocity.y);
                this.quiver[i].direction = v.Direction();
            }

        }
    }

    this.Render = function(ctx)
    {
        var temp = new Bbox(0,0,0,0);

        this.pods[this.mainPlayer.podIndex].Render(ctx); //draw pod
        for (var i = 0; i < this.arrow_count; i++) //draw arrows
        {
            if (this.quiver[i].podIndex == this.mainPlayer.podIndex) {
                if(this.quiver[i].velocity.x == 0 && this.quiver[i].velocity.y == 0) {
                    Picasso.DrawImageRot(ctx, this.quiver[i].position, this.a_imagestill, this.quiver[i].direction);
                    return;
                }
                Picasso.DrawImageRot(ctx, this.quiver[i].position, this.a_image, this.quiver[i].direction);
            }

        }

        if (this.mainPlayer.podIndex+1 < this.pods.length) { //draw pod preview (right)
            temp.Set((cam.window.width)-20,0,20,cam.window.height);
            Picasso.DrawBB(ctx, temp, "orange",false);
        }

        if (this.mainPlayer.podIndex-1 >= 0) { //draw pod preview (left)
            temp.Set(0,0,20,cam.window.height);
            Picasso.DrawBB(ctx, temp, "brown",false);
        }
    }
}