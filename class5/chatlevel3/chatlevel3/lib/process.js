module.exports = (Application) => (id, str) => {
  if (str[0] !== '/') return 'Bad command format';

  const parts = str.split(' ');
  const command = parts.shift();
  if (command in Application.commands) {
    return Application.commands[command](id, parts);
  }
  return `Command not found: ${str}`;
};
