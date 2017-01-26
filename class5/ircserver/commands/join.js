module.exports =params=>{
  return (data, id)=>{
    return new Promise((resolve, reject)=>{
      if(!params.usersList[id].nick) return reject('run /nick first');

      if(typeof params.channelsList[data[0]]==="undefined"){
          params.channelsList[data[0]]={
            users: {}
          }
      }
      params.channelsList[data[0]].users[id] = params.usersList[id];
      params.responseToChannel(`/joined ${params.usersList[id].nick}`,data[0] )
      .then(()=>resolve(`/join ${data[0]} ok`))
      .catch((err)=> reject(err))

    });
  }
}
