const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.set('Content-Type', 'text/plain');
  res.send('respond with a resource');
});

module.exports = router;
