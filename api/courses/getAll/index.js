const deps = require('../../deps');
const config = deps.config;
const firebase = deps.firebase;
const Router = require('restify-router').Router;
const getAll = new Router();

getAll.get('/' + config.version + '/getAll', (req, res) => {
  const coursesRef = firebase.database().ref('/');
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

module.exports = getAll;
