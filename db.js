const {
  MongoClient
} = require('mongodb');

const url = 'mongodb://localhost:27017/Surveymon';

const connectToDB = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, {
      useNewUrlParser: true
    }, (err, client) => {
      if (err) {
        reject(err);
      } else {
        resolve(client);
      }
    })
  });
};

const queryPollData = pollId => {
  return connectToDB().then(client => {
    const db = client.db('Surveymon');
    const collection = db.collection('Polls');

    return collection.findOne({ pollId });
  }).catch(err => {
    reject(err);
  });
}

const insertPollData = data => {
  return connectToDB().then(client => {
    const db = client.db('Surveymon');
    const collection = db.collection('Polls');

    return collection.insertOne(data);
  }).catch(err => {
    reject(err);
  });
}

const upvote = (pollId, { vote }) => {
  return connectToDB().then(client => {
    const db = client.db('Surveymon');
    const collection = db.collection('Polls');

    return collection.updateOne({ pollId, 'options.name': vote }, { $inc: {'options.$.voteCount' : 1} });
  }).catch(err => {
    reject(err);
  });
}

module.exports = {
  queryPollData,
  insertPollData,
  upvote
};