const firebase = require('firebase-admin');

// Initializing Firebase admin account
const serviceAccount = require("./service-account.json");
const config = require('./config.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: config.firebaseUrl
});

module.exports = firebase;
