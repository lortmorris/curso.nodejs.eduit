
const Libs = Application => ({
  MessagesDB: require('./messagesdb')(Application),
  Help: require('./help')(Application),
  Join: require('./join')(Application),
  Nick: require('./nick')(Application),
});

module.exports = Libs;
