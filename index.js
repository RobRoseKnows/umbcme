/***********************************************
** Filename: index.js
** Description: Contains the endpoints for the UMBC API
** Notes: Decided to
************************************************/
let config = require('./config.json');
let firebase = require('firebase-admin');
let restify = require('restify');
let plugins = require('restify-plugins');
let logger  = require('morgan')

const server = restify.createServer({
  name: 'umbcapi',
  version: '0.0.1'
});

const prefix = "v0";
server.use(logger('dev'));
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());


// Initializing Firebase admin account
let serviceAccount = require("./service-account.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: config.firebaseUrl
});

// process.env.PORT || 5000

server.get('/', (req, res) => {
  res.redirect("http://umbc.me");
});

server.get('/' + prefix + '/getAll', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  coursesRef.orderByChild("department").startAt(req.query.startAt.toUpperCase()).limitToFirst(parseInt(req.query.limit)).once("value").then((dataSnapshot) => {

    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      results.push(childSnapshot.val());
    });
    res.json(results);
  })
});
server.get('/' + prefix + '/classInfo', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  coursesRef.orderByChild("title").equalTo(req.query.class.toUpperCase()).once("value").then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      results.push(childSnapshot.val());
    });
    res.json(results);
  })
});

const port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
