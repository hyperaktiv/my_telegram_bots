const Telegraf = require('../node_modules/telegraf');

const bot = new Telegraf('930097781:AAHYjogDTjXsjF5eXdZsZS9aiYZ6t8b1h-I');

const axios = require('../node_modules/axios');

//https://core.telegram.org/bots/api#inlinekeyboardmarkup

//============= INLINE KEYBOARD

bot.command('test', ctx => {

    bot.telegram.sendMessage(ctx.chat.id, 'Select your choice:',
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "See Fruits List", callback_data: "fruits" }
                    ],
                    [
                        { text: "See Meats List", callback_data: "meats" }
                    ]
                ],
            }
        }
    )
})
bot.action('fruits', ctx => {
    // create an alert on the screen
    ctx.answerCbQuery('You\'ve click to Fruits List');
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'List fruits:\n-Apple\n-Kiwi\n-Oranges\n-Pears',
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Back to menu", callback_data: "menu" }
                    ]
                ],
            }
        }
    )
})
bot.action('meats', ctx => {
    // create an alert on the screen
    ctx.answerCbQuery('You\'ve click to Meats List');
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'List fruits:\n-Cows\n-Cat\n-Pigs\n-Fish',
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Back to menu", callback_data: "menu" }
                    ]
                ],
            }
        }
    )
})
bot.action('menu', ctx => {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'Main menu:',
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "See Fruits List", callback_data: "fruits" }
                    ],
                    [
                        { text: "See Meats List", callback_data: "meats" }
                    ]
                ],
            }
        }
    )

})

// get cryptocoin prices
const apikey = '9cbe3f13461250a293604ac94227be535b8a88d7f9341a15b74d3455e07e5341';

bot.command(['crypto', 'coin', 'start'], ctx => {
    //ctx.answerCbQuery('');
    sendStartMessage(ctx);
})

bot.action('price', ctx => {
    let priceMessage = `Get Price Infomation. Select one of these cryptocurrencies below:`;
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, priceMessage,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "BTC - bitcoin", callback_data: "price-BTC" },
                        { text: "ETH - etherium", callback_data: "price-ETH" }
                    ],
                    [
                        { text: "BNB - binance coin", callback_data: "price-BNB" },
                        { text: "BCH - bitcoin cash", callback_data: "price-BCH" }
                    ],
                    [
                        { text: "Back to menu", callback_data: "start" }
                    ]
                ]
            }
        }
    )
})
bot.action('start', ctx => {
    ctx.deleteMessage();
    sendStartMessage(ctx);
})
// when choosing a inline markup
let priceActionList = ["price-BTC", "price-ETH", "price-BNB", "price-BCH"];
bot.action(priceActionList, async ctx => {
    //console.log(ctx.match);
    let symbol = ctx.match.split('-')[1];

    try {
        let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apikey}`);
        let data = res.data.DISPLAY[symbol].USD;

        let message = `
            SYMBOL: ${symbol}
            PRICE: ${data.PRICE}
            Open24h: ${data.OPEN24HOUR}
            High24h: ${data.HIGH24HOUR}
            Low24h: ${data.LOW24HOUR}
        `;  // Supply: ${data.SUPPLY}   Market Cap: ${data.MKTCAP}

        ctx.deleteMessage();
        bot.telegram.sendMessage(ctx.chat.id, message,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: 'Back to prices', callback_data: 'price' }
                        ]
                    ]
                }
            }
        )

    } catch (err) {
        console.log(err);
        ctx.reply('Error Encountered');
    }
})

////////// function
    function sendStartMessage(ctx) {

        let startMessage = `Welcome, this command gives you the cyptocurrency infomation/prices`;
        bot.telegram.sendMessage(ctx.chat.id, startMessage,
            {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "Crypto Prices", callback_data: "price" }
                        ],
                        [
                            { text: "CoinMarketCap", url: "https://coinmarketcap.com" }
                        ],
                        [
                            { text: "Bot Info", callback_data: "info" }
                        ]
                    ]
                }
            }
        )
    }


//==================REPLY KEYBOARD

bot.action('info', ctx => {
    ctx.answerCbQuery();

    bot.telegram.sendMessage(ctx.chat.id, "Bot Info",
        {
            reply_markup: {
                keyboard: [
                    [
                        { text: "CoinMarketCap" },
                    ],
                    [
                        { text: "TradingView" }
                    ],
                    [
                        { text: "Bittrex" }
                    ],
                    [
                        { text: "Remove Keyboard" }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        }
    )
})

bot.hears('CoinMarketCap', ctx => {
    ctx.reply("https://coinmarketcap.com");
})
bot.hears('TradingView', ctx => {
    ctx.reply("https://tradingview.com");
})
bot.hears('Bittrex', ctx => {
    ctx.reply("https://bittrex.com");
})
bot.hears('Remove Keyboard', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Remove Keyboard", {
      reply_markup: {
          remove_keyboard: true
      }  
    })
})





bot.launch();