const deps = require('../../deps');
const config = deps.config;
const firebase = deps.firebase;
const Router = require('restify-router').Router;
const teaches = new Router();

// Find the courses a professor teaches when department unknown
teaches.get('/' + config.version + '/teaches', (req, res) => {
  const coursesRef = firebase.database().ref('/');
  const name = req.query.name;
  coursesRef
    .orderByChild("title")
    .once("value")
    .then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      const course = childSnapshot.val();
      const title = course["title"];
      const sections = course["sections"];
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

module.exports = teaches;
