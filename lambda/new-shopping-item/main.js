const superagent = require('superagent');

const newShoppingItem = async (text) => {
  const result = await superagent.post('https://api.todoist.com/rest/v1/tasks')
    .send({
      content: text,
      project_id: parseInt(process.env.TODOIST_SHOPPING_LIST_PROJECT_ID, 10),
    })
    .set('Authorization', `Bearer ${process.env.TODOIST_API_TOKEN}`);

  return result.body.id;
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
        error: 'Unauthorized',
      }),
    };
  }

  if (!event.body || !JSON.parse(event.body) || !JSON.parse(event.body).text) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Invalid taskId',
      }),
    };
  }

  let itemId;

  try {
    itemId = await newShoppingItem(JSON.parse(event.body).text);
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal',
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      itemId,
    }),
  };
};
