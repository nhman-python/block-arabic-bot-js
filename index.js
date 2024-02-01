const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf('your bot token');


function containsArabic(text) {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    return arabicRegex.test(text);
}

bot.command('start', async (ctx) => {
    try {
        const chatType = ctx.message.chat.type;
        if (chatType === 'private') {
            const message = 'אני בוט למחיקת והסרת משתמשים ערבים מקבוצות!';
            const userNameBot = bot.botInfo.username;
            const joinButton = Markup.inlineKeyboard([
                Markup.button.url('צרף אותי לקבוצה', `https://t.me/${userNameBot}?startgroup=start&admin=delete_messages+restrict_members`)
            ]);
    
            await ctx.reply(message, joinButton);
        }
    }
    catch (error) {
        console.log(error);
    }
});

bot.on('message', async (ctx) => {
    try {
        const chatType = ctx.message.chat.type;
        if (chatType === 'group' || chatType === 'supergroup') {
            const text = ctx.message.text;
            const userId = ctx.message.from.id;
            const chatId = ctx.message.chat.id;
    
            if (containsArabic(text)) {
                await ctx.banChatMember(userId, chatId);
                await ctx.deleteMessage(ctx.message.id);
                await ctx.reply(`הודעה מכילה תווים בערבית המשתמש הורחק וההודעה נמחקה`);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});

bot.launch();
