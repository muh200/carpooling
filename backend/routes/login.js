const passport = require('passport');
const express = require('express');
const router = express.Router();
const { checkNotAuthenticated } = require('../check-authentication');

router.post('/', checkNotAuthenticated, function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ error: info.message }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.end();
    });
  })(req, res, next);
});

module.exports = router;
