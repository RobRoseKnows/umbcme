const deps = require('../../deps');
const config = deps.config;
const firebase = deps.firebase;
const Router = require('restify-router').Router;
const classInfo = new Router();

// Get information on a specific class
classInfo.get('/' + config.version + '/sectionInfo', (req, res) => {
  const sectionsRef = firebase.database().ref('/');
  sectionsRef
    .orderByChild("class_number")
    .equalTo(req.query.classNumber)
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
