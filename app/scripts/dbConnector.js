import { firestore } from './firebase.js';

const FIRESTORE = firestore;
const COLLECTION_NAME = 'PlayerScores';

class DbConnector {
	constructor(collectionName) {
		this._collectionName = collectionName;
	}

	addScoreToDb(player, time, lvl) {
		let dbObj = {
			name: player,
			time: time,
			level: lvl,
			date: new Date()
		};

		FIRESTORE.collection(this._collectionName)
			.add(dbObj)
			.then((docRef) => {
				console.log('Document written with ID: ', docRef.id);
			})
			.catch((error) => {
				console.error('Error adding document: ', error);
			});
	}

	loadScores() {
		return FIRESTORE.collection(this._collectionName).get().then((snapshot) => {
			const scores = [];
			snapshot.forEach((doc) => scores.push(doc.data()));
			return scores;
		});
	}
}

const DB_CONNECTOR = new DbConnector(COLLECTION_NAME);

export { DB_CONNECTOR };
