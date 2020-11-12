const express = require('express');
const { checkAuthenticated } = require('./check-authentication');

function userLocator(datastore, maxNumberMatches) {
    const router = express.Router();

    router.use(checkAuthenticated);

    router.post('/', function(req, res, next) {
        datastore.set(req.user.username, {
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            timestamp: Date.now(),
        });
        res.json({});
    });

    router.get('/', function(req, res, next) {
        const result = [];
        const currLocation = {
            longitude: req.query.longitude,
            latitude: req.query.latitude,
        };
        const distanceToCurr = location => distance(currLocation, location);
        for (const [username, location] of datastore.entries()) {
            const currDistance = distanceToCurr(location);
            if (result.length < maxNumberMatches ||
                currDistance < distanceToCurr(result[result.length - 1].location)) {
                let i = 0;
                for (; i < result.length; ++i) {
                    if (distanceToCurr(result[i].location) > currDistance) {
                        break;
                    }
                }
                result.splice(i, 0, { username, location });
                if (result.length > maxNumberMatches) result.pop();
            }
        }
        res.json(result);
    });

    router.delete('/', function(req, res, next) {
        datastore.delete(req.user.username);
        res.json({});
    });

    return router;
}

function distance(location1, location2) {
    const xDiff = Math.abs(location1.longitude - location2.longitude);
    const yDiff = Math.abs(location1.latitude - location2.latitude);
    return Math.sqrt(xDiff**2 + yDiff**2);
}

module.exports = userLocator;
