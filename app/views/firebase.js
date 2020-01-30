const firebaseConfig = {
	apiKey: 'AIzaSyB_sDj-xI3iB-tcKzN6SU-HJsjGRgDuu5A',
	authDomain: 'memory-ce8f9.firebaseapp.com',
	databaseURL: 'https://memory-ce8f9.firebaseio.com',
	projectId: 'memory-ce8f9',
	storageBucket: 'memory-ce8f9.appspot.com',
	messagingSenderId: '338375684667',
	appId: '1:338375684667:web:9dd6e8c3a3da05e0b2221e',
	measurementId: 'G-0GF81P9RJW'
};
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export default firebase;

export { firestore };
