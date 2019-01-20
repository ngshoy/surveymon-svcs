const { model } = require('mongoose');

const Poll = model('Poll', {
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
