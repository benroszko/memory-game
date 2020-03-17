const firebaseConfig = {
	// apiKey: '*',
	// authDomain: '*',
	// databaseURL: '*',
	// projectId: '*',
	// storageBucket: '*',
	// messagingSenderId: '*',
	// appId: '*',
	// measurementId: '*'
};
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export default firebase;

export { firestore };
