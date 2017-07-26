
const Nick = ({ sendMSG, sendError }) => ({cmd, arguments}, socket) => {
  if (arguments.length !== 1) return sendError('bad arguments', socket);
  const nickName = arguments.pop();
  socket.nickName = nickName;
  return sendMSG(`your nickname is ${nickName}`, socket);
}


module.exports  = Nick;
