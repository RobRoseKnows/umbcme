let firebase = require('firebase-admin');
// Initializing Firebase admin account
let serviceAccount = require("./service-account.json");
let config = require('./config.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: config.firebaseUrl
});

module.exports = firebase;
