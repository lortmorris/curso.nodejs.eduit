
const Join = ({ db, sendError, sendMSG }) => ({cmd, arguments}, socket) => {
  console.info('join called ', cmd, arguments);
  if ( arguments.length > 1) return sendError('bad arguments', socket);
  if ( arguments.length === 0) return sendError('missing channel name', socket);
  if (typeof socket['nickName'] === 'undefined') return sendError('run /nick before', socket);
  const channel = arguments.pop();

  db.channels.insert({
    added: new Date(),
    name: channel,
    socketId: socket.id
  }, (err, doc) => {
    return sendMSG('joined '+channel, socket);
  });
}

module.exports = Join;
