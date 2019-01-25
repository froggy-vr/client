import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
    apiKey: "AIzaSyCL9guSfzivJnUvXtJyTa4XItng-hHHbUY",
    authDomain: "froggy-vr.firebaseapp.com",
    databaseURL: "https://froggy-vr.firebaseio.com",
    projectId: "froggy-vr",
    storageBucket: "froggy-vr.appspot.com",
    messagingSenderId: "742148051650"
  };

firebase.initializeApp(config);

export default firebase;