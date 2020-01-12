
module.exports = (bot) => {

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
                            { text: 'Search Pixabay Image', switch_inline_query_current_chat: 'p ' }
                        ],
                        [
                            { text: 'Search Wikipedia', switch_inline_query_current_chat: 'w ' }
                        ]
                    ]
                },
                parse_mode: 'Markdown'
            }
        ];

        ctx.answerInlineQuery(results);
    })
    
}