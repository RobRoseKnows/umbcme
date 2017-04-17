let firebase = require('firebase-admin');
let express = require('express');
let app = express();
let API_VERSION = "v0";
// Initializing Firebase admin account
let serviceAccount = require("./service-account.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://umbcapi-c4910.firebaseio.com'
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/' + API_VERSION + '/getAll', (req, res) => {
  // Get the courses reference
  let coursesRef = firebase.database().ref('/');
  coursesRef.orderByChild("department").startAt(req.query.startAt.toUpperCase()).limitToFirst(parseInt(req.query.limit)).once("value").then((dataSnapshot) => {

    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      results.push(childSnapshot.val());
    });
    res.json(results);
  })
});
app.get('/' + API_VERSION + '/classInfo', (req, res) => {
  let coursesRef = firebase.database().ref('/');
  coursesRef.orderByChild("title").equalTo(req.query.class.toUpperCase()).once("value").then((dataSnapshot) => {
    let results = [];
    dataSnapshot.forEach((childSnapshot) => {
      results.push(childSnapshot.val());
    });
    res.json(results);
  })
})
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
