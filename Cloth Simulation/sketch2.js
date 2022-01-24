//Controls
let cWidth = 1200, cHeight = 600;
const size = 2;
const pointRad = 10;
const stickWidth = 1;

const gravity = 0.25;
const bounce = 0.7;
const friction = .999;

const iterations = 2;

const nRows = 25, nCols = 50, spacing = { x: 20, y: 20 }, start = { x: 100, y: 10 };
const pinGap = 13;
//-------------------

let points = [];
let sticks = [];
// let cloth = [];
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
	
	for (let i = 0; i < nRows; ++i)
	{
		points[i] = new Array(nCols);
		for (let j = 0; j < nCols; ++j)
		{
			let x = start.x + spacing.x * (j + 1), y = start.y + spacing.y * (i + 1);
			points[i][j] = (new Point(x, y, x, y, j % pinGap == 0 || j == nCols - 1));
		}
	}

	for (let i = 0; i < nRows - 1; ++i)
	{
		for (let j = 0; j < nCols - 1; ++j)
		{
			sticks.push(new Stick(points[i][j], points[i + 1][j]));
			sticks.push(new Stick(points[i][j], points[i][j + 1]));
		}
	}
	for (let i = 0; i < nRows - 1; ++i)
		sticks.push(new Stick(points[i][nCols - 1], points[i + 1][nCols - 1]));

	points = points.flat();

	// strokeWeight(stickWidth)
	// stroke(255);
}

function draw()
{
	background(0);

	if (startSimulation)
	{
		updatePoints();
		for (let i = 0; i < iterations; i++)
			updateSticks();
	}

	sticks.forEach(s =>
	{
		line(s.a.x, s.a.y, s.b.x, s.b.y);
	})
}

function updatePoints()
{
	for (let i = 0; i < points.length; i++)
	{
		let p = points[i];
		if (p.isLocked) continue;

		let vx = (p.x - p.oldx) * friction,
			vy = (p.y - p.oldy) * friction;

		p.oldx = p.x;
		p.oldy = p.y;
		p.x += vx;
		p.y += vy;
		p.y += gravity;

	}
}

function updateSticks()
{
	for (let i = 0; i < sticks.length; i++)
	{
		let s = sticks[i],
			dx = s.b.x - s.a.x,
			dy = s.b.y - s.a.y,
			// distance = Math.sqrt(dx * dx + dy * dy),
			// difference = s.length - distance,
			// percent = difference / distance / 2,
			iDist = INVSQRT(dx * dx + dy * dy),
			percent = (s.length * iDist - 1) / 2,
			offsetX = dx * percent,
			offsetY = dy * percent;


		// if (distance < sticks[i].length) continue;
		if (iDist > 1 / sticks[i].length) continue;

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

function INVSQRT(number)
{
	//This is the fast inverse square root algo which I used to get a vector's unit vector
	var i;
	var x2, y;
	const threehalfs = 1.5;

	x2 = number * 0.5;
	y = number;
	var buf = new ArrayBuffer(4);
	new Float32Array(buf)[0] = number;
	i = new Uint32Array(buf)[0];
	i = 0x5f3759df - (i >> 1);
	new Uint32Array(buf)[0] = i;
	y = new Float32Array(buf)[0];
	y = y * (threehalfs - x2 * y * y); // 1st iteration
	//  y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

	return y;
}
