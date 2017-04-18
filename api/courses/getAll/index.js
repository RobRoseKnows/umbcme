let deps = require('../../deps');
let config = deps.config;
let firebase = deps.firebase;
let Router = require('restify-router').Router;
let getAll = new Router();

getAll.get('/' + config.version + '/getAll', (req, res) => {
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

module.exports = getAll;
