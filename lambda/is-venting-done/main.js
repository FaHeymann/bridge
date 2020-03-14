const AWS = require('aws-sdk');
const moment = require('moment');

const ddb = new AWS.DynamoDB();

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

  let result;
  try {
    result = await ddb.getItem({
      Key: {
        task: {
          S: 'venting',
        },
        date: {
          N: moment().format('YYYYMMDD'),
        },
      },
      TableName: 'bridge',
    }).promise();
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
    body: JSON.stringify({
      isDone: !!result.Item
    }),
  };
};
