const expect = require('expect');
const request = require('supertest');

const { app } = require('./app');
const { Poll } = require('./db/models/pollModel');

describe('POST /CreatePoll', () => {
  const pollData = {
    "topic": "where should we go for lunch?",
    "options": [{
        "name": "Ematei",
        "voteCount": 1
      },
      {
        "name": "Niu Da",
        "voteCount": 0
      },
      {
        "name": "Hong Shing",
        "voteCount": 0
      },
      {
        "name": "Modern Work",
        "voteCount": 0
      }
    ]
  };

  beforeEach(done => {
    Poll.deleteMany({}).then(() => done());
  });

  it('should create a new poll', done => {
    request(app)
    .post('/CreatePoll')
    .send(pollData)
    .expect(200)
    .expect(res => {
      expect(res.body.pollId).toBeDefined();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      return done();
    })
  });

  it('should not create a new poll with invalid data', done => {
    pollData.topic = '';

    request(app)
    .post('/CreatePoll')
    .send(pollData)
    .expect(400)
    .expect(res => {
      expect(res.body.pollId).toBeUndefined();
      expect(res.body.name).toBe('ValidationError');
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      return done();
    })
  });
});