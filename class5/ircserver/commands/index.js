module.exports = (params)=>{
  return{
    '/nick': require('./nick')(params),
    '/join': require('./join')(params),
  }
}
