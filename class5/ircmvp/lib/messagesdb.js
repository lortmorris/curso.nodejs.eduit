

const MessagesDB = ({db}) => ({
  getMessages: query => new Promise((resolve, reject) => {
    db.messages.find(query, {}, (err, docs) => (err ? reject(err) : resolve(docs)));
  })
});

module.exports = MessagesDB;
