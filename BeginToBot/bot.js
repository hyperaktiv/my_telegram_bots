const Telegraf = require('../node_modules/telegraf');

const bot = new Telegraf('605355907:AAGoDip7uEncnetQywAx9MMJ_fKKn538VPk');

// code

bot.help((ctx) => {
    ctx.reply("You have entered the 'help' command");
})
bot.settings((ctx) => {
    ctx.reply("You have entered the 'settings' command");
})
bot.command(["test", "Test"], (ctx) => {
    ctx.reply(ctx.from.last_name + ", you've entered a test/Test command!");
})

    // method
// hear some text from chatroom to reply: cat, Cat, indoing...
bot.hears(["cat", "Cat"], (ctx) => {
    ctx.reply("You've called for the cat/Cat text");
})
// reply when sending a sticker
bot.on("sticker", (ctx) => {
    ctx.reply("This is a sticker message.");
})
// reply when mention someone: @botfather, @anotherguy,...
bot.mention("botfather", (ctx) => {
    ctx.reply("You've used mention method");
})
bot.phone("+84 976221354", (ctx) => {
    ctx.reply("Phone method is using");
})
// handles hashtags : #hash, #somewhere
bot.hashtag("hash", (ctx) => {
    ctx.reply("Hashtag method 've used.");
})

    // cactch any context
// bot.use((ctx, next) => {
//     ctx.reply("You've interact with the bot.");
// })

// reply hello world and log to console the time.
// bot.use(async (ctx, next) => {
//     const start = new Date();
//     await next();
//     const ms = new Date() - start;
//     console.log('Response time: %sms', ms);
//   })
// bot.on('text', (ctx) => ctx.reply('Hello World'))

// using extra parameters
bot.command("start", ctx => {
    // bot.telegram.sendMessage(chatId, text, [extra])  ===   ctx.reply(text, [extra])
    bot.telegram.sendMessage(ctx.chat.id, "Hello World", 
        {
            parse_mode: 'Markdown',
            disable_notification: true
        }
    );
    
    // ctx.reply("Hello world", 
    //     {
    //         parse_mode: 'Markdown',
    //         disable_notification: true
    //     }
    // );
})



bot.launch();