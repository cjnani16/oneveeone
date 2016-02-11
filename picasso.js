/**
 * Created by crawf_000 on 1/26/2016.
 */
var Picasso = function()
{

}
    Picasso.DrawBB = function(ctx, bbox, color)
    {
        ctx.fillStyle = color;
        ctx.fillRect(bbox.x, bbox.y, bbox.width, bbox.height);
    }