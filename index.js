/***********************************************
** Filename: index.js
** Description: Contains the endpoints for the UMBC API
** Notes: The goal of this project is to make it easier
**        for students to interface with course data
**        at UMBC
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


server.get('/', (req, res) => {
  res.redirect("http://umbc.me");
});

// Get all of the courses given a certain parameter
server.get('/' + prefix + '/getAll', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  coursesRef
    .orderByChild("department")
    .startAt(req.query.startAt.toUpperCase())
    .limitToFirst(parseInt(req.query.limit))
    .once("value").then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      results.push(childSnapshot.val());
    });
    res.json(results);
  })
});

// Get information on a specific class
server.get('/' + prefix + '/classInfo', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  coursesRef
    .orderByChild("title")
    .equalTo(req.query.class.toUpperCase())
    .once("value")
    .then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      results.push(childSnapshot.val());
    });
    res.json(results);
  });
});

// Get all courses greater than a course level
server.get('/' + prefix + '/levelGreater', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  coursesRef
    .orderByChild("level")
    .startAt(parseInt(req.query.level))
    .limitToFirst(parseInt(req.query.limit))
    .once("value")
    .then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      let values = childSnapshot.val();
      if(values["level"] !== undefined){
        results.push(childSnapshot.val());
      }
    });
    res.json(results);
  });
});

// Get all courses less than a course level e.g. less than 300 level course
server.get('/' + prefix + '/levelLess', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  coursesRef
    .orderByChild("level")
    .endAt(parseInt(req.query.level))
    .limitToFirst(parseInt(req.query.limit))
    .once("value")
    .then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      let values = childSnapshot.val();
      if(values["level"] !== undefined){
        results.push(childSnapshot.val());
      }
    });
    res.json(results);
  });
});

// List all of the courses in a the department
server.get('/' + prefix + '/department', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  coursesRef
    .orderByChild("department")
    .equalTo(req.query.name.toUpperCase())
    .once("value")
    .then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      results.push(childSnapshot.val());
    });
    res.json(results);
  });
});

// Find the courses a professor teaches when department is known
server.get('/' + prefix + '/teachesDept', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  let name = req.query.name;
  coursesRef
    .orderByChild("department")
    .equalTo(req.query.dept.toUpperCase())
    .once("value")
    .then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      let course = childSnapshot.val();
      let title = course["title"];
      let sections = course["sections"];
      for(let i = 0; i < sections.length; ++i) {
        if(sections[i]["instructor(s)"].toLowerCase().includes(name.toLowerCase())) {
          let courseSection = sections[i];
          courseSection["title"] = title;
          results.push(courseSection);
        }
      }
    });
    res.json(results);
  });
});

// Find the courses a professor teaches when department unknown
server.get('/' + prefix + '/teaches', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  let name = req.query.name;
  coursesRef
    .orderByChild("title")
    .once("value")
    .then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      let course = childSnapshot.val();
      let title = course["title"];
      let sections = course["sections"];
      for(let i = 0; i < sections.length; ++i) {
        if(sections[i]["instructor(s)"].toLowerCase().includes(name.toLowerCase())) {
          let courseSection = sections[i];
          courseSection["title"] = title;
          results.push(courseSection);
        }
      }
    });
    res.json(results);
  });
});
const port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
