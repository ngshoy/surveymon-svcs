const { model } = require('mongoose');
const uuidv4 = require('uuid/v4');

const Poll = model('Poll', {
  pollId: {
    type: String,
    default: uuidv4()
  },
  topic: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  options: {
    type: Array,
    required: true
  }
});

module.exports = { Poll };
