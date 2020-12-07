// We want the public key
const PUBLIC_VAPID_KEY = 'BNJfp6xJTI7TqAy142SFQ0_yaaSemAvZiRmDttx_To_WqgnU70fIOQl6dmMq7wmjkwtS1NcZE9sHquYlQXEpdCY';

// convert URL to IntArray
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

// Check for service worker
if('serviceWorker' in navigator) {
    send().catch(err => console.error(err));
}

// Register Service, Register Push, Send Push
async function send() {
    // Register Service Worker
    const register = await navigator.serviceWorker.register("/serviceWorkerPL.js", {
      scope: "/components/homepage/homepage"
    });
  
    // Register Push
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });
  
    // Send Push Notification
    await fetch("/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "content-type": "application/json"
      }
    });
  }