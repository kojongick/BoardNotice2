import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyDFt7xIn8nmCNbSjVz79wW3U2qZDK7yvwY",
    authDomain: "boardnotice-fbbf1.firebaseapp.com",
    databaseURL: "https://boardnotice-fbbf1.firebaseio.com",
    projectId: "boardnotice-fbbf1",
    storageBucket: "boardnotice-fbbf1.appspot.com",
    messagingSenderId: "617466786199"
};
firebase.initializeApp(config);
export default firebase;

