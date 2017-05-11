module.exports = App => {
  return {
    'GET/users/save': (req, res)=> App.controllers.users.addUser(req, res),
  }
}
