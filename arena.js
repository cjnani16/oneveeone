/**
 * Created by crawf_000 on 1/31/2016.
 */
var Arena = function()
{
    this.podIndex=2;
    this.mainPlayer = new Hunter("Main", new Vector2(50,50));
    this.pods = new Array(new Pod(1), new Pod(2), new Pod(3));

    this.Step = function(delta) {
        this.mainPlayer.Step(delta);
        console.log("player at x="+this.mainPlayer.position.x);
        if (this.mainPlayer.position.x+this.mainPlayer.bbox.width > this.pods[this.podIndex].width
            && this.podIndex+1 < this.pods.length)
        {
                alert("player out right");
                this.podIndex+=1;
                this.mainPlayer.position.x = 50;
        }

        if (this.mainPlayer.position.x < 0
            && this.podIndex-1 >= 0)
        {
                alert("player out left");
                this.podIndex-=1;
                this.mainPlayer.position.x = 50;
        }
    }
}