const express = require('express');
const { router } = require('./routes/routes');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/', router);

app.listen(3000, '127.0.0.1', err => {
  if (err) console.log(err);
  console.log('Server listening on port 3000, visit http://127.0.0.1:3000.');
});
