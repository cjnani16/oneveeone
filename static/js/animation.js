/**
 * Created by crawf_000 on 2/23/2016.
 */

var Animation = function(src, xf, yf, fps) {

    this.sheet = new Image();
    this.sheet.src = src;
    this.xframes = xf;
    this.yframes = yf;
    this.fwidth = Math.floor(this.sheet.width/xf);
    this.fheight = Math.floor(this.sheet.height/yf);

    this.findex = new Vector2(0,0);
    this.height = this.sheet.height;
    this.width = this.sheet.width;

    this.fps = fps;

    this.timer = 0;

    this.Update = function() { //SHOULD be called 50 times a second... otherwise fps wont be accurate.
        this.timer++;
        if (this.timer>(50/this.fps))
        {
            this.timer=0;
            if (this.findex.x+1 < this.xframes)
            {
                this.findex.x+=1;
            }
            else if (this.findex.y+1 < this.yframes)
            {
                this.findex.x=0;
                this.findex.y+=1;
            }
            else
            {
                this.findex.x=0;
                this.findex.y=0;
            }

        }

        return new Vector2();
    }

    this.Render = function(ctx, position, offset) {
        var ox=0, oy=0;
        if (offset==null) {
            ox = ((document.getElementById("canvas").width/2)-240);
            oy = 50;
        }

        ctx.drawImage(this.sheet, position.x+ox, position.y+oy, this.fwidth, this.fheight);

        ctx.drawImage(this.sheet, this.findex.x*this.fwidth, this.findex.y*this.fheight,
            this.fwidth, this.fheight, position.x+ox, position.y+oy, this.width, this.height);
    }
}