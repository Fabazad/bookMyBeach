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
targetDate.setUTCMinutes(53);
const targetTime = targetDate.getTime();
var now = new Date();

main();

async function main(){
    console.log("Running...  Polytech c'est super gay! Pissenliste, la vraie <3");
    if(targetTime < now.getTime()){
        console.error("Too late!");
        return;
    }
    if(targetTime - timeBeforeBooking > now.getTime()){
        console.log("Waiting for " + (targetDate.getUTCHours()+1) + ":55...");
        await wait(targetTime - now.getTime() - timeBeforeBooking);
    }
    console.log("Logging...");
    const cookies = await login();
    if(!cookies){
        console.error("Wrong Credentials!");
        return;
    }
    console.log("Logged!")
    var booked = false;
    console.log("Booking...");
    while(nowTime < targetTime + timeAfterBooking && !booked){
        booked = await book(cookies);
    }
    if(booked){
        console.log("Booked! Polytech c'est super gay! Pissenliste, la vraie <3");
    }
    else{
        console.log("I worked for nothing!");
    }
}


function login(){
    return new Promise(resolve => {
        now = new Date();
        nowTime = now.getTime();

        request.post(loginUrl,{}, (error, res, body) => {
        if (error) {
            console.error(error)
            return resolve();
        }
        if(body){
            return resolve();
        }
        return resolve(res.headers['set-cookie'].join(';'));
        
        }).form({
            email: email, 
            password: password
        });
    })
}
  
function book(cookies){
    return new Promise(resolve => {
        request.get(eventUrl,{
            headers: {
                'cookie': cookies
            }
        }, (error, res, body) => {
            if (error) {
                console.error(error)
                return
            }
            if(body){ 
                resolve(false);
            }
            resolve(true);
        });
        now = new Date();
        nowTime = now.getTime();
    });
}

function wait(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, x);
    });
  }
  