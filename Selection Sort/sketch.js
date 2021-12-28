//Controls
let cWidth = 1200, cHeight = 400;
const size = 100;
let sleepTime = 0;

let values = new Array(size);
let state = new Array(size);
let finished = false;

function setup()
{
	createCanvas(cWidth, cHeight);
	const low = 10, high = cHeight;
	for (let i = 0; i < size; ++i)
	{
		// values[i] = int(random(low, high))
		values[i] = low + (high - low) * i / size;
		state[i] = -1;
	}
	shuffle(values);
	display();
	const SORT = async () =>
	{
		await selectionsort(values);
		finished = true;
	}
	SORT();
}

function draw()
{
	display()
}

const w = cWidth / size;
function display()
{
	background(0)
	if (finished)
	{
		fill(0, 255, 0)
		for (let i = 0; i < size; ++i)
			rect(w * i, height - values[i], w, values[i])
		noLoop();
		return;
	}

	for (let i = 0; i < size; ++i)
	{
		switch (state[i])
		{
			case 1://pointer
				fill(255, 0, 0);
				break;
			case 2:
				fill(0, 0, 255);//current element
				break;
			case 3:
				fill(0, 255, 0);//sorted
				break;
			default:
				fill(180);
				break;
		}
		rect(w * i, height - values[i], w, values[i])
	}
}

async function selectionsort(a)
{
	for (let i = 0; i < a.length; ++i)
	{
		let min_idx = i;
		state[i] = 2;
		for (let j = i + 1; j < a.length; ++j)
		{
			state[j] = 1;
			if (a[j] < a[min_idx])
				min_idx = j;
			await sleep(sleepTime);
			state[j] = 0;
		}
		swap(a, min_idx, i);
		state[i] = 3;
	}
}

function sleep(ms)
{
	return new Promise(resolve => setTimeout(resolve, ms));
}

function swap(a, i, j)
{
	let t = a[i];
	a[i] = a[j];
	a[j] = t;
}

//Fisher-Yates Algorithm
const shuffle = array =>
{
	for (let i = array.length - 1; i > 0; i--)
	{
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
}