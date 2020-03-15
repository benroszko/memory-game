import { firestore } from './firebase.js';

const FIRESTORE = firestore;

export class DbConnector {
	constructor() {
		this.collectionName = 'PlayerScores';
	}

	addScoreToDb(player, time, lvl) {
		let dbObj = {
			name: player,
			time: time,
			level: lvl,
			date: new Date()
		};

		FIRESTORE.collection(this.collectionName)
			.add(dbObj)
			.then((docRef) => {
				console.log('Document written with ID: ', docRef.id);
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
			});
	}

	loadScores() {
		return FIRESTORE.collection(this.collectionName).get().then((snapshot) => {
			const scores = [];
			snapshot.forEach((doc) => scores.push(doc.data()));
			return scores;
		});
	}
}
