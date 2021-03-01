const puppeteer = require('puppeteer');
const configData = require('../config');
const RestockBot = require('./classes/restockBot')


RestockBot.init(configData.urls)
    .then(bot => {
        setInterval(async() => {
            let restockedProducts = await bot.checkStock();
            console.log(restockedProducts);
        }, configData.interval * 1000)
    })
