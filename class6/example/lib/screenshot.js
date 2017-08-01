const Browser = require("browserwithphantom");


module.exports = (url)=>{
    return new Promise((resolve, reject)=>{
       browser = new Browser("mytest", {ttl: 60});

        browser.ready()
        .then(()=>{
            return browser.browseTo(url);
        })
        .then(()=>{
            return browser.loaded();
        })
        .then(()=>{
            return browser.screenshot();
        })       
        .then(resolve)
        .catch(reject)
    });

}


    