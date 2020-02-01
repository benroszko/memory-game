import { loadScores } from './dbConnector.js';

async function loadFromDb() {
	return await loadScores();
}

function getScoresByLevel(arr, lvl) {
	return arr.filter((score) => score.level === lvl).sort((a, b) => a.time < b.time);
}

function displayScores(scores) {
	const emptyTableP = document.getElementById('empty-table-case');

	if (scores.length === 0) {
		emptyTableP.style.display = 'block';
	} else {
		emptyTableP.style.display = 'none';
		//TODO: display table-rows
	}
}

function changeViewOnNavTabClick(scores) {
	const navTabs = [ ...document.getElementsByClassName('nav-link') ];
	navTabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			const activeOne = navTabs.find((nav) => nav.classList.contains('active'));
			if (tab !== activeOne) {
				activeOne.classList.remove('active');
				tab.classList.add('active');
				const activeScores = getScoresByLevel(scores, tab.textContent.toUpperCase());
				displayScores(activeScores);
			}
		});
	});
}
window.onload = async () => {
	const scores = await loadFromDb();
	changeViewOnNavTabClick(scores);
	const easyScores = getScoresByLevel(scores, 'EASY');
	displayScores(easyScores);
};
