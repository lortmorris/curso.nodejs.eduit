const mymkdir  = require("./lib/exa1");

mymkdir("pepe")
    .then(()=>{
        console.log("pepe creado");
        return mymkdir("pepe/rompe");
    })
    .then(()=>{
        console.log("rompio todo ok");
    })
    .catch(err=>{
        console.log(" pepe rompio de mas: ", err);
    })
