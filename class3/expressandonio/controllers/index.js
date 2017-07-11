const Ip = require('./ip');

module.exports = (app) => ({
  ip: Ip(app),
});
