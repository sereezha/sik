import fetch from 'node-fetch';

export const handler = async function (event, context) {
  try {
    const tg = {
      token: process.env.BOT_TOKEN,
      chat_id: process.env.CHAT_ID,
    };

    const { phone, telegram, bottles, months } = event.queryStringParameters;
    if (!telegram || phone.trim() === '$' || !bottles || !months) {
      throw new Error('error');
    }

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
  } catch (e) {
    console.log('ERROR:', event);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Internal Server Error' }),
    };
  }
};
