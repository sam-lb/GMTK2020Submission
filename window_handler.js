class WindowHandler {

	static transformCoordinates(p) {
		return createVector(HALF_WIDTH + (p.x - windowDims.midx) * SCALE, HALF_HEIGHT - (p.y - windowDims.midy) * SCALE);
	}

	static reverseTransform(p) {
		return createVector((p.x - HALF_WIDTH) / SCALE + windowDims.midx, (HALF_HEIGHT - p.y) / SCALE + windowDims.midy)
	}
	
	static drawCircle(p, r, color, strokeColor, transparency=255) {
		strokeWeight(1);
		stroke(strokeColor.x, strokeColor.y, strokeColor.z, transparency);
		fill(color.x, color.y, color.z, transparency);
		p = WindowHandler.transformCoordinates(p);
		circle(p.x, p.y, 2 * r * SCALE);
	}
	
	static drawCircleOutline(p, r, color, weight=1) {
		strokeWeight(weight);
		stroke(color.x, color.y, color.z);
		noFill();
		p = WindowHandler.transformCoordinates(p);
		circle(p.x, p.y, 2 * r * SCALE);
	}

	static drawLine(p1, p2, color, weight=1) {
		stroke(color.x, color.y, color.z);
		strokeWeight(weight);
		p1 = WindowHandler.transformCoordinates(p1); p2 = WindowHandler.transformCoordinates(p2);
		line(p1.x, p1.y, p2.x, p2.y);
	}

	static drawRect(p, w, h, color, strokeColor) {
		strokeWeight(1);
		stroke(strokeColor.x, strokeColor.y, strokeColor.z);
		fill(color.x, color.y, color.z);
		p = WindowHandler.transformCoordinates(p);
		rect(p.x, p.y, w * SCALE, h * SCALE, 5);
	}

	static drawPolygon(pts, color, strokeColor) {
		strokeWeight(1);
		stroke(strokeColor.x, strokeColor.y, strokeColor.z);
		fill(color.x, color.y, color.z);
		pts = WindowHandler.sortClockwise(pts);
		
		let pt; 
		beginShape();
		for (let p of pts) {
			pt = WindowHandler.transformCoordinates(p);
			vertex(pt.x, pt.y);
		}
		endShape();
	}
	
	static drawSpikey(p, w, h, color, spikes=3) {
		let pts = [], spikeSize = w / 3, y = p.y - h/2;
		pts.push(createVector(p.x, p.y - h/2));
		pts.push(createVector(p.x, p.y + h/2));
		pts.push(createVector(p.x - w + spikeSize, y));
		pts.push(createVector(p.x - w + spikeSize, p.y + h/2));
		
		for (let i=1; i<=spikes; i++) {
			pts.push(createVector(p.x - random(w, w-spikeSize), y + i*h/(spikes+1)));
		}
		WindowHandler.drawPolygon(pts, color, color);
	}
	
	static drawFire(p, w, h) {
		let tw = w/3, th = h/3;
		WindowHandler.drawSpikey(p, w, h, createVector(255, 255, 0), 5);
		WindowHandler.drawSpikey(p, 2*tw, 2*th, createVector(255, 128, 0), 5);
		WindowHandler.drawSpikey(p, tw, th, createVector(255, 0, 0), 5);
	}

	static polygonMidpoint(points) {
		let v = createVector(0,0,0);
		for (let i=0; i<points.length; i++) {
			v.add(points[i]);
		}
		return v.mult(1/points.length);
	}

	static sortClockwise(points) {
		let center = WindowHandler.polygonMidpoint(points);
		let f = (A, B) => { return atan2(A.y - center.y, A.x - center.x) - atan2(B.y - center.y, B.x - center.x); }
		return points.sort(f);
	}
	
	static onScreen(point, buffer=0) {
		return ((windowDims.xmin-buffer < point.x && point.x < windowDims.xmax + buffer) && 
				(windowDims.ymin-buffer < point.y && point.y < windowDims.ymax + buffer));
	}
	
	static randomWindowPoint() {
		return createVector(random(windowDims.xmin, windowDims.xmax), random(windowDims.ymin, windowDims.ymax));
	}
	
	static randomPoint() {
		return createVector(random(totalDims.xmin, totalDims.xmax), random(totalDims.ymin, totalDims.ymax));
	}
	
	static cameraTrack(target) {
		windowDims.xmin = constrain(target.pos.x - xUnits/2, totalDims.xmin, totalDims.xmax - xUnits);
		windowDims.xmax = constrain(target.pos.x + xUnits/2, totalDims.xmin + xUnits, totalDims.xmax);
		windowDims.ymin = constrain(target.pos.y - yUnits/2, totalDims.ymin, totalDims.ymax - yUnits);
		windowDims.ymax = constrain(target.pos.y + yUnits/2, totalDims.ymin + yUnits, totalDims.ymax);
		windowDims.midx = windowDims.xmin + xUnits / 2; // do NOT replace with target.pos.x
		windowDims.midy = windowDims.ymin + yUnits / 2; // do NOT replace with target.pos.y
	}
}