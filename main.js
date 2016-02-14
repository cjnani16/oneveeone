/**
 * Created by crawf_000 on 1/26/2016.
 */
var canvas          = document.getElementById("canvas");
canvas.width        = 1000;
canvas.height       = 600;
canvas.style.width  = canvas.width + "px";
canvas.style.height = canvas.height + "px";
canvas.style.border = "5px solid black";

var ctx             = canvas.getContext('2d');

var arena = new Arena();
var inputh = new InputHandler(canvas, arena.mainPlayer);

var origin_x = (canvas.width/2)-250;

var physics = function(object) {
	var temp = new Bbox(0,0,0,0);
	
	temp.Set(object.position.x+object.velocity.x, object.position.y, object.bbox.width, object.bbox.height);
	if (!arena.IsHitting(temp))
    object.position.x+=object.velocity.x;
	
	temp.Set(object.position.x, object.position.y+object.velocity.y, object.bbox.width, object.bbox.height);
	if (arena.IsHitting(temp))
	object.velocity.y=0;
	else
    object.position.y+=object.velocity.y;

    if (object.position.y<arena.pods[arena.podIndex].height-object.bbox.height) {
        object.velocity.y+=0.5;
    } else {
        object.velocity.y=0;
        object.position.y=arena.pods[arena.podIndex].height-object.bbox.height;
    }
}

gameLoop = function()
{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    Picasso.DrawBB(ctx, arena.pods[arena.podIndex].bg, "gray");
	this.arena.Step(ctx,arena.mainPlayer.bbox);
    ctx.fillText(arena.pods[arena.podIndex].name,550,40);
	
	if (arena.IsHitting(arena.mainPlayer.bbox))
    Picasso.DrawBB(ctx, arena.mainPlayer.bbox, "red");
	else Picasso.DrawBB(ctx, arena.mainPlayer.bbox, "blue");
	
	physics(arena.mainPlayer);
	
	window.requestAnimationFrame(gameLoop);
}

gameLoop();