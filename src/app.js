require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressjwt = require('express-jwt');
const {
  retrievePollData,
  retrievePollForVote,
  insertPollData,
  deletePollData,
  upvote
} = require('./db/poll');

const app = express();
const jwtCheck = expressjwt({
  secret: 'mysupersecretkey'
});
app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
//   next();
// });
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
    console.error(err);
    const errCode = getErrorCode(err);
    return res.status(errCode).send(err);
  }

  if (!document) {
    return res.status(404).send();
  }
  return res.status(200).send(document);
}

app.get('/health', (req, res) => {
  res.send('Server is healthy!');
});

app.get('/ViewPoll/:pollId', jwtCheck, (req, res) => {
  handleRequest(req, res, retrievePollForVote, [req.params.pollId]);
});

app.get('/PollResults/:pollId', jwtCheck, (req, res) => {
  handleRequest(req, res, retrievePollData, [req.params.pollId]);
})

app.put('/CreatePoll', jwtCheck, (req, res) => {
  handleRequest(req, res, insertPollData, [req.body]);
});

app.delete('/DeletePoll/:pollId', jwtCheck, (req, res) => {
  handleRequest(req, res, deletePollData, [req.params.pollId]);
});

app.patch('/vote/:pollId', jwtCheck, (req, res) => {
  handleRequest(req, res, upvote, [req.params.pollId, req.body.vote]);
});

app.listen(process.env.PORT, function () {
  console.log(`server has started at port ${process.env.PORT}`);
});

module.exports = { app };