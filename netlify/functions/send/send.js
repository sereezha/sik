
exports.handler = async function (event, context) {
  const tg = {
    token: '6840605880:AAHHLJZaYu5V5sAoEABGNL04Cy8PPqE9Odo',
    chat_id: '187508671',
    // 187508671
    // -1001494969756
    // -943321059
    // 6788541003:AAFfj6hn8F14GeujafIfWGSr6QaIo-3esik
    // 6840605880:AAHHLJZaYu5V5sAoEABGNL04Cy8PPqE9Odo
  };

  const url = `https://api.telegram.org/bot${tg.token}/sendMessage?parse_mode=html`;

  try {
    const { name, phone, telegram } = event.queryStringParameters;

    const obj = {
      chat_id: tg.chat_id,
      text: `
<b>Ім'я</b>: ${name}
<b>Телефон</b>: ${phone}
${telegram ? `<b>Телеграм</b>: ${telegram}` : ''}
    `,
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(obj)
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: name + ' ' + phone }),
    };
  } catch (err) {
    return {
      statusCode: 404,
      body: err.toString(),
    };
  }
};
