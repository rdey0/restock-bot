# Restock-Bot

<div width='100%'>
    <pre  align='center' color='rgb(206,121,87)' >
________            _____            ______        ________      _____ 
___  __ \_____________  /_______________  /__      ___  __ )_______  /_
__  /_/ /  _ \_  ___/  __/  __ \  ___/_  //_/________  __  |  __ \  __/
_  _, _//  __/(__  )/ /_ / /_/ / /__ _  ,<  _/_____/  /_/ // /_/ / /_  
/_/ |_| \___//____/ \__/ \____/\___/ /_/|_|        /_____/ \____/\__/ 
    </pre>
</div>

# 

## Description

A simple bot which will notify you via email when online products are back in stock. Currently only Newegg is supported.

## How to Use

1. Modify `/config.js`
    - Set the `'email'` field to your gmail address
    - Set the `'password'` field to the password of your gmail account. I recommend making a <a href='https://support.google.com/accounts/answer/185833'>secure app password</a>. From the 'Select app' menu, choose 'Mail', and from the 'Select device' menu, choose your device.
    - Add the URLs of the products you want the bot to keep track of to the `'urls'` field
    - The `'interval'` field determines how long the bot will wait (in seconds) before rechecking the status of your products
    - Set `'verbose'` to `true` if you want status updates to be logged to the terminal, `false` to disable status updates
2. Run `npm install`
3. Run `npm start`

#### Note: If you did not provide a secure app password, you may need to enable less secure apps on your google account to use this bot