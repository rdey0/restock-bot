const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const DomParser = require('dom-parser');
const Product = require('./product');
const domains = require('../enums/domains');
const logo = require('../assets/logo');

class RestockBot {
    isNewegg = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]newegg+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
    isBestbuy = new RegExp('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]bestbuy+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$');
    
    static async load(urls, verbose, email, password) {
        const bot = new RestockBot(urls, verbose, email, password);
        await bot.startup();
        return bot;
    }

    constructor(urls, verbose, email, password){
        this.verboseMode = verbose;
        this.urls = urls;
        this.email = email;
        this.password = password;
        this.products = {};
    }

    async startup() {
        console.log(logo);
        this.browser = await puppeteer.launch();
        if(this.verboseMode)
            console.log('Loading product pages to scrape...\n')
        await Promise.allSettled(this.urls.map(url => this.addPage(url)));
        console.log('Restock-Bot is up and running\n');
    }

    async addPage(url) {
        if(this.isValidUrl(url)){
            var page = await this.browser.newPage();
            await page.goto(url);
            var html = await page.evaluate(() => document.body.innerHTML);
            const parser = new DomParser();
            var document = parser.parseFromString(html);
            if(this.isNewegg.test(url))
                this.products[url] = new Product(this.neweggGetName(document), url, page, domains.NEWEGG);
            else if(this.isBestbuy.test(url))
                this.products[url] = new Product(this.bestbuyGetName(document), url, page, domains.BESTBUY);
        }
    }

    async checkRestock() {
        if(this.verboseMode)
            console.log('Checking status of products...\n'); 
        var productStatuses = await Promise.allSettled(Object.entries(this.products).map(([url, product]) => this.getUpdates(product)));

        var restockedProducts = [];
        for(let res of productStatuses){
            if(res.status == 'fulfilled' && res.value)
                restockedProducts.push(this.products[res.value]);
        }

        if(restockedProducts.length > 0)
            await this.sendNotification(restockedProducts);
        else if(this.verboseMode)
            console.log('Nothing to report\n');
        
        if(this.verboseMode)
            console.log('Waiting... \n');
    }

    async getUpdates(product) {
        var page = product.page;
        await page.reload();
        var html = await page.evaluate(() => document.body.innerHTML);
        const parser = new DomParser();
        var document = parser.parseFromString(html);

        switch(product.domain){
            case domains.NEWEGG:
                product.name = this.neweggGetName(document);
                if(this.neweggProductRestocked(product, document))
                    return product.url;
                break;
            case domains.BESTBUY:
                product.name = this.bestbuyGetName(document);
                if(this.bestbuyProductRestocked(product, document))
                    return product.url;
                break;
            default:
                break;
        }

        return '';
    }

    async sendNotification(products) {
        var htmlContent = '<div>The following products are now in stock!</div><br/>';
        for(let product of products) 
            htmlContent += `<div><a href=\"${product.url}\">${product.name}</a></div><br/>`;        
        htmlContent += '<div>- Restock Bot</div>';

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.email,
                pass: this.password
            }
        });

        await transporter.sendMail({
            from:`"Restock Bot" <${this.email}>`,
            to: this.email,
            subject: 'Products have been restocked!',
            html: htmlContent
        });

        if(this.verboseMode)
            console.log(`Restock detected! Product links sent to ${this.email}\n`);
    }

    neweggProductRestocked(product, document) {
        const stockStatusNodes = document.getElementsByClassName('product-flag');
        const prevInStock = product.inStock;
        if(stockStatusNodes.length > 0){
            const stockStatus = stockStatusNodes[0].textContent.trim().toLowerCase();
            const isInStock = (stockStatus != 'out of stock');
            product.inStock = isInStock;
            // Only classify a product as restocked if it is now in stock and wasn't in stock before
            return (isInStock && !prevInStock);
        }else{
            // Assume that if the page has no product flag, then the item is in stock
            product.inStock = true;
            // Classify a product as restocked if it wasn't in stock before
            return (!prevInStock);
        }
    }

    neweggGetName(document) {
        const elements = document.getElementsByClassName('product-title');
        if(elements.length > 0) 
            return elements[0].textContent;
        return '';
    }

    bestbuyProductRestocked(product, document) {
        //TODO
        return false;
    }

    bestbuyGetName(document) {
        const elements = document.getElementsByClassName('sku-title');
        if(elements.length > 0){
            console.log(elements[0].textContent);
            return elements[0].textContent;
        } 
        return '';
    }

    isValidUrl(url) {
        return this.isNewegg.test(url);
    }
}
module.exports = RestockBot;