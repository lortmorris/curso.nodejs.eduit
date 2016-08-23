const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const mongojs = require("mongojs");

const db = mongojs("cursonode", ["test", "logs", "alumnos"]);


app.use(express.static("./public"));
app.engine('.hbs', exphbs({defaultLayout: 'default', extname:'.hbs'}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res)=>{
    db.alumnos.find({}, {}, (err, docs)=>{
        res.render("home", {data: docs});
    })
});

app.post("/remove", (req, res)=>{

    let end = (response)=>{
        res.json(response);
    }

    try{
        let id = db.ObjectId(req.body.id);
        db.alumnos.remove( {_id: id} , (err, doc)=>{
            err ? end({error: true, msg: err}) : end(doc);
        });
    }catch(e){
        end({error: true, msg: e});
    }

});

app.post("/add", (req, res)=>{
    db.alumnos.insert(req.body, (err, doc)=>{
        if(err) res.json({err: true, msg: err});
        else res.json(doc);
    });

})

app.listen(5000);
