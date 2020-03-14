const superagent = require('superagent');
const moment = require('moment');

const getDueTodos = async () => {
  const result = await superagent.get('https://api.todoist.com/rest/v1/tasks')
    .set('Authorization', `Bearer ${process.env.TODOIST_API_TOKEN}`);

  return result.body
    .filter(entry => entry.due && moment(entry.due.date).isBefore(moment(new Date())))
    .map(entry => ({
      id: entry.id,
      text: entry.content,
    }));
};

exports.main = async (event, context) => {
  if (!event.headers || event.headers.Authorization !== `Bearer ${process.env.AUTH_TOKEN}`) {
    return {
      statusCode: 403,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Unauthorized'
      }),
    };
  }

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      dueTodos: await getDueTodos(),
    }),
  };


  return response;
};
