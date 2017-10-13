module.exports = (Application) => (id, arg) => {
  const username = arg[0];
  console.log('nick: ', arg);
  Application.usersList[id].nickname = username;
  Application.usersList[id].auth = true;
  return `your nickname is now ${username}`;
}
