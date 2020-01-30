import { addScoreToDb } from './dbConnector.js';

const imgMap = new Map();
let prevImg;
const coveredImg = '../img/game/covered.jpg';
const guessedImg = '../img/game/guessed.jpg';
let timeIntervalId;
let timeCounter;
let alreadyGuessed;

let uncovered = 0;

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

function convertToLevel(boardSize) {
	if (boardSize === 4) return 'EASY';
	else if (boardSize === 6) return 'MEDIUM';
	else return 'HARD';
}

function endGame() {
	clearInterval(timeIntervalId);
	const promptTxt = `Congratulations! Your time is: ${timeCounter}!\nPlease, enter your name: `;
	const defaultName = 'Your name...';
	let playerName;
	do {
		playerName = prompt(promptTxt, defaultName);
	} while (!playerName || playerName === 'Your name...');
	addScoreToDb(playerName, timeCounter, convertToLevel(Math.sqrt(imgMap.size)));
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
						img.src = prevImg.src = guessedImg;
						cell.guessed = true;
						if (!--alreadyGuessed) {
							endGame();
						}
					} else {
						img.src = prevImg.src = coveredImg;
					}
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
	}, 1000);
}

export { loadBoard, loadTimer };
