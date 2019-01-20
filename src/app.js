const express = require('express');
const bodyParser = require('body-parser');
const {
  upvote
} = require('./db/poll');
const {
  queryPollData,
  insertPollData
} = require('./db/poll-mongoose');

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use((req, res) => {
//   console.log(JSON.stringify(req.body));
//   res.setHeader('Content-Type', 'text/plain');
//   res.write('you posted:\n');
//   res.end(JSON.stringify(req.body, null, 2));
// });

const getErrorCode = err => {
  let errCode;
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    errCode = 400;
  } else {
    errCode = 500;
  }
  return errCode;
}

app.get('/health', (req, res) => {
  res.send('Server is healthy!');
});

app.get('/ViewPoll/:pollId', async (req, res) => {
  let document;

  try {
    document = await queryPollData(req.params.pollId);
  } catch (err) {
    const errCode = getErrorCode(err);
    res.status(errCode).send(err);
  }

  if (!document) {
    res.sendStatus(404);
  }
  res.status(200).send(document);
});

app.post('/CreatePoll', async (req, res) => {
  let document;

  try {
    document = await insertPollData(req.body);
  } catch (err) {
    const errCode = getErrorCode(err);
    res.status(errCode).send(err);
  }

  res.status(200).send(document);
});

app.post('/vote/:pollId', async (req, res) => {
  let document;

  try {
    document = await upvote(req.params.pollId, req.body);
  } catch (err) {
    const errCode = getErrorCode(err);
    res.status(errCode).send(err);
  }

  res.status(200).send(document);
})

app.listen(3000, function () {
  console.log('server has started at port 3000');
});

module.exports = { app };