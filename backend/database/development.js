const Database = require('./database');

// This database is only appropriate for testing in a development environment.
class DevelopmentDatabase extends Database {
  constructor() {
    super();
    this.data = new Map();
  }

  get(key) {
    return this.data.get(key);
  }

  set(key, value) {
    this.data.set(key, value);
  }

  remove(key) {
    this.data.delete(key);
  }
}

module.exports = DevelopmentDatabase;
