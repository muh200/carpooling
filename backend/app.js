const express = require('express');
const session = require('express-session');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const ridersRouter = require('./routes/riders');
const driversRouter = require('./routes/drivers');

const passport = require('passport');

const initializePassport = require('./passport-config');
initializePassport(passport);

const app = express();

let secret = null;
if (process.env.NODE_ENV === 'development') {
  secret = 'secret';
} else {
  secret = process.env.SECRET;
  if (secret === undefined) {
    console.error('SECRET environment variable is not set.');
    process.exitCode = 1;
  }
}

app.use(logger('dev'));
app.use(express.json());
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
}));
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/riders', ridersRouter);
app.use('/drivers', driversRouter);
app.use('/logout', logoutRouter);

module.exports = app;
