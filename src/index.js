const puppeteer = require('puppeteer');
const config_data = require('../config');
const restockBot = require('./classes/restockBot')
const RestockBot = restockBot.bot;
const bot = RestockBot.init(config_data.urls);