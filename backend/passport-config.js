const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

let accountsDatabase = null;
if (process.env.NODE_ENV === 'development') {
  accountsDatabase = require('./database/development');
} else {
  console.error(
    `There are no production databases implemented yet.
     Set the NODE_ENV environment variable to 'development'.`
  );
  process.exitCode = 1;
}

function initialize(passport) {
  passport.use(new LocalStrategy(
    async function(username, password, done) {
      const account = accountsDatabase.get(username);
      if (account === undefined) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      const match = await bcrypt.compare(password, account.hashedPassword);
      if (!match) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, account);
    }
  ));

  passport.serializeUser(function(user, done) {
    // no sensitive information should be in the session token
    done(null, user.username);
  });

  passport.deserializeUser(function(username, done) {
    const user = accountsDatabase.get(username);
    done(null, user);
  });
}

module.exports = initialize;
