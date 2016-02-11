/**
 * Created by crawf_000 on 1/31/2016.
 */
var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;

    this.Direction = function() {
        return Math.atan(this.y/this.x);
    }

    this.Length = function() {
        return Math.sqrt((this.y * this.y) + (this.x * this.x));
    }
}