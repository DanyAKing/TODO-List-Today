const express = require('express');

const router = express.Router();

router
  .get('/', (req, res) => {
    console.log(`Visit ${req.path}`);
  });

module.exports = { router };
