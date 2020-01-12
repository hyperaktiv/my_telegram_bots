const Telegraf = require('../node_modules/telegraf');

const bot = new Telegraf('976988260:AAGo4f9HyGQVykfyTOJcvu7vVL-tRKFomaE');

// https://core.telegram.org/bots/api#sendchataction

// reply with url photo: bot.telegram.sendPhoto(ctx.chat.id, '__url here__');
// reply with file path photo:  bot.telegram.sendPhoto(ctx.chat.id, { source: "res/dubai.jpg" } );

bot.command(['start', 'help'], ctx => {
    let message = `
        =) /fortune - to have a English quotes
        +) /allphoto - get list of the picture
        +) /citieslist - get text file cities
        +) call to city to see the picture
        +) upload file document or image to get the link download
    `;
    ctx.reply(message);
})
// send each media
bot.hears(['newyork', 'new york', 'New York'], ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id, 
        { source: "res/newyork.jpg"},
        { reply_to_message_id: ctx.message.message_id } 
    );
})
bot.hears(['hongkong', 'hong kong', 'Hong Kong'], ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id,
        { source: "res/hongkong.jpg" },
        { reply_to_message_id: ctx.message.message_id } 
    );
})
bot.hears(['dubai', 'du bai', 'Dubai City'], ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id, 
        { source: "res/dubai.jpg"},
        { reply_to_message_id: ctx.message.message_id } 
    );
})
bot.hears(['london', 'London'], ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id, 
        { source: "res/london.jpg"}),
        { reply_to_message_id: ctx.message.message_id } 
    ;
})
bot.hears(['singapore', 'Singapoe'], ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id, 
        { source: "res/singapore.jpg"},
        { reply_to_message_id: ctx.message.message_id } 
    );
})

// send album media
// https://core.telegram.org/bots/api#sendmediagroup
bot.command("allphoto", ctx => {
    // display action when sind photo
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");

    let cities = ["res/singapore.jpg", "res/dubai.jpg", "res/hongkong.jpg", "res/london.jpg", "res/newyork.jpg"];
    
    let result = cities.map( city => {
        return {
            type: 'photo',
            media: {
                source: city
            }
        }
    });
    bot.telegram.sendMediaGroup(ctx.chat.id, result);
})

// send document
// https://core.telegram.org/bots/api#senddocument
bot.command("citieslist", ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_document");
    bot.telegram.sendDocument(ctx.chat.id,
        { source: "res/citieslist.txt" },
        { 
            thumb: { source: "res/london.jpg" }, 
            caption: "This is the list cities file." ,
            reply_to_message_id: ctx.message.message_id        
        }
    )
})

// get download link document and photo with bot
bot.on("message", async ctx => {
    // with document
    if(ctx.updateSubTypes[0] == 'document') {
        try {
            let link = await bot.telegram.getFileLink(ctx.message.document.file_id);
            //ctx.reply('Your download link: ' + link);
            bot.telegram.sendMessage(ctx.chat.id, 'Your download link: ' + link,    // text
                {
                    reply_to_message_id: ctx.message.message_id,    // reply which message
                }
            );
        } catch (err) {
            console.log(err);
            ctx.reply(err.description);
        }
    } // with photo
    else if(ctx.updateSubTypes[0] == 'photo') {
        try {
            let link = await bot.telegram.getFileLink(ctx.message.photo[0].file_id);
            bot.telegram.sendMessage(ctx.chat.id, 'Your download link: ' + link,    // text here
                {
                    reply_to_message_id: ctx.message.message_id,    // reply which message
                }
            );
        } catch (err) {
            console.log(err);
            ctx.reply(err.description);
        }
    }
})



// create a simple return happy quotes
const axios = require('axios');

bot.command('fortune', (ctx) => {
    axios.get('http://yerkee.com/api/fortune')
        .then(res => {
            bot.telegram.sendMessage(ctx.chat.id, res.data.fortune, 
                { reply_to_message_id: ctx.message.message_id }
            )
        }).catch(e => {
            console.log(e);
        })
})

bot.launch();