const axios = require('../node_modules/axios');
const pixabay_apkey = process.env.PIXABAYAPI;

module.exports = (bot) => {

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
}

