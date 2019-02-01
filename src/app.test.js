const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./app');
const { Poll } = require('./db/models/pollModel');

const id = new ObjectID();
const pollData = {
  "_id": id,
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

  after(done => {
    Poll.deleteMany({}).then(() => done());
  })

  it('should create a new poll with correct data', done => {
    request(app)
    .put('/CreatePoll')
    .send(pollData)
    .expect(200)
    .expect(res => {
      expect(res.body._id).toEqual(id.toHexString());
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
    const invalidData = { ...pollData, topic: ''};

    request(app)
    .put('/CreatePoll')
    .send(invalidData)
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

describe('GET /ViewPoll/:pollId', () => {
  beforeEach(done => {
    Poll.deleteMany({}).then(() => null);
    const newPoll = new Poll(pollData);
    newPoll.save().then(() => done());
  });

  after(done => {
    Poll.deleteMany({}).then(() => done());
  })

  it('should find the poll with corect data', done => {
    request(app)
    .get(`/ViewPoll/${id.toHexString()}`)
    .expect(200)
    .expect(res => {
      expect(res.body._id).toEqual(id.toHexString());
      expect(res.body.topic).toEqual('where should we go for lunch?');
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

  it('should not find any poll with invalid id', done => {
    const invalidId = new ObjectID();

    request(app)
    .get(`/ViewPoll/${invalidId.toHexString()}`)
    .expect(404)
    .expect(res => {
      expect(res.body._id).toBeUndefined();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      return done();
    })
  });
});