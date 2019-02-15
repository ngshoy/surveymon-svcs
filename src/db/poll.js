const mongoose = require('mongoose');
const { Poll } = require('./models/pollModel');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const insertPollData = data => {
  const newPoll = new Poll(data);
  return newPoll.save();
}

const retrievePollData = pollId => {
  return Poll.findById(pollId);
}

const deletePollData = pollId => {
  return Poll.findByIdAndRemove(pollId);
}

const upvote = (pollId, vote) => {
  return Poll.findOneAndUpdate({ _id: pollId, 'options.name': vote }, { $inc: { 'options.$.voteCount': 1 }}, {new: true});
}

module.exports = {
  retrievePollData,
  insertPollData,
  deletePollData,
  upvote
}