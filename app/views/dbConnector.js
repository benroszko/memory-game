import { firestore } from './firebase.js';

const collectionName = 'PlayerScores';

function addScoreToDb(player, time, lvl) {
	let dbObj = {
		name: player,
		time: time,
		level: lvl,
		date: new Date()
	};

	firestore
		.collection(collectionName)
		.add(dbObj)
		.then(function(docRef) {
			console.log('Document written with ID: ', docRef.id);
		})
		.catch(function(error) {
			console.error('Error adding document: ', error);
		});
}

function loadScores() {
	return firestore.collection(collectionName).get().then((snapshot) => {
		const scores = [];
		snapshot.forEach((doc) => scores.push(doc.data()));
		return scores;
	});
}

export { addScoreToDb, loadScores };
