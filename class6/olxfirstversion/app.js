
const mongojs = require('mongojs');
const browser = require("browserwithphantom");
const mybrowser = new browser("mytest", {ttl: 60})
const db = mongojs('mongodb://127.0.0.1/olx', ['tmp']);
mybrowser.ready()
    .then(()=>{
        return mybrowser.browseTo('https://www.olx.com.ar/');
    })
    .then(()=>{
        return mybrowser.loaded();
    })
    .then(()=>{
        return mybrowser.evaluate(function(){
          var products = document.querySelectorAll('.item-wrapper');
          var response = [];
          for( var x=0; x<products.length; x++){
            var p = products[x];
            response.push({
              img: p.querySelector('img').src,
              price: p.querySelector('strong').innerText,
              title: p.querySelector('h4 span').innerText,
              link: p.querySelector('a').href
            });
          }
          return response;
        });
    })
    .then((response) => {
      console.info(response);
      db.tmp.insert(response, (err, docs) => {
        console.info(err);
        db.close();
      })
      return Promise.resolve();
    })
    .then(()=>{
      console.log("closing...");
       return mybrowser.close();
    })
    .catch((err)=>{
        throw err;
    })
