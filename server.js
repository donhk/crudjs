const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
app.use(bodyParser.urlencoded({extended: true}));

var db
MongoClient.connect('mongodb://mongouser:soMePas12325s@127.0.0.1:27017/mydatabase', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
      console.log('listening on 3000')
      app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
          });
     app.post('/quotes', (req, res) => {
        console.log('Hellooooooooooooooooo!')
        console.log(req.body)
     });
  });
});

console.log('May Node be with you');
