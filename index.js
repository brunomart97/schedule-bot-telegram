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
  const conclusion = task.dt_conclusion && `\n<b>Concluída em:</b> ${formatDate(task.dt_conclusion)}`;
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

const buttonsSchedule = tasks => {
  const buttons = tasks.map(item => {
    const date = item.dt_prediction && `${moment(item.dt_prediction).format('DD/MM/YYYY')}`;
    return [Markup.callbackButton(`${date}${item.description}`, `show ${item.id}`)];
  });

  return Extra.markup(Markup.inlineKeyboards(buttons, {columns: 1}));
};

const buttonsTask = idTask => Extra.HTML().markup(Markup.inlineKeyboard([
  Markup.callbackButton('✔️', `concluir ${idTask}`),
  Markup.callbackButton('🗓️', `setData ${idTask}`),
  Markup.callbackButton('📝', `addNota ${idTask}`),
  Markup.callbackButton('❌', `excluir ${idTask}`)
], {columns: 4}));