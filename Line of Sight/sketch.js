//Controls
let cWidth = 1202,
	cHeight = 602;
const POINT_DIAMETER = 15;


let shapes = [];
let points = [];
let mousePos;
function setup()
{
	createCanvas(cWidth, cHeight);
	stroke(255);
	noFill();
	mousePos = new Point(cWidth / 2, cHeight / 2);
}

function draw()
{
	background(0);
	mousePos.x = mouseX, mousePos.y = mouseY;
	points.forEach((p) =>
	{
		p.draw();
	});

	shapes.forEach((s) =>
	{
		s.draw();
	});

	mousePos.draw(true);
}

function mousePressed()
{
	let p = new Point(mouseX, mouseY);
	if (mouseX > 0 && mouseX < cWidth && mouseY > 0 && mouseY < cHeight) 
	{
		if (points.length >= 3 && points[0].intersects(p)) 
		{
			// console.log("New Shape");
			shapes.push(new Shape(points));
			points = [];
		}
		else 
		{
			let add = true;
			for (let i = 0; add && i < points.length; ++i)
				if (points[i].intersects(p))
					add = false;

			if (add) 
			{
				points.push(new Point(mouseX, mouseY));
				// console.log("New Point"); 
			}
		}
	}
}

//#region Helper Classes
class Point
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	draw(mousePos = false)
	{
		push();
		if (mousePos)
			fill(255, 0, 0);
		circle(this.x, this.y, POINT_DIAMETER);
		pop();
	}

	intersects(other, accurate = false)
	{
		if (accurate)
			return dist(this.x, this.y, other.x, other.y) < POINT_DIAMETER;
		else
			return (
				this.x < other.x + POINT_DIAMETER &&
				this.x + POINT_DIAMETER > other.x &&
				this.y < other.y + POINT_DIAMETER &&
				this.y + POINT_DIAMETER > other.y
			);
	}
}

class Shape
{
	constructor(points)
	{
		this.points = points;
	}

	draw(drawPoints = false)
	{
		//draw edges
		push();
		// stroke(this.color);
		noFill();
		beginShape();
		for (let i = 0; i < this.points.length; ++i)
			vertex(this.points[i].x, this.points[i].y);
		endShape(CLOSE);

		//draw Points
		if (drawPoints)
		{
			this.points.forEach((p) =>
			{
				p.draw();
			});
		}

		pop();
	}
}
//#endregion

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