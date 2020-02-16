import { addScoreToDb, loadScores } from './dbConnector.js';

const imgMap = new Map();
let prevImg;
const coveredImg = '../img/game/covered.jpg';
const guessedImg = '../img/game/guessed.jpg';
const progressBar = document.getElementsByClassName('progress-bar')[0];
let timeIntervalId;
let timeCounter;
let notGuessedYet;

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

function resetProgressBar() {
	progressBar.style.width = progressBar.textContent = '0%';
}

function destroyAllBoardChildren() {
	const board = document.getElementsByClassName('board')[0];
	while (board.firstChild) {
		board.removeChild(board.firstChild);
	}
}

function reloadBoard() {
	const size = Math.sqrt(imgMap.size);
	imgMap.clear();
	destroyAllBoardChildren();
	loadBoard(size);
}

function showPlayAgainBtn() {
	const playAgainBtn = document.getElementById('play-again');
	playAgainBtn.hidden = false;
	playAgainBtn.addEventListener('click', () => {
		resetProgressBar();
		reloadBoard();
		loadTimer();
	});
}

function resolveSufix(number) {
	switch (number % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

function endGame() {
	clearInterval(timeIntervalId);
	setTimeout(async () => {
		const scores = await loadScores();
		const placeInLeaderboard = scores.filter((sc) => sc.time < timeCounter).length + 1;
		const whichPlace = placeInLeaderboard + resolveSufix(placeInLeaderboard);
		const promptTxt = `Congratulations! Your time is: ${timeCounter}!\nYou've ended on ${whichPlace} place.\nPlease, enter your name: `;
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
						console.log(--notGuessedYet, imgMap.size / 2);
						const progress = 100 * (1 - notGuessedYet / (imgMap.size / 2));
						progressBar.style.width = progressBar.textContent = progress + '%';
						if (!notGuessedYet) {
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
	notGuessedYet = size * size / 2;
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
	const timer = document.getElementsByClassName('timer')[0];
	const timerTextContent = 'Time: ';
	timeCounter = 0;

	if (timeIntervalId) {
		clearInterval(timeIntervalId);
		timer.textContent = timerTextContent + timeCounter;
	}
	timer.hidden = false;
	timeIntervalId = setInterval(() => {
		timer.textContent = timerTextContent + ++timeCounter;
	}, 1000);
}

export { loadBoard, loadTimer };
