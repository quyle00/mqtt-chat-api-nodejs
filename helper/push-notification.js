const firebaseAdmin = require('firebase-admin');
const Constants = require('../constants');
let _ = require('lodash');
const FBMessagingErrors = [
    'The registration token is not a valid FCM registration token',
    'NotRegistered',
    'BadDeviceToken',
    'Unregistered'
];
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

firebaseAdmin.initializeApp({
    projectId: Constants.SERVICE_ACCOUNT.project_id,
    credential: firebaseAdmin.credential.cert(Constants.SERVICE_ACCOUNT),
    databaseURL: Constants.FIREBASE_CONFIG.DATABASE_URL,
    serviceAccountId: Constants.FIREBASE_CONFIG.SERVICE_ACCOUNT_ID
});

module.exports = {
    sendPushNotification
}

function sendPushNotification(payload) {
    if (typeof payload['notification'] == "undefined") {
        return;
    }
    let iosNotification = Object.assign({}, payload.notification);
    let androidNotification = Object.assign({}, payload.notification);
    for (let key in androidNotification) {
        androidNotification[key] = androidNotification[key].toString();
        key = key.toString();

    }
    androidNotification['sound'] = typeof payload.sound == "undefined" ? 'default' : payload.sound;
    /*
    * Set click action for flutter Android
    */
    androidNotification['click_action'] = 'FLUTTER_NOTIFICATION_CLICK';
    if (typeof iosNotification.click_action != "undefined") {
        delete iosNotification.click_action;
    }

    if (typeof payload.notification.title != "undefined") {
        payload.notification.title = entities.decode(payload.notification.title).replace(/(<([^>]+)>)/ig, "");
    }

    if (typeof payload.notification.body != "undefined") {
        payload.notification.body = entities.decode(payload.notification.body).replace(/(<([^>]+)>)/ig, "");
    }
    if (typeof payload.data != "undefined") {
        for (let key in payload.data) {
            payload.data[key] = payload.data[key].toString();
            key = key.toString();


        }
        androidNotification = _.merge(androidNotification, payload.data);
    }

    const message = {
        android: {
            ttl: 3600 * 1000,
            data: androidNotification,
        },
        apns: {
            payload: {
                aps: {
                    badge: typeof payload.badge == "undefined" ? 2 : payload.badge,
                    sound: typeof payload.sound == "undefined" ? 'default' : payload.sound.toLowerCase(),
                    alert: {
                        title: iosNotification.title,
                        body: iosNotification.body,
                    },
                },
                data: typeof payload.data != "undefined" ? payload.data : {},
            },
        },
        webpush: {
            notification: payload.notification
        },
        tokens: _.isString(payload.deviceToken) ? [payload.deviceToken] : payload.deviceToken
    };

    if (typeof payload.contentAvailable != 'undefined') {
        message.apns.payload.aps.contentAvailable = payload.contentAvailable;
    }

    if (typeof payload.mutableContent != 'undefined') {
        message.apns.payload.aps.mutableContent = payload.mutableContent;
    }

    send(message);
}

function send(message) {
    /*
    * Noted : Should maximum 100 token for each push
    */
    return firebaseAdmin.messaging().sendMulticast(message)
        .then((response) => {
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(message.tokens[idx]);
                    }
                });
                deregisterToken(FBMessagingErrors[0], failedTokens);
            }
            return true;
        })
        .catch((error) => {
            deregisterToken(error.message, message.token)
            return false;
        });
}

function deregisterToken(error, deviceToken) {
    if (FBMessagingErrors.includes(error)) {
        console.log(`====== Error push notifications: ${error} with ${deviceToken.length} token failed =======`);
    }
}
