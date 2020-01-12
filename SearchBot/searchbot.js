/**
 * @Desc    bot with searching and showing the images with finding info
 * @Author  D_nam
 * @Date    8/1/2020
 */
require('dotenv').config();
const Telegraf = require('../node_modules/telegraf');
const bot = new Telegraf(process.env.TOKEN);

// handler with start,help commands
const startCommand = require('./src/commands/commands');
startCommand(bot);
const startHandler = require('./src/inlineHandlers/startcommand');
startHandler(bot);

// https://core.telegram.org/bots/inline  or /api#answerInlineQuery
// pixabay API: https://pixabay.com/api/?key=<apikey>&q=<search>
// handler with image getting on pixabay
const pixabay_img = require('./src/inlineHandlers/getPixabay');
pixabay_apkey(bot);


//========== ON NOT WORKING NOW=========
// https://core.telegram.org/bots/api#inlinequeryresultarticle
// wiki API: https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=<query>&limit=50
const wikiHandler = require('./src/inlineHandlers/getWiki');





bot.launch();