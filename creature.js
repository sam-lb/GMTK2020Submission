let eimg, himg;

class Creature {
	
	constructor(pos) {
		this.pos = pos;
		//this.facing = "left";
	}//New
	
	move(vec) {
		this.pos.add(vec);
	}
	
	handleKeys() {
		
	}
	
	draw() {
		if (WindowHandler.onScreen(this.pos, this.radius+0.1)) {
			if (!this.isStatic) { 
				this.pos.x = constrain(this.pos.x, totalDims.xmin+this.radius, totalDims.xmax-this.radius);
				this.pos.y = constrain(this.pos.y, totalDims.ymin+this.radius, totalDims.ymax-this.radius);
				//this.rotationVector = p5.Vector.fromAngle(this.angle);
				//this.rotPerp = p5.Vector.fromAngle(this.angle+HALF_PI);
			}
			let keyResults = this.handleKeys();
			
			/*push();
			WindowHandler.drawCircle(this.pos, this.radius+0.1, this.lighterColor, this.lighterColor);
			this.selfRotate(-this.angle);
			this.drawExtras(keyResults);
			WindowHandler.drawCircle(this.pos, this.radius, this.baseColor, this.lighterColor);
			for (let crater of this.craters) {
				this.drawCrater(crater);
			}
			pop();*/
		}
	}
}

class Enemy extends Creature {
	
	constructor(pos) {
		super(pos)
		eimg = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/Alien2.png");
	}
	
	draw() {
		super.draw();
		//let p = WindowHandler.transformCoordinates(this.pos);
		image(eimg, this.pos.x, this.pos.y);
	}
	
	move() {
		this.pos.x -= 10;
	}
}//New

/*class Human extends Creature {
	constructor(pos) {
		super(pos)
		//himg = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/.png");
	}
	
	draw() {
		super.draw();
		//image here probably
	}
}*///New