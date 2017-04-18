let deps = require('../../deps');
let config = deps.config;
let firebase = deps.firebase;
let Router = require('restify-router').Router;
let classInfo = new Router();

// Get information on a specific class
classInfo.get('/' + config.version + '/classInfo', (req, res) => {
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

module.exports = classInfo;
