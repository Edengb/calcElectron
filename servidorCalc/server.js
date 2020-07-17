// Importanto os modulos.
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
let request = require('request');



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE, PATCH");
  next();
});












/*
app.use(bodyParser.json()); // Transformando a resposta em um JSON
app.use(bodyParser.urlencoded({ extended: true }));
*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))






// parse application/json
app.use(bodyParser.json());



 
app.use(express.static(__dirname + '/'));







 let dbConn = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: 'root',
     database: 'calc'
 });
 // connect to database
 dbConn.connect();






 // default route
 
app.get('/API/historico', function (req, res) {
  dbConn.query('SELECT * FROM resultHistory', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'history list' });
  });
});

app.get('/API/historico/:id', function (req, res) {
     if (!req.params.id) {
      return res.status(400).send({ error: true, message: 'Please provide user_id' });
     }
     dbConn.query('SELECT * FROM resultHistory where ID = ?', req.params.id, function (error, results, fields) {
      if (error) throw error;
       return res.send({ error: false, data: results[0], message: 'calc.' });
     });
});



app.delete('/API/historico/:id', function (req, res) {
     if (!req.params.id) {
      return res.status(400).send({ error: true, message: 'Please provide user_id' });
     }
     dbConn.query('DELETE FROM resultHistory WHERE ID = ?', req.params.id, function (error, results, fields) {
      if (error) throw error;
       return res.send({ error: false, data: results[0], message: 'calc.' });
     });
});


app.post('/API/historico', function (req, res) {
  let retornJson;


  var apiurl = 'http://localhost:8000/API/historico'
  request(apiurl, function(error,response,body){
    retornJson = JSON.parse(body).data;


    let calc = req.body;
    if (!calc) {
      return res.status(400).send({ error:true, message: 'Please provide user' });
    }
    dbConn.query("INSERT INTO resultHistory SET ?", { expression: calc.expression, result: calc.result}, function (error, results, fields) {
      if (error) throw error;
      return res.send(retornJson);
    }); 

  })
});









 // set port
 app.listen(8000, function () {
     console.log('Node app is running on port 8000');
 });
 module.exports = app;