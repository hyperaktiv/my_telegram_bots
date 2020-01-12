
module.exports = (bot) => {

    // handler for /start, /help command
    bot.command(['start', 'help'], ctx => {
        let message = `
*Searching infomation* (image, info, url ...) *bot:*
   \`@image_piwi_bot p <text>\`    - searching for image with category on pixabay
   \`@image_piwi_bot w <text>\`    - searching for info/page on wikipedia
    `;
        ctx.reply(message,
            {
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
        )
    })
}
