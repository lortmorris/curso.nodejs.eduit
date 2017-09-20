const browser = require('browserwithphantom');
const config = require('config');
const mongojs = require('mongojs');
const db = mongojs(`${config.get('db').host}/${config.get('db').db}`, config.get('db').collections);
const mybrowser = new browser("mytest", {ttl: 60});

const save = (item, category) =>{
  db.products.findOne({olxid: item.olxid},{}, (err, doc)=>{
    if(!doc){
      db.products.insert(Object.assign({}, item, {category}));
    }
  });
}

const scrap = (docs) => {
  const category = docs.pop();
  if(category===undefined) {
    console.log('End all');
    db.close();
    return mybrowser.close()
  }

  const categoryId = category._id;
  const url = category.href;

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
        var items = document.querySelectorAll('.item');
        var forReturn = [];
        for(var x=0; x<items.length; x++){
            forReturn.push({
              img: items[x].querySelector("img").src || "",
              title: items[x].querySelector('h3').innerText,
              price: items[x].querySelector(".items-price").innerText,
              olxid: items[x].querySelector('a').href.split('iid-')[1]
            });

        }//end for
        return forReturn;
        }); //end evaluate
      })
      .then((items)=>{
        if(items){
          items.forEach(item => save(item, category) );
        }
        return Promise.resolve();
      })
      .then(()=>{
        console.info('getting next category')
        scrap(docs);
      })
      .catch((err)=>{
        console.error('Error in scrap');
        scrap(docs);
        //throw err;
      })
};

db.categories.find({}, {}, (err, docs)=> scrap(docs));
