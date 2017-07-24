const mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1/cursodb', ['alumnos', 'logs']);

db.alumnos.find({fname: 'David'}, (err,docs)=>{
	console.log(err, docs);
});