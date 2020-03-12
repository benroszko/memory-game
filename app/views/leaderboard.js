import { loadScores } from './dbConnector.js';

const rowsQuantity = 10;

async function loadFromDb() {
	return await loadScores();
}

function getScoresByLevel(arr, lvl) {
	return arr.filter((score) => score.level === lvl).sort((a, b) => a.time - b.time);
}

function displayScores(scores) {
	const emptyTableP = document.getElementById('empty-table-case');
	const trs = [ ...document.getElementsByTagName('tr') ];
	if (scores.length === 0) {
		emptyTableP.style.display = 'block';
		trs.forEach((tr) => (tr.style.display = 'none'));
	} else {
		emptyTableP.style.display = 'none';
		trs.forEach((tr) => (tr.style.display = 'none'));
		trs[0].style.display = 'table-row';
		const bestScores = scores.length > 10 ? scores.slice(0, rowsQuantity) : scores;
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
}

function changeViewOnNavTabClick(scores, navTabs) {
	navTabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			localStorage.setItem('level', tab.textContent.toUpperCase());
			const activeOne = navTabs.find((nav) => nav.classList.contains('active'));
			if (tab !== activeOne) {
				activeOne.classList.remove('active');
				tab.classList.add('active');
				const activeScores = getScoresByLevel(scores, tab.textContent.toUpperCase());
				console.log(activeScores);
				displayScores(activeScores);
			}
		});
	});
}

window.onload = async () => {
	setTimeout(() => {
		document.getElementsByClassName('spinner')[0].style.display = 'none';
		document.getElementsByClassName('table-responsive')[0].style.display = 'block';
	}, 1000);
	const scores = await loadFromDb();
	console.log(scores);
	const prevLevel = localStorage.getItem('level') || 'EASY';
	const navTabs = [ ...document.getElementsByClassName('nav-link') ];
	navTabs.find((tab) => tab.textContent.toUpperCase() === prevLevel).classList.add('active');
	console.log(navTabs[0].textContent);
	changeViewOnNavTabClick(scores, navTabs);
	const easyScores = getScoresByLevel(scores, prevLevel);
	console.log(easyScores);
	displayScores(easyScores);
};
