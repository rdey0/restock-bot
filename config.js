const configData = {
    /* Email to be notified. Currently only works with gmail accounts */
    "email": "example@gmail.com",
    /* Password to your email*/
    "password": "password",
    /* Add product URLs you want the bot to keep track of here. Only Newegg supported. */
    "urls": [
        "https://www.example.com/product"
    ],
    /* Set the amount of time in seconds the bot waits before rechecking the stock status*/
    "interval": 30,
    /* Status updates will be logged to the console if true, nothing will be logged otherwise*/
    'verbose': true
}
module.exports = configData;

