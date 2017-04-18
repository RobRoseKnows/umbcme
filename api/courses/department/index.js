let deps = require('../../deps');
let config = deps.config;
let firebase = deps.firebase;
let Router = require('restify-router').Router;
let department = new Router();

// List all of the courses in a the department
department.get('/' + config.version + '/department', (req, res) => {
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

module.exports = department;
