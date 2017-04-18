/***********************************************
** Filename: index.js
** Description: Contains the endpoints for the UMBC API
** Notes: The goal of this project is to make it easier
**        for students to interface with course data
**        at UMBC
************************************************/
let config = require('./config.json');
let restify = require('restify');
let plugins = require('restify-plugins');
let logger  = require('morgan')
let firebase = require('./firebase');
let getAll = require('./api/courses/getAll/');
let classInfo = require('./api/courses/classInfo/');
let department = require('./api/courses/department/');
let levelGreater = require('./api/courses/levelGreater/');
let levelLess = require('./api/courses/levelLess/');
let teaches = require('./api/courses/teaches/');
let teachesDept = require('./api/courses/teachesDept/');

const server = restify.createServer({
  name: 'umbcapi',
  version: '0.0.1'
});

const prefix = "v0";
server.use(logger('dev'));
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());

const courses = [getAll, classInfo, department, levelGreater, levelLess, teaches, teachesDept];

courses.forEach((router) => router.applyRoutes(server));

const port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
