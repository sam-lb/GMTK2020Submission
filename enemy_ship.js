class EnemyShip {
	
	constructor(pos, r, bulletDamage=5) {
		this.pos = pos;
		this.radius = r;
		this.miniR = this.radius * 0.8;
		this.bigR = this.radius * 1.2;
		this.baseColor = createVector(100, 100, 100);
		this.antiColor = createVector(255, 255, 255);
		this.darkerColor = createVector(0, 255, 0);
		this.bulletColor = createVector(255, 128, 0);
		this.activated = false;
		this.bullets = [];
		this.angle = 0;
		this.bulletDamage = bulletDamage;
		this.maxHealth = 10;
		this.health = this.maxHealth;
		this.dead = false;
	}
	
	selfRotate(angle) {
		let c = WindowHandler.transformCoordinates(this.pos);
		translate(c);
		rotate(angle);
		translate(c.mult(-1));
	}
	
	shoot() {
		if (this.activated) {
			this.bullets.push(new Bullet(this.gunPoints[0], this.rotationVector, this.bulletColor));
			this.bullets.push(new Bullet(this.gunPoints[1], this.rotationVector, this.bulletColor));
		}
	}
	
	move() {
		return {"moving": false,};
	}
	
	draw() {
		this.rotationVector = p5.Vector.fromAngle(this.angle);
		this.rotPerp = p5.Vector.fromAngle(this.angle+HALF_PI);
		this.gunPoints = [this.rotationVector.copy().mult(0).add(this.rotPerp.copy().mult(this.bigR)).add(this.pos),
						  this.rotationVector.copy().mult(0).add(this.rotPerp.copy().mult(-this.bigR)).add(this.pos)];
		let state = this.move();
		
		push();
		this.selfRotate(-this.angle);
		let end1 = createVector(this.pos.x, this.pos.y+this.bigR), end2 = createVector(this.pos.x, this.pos.y-this.bigR);
		WindowHandler.drawCircle(this.pos, this.radius, this.darkerColor, this.darkerColor);
		WindowHandler.drawLine(end1, end2, this.antiColor, 5);
		WindowHandler.drawRect(createVector(this.pos.x-this.bigR, this.pos.y+this.radius/4), this.radius, this.radius/2, this.baseColor, this.baseColor);
		WindowHandler.drawRect(createVector(this.pos.x-this.bigR, this.pos.y+this.radius/4), this.radius/6, this.radius/2, createVector(128,128,128), createVector(128,128,128));
		WindowHandler.drawCircle(this.pos, this.miniR, this.baseColor, this.baseColor);
		WindowHandler.drawRect(createVector(end1.x,end1.y+this.radius/10), this.radius/2, this.radius/10, this.antiColor, this.antiColor);
		WindowHandler.drawRect(end2, this.radius/2, this.radius/10, this.antiColor, this.antiColor);
		if (state.moving) {
			WindowHandler.drawFire(createVector(this.pos.x-this.bigR, this.pos.y), this.radius/2, this.radius/2);
		}
		rectMode(CENTER);
		WindowHandler.drawRect(createVector(this.pos.x+this.radius/2, this.pos.y), this.bigR/2, this.bigR, this.antiColor, this.baseColor);
		pop();
		
		let bullet;
		for (let i=0; i<this.bullets.length; i++) {
			bullet = this.bullets[i];
			bullet.draw();
			if (!WindowHandler.onScreen(bullet.pos, bullet.l)) {
				this.bullets.splice(i,1);
				i--;
			}
		}
		this.healthBarPos = createVector(this.pos.x - this.radius, this.pos.y - this.radius * 1.5);
		WindowHandler.drawRect(this.healthBarPos, this.radius * 2, 0.25, createVector(255, 0, 0), createVector(255, 0, 0));
		WindowHandler.drawRect(this.healthBarPos, (this.health/this.maxHealth) * (this.radius * 2), 0.25, createVector(0, 255, 0), createVector(0, 255, 0));
	}
}


class PatrollerShip extends EnemyShip {
	
	constructor(point1, point2, r, goal) {
		super(point1.copy(), r);
		this.points = [point1, point2];
		this.outerR = 15;
		this.speed = 0.05;
		this.vel = p5.Vector.sub(point2, point1).setMag(this.speed);
		this.target = 1;
		this.goal = goal;
		this.findAngle();
	}
	
	findAngle() {
		this.angle = createVector(1, 0).angleBetween(this.vel);
	}
	
	move() {
		if (this.activated) {
			let diff = p5.Vector.sub(this.goal.pos, this.pos);
			this.angle = (atan2(diff.y, diff.x)+9*this.angle)/10;
			this.pos.add(diff.setMag(this.speed/2));
			if (random() < 0.03) {
				this.shoot();
			}	
		} else {
			let target = this.points[this.target];
			this.vel = p5.Vector.sub(target, this.pos).setMag(this.speed);
			if (dist(this.pos.x, this.pos.y, target.x, target.y) <= this.speed) {
				this.target = (this.target + 1) % 2;
			}
			this.findAngle();
			this.pos.add(this.vel);
		}
		return {"moving": true,};
	}
	
	draw() {
		if (WindowHandler.onScreen(this.pos, this.outerR)) {
			let d = dist(this.goal.pos.x, this.goal.pos.y, this.pos.x, this.pos.y);
			if (d < this.goal.radius + this.outerR) {
				if (d < this.goal.radius + this.radius) {
					initializeInside();
				}
				this.activated = true;
				this.darkerColor = createVector(255, 0, 0);
			} else {
				this.activated = false;
				this.darkerColor = createVector(0, 255, 0);
			}
			super.draw();
			WindowHandler.drawCircleOutline(this.pos, this.outerR, this.baseColor);
		}
	}
	
}


class Pursuer extends EnemyShip {
	
	constructor(pos, r, goal) {
		super(pos, r, 1);
		this.goal = goal;
		this.speed = 0.05;
		this.darkerColor = createVector(255, 128, 0);
		this.activated = true;
	}
	
	move() {
		let diff = p5.Vector.sub(this.goal.pos, this.pos);
		if (diff.mag() < this.goal.radius + this.radius) {
			initializeInside();
		}
		if (random() < 0.03) {
				this.shoot();
		}
		this.angle = (atan2(diff.y, diff.x)+9*this.angle)/10;
		this.pos.add(diff.setMag(this.speed));
		return {"moving": true,};
	}
}


class EarthAttacker extends EnemyShip {
	
	constructor(pos, r) {
		super(pos, r, 1);
		this.goal = p5.Vector.fromAngle(random(PI/3, 2*PI/3)).mult(playerEarth.radius+5).add(playerEarth.pos);
		this.speed = 0.2;
		this.darkerColor = createVector(153, 51, 255);
		this.bulletDamage = 3;
	}
	
	move() {
		let diff = p5.Vector.sub(this.goal, this.pos);
		this.activated = diff.mag() < this.speed * 5; // margin of error
		if (this.activated) {
			this.angle = atan2(playerEarth.pos.y-this.pos.y, playerEarth.pos.x-this.pos.x);
			if (random() < 0.05) {
				this.shoot();
			}
			this.textPosition = WindowHandler.transformCoordinates(createVector(windowDims.xmin+1, windowDims.ymax-1));
			stroke(255);
			fill(255);
			text("Aliens have engaged the Earth!", this.textPosition.x, this.textPosition.y);
		} else {
			this.angle = (atan2(diff.y, diff.x)+9*this.angle)/10;
			this.pos.add(diff.setMag(this.speed));
		}
		return {"moving": this.activated,};
	}
	
}