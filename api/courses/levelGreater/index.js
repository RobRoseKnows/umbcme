let deps = require('../../deps');
let config = deps.config;
let firebase = deps.firebase;
let Router = require('restify-router').Router;
let levelGreater = new Router();

// Get all courses greater than a course level
levelGreater.get('/' + config.version + '/levelGreater', (req, res) => {
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

module.exports = levelGreater;
