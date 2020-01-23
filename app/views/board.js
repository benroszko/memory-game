const imgMap = new Map();
let uncovered = 0;
const coveredImg = '../img/game/1.jpg';

function fillWithPaths(arr, length) {
	for (let i = 1; i <= length; i++) {
		arr.push({
			path: `../img/game/${i}.jpg`,
			lives: 2
		});
	}
}

function fillImgMap(size) {
	const pathsArr = [];
	fillWithPaths(pathsArr, size * size / 2);

	let rand;
	for (let i = 1; i <= size * size; i++) {
		rand = Math.floor(Math.random() * pathsArr.length);
		imgMap.set(i, pathsArr[rand].path);
		if (--pathsArr[rand].lives === 0) {
			pathsArr.splice(rand, 1);
		}
	}
}

const setImg = (td, index) => {
	//	td.style.backgroundImage = `url(${coveredImg})`;
	const img = new Image(50, 50);
	img.src = coveredImg;
	img.onerror = `this.onerror=null; this.src='${coveredImg}'`;
	td.addEventListener('click', () => {
		if (uncovered === 0) {
			img.src = `${imgMap.get(index)}`;
			uncovered++;
		} else {
			img.src = `${imgMap.get(index)}`;
			setTimeout(() => {
				uncovered = 0;
				img.src = coveredImg;
			}, 2000);
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
	fillImgMap(size);
	console.log(imgMap);

	const board = document.getElementsByClassName('board')[0];
	for (let i = 0; i < size; i++) {
		const tr = document.createElement('tr');
		createRow(tr, size, i * size);
		board.appendChild(tr);
	}
}

export { loadBoard };
