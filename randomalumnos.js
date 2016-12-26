function random(n){
	var names = ['pepe','luis', 'tito','cacho','carlos','juan'];

	for(var x=0; x<n; x++){
		var alumno ={
			fname: names[Math.floor(Math.random() * names.length)],
			lname: names[Math.floor(Math.random() * names.length)],
			dni: Math.floor(Math.random() * 20000000) + 10000,
			avg: Math.floor(Math.random()*11)
		};

		db.alumnos.insert(alumno);
	}
}

random(1000);