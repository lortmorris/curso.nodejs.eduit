const fs = require('fs');

module.exports = {
  users: {
    addUser: (req, res) => {
      req.users.push(req.query);
      fs.writeFile('./users.json', JSON.stringify(req.users), (err)=>{
          res.end(err ? 'error' : 'saved');
      });
    }
  }
};
