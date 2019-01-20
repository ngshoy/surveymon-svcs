const { model } = require('mongoose');

const Poll = model('Poll', {
  pollId: {
    type: String
  },
  topic: {
    type: String
  },
  options: {
    type: Array
  }
});

module.exports = { Poll };
