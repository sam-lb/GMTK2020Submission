let HALF_WIDTH, HALF_HEIGHT, SCALE, dims;
let moon, objs, xUnits, yUnits, enemyShips, playerEarth, enemyEarth, mode;
let startBG;


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
	//enemyShips.push(new PatrollerShip(createVector(windowDims.), createVector(), 0.5, moon));
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

function initializeSpace() {
	mode = "moon";
	moon = new Moon(createVector(0, 0), 1);
	playerEarth = new Earth(createVector(totalDims.xmin + 10, totalDims.ymin + 10), 5);
	enemyEarth = new Earth(createVector(totalDims.xmax - 10, totalDims.ymax - 10), 5);
	objs = [];
	enemyShips = []
	generateBackground(2000,5);
	//generateEnemyShips();
}

function startScreen() {
	image(startBG, 0, 0);
	initializeSpace();
}

function preload() {
	startBG = loadImage();
	controlRoomBG1 = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/Background.png");
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
	mode = "start";
	
	startBG.resize(windowWidth, windowHeight);
}

function draw() {
	if (mode === "start") {
		startScreen();
	} else if (mode === "moon") {
		background(0, 6, 23);
		for (let obj of objs) {
			obj.draw();
		}
		for (let enemyShip of enemyShips) {
			enemyShip.draw();
		}
		playerEarth.draw();
		enemyEarth.draw();
		moon.draw();
	}
}