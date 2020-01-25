import { loadBoard, loadTimer, loadScoreCounter } from './board.js';

window.onload = () => {
	const select = document.getElementsByClassName('form-control')[0];
	const btn = document.getElementsByClassName('btn')[0];
	let dimension = 0; //number of rows and columns in table
	console.log(select);

	btn.addEventListener('click', () => {
		let chosen = true;

		switch (select.value) {
			case 'easy':
				dimension = 4;
				break;
			case 'medium':
				dimension = 6;
				break;
			case 'hard':
				dimension = 8;
				break;
			default:
				chosen = false;
				break;
		}

		if (chosen) {
			btn.disabled = select.disabled = true;
			loadBoard(dimension);
			loadTimer();
			loadScoreCounter();
		}
	});
};
