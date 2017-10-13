module.exports = (Application) => (id, arg) => {
    if (Application.usersList[id].auth){
      Application.io.emit('notify', arg.join());
      return '';
    }
    return `user ${id} not auth, required exec /nick`;
}
