import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
    getFirestore
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
    getAuth
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain:
        "YOUR_PROJECT_ID.firebaseapp.com",

    projectId:
        "YOUR_PROJECT_ID",

    storageBucket:
        "YOUR_PROJECT_ID.firebasestorage.app",

    messagingSenderId:
        "YOUR_MESSAGING_SENDER_ID",

    appId:
        "YOUR_APP_ID"

};


const app =
    initializeApp(
        firebaseConfig
    );


const db =
    getFirestore(app);


const auth =
    getAuth(app);


export {
    app,
    db,
    auth
};
