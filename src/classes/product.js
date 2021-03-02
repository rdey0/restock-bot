class Product {
    constructor(name, url, page, domain, inStock = false) {
        this.name = (name) ? name : url;
        this.url = url;
        this.page = page;
        this.domain = domain;
        this.inStock = inStock;
    }
}

module.exports = Product;