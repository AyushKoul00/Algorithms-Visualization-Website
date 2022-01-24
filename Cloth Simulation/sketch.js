//Controls
let cWidth = 1200, cHeight = 600;
const size = 2;
const pointRad = 15;
const stickWidth = 5;
let gravity = 1.5;
const iterations = 20;


let points = [];
let sticks = [];
let startBtn;
let startSimulation = false;
function setup()
{
	createCanvas(cWidth, cHeight);
	gravity = createVector(0, gravity)
	stroke(255)
	startBtn = createButton("Start").class('Btn');
	startBtn.mousePressed(() =>
	{
		startSimulation = !startSimulation;
		startBtn.html(startSimulation ? "Stop" : "Start");
	});
	// frameRate(2)
}


let clickInd = -1;
function mousePressed()
{
	for (let i = 0; i < points.length; ++i)
	{
		let pos = points[i].pos;
		if (abs(mouseX - pos.x) < pointRad && abs(mouseY - pos.y) < pointRad)
		{
			clickInd = i;
			break;
		}
	}

	if (clickInd == -1)//create new point
	{
		let mPos = createVector(mouseX, mouseY)
		points.push(new Point(mPos, mPos))
	}
	else//clicked on existing point
	{
		// points[clickInd].isLocked = !points[clickInd].isLocked;
	}

	// console.log(points.length)
}

function mouseReleased()
{
	let leftInd = -1;
	for (let i = 0; i < points.length; ++i)
	{
		let pos = points[i].pos;
		if (abs(mouseX - pos.x) < pointRad && abs(mouseY - pos.y) < pointRad)
		{
			leftInd = i;
			break;
		}
	}

	if (clickInd != -1 && leftInd != -1 && leftInd != clickInd)
	{
		let alreadyExist = false;

		let A = points[min(clickInd, leftInd)];
		let B = points[max(clickInd, leftInd)];

		for (let i = 0; i < sticks.length; ++i)
		{
			if (sticks[i].a == A && sticks[i].b == B)
			{
				alreadyExist = true;
				break;
			}
		}
		if (!alreadyExist)
			sticks.push(new Stick(A, B));
		// else
		// 	console.log('already exists');
	}
	if (clickInd != -1 && leftInd != -1 && leftInd == clickInd)
	{
		points[clickInd].isLocked = !points[clickInd].isLocked;
	}
	clickInd = -1;
}



function draw()
{
	background(0)
	simulate()

	strokeWeight(stickWidth)
	stroke(255);
	sticks.forEach(s =>
	{
		line(s.a.pos.x, s.a.pos.y, s.b.pos.x, s.b.pos.y)
	})

	if(clickInd != -1)
		line(points[clickInd].pos.x, points[clickInd].pos.y, mouseX, mouseY)

	strokeWeight(pointRad);
	points.forEach(p =>
	{
		p.isLocked ? stroke(255, 0, 0) : stroke(255);
		point(p.pos.x, p.pos.y)
	}
	)
}


function simulate()
{
	if (!startSimulation) return;
	for (let i = 0; i < points.length; ++i)
	{
		if (points[i].isLocked) continue;
		let posBefore = points[i].pos.copy();

		// points[i].pos += points[i].pos - points[i].prevPos;
		points[i].pos.add(p5.Vector.sub(points[i].pos, points[i].prevPos));

		// points[i].pos += gravity * deltaTime * deltaTime;
		points[i].pos.add(p5.Vector.mult(gravity, deltaTime * deltaTime / 1000))

		points[i].prevPos = posBefore;
		// console.log(String(p5.Vector.sub(points[i].pos, points[i].prevPos)));
	}


	for (let it = 0; it < iterations; ++it)
	{
		for (let i = 0; i < sticks.length; ++i)
		{
			let stickCenter = p5.Vector.add(sticks[i].a.pos, sticks[i].b.pos).div(2);
			let stickDir = p5.Vector.sub(sticks[i].a.pos, sticks[i].b.pos);
			stickDir.normalize();
			let length = p5.Vector.sub(sticks[i].a.pos, sticks[i].b.pos).mag();

			if (length > sticks[i].len)
			{
				if (!sticks[i].a.isLocked)
					sticks[i].a.pos = p5.Vector.add(stickCenter, p5.Vector.mult(stickDir, sticks[i].len / 2));
				if (!sticks[i].b.isLocked)
					sticks[i].b.pos = p5.Vector.sub(stickCenter, p5.Vector.mult(stickDir, sticks[i].len / 2));
			}

		}
	}

}


function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

class Point
{
	constructor(pos, prevPos, isLocked = false)
	{
		this.pos = pos;
		this.prevPos = prevPos;
		this.isLocked = isLocked;
	}
}

class Stick
{
	constructor(a, b)
	{
		this.a = a;
		this.b = b;
		this.len = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
	}
}