const puppeteer = require('puppeteer');
const $ = require('cheerio');
const DomParser = require('dom-parser');
const domains = require('../enums/domains');

class RestockBot {
    isNewegg = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]newegg+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
    
    static async init(urls) {
        const bot = new RestockBot(urls);
        await bot.startup();
        return bot;
    }

    constructor(urls){
        this.urls = urls;
        this.products = {};
        this.inStock = {};
    }

    async startup() {
        this.browser = await puppeteer.launch();
        await Promise.allSettled(this.urls.map(url => this.addPage(url)));
        // console.log(this.products);
    }

    async addPage(url) {
        if(this.isValidUrl(url)){
            var page = await this.browser.newPage();
            await page.goto(url);
            this.inStock[url] = false;

            if(this.isNewegg.test(url))
                this.products[url] = {
                    'url': url,
                    'page': page,
                    'domain': domains.NEWEGG,
                    'inStock': false
                };
            
            return true;
        }
        return false;
    }

    async checkStock() {
        var productStatuses = await Promise.allSettled(Object.entries(this.products).map(([url, product]) => this.getUpdates(product)));
        var restockedProducts = [];
        for(let res of productStatuses){
            if(res.status == 'fulfilled' && res.value)
                restockedProducts.push(res.value);
        }
        console.log(restockedProducts);
        return restockedProducts;
    }

    async getUpdates(product) {
        var page = product.page;
        await page.reload();
        let html = await page.evaluate(() => document.body.innerHTML);
        const parser = new DomParser();
        var document = parser.parseFromString(html);

        switch(product.domain){
            case domains.NEWEGG:
                if(this.neweggProductRestocked(product, document))
                    return product.url;
                break;
            case domains.BESTBUY:
                if(this.bestbuyProductRestocked(product, document))
                    return product.url;
                break;
            default:
                return false;
        }
        
    }

    neweggProductRestocked(product, document) {
        const stockStatusNodes = document.getElementsByClassName('product-flag');
        if(stockStatusNodes.length > 0){
            const stockStatus = stockStatusNodes[0].textContent.trim().toLowerCase();
            const isInStock = (stockStatus != 'out of stock');
            const prevInStock = product.inStock;
            product.inStock = isInStock;
            // Only classify a product as restocked if it was not in stock before and is now in stock
            return (isInStock && !prevInStock)
        }
        return false;
    }

    bestbuyProductRestocked(product, document) {
        //TODO
        return false;
    }

    isValidUrl(url) {
        return this.isNewegg.test(url);
    }
    //document.querySelector('div[class="product-flag"]').innerText
}
module.exports = {bot: RestockBot};