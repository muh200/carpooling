function checkAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.status(401).end();
}

function checkNotAuthenticated(req, res, next) {
  if (!req.user) {
    return next();
  }
  res.status(403).end();
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
