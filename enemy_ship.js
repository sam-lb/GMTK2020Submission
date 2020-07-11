class EnemyShip {
	
	constructor(pos, r) {
		this.pos = pos;
		this.radius = r;
		this.miniR = this.radius * 0.8;
		this.bigR = this.radius * 1.2;
		this.baseColor = createVector(100, 50, 50);
		this.antiColor = createVector(255, 255, 255);
		this.darkerColor = createVector(255, 0, 0);
		this.angle = 0;
	}
	
	draw() {
		if (WindowHandler.onScreen(this.pos, this.radius*3)) { // might remove this for non-patrol attack types
			let c = WindowHandler.transformCoordinates(this.pos);
			
			push();
			translate(c);
			rotate(this.angle);
			translate(c.mult(-1));
			let end1 = createVector(this.pos.x, this.pos.y+this.bigR), end2 = createVector(this.pos.x, this.pos.y-this.bigR);
			WindowHandler.drawCircle(this.pos, this.radius, this.darkerColor, this.darkerColor);
			WindowHandler.drawLine(end1, end2, this.antiColor, 5);
			WindowHandler.drawRect(createVector(this.pos.x-this.bigR, this.pos.y+this.radius/2), this.radius, this.radius, this.baseColor, this.baseColor);
			WindowHandler.drawRect(createVector(this.pos.x-this.bigR, this.pos.y+this.radius/2), this.radius/6, this.radius, createVector(128,128,128), createVector(128,128,128));
			WindowHandler.drawCircle(this.pos, this.miniR, this.baseColor, this.baseColor);
			WindowHandler.drawRect(createVector(end1.x,end1.y+this.radius/10), this.radius/2, this.radius/10, this.antiColor, this.antiColor);
			WindowHandler.drawRect(end2, this.radius/2, this.radius/10, this.antiColor, this.antiColor);
			rectMode(CENTER);
			WindowHandler.drawRect(createVector(this.pos.x+this.radius/2, this.pos.y), this.bigR/2, this.bigR, this.antiColor, this.baseColor);
			
			pop();
		}
	}
}


class PatrollerShip extends EnemyShip {
	
	constructor(point1, point2, r) {
		super(point1, r);
		this.point1 = point1;
		this.point2 = point2;
	}
	
	
	
}