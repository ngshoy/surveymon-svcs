const mongoose = require('mongoose');
const { Poll } = require('./models/pollModel');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/Surveymon';

mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true });

const insertPollData = data => {
  const newPoll = new Poll(data);
  return newPoll.save();
}

const queryPollData = pollId => {
  return Poll.findById(pollId);
}

const deletePollData = pollId => {
  return Poll.findByIdAndRemove(pollId);
}

const upvote = (pollId, vote) => {
  return Poll.findOneAndUpdate({ _id: pollId, 'options.name': vote }, { $inc: { 'options.$.voteCount': 1 }});
}

module.exports = {
  queryPollData,
  insertPollData,
  deletePollData,
  upvote
}