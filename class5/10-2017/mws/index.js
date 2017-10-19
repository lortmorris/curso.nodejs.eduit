const register = require('./register');
const home = require('./home');
const login = require('./login');
const chat = require('./chat');

const mws = application => ({
  register: register(application),
  home: home(application),
  login: login(application),
  chat: chat(application),
});

module.exports = mws;
