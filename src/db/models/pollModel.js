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
  options: [PollOptionSchema]
});

module.exports = { Poll };
