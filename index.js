/**
 * @author: D_Nam
 * @desc:   auto send newsfeed or new status of some or one page in social app: fb, instagram, ...
 * @step: + create bot, channel
 *        + go to convert page to rss:  https://fetchrss.com/ 
 *        + go to set-up on:            zapier.com (app on zapier/code in zaplier/add code/test)
 *        + add code to zapier
 */


// const Telegraf = require('telegraf');
// const bot = new Telegraf('1004405610:AAF5y3YMQK1H-YkYWfhM6yHQUzPvIpu8W_E');

// bot.use(ctx => {
//     console.log(ctx.chat);
// })

// bot.launch();


let message = `
<a href="${inputData.link}">Link</a>
Description:
${inputData.description}
`;

let token = '1004405610:AAF5y3YMQK1H-YkYWfhM6yHQUzPvIpu8W_E';
let data = {
    chat_id: '-1001318827389',
    text: message,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {text: "Go to Post", url: inputData.link}
        ]
      ]
    }
};

    (async () => {

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`,
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
    })();
