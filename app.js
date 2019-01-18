const express = require('express');
const bodyParser = require('body-parser');
const {
  queryPollData,
  insertPollData
} = require('./db');

const app = express();
app.use(bodyParser.json());
// app.use((req, res) => {
//   console.log(JSON.stringify(req.body));
//   res.setHeader('Content-Type', 'text/plain');
//   res.write('you posted:\n');
//   res.end(JSON.stringify(req.body, null, 2));
// });

app.get('/health', (req, res) => {
  res.send('Server is healthy!');
});

app.get('/ViewPoll/:pollId', (req, res) => {
  queryPollData(req.params.pollId)
    .then(doc => {
      res.status(200);
      res.send(doc);
    })
    .catch(err => {
      res.status(500);
      res.statusMessage(err);
      res.send();
    })
});

app.post('/CreatePoll', (req, res) => {
  if (!req.body) {
    res.sendStatus(400)
  }

  insertPollData(req.body)
    .then(doc => {
      res.status(200);
      res.send(doc);
    })
    .catch(err => {
      res.status(500);
      res.statusMessage(err);
      res.send();
    })
});

app.listen(3000, function () {
  console.log('server has started at port 3000');
});