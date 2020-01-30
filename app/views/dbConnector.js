// // Firebase App (the core Firebase SDK) is always required and
// // must be listed before other Firebase SDKs
// import * as firebase from 'firebase/app';

// // Add the Firebase services that you want to use
// import 'firebase/auth';
// import 'firebase/firestore';
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

export { addScoreToDb };
