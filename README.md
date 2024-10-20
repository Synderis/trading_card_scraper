Bulk tool for scraping trading card prices. Allows for csv import and export.
Currently supports Pokemon, Magic and Yugioh cards and most of the types of cards from each brand/format.
<img src="https://imgur.com/QtGo6gg.png">
The CSV import tool will attempt to fix data when it is empty such as changing null values in Card Count to 1 by default. Otherwise errors will be marked in red.
<img src="https://imgur.com/oPc5fSi.png">
If the error is in Card Count the red marking will be removed when fixed otherwise it will remain since the other fields have other error handling that should prevent most bad data.
<img src="https://imgur.com/BR0T7jg.png">
It will still let you submit with errors but depending on the error the data you get may be for a different card or the total price calculation will be incorrect.
The view that you see is what will be submitted.
<img src="https://imgur.com/8a41Lbt.png">
The table will provide price data and totals adjusted for card count along with its page link. This data can be exported to CSV in the same format as the table.