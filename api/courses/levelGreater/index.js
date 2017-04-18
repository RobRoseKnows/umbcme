const deps = require('../../deps');
const config = deps.config;
const firebase = deps.firebase;
const Router = require('restify-router').Router;
const levelGreater = new Router();

// Get all courses greater than a course level
levelGreater.get('/' + config.version + '/levelGreater', (req, res) => {
  const coursesRef = firebase.database().ref('/');
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
