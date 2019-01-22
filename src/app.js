const express = require('express');
const bodyParser = require('body-parser');
const {
  queryPollData,
  insertPollData,
  deletePollData,
  upvote
} = require('./db/poll-mongoose');

const app = express();
const port = process.env.PORT || 3000;
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

// app.get('/ViewPoll/:pollId', async (req, res) => {
//   let document;

//   try {
//     document = await queryPollData(req.params.pollId);
//   } catch (err) {
//     const errCode = getErrorCode(err);
//     res.status(errCode).send(err);
//   }

//   if (!document) {
//     res.sendStatus(404);
//   }
//   res.status(200).send(document);
// });

app.put('/CreatePoll', (req, res) => {
  handleRequest(req, res, insertPollData, [req.body]);
});

// app.post('/CreatePoll', async (req, res) => {
//   let document;

//   try {
//     document = await insertPollData(req.body);
//   } catch (err) {
//     const errCode = getErrorCode(err);
//     res.status(errCode).send(err);
//   }

//   res.status(200).send(document);
// });

app.delete('/DeletePoll/:pollId', (req, res) => {
  handleRequest(req, res, deletePollData, [req.params.pollId]);
});

// app.delete('/DeletePoll/:pollId', async (req, res) => {
//   let document;

//   try {
//     document = await deletePollData(req.params.pollId);
//   } catch (err) {
//     const errCode = getErrorCode(err);
//     res.status(errCode).send(err);
//   }

//   if (!document) {
//     res.sendStatus(404);
//   }
//   res.status(200).send(document);
// });

app.patch('/vote/:pollId', (req, res) => {
  handleRequest(req, res, upvote, [req.params.pollId, req.body.vote]);
});

// app.post('/vote/:pollId', async (req, res) => {
//   let document;

//   try {
//     document = await upvote(req.params.pollId, req.body);
//   } catch (err) {
//     const errCode = getErrorCode(err);
//     res.status(errCode).send(err);
//   }

//   if (!document) {
//     res.sendStatus(404);
//   }
//   res.status(200).send(document);
// });

app.listen(port, function () {
  console.log(`server has started at port ${port}`);
});

module.exports = { app };