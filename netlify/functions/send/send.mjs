import fetch from 'node-fetch';

export const handler = async function (event, context) {
  const tg = {
    token: process.env.BOT_TOKEN,
    chat_id: process.env.CHAT_ID,
    // 187508671
    // -1001494969756
    // -943321059
    // 6788541003:AAFfj6hn8F14GeujafIfWGSr6QaIo-3esik
    // 6840605880:AAHHLJZaYu5V5sAoEABGNL04Cy8PPqE9Odo
  };

  const { phone, telegram, bottles, months } = event.queryStringParameters;
  const formData = new FormData();

  formData.append('Phone', phone);
  formData.append('Telegram', telegram);
  formData.append('Bottles', bottles);
  formData.append('Months', months);

  const obj = {
    chat_id: tg.chat_id,
    text: `
<b>Phone</b>: ${phone}
${telegram ? `<b>Telegram</b>: ${telegram}` : ''}
<b>Bottles</b>: ${bottles}
<b>Months</b>: ${months}
    `,
  };

  const promises = [
    fetch(process.env.GOOGLE_SHEET, {
      method: 'POST',
      body: formData,
    }),
    fetch(
      `https://api.telegram.org/bot${tg.token}/sendMessage?parse_mode=html`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(obj),
      }
    ),
  ];

  await Promise.allSettled(promises)
    .then(() => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'success' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    })
    .catch((err) => {
      return {
        statusCode: 404,
        body: err.toString(),
      };
    });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'success' }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};
