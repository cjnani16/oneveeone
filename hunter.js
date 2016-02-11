/**
 * Created by crawf_000 on 1/31/2016.
 */
var Hunter = function(n, p) {
    this.name = n;
    this.hitpoints = 1;
    this.bbox = new Bbox(p.x, p.y, 32, 32);
    this.position = p;
    this.velocity = new Vector2(0,0);

    this.Step = function(delta)
    {
        this.bbox.x = this.position.x;
        this.bbox.y = this.position.y;
    }
}