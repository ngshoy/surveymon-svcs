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
    return new Promise((resolve, reject) => {
      const db = client.db('Surveymon');
      const collection = db.collection('Polls');

      collection.findOne({ pollId }, (err, item) => {
        client.close();
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      })
    })
  }).catch(err => {
    reject(err);
  });
}

const insertPollData = data => {
  return connectToDB().then(client => {
    return new Promise((resolve, reject) => {
      const db = client.db('Surveymon');
      const collection = db.collection('Polls');

      collection.insertOne(data, (err, item) => {
        if (err) {
          reject(err);
        } else {
          resolve(item);
        }
      });
    })
  }).catch(err => {
    reject(err);
  });
}

module.exports = {
  queryPollData,
  insertPollData
};