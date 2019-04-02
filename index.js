const dotenv = require('dotenv');
const request = require('request');
const express = require('express')
dotenv.config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const eventId = process.env.EVENTID;
const hourBook = process.env.HOUR_BOOK;

const loginUrl = "https://bde.polytechmontpellier.fr/Home/verifLogin";
const eventUrl = "https://bde.polytechmontpellier.fr/Event/bookEvent/" + eventId;

const timeBeforeBooking= 1000*60*5; //5min before
const timeAfterBooking= 1000*60*5; //5min after

let targetDate = new Date();
targetDate.setUTCHours(hourBook - 2); // -2 because UTC
targetDate.setUTCMinutes(0);
const targetTime = targetDate.getTime();
var now = new Date();

const app = express()

app.listen(3000, function () {
    console.log('Running');
    if(targetTime - now.getTime() - timeBeforeBooking >= 0){
        setTimeout(login, targetTime - now.getTime() - timeBeforeBooking);
    }
    else if(targetTime - now.getTime() > 0){
        login();
    }
})

if(targetTime - now.getTime() - timeBeforeBooking >= 0){
    setTimeout(login, targetTime - now.getTime() - timeBeforeBooking);
}

function login(){
    now = new Date();
    nowTime = now.getTime();

    if(targetTime - timeBeforeBooking < nowTime && nowTime < targetTime + timeAfterBooking ){
        request.post(loginUrl,{}, (error, res, body) => {
        if (error) {
            console.error(error)
            return
        }
        if(body){
            console.error("Wrong Credentials!");
            return;
        }
        book(res.headers['set-cookie'].join(';'));
        
        }).form({
            email: email, 
            password: password
        })
    }
}
  
function book(cookies){
    request.get(eventUrl,{
        headers: {
            'cookie': cookies
        }
    }, (error, res, body) => {
    if (error) {
        console.error(error)
        return
    }
    console.log(body)
    });
    now = new Date();
    nowTime = now.getTime();
    if(targetTime + timeAfterBooking > nowTime){
        setTimeout(() => book(cookies), 200);
    }
}
  