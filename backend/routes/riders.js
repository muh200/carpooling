const userLocator = require('../user-locator');

let riders = null;
if (process.env.NODE_ENV === 'development') {
  riders = new Map();
} else {
  console.error(
    `There are no production databases implemented yet.
     Set the NODE_ENV environment variable to 'development'.`
  );
  process.exitCode = 1;
}

module.exports = userLocator(riders, 10);
