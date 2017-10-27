const browser = require('browserwithphantom');
const config = require('config');
const mongojs = require('mongojs');
const db = mongojs(`${config.get('db').host}/${config.get('db').db}`, config.get('db').collections);
const mybrowser = new browser("mytest", {ttl: 60});

const save = (item) =>{
  db.restaurantes.findOne({internalid: item.internalid},{}, (err, doc)=>{
    if(!doc){
      db.restaurantes.insert(Object.assign({}, item));
    }
  });
}

const scrap = (page) => {
  const currentPage = page + 1;
  const url = `https://www.guiaoleo.com.ar/guia?page=${currentPage}&queryString=&minComments=0`

  mybrowser.ready()
      .then(()=>{
          return mybrowser.browseTo(url);
      })
      .then(()=>{
          return mybrowser.loaded();
      })
      .then(()=>{
          return mybrowser.screenshot();
      })
      .then(()=>{
        return mybrowser.evaluate(function(){
        var forReturn = [];
        var data = document.querySelectorAll('div.col-xs-12.col-md-4');
        for(var x=0; x<data.length; x++){
          var r = data[x];
          var categories = r.querySelector('h3').innerText;
          var address = r.dataset.address.split(' ');
          var link = r.dataset.slug.split('-');
          forReturn.push({
            town: address.pop(),
            address: address.join(' '),
            image: r.dataset.image,
            location: JSON.parse(r.dataset.location),
            link: link.join('-'),
            internalid: link.pop(),
            title: r.dataset.title,
            categories: categories.split(',')
          })
        }
        return forReturn;
        }); //end evaluate
      })
      .then((items)=>{
        if(items && items.length > 0){
          items.forEach(item => save(item) );
          return Promise.resolve();
        }else {
          db.close();
          return mybrowser.close();
        }
      })
      .then(()=>{
        console.info('getting next page')
        scrap(currentPage);
      })
      .catch((err)=>{
        console.error('Error in scrap: ', err);
        //throw err;
      })
};

let page = 0;
if (process.argv.length === 3) page = parseInt(process.argv[2]);
scrap(page);
