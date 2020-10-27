// This is the abstract class that all database objects derive from. This
// ensures that development databases and production databases have the same
// interface. The interface is meant to match the semantics of the Map
// javascript type.
class Database {
  get(key) {
    throw new Error("This method is not implemented");
  }

  set(key, value) {
    throw new Error("This method is not implemented");
  }

  remove(key) {
    throw new Error("This method is not implemented");
  }
}

module.exports = Database;
