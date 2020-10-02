import firebase from 'firebase/app'
import 'firebase/database'

var firebaseConfig = {
    apiKey: "AIzaSyCDAKeETUvia9ar6BovyeHxTg_TR5MGb0I",
    authDomain: "meuapp-f6e83.firebaseapp.com",
    databaseURL: "https://meuapp-f6e83.firebaseio.com",
    projectId: "meuapp-f6e83",
    storageBucket: "meuapp-f6e83.appspot.com",
    messagingSenderId: "510037429053",
    appId: "1:510037429053:web:3e8ba89d2a454d7615d354",
    measurementId: "G-720MEHV05Q"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase