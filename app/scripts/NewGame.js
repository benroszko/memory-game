import { loadBoard, loadTimer } from './board.js';

window.onload = () => {
	const select = document.getElementsByClassName('form-control')[0];
	const btn = document.getElementsByClassName('btn')[0];
	let dimension = 0; //number of rows and columns in table

	const dimensions = {
		EASY: 4,
		MEDIUM: 6,
		HARD: 8
	};

	btn.addEventListener('click', async () => {
		let chosen = true;

		switch (select.value) {
			case 'easy':
				dimension = dimensions.EASY;
				break;
			case 'medium':
				dimension = dimensions.MEDIUM;
				break;
			case 'hard':
				dimension = dimensions.HARD;
				break;
			default:
				chosen = false;
				break;
		}

		if (chosen) {
			btn.disabled = select.disabled = true;
			await loadBoard(dimension);
			loadTimer();
		}
	});
};
