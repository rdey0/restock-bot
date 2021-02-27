const puppeteer = require('../src/node_modules/puppeteer');

class RestockBot {
    async constructor(urls){
        this.browser = await puppeteer.launch();
        this.urls = urls;
        this.pages = {
            newegg: []
        };
    }

    async open_pages() {
        return;
    }
}
module.exports = {bot: RestockBot};