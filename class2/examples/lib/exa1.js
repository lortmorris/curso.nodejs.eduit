const fs = require("fs");

module.exports = (path, cb)=>{

  return new Promise((resolve, reject)=>{
    fs.mkdir(path, (err) => {
      if(cb===undefined) err? reject(err): resolve();
      else cb(err);
    });
  });
}