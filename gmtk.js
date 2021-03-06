let HALF_WIDTH, HALF_HEIGHT, SCALE, dims;
let moon, objs, xUnits, yUnits, enemyShips, playerEarth, enemyEarth, mode;
let startBG, controlRoomBG1, instructionsBG, loseBG, winBG;
let lasersBG, explosionBG, earthGoneBG;//N
let controlsOn, controlsOff;//N
let startButton, instructionsButton, backButton, replayButton;



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
	enemyShips.push(new PatrollerShip(createVector(totalDims.xmax - 10 - 2*enemyEarth.radius, totalDims.ymax - 5),
									  createVector(totalDims.xmax - 10 - 2*enemyEarth.radius, totalDims.ymax - 5 - 2*enemyEarth.radius), 0.9, moon));
	enemyShips.push(new PatrollerShip(createVector(totalDims.xmax - 2.5, totalDims.ymax - 5 - 2*enemyEarth.radius),
									  createVector(totalDims.xmax - 2.5, totalDims.ymax - 5), 0.9, moon));
	enemyShips.push(new PatrollerShip(createVector(totalDims.xmax - 2*enemyEarth.radius - 5, totalDims.ymax - 10 - 2*enemyEarth.radius),
									  createVector(totalDims.xmax - 5, totalDims.ymax - 10 - 2*enemyEarth.radius), 0.9, moon));
	enemyShips.push(new PatrollerShip(createVector(totalDims.xmax - 5, totalDims.ymax - 2.5),
									  createVector(totalDims.xmax - 2*enemyEarth.radius - 5, totalDims.ymax - 2.5), 0.9, moon));
	enemyShips.push(new Pursuer(createVector(0, enemyEarth.pos.y), 0.9, moon));
	enemyShips.push(new Pursuer(createVector(enemyEarth.pos.x, 0), 0.9, moon));
	enemyShips.push(new Pursuer(createVector(0, playerEarth.pos.y), 0.9, moon));
	enemyShips.push(new Pursuer(createVector(playerEarth.pos.x, 0), 0.9, moon));
	enemyShips.push(new EarthAttacker(enemyEarth.pos.copy(), 0.9, moon));
}

function keyPressed() {
	if (mode === "moon") {
		if (key === " ") {
			moon.shoot();
		}
	}
}

function keyReleased() {
	if (mode === "moon") {
		if (key === " ") {
			moon.toggleWeapon();
		}
	}
}

function mouseClicked() {
	if (mode === "start") {
		startButton.checkPressed();
		instructionsButton.checkPressed();
	} else if (mode === "instructions") {
		backButton.checkPressed();
	} else if (mode === "win" || mode === "lose") {
		replayButton.checkPressed();
	}
}

function initializeStart() {
	mode = "start";
	startButton = new Button("Play", createVector(windowDims.midx-xUnits/4, windowDims.midy+yUnits/3.5), xUnits/2, yUnits/6, createVector(128, 128, 128), createVector(200, 200, 255), initializeSpace);
	instructionsButton = new Button("Instructions", createVector(startButton.pos.x,startButton.pos.y - startButton.height - 1), startButton.w, startButton.h,
									createVector(128, 128, 128), createVector(200, 200, 255), initializeInstructions);
}

function initializeInstructions() {
	mode = "instructions";
	backButton = new Button("back", createVector(windowDims.midx-xUnits/4, windowDims.midy+windowDims.ymin + yUnits/6 + 1), xUnits/2, yUnits/6, createVector(128, 128, 128), createVector(200, 200, 255), initializeStart);
}

function initializeLose() {
	mode = "lose";
	replayButton = new Button("Try again", createVector(windowDims.midx-xUnits/4, windowDims.midy), xUnits/2, yUnits/6, createVector(128, 128, 128), createVector(200, 200, 255), initializeStart);
}

function initializeWin() {
	mode = "win";
	replayButton = new Button("Play again", createVector(windowDims.midx-xUnits/4, windowDims.midy), xUnits/2, yUnits/6, createVector(128, 128, 128), createVector(200, 200, 255), initializeStart);
}

function initializeSpace() {
	mode = "moon";
	moon = new Moon(createVector(totalDims.xmin + 16, totalDims.ymin + 16), 1.5);
	playerEarth = new Earth(createVector(totalDims.xmin + 10, totalDims.ymin + 10), 5, initializeLose) // callback; lose game
	enemyEarth = new Earth(createVector(totalDims.xmax - 10, totalDims.ymax - 10), 5, initializeWin, createVector(0, 0, 0), createVector(200, 0, 0)); // callback: win game
	objs = [];
	enemyShips = []
	generateBackground();
	generateEnemyShips();
	WindowHandler.cameraTrack(moon);
}

function startScreen() {
	image(startBG, 0, 0);
	startButton.draw();
	instructionsButton.draw();
}

function instructions() {
	image(instructionsBG, 0, 0);
	backButton.draw();
}

function moonScreen() {
	background(0, 6, 23);
	for (let obj of objs) {
		obj.draw();
	}
	playerEarth.draw();
	enemyEarth.draw();
	for (let enemyShip of enemyShips) {
		enemyShip.draw();
	}
	bulletHandling();
	moon.draw();
}

function initializeInside() {
	mode = "inside";
	enemy = new Enemy(createVector(windowWidth-200, windowHeight-200));
}//N

function insideScreen() {
	image(controlRoomBG1, 0, 0);
	image(controlsOff, 0, windowHeight-200);
	enemy.draw();
	//player.draw();
	if (enemy.pos.x>100) {
		enemy.move();
	} else {
		mode = "lasersOn";
	}	
}//New

function lasersOnAnimation() {
	image(lasersBG, 0, 0);
	image(controlsOn, 0, windowHeight-200);
	enemy.draw();
	setTimeout(function(){mode="earthBlowUp"}, 1500);
}//New

function earthBlowUp() {
	image(explosionBG, 0, 0);
	image(controlsOn, 0, windowHeight-200);
	enemy.draw();
	setTimeout(function(){mode="earthGone"}, 1500);
}//New

function earthGone() {
	image(earthGoneBG, 0, 0);
	image(controlsOff, 0, windowHeight-200);
	enemy.draw();
	setTimeout(function(){mode="initializeLose"}, 1500);//SET TIMEOUT, THEN SHOW YOU LOSE SCREEN
}//New

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	setup();
}

function bulletHandling() {
	// this is terrible, but theres 3.5 hours left
	let bullet;
	for (let i=0; i<moon.bullets.length; i++) {
		bullet = moon.bullets[i];
		if (dist(bullet.pos.x, bullet.pos.y, enemyEarth.pos.x, enemyEarth.pos.y) < enemyEarth.radius) {
			moon.bullets.splice(i,1);
			enemyEarth.health -= moon.bulletDamage;
			i--;
			continue;
		}
		for (let j=0; j<enemyShips.length; j++) {
			if (dist(bullet.pos.x, bullet.pos.y, enemyShips[j].pos.x, enemyShips[j].pos.y) < enemyShips[j].radius) {
				moon.bullets.splice(i,1);
				enemyShips[j].health -= moon.bulletDamage;
				i--;
				if (enemyShips[j].health <= 0) {
					enemyShips.splice(j, 1);
				}
				break;
			}
		}
	}
	
	let ship;
	for (let i=0; i<enemyShips.length; i++) {
		ship = enemyShips[i];
		for (let j=0; j<ship.bullets.length; j++) {
			bullet = ship.bullets[j];
			if (dist(bullet.pos.x, bullet.pos.y, playerEarth.pos.x, playerEarth.pos.y) < playerEarth.radius) {
				ship.bullets.splice(j,1);
				playerEarth.health -= ship.bulletDamage;
				j--;
				continue;
			} else if (dist(bullet.pos.x, bullet.pos.y, moon.pos.x, moon.pos.y) < moon.radius) {
				ship.bullets.splice(j, 1);
				moon.health -= ship.bulletDamage;
				j--;
			}
		}
	}
}

function preload() {
	startBG = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/start.png");
	controlRoomBG1 = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/Background.png");
	instructionsBG = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/instructions.png");
	winBG = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/win.png");
	loseBG = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/lose.png");
	lasersBG = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/BackgroundWithLasers2.png");//N
	explosionBG = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/BackgroundWithExplosion.png");//N
	earthGoneBG = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/BackgroundWithEarthGone.png");//N
	controlsOn = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/ControlsOn.png");//N
	controlsOff = loadImage("https://raw.githubusercontent.com/sam-lb/GMTK2020Submission/master/reimages/ControlsOff (1).png");//N
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	HALF_WIDTH = windowWidth / 2;
	HALF_HEIGHT = windowHeight / 2;
	let windowUnits = 15, totalUnits = 100;
	let prop = totalUnits / windowUnits;
	SCALE = min(windowWidth, windowHeight) / windowUnits;
	windowDims = {"xmin": -HALF_WIDTH / SCALE, "xmax": HALF_WIDTH / SCALE, "ymin": -HALF_HEIGHT / SCALE, "ymax": HALF_HEIGHT / SCALE, midx: 0, midy: 0,};
	xUnits = windowDims["xmax"] - windowDims["xmin"];
	yUnits = windowDims["ymax"] - windowDims["ymin"];
	totalDims = {"xmin": prop * windowDims.xmin, "xmax": prop * windowDims.xmax, "ymin": prop * windowDims.ymin, "ymax": prop * windowDims.ymax,};
	
	startBG.resize(windowWidth, windowHeight);
	controlRoomBG1.resize(windowWidth, windowHeight);
	instructionsBG.resize(windowWidth, windowHeight);
	loseBG.resize(windowWidth, windowHeight);
	winBG.resize(windowWidth, windowHeight);
	lasersBG.resize(windowWidth, windowHeight);//N
	explosionBG.resize(windowWidth, windowHeight);//N
	earthGoneBG.resize(windowWidth, windowHeight);//N
	
	initializeStart();
}

function draw() {
	//resizeCanvas(windowWidth, windowHeight, false);
	if (mode === "moon") {
		moonScreen();
	} else if (mode === "instructions") {
		instructions();
	} else if (mode === "start") {
		startScreen();
	} else if (mode === "win") {
		image(winBG, 0, 0);
		replayButton.draw();
	} else if (mode === "lose") {
		image(loseBG, 0, 0);
		replayButton.draw();
	} else if (mode === "inside") {
		insideScreen();
	} else if (mode === "lasersOn") {
		lasersOnAnimation();
	} else if (mode === "earthBlowUp") {
		earthBlowUp();
	} else if (mode === "earthGone") {
		earthGone();
	} else if (mode === "initializeLose") {
		initializeLose();
	}//
}