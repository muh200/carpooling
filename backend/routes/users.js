const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

let Database = null;
if (process.env.NODE_ENV === 'development') {
  Database = require('../database/development');
} else {
  console.error(
    `There are no production databases implemented yet.
     Set the NODE_ENV environment variable to 'development'.`
  );
  process.exitCode = 1;
}

const accountsDatabase = new Database();

router.use(express.json());

router.post('/', async function(req, res, next) {
  if (req.body.username === undefined || req.body.username === null) {
    res.status(400).json({
      error: 'Username is not defined.',
    });
  } else if (req.body.password === undefined || req.body.password === null) {
    res.status(400).json({
      error: 'Password is not defined.',
    });
  } else if (req.body.username === '') {
    res.status(400).json({
      error: 'Username is empty.',
    });
  } else if (req.body.password === '') {
    res.status(400).json({
      error: 'Password is empty.',
    });
  } else if (accountsDatabase.get(req.body.username)) {
    res.status(409).json({
      error: 'An account with that username already exists.',
    });
  } else {
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    accountsDatabase.set(req.body.username, {
      'hashedPassword': hash,
    });
    res.status(201).end();
  }
});

module.exports = router;
