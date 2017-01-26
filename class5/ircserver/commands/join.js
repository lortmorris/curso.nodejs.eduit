module.exports =params=>{
  return (data, id)=>{
    return new Promise((resolve, reject)=>{
      params.response('join called', [id]);
    })

  }
}
