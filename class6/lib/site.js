
const siteFactory=(db)=>{
return class Site{
		constructor(){

		}

		add(data){
			return new Promise((resolve, reject)=>{
				db.website.insert(data, (err, doc)=>{
					err ? reject(err) :  resolve(doc);
				});
			});
		}

		search(params){

			return new Promise((resolve, reject)=>{
				db.website.find(params, {}, (err, docs)=>{
					err ? reject(err) : resolve(docs);
				});
			});
		}
	}
}

module.exports = siteFactory;