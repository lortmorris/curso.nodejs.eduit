module.exports =params=>{
  return (data, id)=>{
    return new Promise((resolve, reject)=>{
        if(data.length!=1) return reject('bad arguments');
        params.usersList[id].nick = data[0];
        resolve('new nick '+data[0]);
    })
  }
}
