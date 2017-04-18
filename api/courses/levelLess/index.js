let deps = require('../../deps');
let config = deps.config;
let firebase = deps.firebase;
let Router = require('restify-router').Router;
let levelLess = new Router();

// Get all courses less than a course level e.g. less than 300 level course
levelLess.get('/' + config.version + '/levelLess', (req, res) => {
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

module.exports = levelLess;
