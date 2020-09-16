
const express = require('express');
const request = require('request');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
//const { request } = require('http');

const app = express();


//Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));



//Serve static production
if(process.env.NODE_ENV === 'production') {
    //Static folder
    app.use(express.static('public'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    })
}




app.post('/subscribe', (req, res) => {
    const { email, js } = req.body;
    
    const mcData = {
        members: [
            {
                email_address: email,
                status: 'subscribed'
            }
        ]
    }

    const mcDataPost = JSON.stringify(mcData);

    const options = {
        url: 'https://us2.api.mailchimp.com/3.0/lists/455380b8af',
        method: 'POST',
        headers: {
            Authorization: 'auth c29f6cb880efb478c0f94fde108acd0b-us2'
        },
        body: mcDataPost 
    }

    if(email) {
        request(options, (err, response, body) => {
            if(err) {
                res.json({error: err})
            } else {
                if (js) {
                    res.sendStatus(200);
                } else {
                    res.redirect('/success.html')
                }
            }
        })
    } else {
        res.status(404).send({message: 'Failed'})
    }
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('server started!'))