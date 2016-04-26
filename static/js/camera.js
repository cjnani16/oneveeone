var GameCamera = function(target, win_w, win_h, gap_w, gap_h) {
	this.gap = new Bbox(0,0, gap_w, gap_h);
	this.window = new Bbox(0,0, win_w, win_h);
	this.windowspeed = 1;

	this.Update = function() {
		//center gap on target
		this.gap.x = this.target.x + (this.target.width / 2) - (this.gap.width / 2);
		this.gap.y = this.target.y + (this.target.height / 2) - (this.gap.height / 2);

		//move camera if out of gap
		if (this.gap.x < this.window.x) this.window.x -= this.windowspeed;
		if (this.gap.y < this.window.y) this.window.y -= this.windowspeed; //left and up

		if ((this.gap.x + this.gap.width) > (this.window.x + this.window.width)) this.window.x += windowspeed;
		if ((this.gap.y + this.gap.height) > (this.window.y + this.window.height)) this.window.y += windowspeed; //right and down
	}
}