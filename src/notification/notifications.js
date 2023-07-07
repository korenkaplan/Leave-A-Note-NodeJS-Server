import express, { Application } from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/sendToAll', (req, res) => {
    var notification = {
        title: 'title of notification',
        text: 'text of notification',
    };
    var fcm_tokens = [];

    var notification_body = {
        notification,
        registration_ids: fcm_tokens,
    };

    fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
            Authorization:
                'key=' +
                'AAAABr0C-_o:APA91bGD9iTFBHRTELBCmyWFgqhHG0C_ZCr7zbsVuWF3p1pf_yk6CPM7kBRi-1oo7GuD9qrq4zC9VriY96oTSjoyuI391-Pcq6_xkY3oSQYbciRVIlEgduDf6oEfRjPySfA61cuskvdu',
                'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification_body),
    }).then(()=>{
        res.status(200).send('Notification sent successfully')
    }).catch(err=>{
        res.status(500).send('Error: ' + err.message)
        console.error(err.message);
    })
});

module.exports = router;