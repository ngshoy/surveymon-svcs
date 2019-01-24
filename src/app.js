require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {
  queryPollData,
  insertPollData,
  deletePollData,
  upvote
} = require('./db/poll');

console.log(process.env.MONGODB_URI);
const app = express();
const port = process.env.PORT;
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

const handleRequest = async (req, res, cb, params) => {
  let document;

  try {
    document = await cb(...params);
  } catch (err) {
    const errCode = getErrorCode(err);
    res.status(errCode).send(err);
  }

  if (!document) {
    res.sendStatus(404);
  }
  res.status(200).send(document);
}

app.get('/health', (req, res) => {
  res.send('Server is healthy!');
});

app.get('/ViewPoll/:pollId', (req, res) => {
  handleRequest(req, res, queryPollData, [req.params.pollId]);
});

app.put('/CreatePoll', (req, res) => {
  handleRequest(req, res, insertPollData, [req.body]);
});

app.delete('/DeletePoll/:pollId', (req, res) => {
  handleRequest(req, res, deletePollData, [req.params.pollId]);
});

app.patch('/vote/:pollId', (req, res) => {
  handleRequest(req, res, upvote, [req.params.pollId, req.body.vote]);
});

app.listen(port, function () {
  console.log(`server has started at port ${port}`);
});

module.exports = { app };