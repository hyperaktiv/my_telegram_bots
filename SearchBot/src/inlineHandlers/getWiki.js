const axios = require('../node_modules/axios');

module.exports = (bot) => {

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

        if (allTitles == undefined) {
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
}