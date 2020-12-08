const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const { checkAuthenticated } = require('../check-authentication');

router.use(bodyParser.json());

const notifications = new Map();

// Notification Route
router.post('/', checkAuthenticated, function(req, res, next) {
    let notificationsForUser = notifications.get(req.body.username);
    if (notificationsForUser === undefined) {
        notificationsForUser = [];
        notifications.set(req.body.username, notificationsForUser);
    }
    notificationsForUser.push({
        username: req.user.username,
        message: req.body.message,
    });
    res.json({});
});

router.get('/', checkAuthenticated, function(req, res, next) {
    let notificationsForUser = notifications.get(req.user.username);
    if (notificationsForUser === undefined) {
        notificationsForUser = [];
    }
    notifications.set(req.user.username, []);
    res.json(notificationsForUser);
});

module.exports = router
