const deps = require('../../deps');
const config = deps.config;
const firebase = deps.firebase;
const Router = require('restify-router').Router;
const department = new Router();

// List all of the courses in a the department
department.get('/' + config.version + '/department', (req, res) => {
  const coursesRef = firebase.database().ref('/');
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

module.exports = department;
