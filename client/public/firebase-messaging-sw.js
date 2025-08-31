importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCTfM_bCraWc6X-fTibQ9cksX-wmH0n6hY",
  authDomain: "push-notifications-c79a1.firebaseapp.com",
  projectId: "push-notifications-c79a1",
  storageBucket: "push-notifications-c79a1.firebasestorage.app",
  messagingSenderId: "658165224243",
  appId: "1:658165224243:web:c31d706ac165cf8ec26446",
  measurementId: "G-HT1V6JMKSK",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  if (document.visibilityState === "hidden") {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image,
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});
