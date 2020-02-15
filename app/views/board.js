import { addScoreToDb } from './dbConnector.js';

const imgMap = new Map();
let prevImg;
const coveredImg = '../img/game/covered.jpg';
const guessedImg = '../img/game/guessed.jpg';
const progressBar = document.getElementsByClassName('progress-bar')[0];
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

function showPlayAgainBtn() {
	const playAgainBtn = document.getElementById('play-again');
	playAgainBtn.hidden = false;
	playAgainBtn.addEventListener('click', () => {
		//reset progressBar();
		//clearBoard(); or reloadBorad()
		loadBoard();
		loadTimer();
	});
}

function endGame() {
	clearInterval(timeIntervalId);
	setTimeout(() => {
		const promptTxt = `Congratulations! Your time is: ${timeCounter}!\nPlease, enter your name: `;
		const defaultName = 'Your name...';
		let playerName;
		do {
			playerName = prompt(promptTxt, defaultName);
		} while (!playerName || playerName === defaultName);
		addScoreToDb(playerName, timeCounter, convertToLevel(Math.sqrt(imgMap.size)));
		showPlayAgainBtn();
	}, 1000);
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
						console.log(--alreadyGuessed, imgMap.size / 2);
						const progress = 100 * (1 - alreadyGuessed / (imgMap.size / 2));
						console.log(progress);
						progressBar.style.width = progressBar.textContent = progress + '%';
						if (!alreadyGuessed) {
							endGame();
						}
					} else {
						img.src = prevImg.src = coveredImg;
					}
					uncovered = 0;
				}, 700);
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
	document.getElementsByClassName('progress')[0].style.display = 'block';
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
