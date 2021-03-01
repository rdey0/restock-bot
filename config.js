const configData = {
    /* Email to be notified */
    "email": "example@gmail.com",
    /* Password to your email*/
    "password": 'password',
    /* Add product URLs you want the bot to keep track of here. Only Newegg supported. */
    "urls": [
        "https://www.newegg.com/gigabyte-geforce-rtx-3070-gv-n3070aorus-m-8gd/p/N82E16814932359?Description=3070%20aorus&cm_re=3070_aorus-_-14-932-359-_-Product&quicklink=true",
        "https://www.newegg.com/g-skill-64gb-288-pin-ddr4-sdram/p/N82E16820232990?Description=ram&cm_re=ram-_-20-232-990-_-Product"
    ],
    /* Set the amount of time in seconds the bot waits before rechecking the stock status*/
    "interval": 5,
    /* Status updates will be logged to the console if true, nothing will be logged otherwise*/
    'verbose': true
}
module.exports = config_data;