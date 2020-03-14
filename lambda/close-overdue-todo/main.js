const superagent = require('superagent');

const closeTodo = async (taskId) => {
  await superagent.post(`https://api.todoist.com/rest/v1/tasks/${taskId}/close`)
    .set('Authorization', `Bearer ${process.env.TODOIST_API_TOKEN}`);
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

  if (!event.body || !JSON.parse(event.body) || parseInt(JSON.parse(event.body).taskId, 10) === Number.NaN) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Invalid taskId'
      }),
    };
  }

  try {
    await closeTodo(parseInt(JSON.parse(event.body).taskId, 10));
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal'
      }),
    };
  }


  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  };
};
