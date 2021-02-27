const puppeteer = require('./src/node_modules/puppeteer');
const config_data = require('./config');
const restockBot = require('./src/restockBot')
const RestockBot = restockBot.bot;
console.log(config_data.urls);
const bot = new RestockBot(config_data.urls);