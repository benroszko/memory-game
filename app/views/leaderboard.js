import { loadScores } from './dbConnector.js';

const scores = [];

(function loadFromDb() {
	loadScores()
		.then((data) => scores.push(data))
		.then((bruh) => console.log(scores))
		.then((kek) => console.log(getScoresByLevel(scores, 'EASY')));
})();

function getScoresByLevel(arr, lvl) {
	return arr.forEach((score) => console.log(score.name));
	// .sort((a, b) => a.time < b.time);
}
