class Star {
	
	constructor(pos, radius, maxVariance, points=10) {
		this.pos = pos;
		this.outerRadius = radius;
		this.innerRadius = radius - maxVariance;//random(0, maxVariance);
		this.points = points;
		this.color = createVector(255, 255, random(0,255));
	}
	
	draw() {
		if (WindowHandler.onScreen(this.pos, this.outerRadius)) {
			let t = 0, dt = TWO_PI / this.points, pts=[];
			for (let i=0; i<this.points; i++) {
				if (i % 2 === 0) {
					pts.push(createVector(this.innerRadius * cos(t), this.innerRadius * sin(t)).add(this.pos));
				} else {
					pts.push(createVector(this.outerRadius * cos(t), this.outerRadius * sin(t)).add(this.pos));
				}
				t += dt;
			}
			WindowHandler.drawPolygon(pts, this.color, this.color);
		}
	}
	
}