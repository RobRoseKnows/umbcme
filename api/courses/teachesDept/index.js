let deps = require('../../deps');
let config = deps.config;
let firebase = deps.firebase;
let Router = require('restify-router').Router;
let teachesDept = new Router();

// Find the courses a professor teaches when department is known
teachesDept.get('/' + config.version + '/teachesDept', (req, res) => {
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

module.exports = teachesDept;
