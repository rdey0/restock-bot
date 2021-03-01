# Restock-Bot

## Description

A simple bot which will notify you via email when online products are back in stock. Currently only Newegg is supported.

## How to Use

1. Modify `/config.js`
    - Set the `'email'` field to your gmail address
    - Set the `'password'` field to the password of your gmail account
    - Add the product URLs of the products you want the bot to keep track of to the `'urls'` field
    - The `'interval'` field determines how long the bot will wait (in seconds) before rechecking the status of your products
    - Set `'verbose'` to `true` if you want status updates to be logged to the terminal, `false` to disable status updates
2. Run `npm install`
3. Run `npm start`

#### Note: You may need to enable less secure apps on your google account to use this bot