const Telegraf = require('../node_modules/telegraf');

const bot = new Telegraf("1026890979:AAHp482bVto5MBWSn9iAWOXaAXONswUUTPw");

const axios = require('../node_modules/axios');

// default sheet
// https://docs.google.com/spreadsheets/d/1u7me0l-s90JZHO1Itcx7jvy4QRFJUBEqV4BT9opg5Q4/edit#gid=0
// json page of sheet: template
// https://spreadsheets.google.com/feeds/cells/YOURGOOGLESHEETCODE/SHEETPAGENUMBER/public/full?alt=json

bot.command(["help", "start"], ctx => {
    let helpmessage = `
    *Simple help command*
        =) /sheetdata - get random data have on sheet
        =) /maxrow    - get the max row on sheet
        =) /maxcol    - get the max column on sheet
        =) /sheetdata \'<row>\' \'<column>\'  - get data on specific [row,col] or [row,maxCol]
    `;
    ctx.reply(helpmessage);
})


let dataStore = [];

getData();

bot.command(['maxrow', 'maxcol'], ctx => {

    let input = ctx.message.text;

    if(input == '/maxrow') {
        let maxRow = dataStore.filter(item => {
            return (item.row == '1' && item.col == '2');
        })[0].val;   // output: 6

        bot.telegram.sendMessage(ctx.chat.id, maxRow, 
            { 
                reply_to_message_id: ctx.message.message_id,
                parse_mode: "markdown" 
            }
        );
    } else {

        let maxCol = dataStore.filter(item => {
            return (item.row == '2' && item.col == '2');
        })[0].val;   // output: 5

        bot.telegram.sendMessage(ctx.chat.id, maxCol, 
            { 
                reply_to_message_id: ctx.message.message_id,
                parse_mode: "markdown" 
            }
        );
    }
    
})

bot.command('sheetdata', ctx => {

    let maxRow = dataStore.filter(item => {
        return (item.row == '1' && item.col == '2');
    })[0].val;   // output: 6

    let maxCol = dataStore.filter(item => {
        return (item.row == '2' && item.col == '2');
    })[0].val;   // output: 5


    let randomRow = Math.floor(Math.random() * maxRow) + 1;
    
    let dataOnSheet;
    let message = '';
    let input = ctx.message.text.split(" ");    //input[1]:row - input[2]: col
    
    if (input[1] != undefined && input[2] != undefined) {

        if(input[1] <= maxRow && input[2] <= maxCol ) {

            // get random data on column 5
            dataOnSheet = dataStore.filter(item => {
                return (item.row == input[1] && item.col == input[2]);
            })[0];

            message =`
                *Data:* \`row #${dataOnSheet.row}\`, \`column #${dataOnSheet.col}\`
                ${dataOnSheet.val}
            `;
        } else if(input[1] > maxRow) {
            message = `Your row input doesn't exist`;
        } else if(input[2] > maxCol) {
            message = `Your row input doesn't exist`;
        }
            
    } else if(input[1] != undefined && input[2] == undefined) {

        if(input[1] > maxRow) {
            message = `Your row input doesn't exist`;
        } else {
            // get random data on column 5
            dataOnSheet = dataStore.filter(item => {
                return (item.row == input[1] && item.col == '5');
            })[0];
            
            message =`
                *Data:* \`row #${dataOnSheet.row}\`, \`column #${dataOnSheet.col}\`
                ${dataOnSheet.val}
            `;
        }
            
    } else {
            // get random data on column 5
        dataOnSheet = dataStore.filter(item => {
            return (item.row == randomRow && item.col == '5');
        })[0];

        message =`
            *Data:* \`row #${dataOnSheet.row}\`, \`column #${dataOnSheet.col}\`
            ${dataOnSheet.val}
        `;
    }

    bot.telegram.sendMessage(ctx.chat.id, message, 
        { 
            reply_to_message_id: ctx.message.message_id,
            parse_mode: "markdown" 
        }
    );

})

// get data from sheet
    async function getData() {
        try {
            let res = await axios('https://spreadsheets.google.com/feeds/cells/1u7me0l-s90JZHO1Itcx7jvy4QRFJUBEqV4BT9opg5Q4/1/public/full?alt=json');
            
            let data = res.data.feed.entry;
            dataStore = [];
            data.forEach(item => {
                dataStore.push({
                    row: item.gs$cell.row,
                    col: item.gs$cell.col,
                    val: item.gs$cell.inputValue,
                })
            });

            //console.log(dataStore);
        } catch(err) {
            console.log(err);
        }
    }

bot.launch();