const userLocator = require('../user-locator');

let drivers = null;
if (process.env.NODE_ENV === 'development') {
  drivers = new Map();
} else {
  console.error(
    `There are no production databases implemented yet.
     Set the NODE_ENV environment variable to 'development'.`
  );
  process.exitCode = 1;
}

module.exports = userLocator(drivers, 10);
