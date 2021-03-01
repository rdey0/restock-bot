const puppeteer = require('puppeteer');
const config_data = require('../config');
const restockBot = require('./classes/restockBot')
const RestockBot = restockBot.bot;
(async () =>{
    const bot = await RestockBot.init(config_data.urls);
    bot.checkStock();
})();

// RestockBot.init(config_data.urls)
//     .then(bot=>{
//         setInterval(bot.checkStock)
//     })
