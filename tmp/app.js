const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1/cursodb', ['alumnos','logs']);

db.alumnos
	.find({dni:3879047})
	.limit(100)
	.toArray((err, docs)=>{
		console.log(err, docs);
	});