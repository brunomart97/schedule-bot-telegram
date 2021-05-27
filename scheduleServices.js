const moment = require('moment');
const axios = require('axios');

const baseUrl = 'http://localhost:3001/tasks';

const getSchedule = async date => {
  const url = `${baseUrl}?_sort=dt_prediction,description&_order=asc`;
  const res = await axios.get(url);
  const pending = item => item.dt_conclusion === null
    && moment(item.dt_prediction).isSameOrBefore(date);
  return res.data.filter(pending);
};

const getTask = async id => {
  const res = await axios.get(`${baseUrl}/${id}`);
  return res.data;
};

module.exports = {
  getSchedule,
  getTask
};