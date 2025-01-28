const express = require('express');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const cors = require('cors');
const routes = require('../routes');
const {Handle404Error} = require('../helpers');
const {env} = require('./env');

/**
 * Create Express App
 */
const app = express();

/**
 * Configure Express App
 */
app.use(bodyParser.json({limit: '50mb'}));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);
app.use(bodyParser.raw({limit: '50mb'}));
// enable file upload
app.use(
  fileupload({
    limits: {fileSize: 50 * 1024 * 1024},
    debug: true,
  }),
);
// set public static folder
// app.use(express.static('public'));
app.use('/api', express.static('public'));

// enable CORS - Cross Origin Resource Sharing
app.use(
  cors({
    origin: '*',
  }),
);
app.use(express.json());
app.disable('x-powered-by'); // less hackers know about our stack


// Mount API routes
app.use('/', routes);

// Handle all unknown route request
app.use(Handle404Error);

/**
 * Exports express
 * @public
 */
module.exports = app;
