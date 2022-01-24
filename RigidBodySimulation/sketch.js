//Controls
let cWidth = 1200, cHeight = 600;
const size = 2;
const pointRad = 10;
const stickWidth = 5;

const gravity = 0.25;
const bounce = 0.9;
const friction = .999;

const iterations = 5;
const pointCollision = false;
//-------------------

let points = [];
let sticks = [];
let startBtn;
let startSimulation = false;
function setup()
{
	createCanvas(cWidth, cHeight);
	stroke(255)
	startBtn = createButton("Start").class('Btn');
	startBtn.mousePressed(() =>
	{
		startSimulation = !startSimulation;
		startBtn.html(startSimulation ? "Stop" : "Start");
	});
	// frameRate(5)
}

let clickInd = -1;
function mousePressed()
{
	if (!startSimulation && mouseX > 0 && mouseX < cWidth && mouseY > 0 && mouseY < cHeight)
	{
		for (let i = 0; i < points.length; ++i)
		{
			let p = points[i];
			if (abs(mouseX - p.x) < pointRad && abs(mouseY - p.y) < pointRad)
			{
				clickInd = i;
				break;
			}
			//dont add point so that the point collides with other points
		}

		if (clickInd == -1)//create new point
		{
			points.push(new Point(mouseX, mouseY, mouseX, mouseY))
		}
		else//clicked on existing point
		{
			// points[clickInd].isLocked = !points[clickInd].isLocked;
		}

		// console.log(points.length)
	}
}

function mouseReleased()
{
	if (clickInd != -1)
	{
		let leftInd = -1;
		for (let i = 0; i < points.length; ++i)
		{
			let p = points[i];
			if (abs(mouseX - p.x) < pointRad && abs(mouseY - p.y) < pointRad)
			{
				leftInd = i;
				break;
			}
		}

		if (leftInd != -1 && leftInd != clickInd)
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
		if (leftInd != -1 && leftInd == clickInd)
		{
			points[clickInd].isLocked = !points[clickInd].isLocked;
		}
		clickInd = -1;
	}
}

function draw()
{
	background(0);

	if (startSimulation)
	{
		updatePoints();

		for (let i = 0; i < iterations; i++)
		{
			updateSticks();
			constrainPoints();
		}
	}

	strokeWeight(stickWidth)
	stroke(255);
	sticks.forEach(s =>
	{
		line(s.a.x, s.a.y, s.b.x, s.b.y);
	})

	if (clickInd != -1)
		line(points[clickInd].x, points[clickInd].y, mouseX, mouseY)

	strokeWeight(pointRad * 2);
	points.forEach(p =>
	{
		p.isLocked ? stroke(255, 0, 0) : stroke(255);
		point(p.x, p.y);
	}
	);
}

function updatePoints()
{
	for (let i = 0; i < points.length; i++)
	{
		let p = points[i];
		if (p.isLocked) continue;
		//collision testing
		if (pointCollision)
		{
			for (let j = 0; j < points.length; ++j)
			{
				if (j == i) continue;
				let other = points[j];

				//check bounding box first
				let w = 2 * pointRad;
				if (other.x > p.x + w || other.x + w < p.x || other.y > p.y + w || other.y + w < p.y)
					continue; //not colliding
				let dx = p.x - other.x,
					dy = p.y - other.y,
					distance = Math.sqrt(dx * dx + dy * dy);
				if (distance >= w) continue; //not colliding

				console.log("collision");

				//Resolve Collision - FIX (TODO)
				let difference = w - distance,
					percent = difference / distance / 2,
					offsetX = dx * percent,
					offsetY = dy * percent;

				p.x -= offsetX;
				p.y -= offsetY;
				if (!other.isLocked)
				{
					other.x += offsetX;
					other.y += offsetY;
				}
				else
				{
					p.x -= offsetX;
					p.y -= offsetY;
				}

				dx = p.x - other.x;
				dy = p.y - other.y;

				p.oldx = p.x - dx/2 * bounce;
				p.oldy = p.y - dy/2 * bounce;
				other.oldx = other.x + dx/2 * bounce;
				other.oldy = other.y + dy/2 * bounce;
			}
		}

		let vx = (p.x - p.oldx) * friction,
			vy = (p.y - p.oldy) * friction;

		p.oldx = p.x;
		p.oldy = p.y;
		p.x += vx;
		p.y += vy;
		p.y += gravity;

	}
}

function constrainPoints()
{
	for (let i = 0; i < points.length; i++)
	{
		let p = points[i];
		if (p.isLocked) continue;

		let vx = (p.x - p.oldx) * friction,
			vy = (p.y - p.oldy) * friction;

		if (p.x + pointRad > cWidth)
		{
			// console.log('Right hit');
			p.x = cWidth - pointRad;
			p.oldx = p.x + vx * bounce;
		}
		else if (p.x - pointRad < 0)
		{
			// console.log('Left hit');
			p.x = 0 + pointRad;
			p.oldx = p.x + vx * bounce;
		}
		if (p.y + pointRad > cHeight)
		{
			// console.log('Bottom hit');
			p.y = cHeight - pointRad;
			p.oldy = p.y + vy * bounce;
		}
		if (p.y - pointRad < 0)
		{
			// console.log('Top hit');
			p.y = 0 + pointRad;
			p.oldy = p.y + vy * bounce;
		}
	}
}

function updateSticks()
{
	for (let i = 0; i < sticks.length; i++)
	{
		let s = sticks[i],
			dx = s.b.x - s.a.x,
			dy = s.b.y - s.a.y,
			distance = Math.sqrt(dx * dx + dy * dy),
			difference = s.length - distance,
			percent = difference / distance / 2,
			offsetX = dx * percent,
			offsetY = dy * percent;

		if (!s.a.isLocked)
		{
			s.a.x -= offsetX;
			s.a.y -= offsetY;
		}
		if (!s.b.isLocked)
		{
			s.b.x += offsetX;
			s.b.y += offsetY;
		}
	}
}

class Point
{
	constructor(x, y, oldx, oldy, isLocked = false)
	{
		this.x = x;
		this.y = y;
		this.oldx = oldx;
		this.oldy = oldy;
		this.isLocked = isLocked;
	}
}

class Stick
{
	constructor(a, b)
	{
		this.a = a;
		this.b = b;
		this.length = dist(a.x, a.y, b.x, b.y);
	}
}