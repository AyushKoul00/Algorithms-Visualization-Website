const MAX_POINTS = 30;
let nCr = Array(MAX_POINTS + 1).fill(0).map(x => Array(MAX_POINTS + 1).fill(0));;
function preload()
{
	//populate the nCr array
	for (i = 0; i <= MAX_POINTS; i++)
	{
		for (j = 0; j <= i; j++)
		{
			// Base Cases
			if (j == 0 || j == i)
				nCr[i][j] = 1;
			// Calculate value using previously stored values
			else
				nCr[i][j] = nCr[i - 1][j - 1] + nCr[i - 1][j];
		}
	}
}

let points = [];
let pClicked = -1;
let canvasSize = {
	x: 800,
	y: 600
};
let canv, parameter, speed, parameterValue, pVal;

function dispaySliderValue(slider, val)
{
	val.html(slider.value());

	// update all values
	parameterValue = parameter.value();
}

function setup()
{
	colorMode(HSB, 100);
	
	
	const Heading = createP('Click on Canvas to Add/Move points').parent('heading')
	Heading.style('font-size', '32px');
	
	canv = createCanvas(canvasSize.x, canvasSize.y);
	canv.parent('canvasContainer')

	const settingsDiv = createDiv().parent('canvasContainer').class('settingsDiv');

	const paraDiv = createDiv('Parameter:').class('sliderLabel').parent(settingsDiv)
	parameter = createSlider(0, 1, .5, .001).class('slider').parent(settingsDiv)
	parameterValue = parameter.value();
	pVal = createDiv(parameterValue).class('sliderValue').parent(settingsDiv)
	parameter.attribute('oninput', 'dispaySliderValue(parameter, pVal)');

	document.getElementsByClassName('settingsDiv')[0].appendChild(document.createElement('br'));

	const speedDiv = createDiv('Speed:').class('sliderLabel').parent(settingsDiv)
	speed = createSlider(.005, .03, .002, .001).class('slider').parent(settingsDiv).attribute('disabled', 'true')

	const debugCB = createCheckbox('Show Lerp Lines', DEBUG).parent(settingsDiv)
	debugCB.changed(() => DEBUG = debugCB.checked());

	const animateCB = createCheckbox('Animate', ANIMATE).parent(settingsDiv)
	animateCB.changed(() =>
	{
		ANIMATE = animateCB.checked()
		if (!ANIMATE)
		{
			parameter.removeAttribute('disabled')
			speed.attribute('disabled', 'true')
		}
		else
		{
			parameter.attribute('disabled', 'true')
			speed.removeAttribute('disabled')
		}
	});

	const resetBtn = createButton('reset').class('Btn').parent(settingsDiv)
	resetBtn.mouseClicked(() => points = []);

	const delBtn = createButton('Delete Last Point').class('Btn').parent(settingsDiv)
	delBtn.mouseClicked(() => points.pop());

	//FIX STYLING
	// parameter.parent(settingsDiv)
	// speed.parent(settingsDiv)
	// debugCB.parent(settingsDiv)
	// animateCB.parent(settingsDiv)
	// resetBtn.parent(settingsDiv)
	// delBtn.parent(settingsDiv)
	noFill()
}

let ANIMATE = false, DEBUG = false;
let thresh = 0;
function draw()
{
	background(30);

	if (pClicked != -1)
		points[pClicked].x = mouseX, points[pClicked].y = mouseY;

	if (ANIMATE)
	{
		thresh += speed.value();
		thresh %= 1;
		DEBUG ? recursive_bez(points, thresh) : drawPoints()
		drawCurve(thresh)
	}
	else
	{
		DEBUG ? recursive_bez(points, parameter.value()) : drawPoints()
		drawCurve()
	}
}

function drawPoints()
{
	stroke(0, 100, 100);
	if (points.length > 0)
		Point(points[0]);
	for (let i = 1; i < points.length; ++i)
	{
		Line(points[i], points[i - 1]);
		Point(points[i]);
	}
}

function drawCurve(t = parameter.value())
{
	if (points.length < 1) return;
	stroke(255)
	strokeWeight(3);
	// let t = parameter.value();
	let p;
	beginShape()
	for (let i = 0; i <= t; i += .001)
	{
		p = getBezierPoint(i);
		vertex(p.x, p.y)
	}
	endShape()
	Point(p);
}

function recursive_bez(arr, t, level = 0, original_size = null)
{
	if (arr.length < 1) return
	const ret_arr = [];
	if (!original_size)
		original_size = arr.length
	if (arr.length == 1)
		return
	let col = map(original_size - level, 1, original_size, 100, 1)
	stroke(col, 100, 100);
	for (let i = 0; i < arr.length - 1; i++)
	{
		// strokeWeight(10 - level)
		Point(arr[i], arr.length == points.length ? 20 : 10)
		Point(arr[i + 1], arr.length == points.length ? 20 : 10)
		Line(arr[i], arr[i + 1])
		ret_arr.push(p5.Vector.lerp(arr[i], arr[i + 1], t));
	}
	recursive_bez(ret_arr, t, level + 1, original_size)
}

function getBezierPoint(t = 0)
{
	if (t < 0 || t > 1) return;
	if (points.length < 1) return;
	if (points.length == 1) return points[0];
	let n = points.length - 1;
	if (t == 0) return points[0];
	if (t == 1) return points[n];
	let p = createVector(0, 0);
	let pow_t = 1, pow_one_minus_t = Math.pow(1 - t, n);
	for (let i = 0; i <= n; ++i)
	{
		// let factor = Math.pow(t, i) * Math.pow(1-t, n-i) * nCr[n][i];
		let factor = pow_t * pow_one_minus_t * nCr[n][i];
		pow_t *= t;
		pow_one_minus_t /= (1 - t);
		p.add(p5.Vector.mult(points[i], factor))
	}
	return p;
}

function mouseInScreen()
{
	return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function mousePressed()
{
	if (!mouseInScreen()) return;
	for (let i = 0; i < points.length; ++i)
	{
		if (dist(points[i].x, points[i].y, mouseX, mouseY) < 10)
		{
			pClicked = i;
			// console.log(pClicked);
			// return;
		}
	}
	if (pClicked == -1)
	{
		points.push(createVector(mouseX, mouseY));

	}
}

function mouseReleased()
{
	pClicked = -1;
}

function Line(v1, v2, w = 3)
{
	strokeWeight(w);
	line(v1.x, v1.y, v2.x, v2.y);
}

function Point(v, w = 20)
{
	strokeWeight(w);
	point(v.x, v.y)
}
