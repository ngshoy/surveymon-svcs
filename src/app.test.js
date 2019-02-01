const expect = require('expect');
const request = require('supertest');

const { app } = require('./app');
const { Poll } = require('./db/models/pollModel');

const pollData = {
  "topic": "where should we go for lunch?",
  "options": [{
      "name": "Ematei "
    },
    {
      "name": "Niu Da"
    },
    {
      "name": "Hong Shing"
    },
    {
      "name": "Modern Work"
    }
  ]
};

describe('PUT /CreatePoll', () => {
  beforeEach(done => {
    Poll.deleteMany({}).then(() => done());
  });

  it('should create a new poll with correct data', done => {
    request(app)
    .put('/CreatePoll')
    .send(pollData)
    .expect(200)
    .expect(res => {
      expect(res.body._id).toBeDefined();
      expect(res.body.options[0].name).toBe('Ematei');
      expect(res.body.options[0].voteCount).toBe(0);
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
    .put('/CreatePoll')
    .send(pollData)
    .expect(400)
    .expect(res => {
      expect(res.body._id).toBeUndefined();
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
