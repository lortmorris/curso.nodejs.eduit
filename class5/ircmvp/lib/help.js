
const Help = ({ sendMSG }) => (msg, socket) => {
  const response = `
    /list: show all channels \r\n
    /help: show this messages \r\n
    /msg: send message to channel, ex: /msg #pepe my messages \r\n
    /join: join to #channel \r\n
  `;

  return sendMSG(response, socket);
}

module.exports = Help;
