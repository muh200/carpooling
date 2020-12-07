const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const bodyParser = require('body-parser');

const PUBLIC_VAPID_KEY = 'BNJfp6xJTI7TqAy142SFQ0_yaaSemAvZiRmDttx_To_WqgnU70fIOQl6dmMq7wmjkwtS1NcZE9sHquYlQXEpdCY';
const PRIVATE_VAPID_KEY = 'xucunEx660ChX4Y3wb6WZ6LOKmQCNUwXLEfhT-B4png';
const GOOGLE_API_KEY = 'AIzaSyCnOmZ-ZOHrAGWUgWZBceOKUEshwxrQOzA';

webpush.setGCMAPIKey(GOOGLE_API_KEY);
webpush.setVapidDetails(
    'mailto:garsonchow@gmail.com',
    PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
);

router.use(bodyParser.JSON());

// Notification Route
router.post('/subscribe', (req, res, next) => {
    // Get pushNotification object
    subscription = req.body
    console.log(subscription)
    // Send 201 - resource created
    res.sendStatus(201)
    
    // Create payload
    const payload = JSON.stringify( { title: 'Push Test'} );

    // Pass object into sendNotification
    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
});

// Check to see if we can use service worker in current browser
if('serviceWorker' in navigator) {
    send().catch(err => console.error(err));
}








module.exports = router