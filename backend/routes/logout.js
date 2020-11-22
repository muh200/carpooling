const passport = require('passport');
const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../check-authentication');

router.post('/', checkAuthenticated, function(req, res, next) {
  req.logout();
  res.json({});
});

module.exports = router;
