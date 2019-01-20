const mongoose = require('mongoose');
const { Poll } = require('./models/pollModel');

const url = 'mongodb://localhost:27017/Surveymon';

mongoose.Promise = global.Promise;
mongoose.connect(url);
