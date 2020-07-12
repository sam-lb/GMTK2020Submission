class Button {
	
	constructor(str, pos, w, h, color, hoverColor, callback) {
		this.str = str;
		this.pos = pos;
		this.w = w;
		this.h = h;
		this.color = color;
		this.hoverColor = hoverColor;
		this.callback = callback;
		
		textSize(SCALE);
		let tw = textWidth(this.str);
		let th = textAscent();
		let c = WindowHandler.transformCoordinates(this.pos);
		this.textPos = createVector(c.x+(this.w * SCALE - tw)/2, c.y+(this.h * SCALE + th)/2);
	}
	
	checkHover() {
		let click = WindowHandler.reverseTransform(createVector(mouseX, mouseY));
		return ((this.pos.x <= click.x && click.x <= this.pos.x + this.w) && (this.pos.y - this.h <= click.y && click.y <= this.pos.y));
	}
	
	checkPressed() {
		// call on mousedown event (mouseClicked())
		if (this.checkHover()) {
			this.callback();
			return true;
		}
		return false;
	}
	
	draw() {
		let hover = this.checkHover();
		rectMode(CORNER);
		if (hover) {
			WindowHandler.drawRect(this.pos, this.w, this.h, this.hoverColor, this.hoverColor);
		} else {
			WindowHandler.drawRect(this.pos, this.w, this.h, this.color, this.color);
		}
		stroke(0);
		fill(255);
		text(this.str, this.textPos.x, this.textPos.y);
	}
	
}