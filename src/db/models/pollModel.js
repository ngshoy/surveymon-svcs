const { model, Schema } = require('mongoose');

const PollOptionSchema = new Schema({ 
  name: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  voteCount: {
    type: Number,
    default: 0
  }
 })
const Poll = model('Poll', {
  topic: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  options: {
    type: [PollOptionSchema],
    required: true,
    validate: [arrayMinLimit, 'does not meet the minimum of 2']
  }
});

function arrayMinLimit(arr) {
  return arr.length >= 2;
};

module.exports = { Poll };
