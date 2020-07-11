let HALF_WIDTH, HALF_HEIGHT, SCALE, dims;
let moon, objs, xUnits, yUnits, enemyShips;


function randomColor() {
	return createVector(random(0,255), random(0,255), random(0,255));
}

function generateBackground(nStars=2000, nPlanets=5) {
	let n = floor(0.95*nStars);
	for (let i=0; i<n; i++) {
		objs.push(new Star(WindowHandler.randomPoint(), 0.05, 0.025));
	}
	for (let i=0; i<nStars-n; i++) {
		objs.push(new Star(WindowHandler.randomPoint(), 0.1, 0.05));
	}
	for (let i=0; i<nPlanets; i++) {
		objs.push(new Planet(WindowHandler.randomPoint(), random(2, 4), randomColor(), true));
	}
}

function generateEnemyShips() {
	for (let pos of enemyPositions) {
		enemyShips.push(new PatrollerShip(createVector(pos[0], pos[1]), createVector(pos[2], pos[3]), 0.5));
	}
}

function keyPressed() {
	if (key === " ") {
		moon.shoot();
	}
}

function keyReleased() {
	if (key === " ") {
		moon.toggleWeapon();
	}
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	HALF_WIDTH = windowWidth / 2;
	HALF_HEIGHT = windowHeight / 2;
	let windowUnits = 10, totalUnits = 100;
	let prop = totalUnits / windowUnits;
	SCALE = min(windowWidth, windowHeight) / windowUnits;
	windowDims = {"xmin": -HALF_WIDTH / SCALE, "xmax": HALF_WIDTH / SCALE, "ymin": -HALF_HEIGHT / SCALE, "ymax": HALF_HEIGHT / SCALE, midx: 0, midy: 0,};
	xUnits = windowDims["xmax"] - windowDims["xmin"];
	yUnits = windowDims["ymax"] - windowDims["ymin"];
	totalDims = {"xmin": prop * windowDims.xmin, "xmax": prop * windowDims.xmax, "ymin": prop * windowDims.ymin, "ymax": prop * windowDims.ymax,};
	
	moon = new Moon(createVector(0, 0), 1);
	objs = [];
	enemyShips = []
	generateBackground();
	generateEnemyShips();
}

function draw() {
	background(0);
	for (let obj of objs) {
		obj.draw();
	}
	for (let enemyShip of enemyShips) {
		enemyShip.draw();
	}
	
	WindowHandler.drawLine(createVector(totalDims.xmin, totalDims.ymax), createVector(totalDims.xmax, totalDims.ymax), createVector(255, 0, 0), 3);
	moon.draw();
}