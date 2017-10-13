module.exports = (Application) => ({
  '/nick': require('./nick')(Application),
  '/msg': require('./msg')(Application),
});
