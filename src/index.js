const puppeteer = require('puppeteer');
const configData = require('../config');
const RestockBot = require('./classes/restockBot')

RestockBot.load(configData.urls, configData.verbose, configData.email, configData.password)
    .then(bot => {
        bot.checkRestock();
        setInterval(async() => {
            bot.checkRestock();
        }, configData.interval * 1000)
    })
