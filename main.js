/**
 * Created by crawf_000 on 1/26/2016.
 */
var canvas          = document.getElementById("canvas");
canvas.width        = document.body.clientWidth;
canvas.height       = document.body.clientHeight;
canvas.style.width  = canvas.width + "px";
canvas.style.height = canvas.height + "px";

var ctx             = canvas.getContext('2d');

var arena = new Arena();
var timer=33;

var origin_x = (canvas.width/2)-250;

setInterval(function()
{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    this.arena.Step(timer);
    Picasso.DrawBB(ctx, arena.pods[arena.podIndex].bg, "gray");
    ctx.fillText(arena.pods[arena.podIndex].name,550,40);

    Picasso.DrawBB(ctx, arena.mainPlayer.bbox, "blue");
    physics(arena.mainPlayer);
},timer);

physics = function(player) {
    player.position.x+=player.velocity.x;
    player.position.y+=player.velocity.y;

    if (player.position.y<arena.pods[arena.podIndex].height-player.bbox.height) {
        player.velocity.y+=0.5;
    } else {
        player.velocity.y=0;
        player.position.y=arena.pods[arena.podIndex].height-player.bbox.height;
    }
}