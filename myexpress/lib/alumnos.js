class Alumnos{
  constructor(db){
    this.db = db;
    this.col = 'alumnos';
  }

  insert(data){
    return new Promise((resolve, reject)=>{
      data.type='system';
      data.added = new Date();
      this.db[this.col].insert(data, (err, doc)=> err ? reject(err) : resolve(doc));
    });
  }

  count(){
    return new Promise( (resolve, reject)=>{
      this.db[this.col].find({},{}).count((err, doc)=> err ? reject(err): resolve(doc));
    })
  }

  update(id, data){
      return new Promise((resolve, reject)=>{
        data.lastUpdate = new Date();
        this.db[this.col].update({_id: this.db.ObjectId(id)}, {$set: data},(err, doc)=>{
          err ? reject(err) : resolve(doc);
        });
      })
  }

  search(){
    return new Promise( (resolve, reject)=>{
      this.db[this.col].find({}, {})
      .sort({_id:-1})
      .limit(100)
      .toArray((err, docs)=>  err ? reject(err) : resolve(docs))
    });
  }

  remove(id){
    let self = this;
    return new Promise( (resolve, reject)=>{
      self[db][self.col].remove({_id: self.db.ObjectId(id)}, (err, doc)=> err ? reject(err): resolve(doc))
    });
  }
}

module.exports = Alumnos;
