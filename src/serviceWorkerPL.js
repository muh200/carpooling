// Service worker for push event listener
// Service worker shows the

console.log('Sevice Worker for Push Event Loaded')

self.addEventListener('push', event => {
    const data = event.data.json()
    console.log('Push Received... ')

    self.registration.showNotification(data.title, {
        body: 'Notified by Pool',
        icon: "../../assets/logo.png"
    });

});