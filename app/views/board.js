const imgMap = new Map();
let prevImg;
const coveredImg = '../img/game/covered.jpg';
const guessedImg = '../img/game/guessed.jpg';
let timeIntervalId;
let timeCounter;
let alreadyGuessed;

let uncovered = 0;
let playerScore = 0;

function fillWithPaths(arr, length) {
	for (let i = 1; i <= length; i++) {
		arr.push({
			path: `../img/game/${i}.jpg`,
			lives: 2,
			guessed: false
		});
	}
}

function fillImgMap(size) {
	const pathsArr = [];
	fillWithPaths(pathsArr, size * size / 2);

	let rand;
	for (let i = 1; i <= size * size; i++) {
		rand = Math.floor(Math.random() * pathsArr.length);
		imgMap.set(i, pathsArr[rand]);
		if (--pathsArr[rand].lives === 0) {
			pathsArr.splice(rand, 1);
		}
	}
}

function endGame() {
	clearInterval(timeIntervalId);
	console.log('Your time is: ', timeCounter);
}

function check(img) {
	return img.src === prevImg.src;
}

const setImg = (td, index) => {
	const img = new Image(50, 50);
	img.src = coveredImg;
	td.addEventListener('click', () => {
		const cell = imgMap.get(index);
		if (!cell.guessed) {
			if (uncovered === 0) {
				img.src = `${cell.path}`;
				prevImg = img;
				uncovered++;
			} else if (uncovered === 1 && img !== prevImg) {
				img.src = `${cell.path}`;
				uncovered++;
				setTimeout(() => {
					if (check(img)) {
						playerScore++;
						img.src = prevImg.src = guessedImg;
						cell.guessed = true;
						if (!--alreadyGuessed) {
							endGame();
						}
					} else {
						img.src = prevImg.src = coveredImg;
					}
					console.log(playerScore);
					uncovered = 0;
				}, 1000);
			}
		}
	});
	td.appendChild(img);
};

const createRow = (tr, size, index) => {
	for (let i = 1; i <= size; i++) {
		const td = document.createElement('td');
		setImg(td, index + i);
		tr.appendChild(td);
	}
};

function loadBoard(size) {
	alreadyGuessed = size * size / 2;
	fillImgMap(size);
	console.log(imgMap);

	const board = document.getElementsByClassName('board')[0];
	for (let i = 0; i < size; i++) {
		const tr = document.createElement('tr');
		createRow(tr, size, i * size);
		board.appendChild(tr);
	}
}

function loadTimer() {
	let timer = document.getElementsByClassName('timer')[0];
	timeCounter = 0;
	const timerTextContent = 'TIME: ';
	timer.hidden = false;
	timeIntervalId = setInterval(() => {
		timer.textContent = timerTextContent + ++timeCounter;
		// timeCounter++;
	}, 1000);
}

function loadScoreCounter() {}
// [ ...document.getElementsByClassName('display-3') ].forEach((el) => (el.hidden = false));

export { loadBoard, loadTimer, loadScoreCounter };
