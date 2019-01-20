const mongoose = require('mongoose');
const { Poll } = require('./models/pollModel');

const url = 'mongodb://localhost:27017/Surveymon';

mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true });

const insertPollData = data => {
  const newPoll = new Poll(data);
  return newPoll.save();
}

const queryPollData = pollId => {
  return Poll.findOne({ _id: pollId });
}

module.exports = {
  queryPollData,
  insertPollData
}