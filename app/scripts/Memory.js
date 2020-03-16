import { DB_CONNECTOR } from './DbConnector.js';
import { Timer } from './Timer.js';

const coveredImg = '../img/game/covered.jpg';
const guessedImg = '../img/game/guessed.jpg';

function convertToLevel(boardSize) {
	if (boardSize === 4) return 'EASY';
	else if (boardSize === 6) return 'MEDIUM';
	else return 'HARD';
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

class Memory {
	constructor(size) {
		this._size = size;
		this._notGuessedYet = size * size / 2;
		this._imgMap = this._createImgMap(size);
		this._prevImg = null;
		this._uncoveredCount = 0;
		this._board = document.getElementsByClassName('board')[0];
		this._progressDiv = document.getElementsByClassName('progress')[0];
		this._progressBar = document.getElementsByClassName('progress-bar')[0];
		this._playAgainBtn = document.getElementById('play-again');
		this._timer = new Timer();
	}

	_fillWithPaths(arr, length) {
		for (let i = 1; i <= length; i++) {
			arr.push({
				path: `../img/game/${i}.jpg`,
				lives: 2,
				guessed: false
			});
		}
	}

	_fillImgMap(imgMap, size) {
		const pathsArr = [];
		this._fillWithPaths(pathsArr, this._notGuessedYet);

		let rand;
		for (let i = 1; i <= size * size; i++) {
			rand = Math.floor(Math.random() * pathsArr.length);
			imgMap.set(i, pathsArr[rand]);
			if (--pathsArr[rand].lives === 0) {
				pathsArr.splice(rand, 1);
			}
		}
	}

	_createImgMap(size) {
		const imgMap = new Map();
		this._fillImgMap(imgMap, size);
		return imgMap;
	}

	_setProgressDivDisplayBlock() {
		this._progressDiv.style.display = 'block';
	}

	_check(img) {
		return img.src === this._prevImg.src;
	}

	_increaseProgress() {
		const progress = (100 * (1 - this._notGuessedYet / (this._imgMap.size / 2))).toFixed(2);
		this._progressBar.style.width = this._progressBar.textContent = progress + '%';
	}

	async _getLeaderboardPlace(lvl) {
		const scores = await DB_CONNECTOR.loadScores();
		const placeInLeaderboard =
			scores.filter((sc) => sc.time < this._timer.getTimeCounter() && sc.level === lvl).length + 1;
		return placeInLeaderboard + resolveSufix(placeInLeaderboard);
	}

	_showPrompt(whichPlace) {
		let playerName;
		const promptTxt = `Congratulations! Your time is: ${this._timer.getTimeCounter()}!\nYou've ended on ${whichPlace} place.\nPlease, enter your name: `;
		const defaultName = 'Your name...';
		do {
			playerName = prompt(promptTxt, defaultName);
		} while (!playerName || playerName === defaultName);
		return playerName;
	}

	_resetProgressBar() {
		this._progressBar.style.width = this._progressBar.textContent = '0%';
	}

	_destroyAllBoardChildren() {
		let firstChild = this._board.firstChild;
		while (firstChild) {
			this._board.removeChild(firstChild);
			firstChild = this._board.firstChild;
		}
	}

	async _reloadBoard() {
		const size = Math.sqrt(this._imgMap.size);
		this._destroyAllBoardChildren();
		this._notGuessedYet = size * size / 2;
		this._imgMap = this._createImgMap(size);
		this._prevImg = null;
		await this.loadBoard(size);
	}

	_showPlayAgainBtn() {
		this._playAgainBtn.hidden = false;
		this._playAgainBtn.addEventListener('click', async () => {
			this._resetProgressBar();
			await this._reloadBoard();
		});
	}

	async _afterGameThings() {
		let lvl = convertToLevel(Math.sqrt(this._imgMap.size));
		const whichPlace = await this._getLeaderboardPlace(lvl);
		const playerName = this._showPrompt(whichPlace);
		await DB_CONNECTOR.addScoreToDb(playerName, this._timer.getTimeCounter(), lvl);
		await this._showPlayAgainBtn();
	}

	async _endGame() {
		clearInterval(this._timer.getIntervalId());
		setTimeout(async () => {
			await this._afterGameThings();
		}, 1000);
	}

	async _handleMatchedImgs(img, cell) {
		img.src = this._prevImg.src = guessedImg;
		cell.guessed = true;
		this._notGuessedYet--;
		this._increaseProgress();
		if (!this._notGuessedYet) {
			await this._endGame();
		}
	}

	async _resolveUncovered(img, cell) {
		if (this._check(img)) {
			await this._handleMatchedImgs(img, cell);
		} else {
			img.src = this._prevImg.src = coveredImg;
		}
	}

	async _initializeOnClickLogic(img, index) {
		const cell = this._imgMap.get(index);
		if (!cell.guessed) {
			if (this._uncoveredCount === 0) {
				img.src = `${cell.path}`;
				this._prevImg = img;
				this._uncoveredCount++;
			} else if (this._uncoveredCount === 1 && img !== this._prevImg) {
				img.src = `${cell.path}`;
				this._uncoveredCount++;
				setTimeout(async () => {
					await this._resolveUncovered(img, cell);
					this._uncoveredCount = 0;
				}, 700);
			}
		}
	}

	_setupImg(td, index) {
		const img = new Image(50, 50);
		img.src = coveredImg;
		td.addEventListener('click', async () => {
			await this._initializeOnClickLogic(img, index);
		});
		td.appendChild(img);
	}

	async _createRow(tr, index) {
		for (let i = 1; i <= this._size; i++) {
			const td = document.createElement('td');
			await this._setupImg(td, index + i);
			tr.appendChild(td);
		}
	}

	async _createAndAppendTrs() {
		for (let i = 0; i < this._size; i++) {
			const tr = document.createElement('tr');
			await this._createRow(tr, i * this._size);
			this._board.appendChild(tr);
		}
	}

	async loadBoard() {
		await this._createAndAppendTrs();
		this._setProgressDivDisplayBlock();
		this._timer.loadTimer();
	}
}

export { Memory };
