//Controls
let cWidth = 1200, cHeight = 600;
const size = 2;
const pointRad = 20;
let gravity = 1.5;


let points = [];
function setup()
{
	createCanvas(cWidth, cHeight);
	gravity = createVector(0, gravity)
	strokeWeight(20);
	stroke(255)
	// frameRate(2)
}


function mouseClicked()
{
	let clickInd = -1;

	for (let i=0; i<points.length; ++i)
	{
		let pos = points[i].pos;
		if (abs(mouseX - pos.x) < pointRad && abs(mouseY - pos.y) < pointRad)
		{
			clickInd = i;
			break;
		}
	}
	// console.log(clickInd);
	if (clickInd == -1)//create new point
	{
		let mPos = createVector(mouseX, mouseY)
		points.push(new Point(mPos, mPos))
	}
	else//clicked on existing point
	{
		points[clickInd].isLocked = !points[clickInd].isLocked;
	}

	// console.log(points.length)
}

function draw()
{
	background(0)
	simulate()
	points.forEach(p =>
		{
			p.isLocked ? stroke(255, 0, 0) : stroke(255);
			point(p.pos.x, p.pos.y)
		}
	)
}


function simulate()
{
	for (let i=0; i<points.length; ++i)
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
	
}


function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

class Point
{
	constructor(pos, prevPos, isLocked = true)
	{
		this.pos = pos;
		this.prevPos = prevPos;
		this.isLocked = isLocked;
	}
}

class Segment
{
	constructor(point1, point2)
	{
		this.p1 = point1;
		this.p2 = point2;
		this.len = point1.dist(point2);
	}
}