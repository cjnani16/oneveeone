/**
 * Created by crawf_000 on 2/23/2016.
 */

var Animation = function(src, xf, yf, fw, fh, fps) {

    this.sheet = new Image();
    this.sheet.src = src;
    this.xframes = xf;
    this.yframes = yf;
    this.fwidth = fw;
    this.fheight = fh;

    this.findex = new Vector2(0,0);
    this.height = this.sheet.height;
    this.width = this.sheet.width;

    this.fps = fps;

    this.timer = 0;

    this.Update = function() { //SHOULD be called 50 times a second... otherwise fps wont be accurate.
        if (this.fps==0) {return;}//0fps = no animation

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
    }

    this.Render = function(ctx, position, offset) {
        var ox=-cam.window.x, oy=-cam.window.y;
        if (offset==null) {
            ox += 20;
            oy += 0;
        }

        //ctx.drawImage(this.sheet, position.x, position.y); //for debug

        ctx.drawImage(this.sheet, this.findex.x*this.fwidth, this.findex.y*this.fheight,
            this.fwidth, this.fheight, position.x+ox, position.y+oy, this.width, this.height);

        Picasso.DrawText(ctx, "["+this.fwidth+" | "+this.fheight+"] @ ("+this.findex.x+","+this.findex.y+"):"+this.sheet.src, position.x+ox, position.y-this.height+oy); //TODO Debug purposes
    }
}