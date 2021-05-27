const env = require('./env');
const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegram/markup');
const moment = require('moment');
const { getSchedule, getTask } = require('./scheduleServices');

const bot = new Telegraf(env.token);

bot.start(ctx => {
  const nome = ctx.update.message.from.first_name;
  ctx.reply(`Seja bem vindo, ${nome}!`);
});

const formatDate = date => {
  date && moment(date).format('DD/MM/YYYY');
};

const showTask = async (ctx, taskId, newMessage = false) => {
  const task = await getTask(taskId);
  const conclusion = tark.dt_conclusion && `\n<b>Concluída em:</b> ${formatDate(task.dt_conclusion)}`;
  const message = `
    <b>${task.description}</b>
    <b>Previsão:</b> ${formatDate(task.dt_prediction)}${conclusion}
    <b>Observações:</b>\n${task.note || ''}
  `;

  if(newMessage) {
    ctx.reply(message, buttonsTask(taskId));
  } else {
    CacheStorage.editMessageText(message, buttonsTask(taskId));
  }
};