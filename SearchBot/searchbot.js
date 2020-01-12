/**
 * @Desc    bot with searching and showing the images with finding info
 * @Author  D_nam
 * @Date    8/1/2020
 */
const Telegraf = require('../node_modules/telegraf');

const bot = new Telegraf('1060078511:AAGvPLStGjvkvnHzzE_7AVpId7d9QGR6jgg');

const axios = require('../node_modules/axios');

bot.command(['start', 'help'], ctx => {
    let message = `
*Searching infomation* (image, info, url ...) *bot:*
   \`@image_piwi_bot p <text>\`    - searching for image with category on pixabay
   \`@image_piwi_bot w <text>\`    - searching for info/page on wikipedia
    `;
    ctx.reply(message,
        {
            reply_markup:{
                inline_keyboard: [
                    [
                        { text: 'Search Pixabay Image', switch_inline_query_current_chat: 'p '}
                    ],
                    [
                        { text: 'Search Wikipedia', switch_inline_query_current_chat: 'w '}
                    ]
                ]
            },
            parse_mode: 'Markdown'
        }    
    )
})

// @search_piwi_bot start/help  - dislay the use of this command
//https://core.telegram.org/bots/api#inlinequeryresultarticle
bot.inlineQuery(['start', 'help'], ctx => {

    let message = `
*Searching infomation* (image, info, url ...) *bot:*
   \`@image_piwi_bot p <text>\`    - searching for image with category on pixabay
   \`@image_piwi_bot w <text>\`    - searching for info/page on wikipedia
    `;

    let results = [
        {
            type: 'article',
            id: '1',
            title: 'Help Reference',
            input_message_content: {
                message_text: message
            },
            description: 'Sends help message on how to use the bot',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Search Pixabay Image', switch_inline_query_current_chat: 'p '}
                    ],
                    [
                        { text: 'Search Wikipedia', switch_inline_query_current_chat: 'w '}
                    ]
                ]
            },
            parse_mode: 'Markdown'
        }
    ];

    ctx.answerInlineQuery(results);
})

// https://core.telegram.org/bots/inline  or /api#answerInlineQuery
// pixabay API: https://pixabay.com/api/?key=<apikey>&q=<search>
const pixabay_apkey = '12002908-7086de2dfa63db323f875a879';

// get query with Regex: @... p <sth>   
// ex: @.. p iphone X
bot.inlineQuery(/p\s.+/, async ctx => {

    let input = ctx.inlineQuery.query.split(' ');   //["p", "iphone", "X"]
    input.shift();  // ["inphone", "X"
    let query = input.join(' '); // inphone X

    let res = await axios.get(`https://pixabay.com/api/?key=${pixabay_apkey}&q=${query}`);
    let data = res.data.hits;

    let results = data.map((item, index) => {
        let name = item.tags.split(',')[0];
        return {
            type: 'photo',
            id: String(index),
            photo_url: item.webformatURL,
            thumb_url: item.previewURL,
            photo_width: 300,
            photo_height: 200,
            caption: `[Source](${item.webformatURL})\n[Large Image](${item.largeImageURL})`,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `Share ${query} \n#${name}`, switch_inline_query: `${name}` }
                    ]
                ]
            }
        }
    })

    ctx.answerInlineQuery(results);
})


//========== ON NOT WORKING NOW=========
// https://core.telegram.org/bots/api#inlinequeryresultarticle
// wiki API: https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=<query>&limit=50

// get query with Regex: @... w <sth>   
// ex: @.. w iphone X
bot.inlineQuery(/w\s.+/, async ctx => {
    let input = ctx.inlineQuery.query.split(' ');   //["w", "iphone", "X"]
    input.shift();  // ["inphone", "X"]
    let query = input.join(' '); // inphone X

    let res = await axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${query}&limit=50`);
    let data = res.data;
    let allTitles = data[1];
    let allLinks = data[3];

    if(allTitles == undefined) {
        return;
    }

    let results = allTitles.map((item, index) => {
        return {
            type: 'article',
            id: String(index),
            title: item,
            input_message_content: {
                message_text: `${item}\n${allLinks[index]}`
            },
            description: allLinks[index],
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: `Share ${item}`, switch_inline_query: `${item}` }
                    ]
                ]
            }
        }
    })
    ctx.answerInlineQuery(results);
})


bot.launch();