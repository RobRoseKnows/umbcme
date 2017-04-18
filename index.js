/***********************************************
** Filename: index.js
** Description: Contains the endpoints for the UMBC API
** Notes: The goal of this project is to make it easier
**        for students to interface with course data
**        at UMBC
************************************************/
const config = require('./config.json');
const restify = require('restify');
const plugins = require('restify-plugins');
const logger  = require('morgan')
const firebase = require('./firebase');

/******************** COURSES ***************************/
const getAll = require('./api/courses/getAll/');
const classInfo = require('./api/courses/classInfo/');
const department = require('./api/courses/department/');
const levelGreater = require('./api/courses/levelGreater/');
const levelLess = require('./api/courses/levelLess/');
const teaches = require('./api/courses/teaches/');
const teachesDept = require('./api/courses/teachesDept/');
/******************** END COURSES ************************/

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
