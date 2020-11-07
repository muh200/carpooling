function checkAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.status(401).json({error: 'Illegal request for inauthenticated user.'});
}

function checkNotAuthenticated(req, res, next) {
  if (!req.user) {
    return next();
  }
  res.status(403).json({error: 'Illegal request for authenticated user.'});
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
