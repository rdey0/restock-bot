const puppeteer = require('puppeteer');
const domains = require('../enums/domains');
class RestockBot {
    isNewegg = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]newegg+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
    
    static async init(urls) {
        const bot = new RestockBot(urls);
        await bot.startup();
    }

    constructor(urls){
        this.urls = urls;
        this.pages = [];
        this.inStock = {};
    }

    async startup() {
        this.browser = await puppeteer.launch();
        await Promise.allSettled(this.urls.map(url => this.addPage(url)));
        console.log(this.pages);
    }

    async addPage(url) {
        if(this.isValidUrl(url)){
            var page = await this.browser.newPage();
            await page.goto(url);
            this.inStock[url] = false;

            if(this.isNewegg.test(url))
                this.pages.push({
                    'page': page,
                    'domain': domains.NEWEGG
                });
            
            return true;
        }
        return false;
    }

    async checkStock() {
        
    }

    isValidUrl(url) {
        return this.isNewegg.test(url);
    }
}
module.exports = {bot: RestockBot};