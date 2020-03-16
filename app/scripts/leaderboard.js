import { DB_CONNECTOR } from './DbConnector.js';

const levels = {
	EASY: 'EASY',
	MEDIUM: 'MEDIUM',
	HARD: 'HARD'
};

class Leaderboard {
	constructor(rowsCount) {
		this._rowsCount = rowsCount;
		this._scores = null;
		this._prevLevel = localStorage.getItem('level') || levels.EASY;
		this._spinner = document.getElementsByClassName('spinner')[0];
		this._table = document.getElementsByClassName('table-responsive')[0];
		this._navTabs = [ ...document.getElementsByClassName('nav-link') ];
		this._emptyTableP = document.getElementById('empty-table-case');
		this._trs = [ ...document.getElementsByTagName('tr') ];

		this._setActiveTab();
		this._changeViewOnNavTabClick();
	}

	getRowsCount() {
		return this._rowsCount;
	}

	getScores() {
		return this._scores;
	}

	getPrevLevel() {
		return this._prevLevel;
	}

	getNavTabs() {
		return this._navTabs;
	}

	setScores(scores) {
		this._scores = scores;
	}

	_setActiveTab() {
		this._navTabs.find((tab) => tab.textContent.toUpperCase() === this._prevLevel).classList.add('active');
	}

	_getActiveNavTab() {
		return this._navTabs.find((nav) => nav.classList.contains('active'));
	}

	_setNewActiveTab(oldActive, newActive) {
		oldActive.classList.remove('active');
		newActive.classList.add('active');
		const activeScores = getScoresByLevel(this._scores, newActive.textContent.toUpperCase());
		this.displayScores(activeScores);
	}

	_changeViewOnNavTabClick() {
		this._navTabs.forEach((tab) => {
			tab.addEventListener('click', () => {
				localStorage.setItem('level', tab.textContent.toUpperCase());
				const activeOne = this._getActiveNavTab();
				if (tab !== activeOne) {
					this._setNewActiveTab(activeOne, tab);
				}
			});
		});
	}

	async loadData() {
		this._scores = await DB_CONNECTOR.loadScores();
	}

	removeSpinner() {
		this._spinner.style.display = 'none';
		this._table.style.display = 'block';
	}

	_emptyTableCase() {
		this._emptyTableP.style.display = 'block';
		this._trs.forEach((tr) => (tr.style.display = 'none'));
	}

	_setTableCssClasses() {
		this._emptyTableP.style.display = 'none';
		this._trs.forEach((tr) => (tr.style.display = 'none'));
		this._trs[0].style.display = 'table-row';
	}

	_fillTable(bestScores) {
		let tr,
			tdsArr,
			prevTime = 0,
			position = 1;
		for (let i = 1; i <= bestScores.length; i++) {
			tr = document.getElementById(i + '');
			tr.style.display = 'table-row';
			tdsArr = [ ...tr.children ];

			if (prevTime !== bestScores[i - 1]['time']) {
				tdsArr[0].textContent = position;
			}
			position++;
			tdsArr[1].textContent = bestScores[i - 1]['name'];
			tdsArr[2].textContent = prevTime = bestScores[i - 1]['time'];
			tdsArr[3].textContent = new Date(bestScores[i - 1]['date'].seconds * 1000).toLocaleDateString();
		}
	}

	_nonEmptyTableCase(scores) {
		this._setTableCssClasses();
		const bestScores = scores.length > 10 ? scores.slice(0, this._rowsCount) : scores;
		this._fillTable(bestScores);
	}

	displayScores(scores) {
		if (scores.length === 0) {
			this._emptyTableCase();
		} else {
			this._nonEmptyTableCase(scores);
		}
	}
}

function getScoresByLevel(arr, lvl) {
	return arr.filter((score) => score.level === lvl).sort((a, b) => a.time - b.time);
}

window.onload = async () => {
	const leaderboard = new Leaderboard(10);
	setTimeout(() => {
		leaderboard.removeSpinner();
	}, 1000);
	await leaderboard.loadData();
	const scores = getScoresByLevel(leaderboard.getScores(), leaderboard.getPrevLevel());
	leaderboard.displayScores(scores);
};
