class Bullet {
	
	constructor(pos, vel, color, l=0.3) {
		this.pos = pos;
		this.vec = vel.copy().setMag(l);
		this.vel = vel.setMag(0.5);
		this.color = color;
		this.l = l;
	}
	
	draw() {
		this.pos.add(this.vel);
		WindowHandler.drawLine(this.pos, p5.Vector.add(this.pos, this.vec), this.color, 5);
	}
	
}