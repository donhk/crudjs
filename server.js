const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient

var mydb

MongoClient.connect('mongodb://mongouser:soMePas12325s@127.0.0.1:27017/mydatabase', (err, database) => {
  if (err) return console.log(err)
  mydb = database
  app.listen(process.env.PORT || 6015, () => {
    console.log('listening on 6015')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
   res.sendFile(__dirname + '/index.html')
})

//https://stackoverflow.com/a/47694265/4170988
app.post('/quotes', (req, res) => {
  console.log(req.body)
  //fix for mongodb version >= 3.0
  const myAwesomeDB = mydb.db('mydatabase')
  myAwesomeDB.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

//mongodb --port xxxxx use mydatabase db.quotes.find( {} )
app.get('/read', (req, res) => {
  const myAwesomeDB = mydb.db('mydatabase')
  //var cursor = myAwesomeDB.collection('quotes').find()
  var cursor = myAwesomeDB.collection('quotes').find().toArray(function(err, results){
  console.log(results)
  // send HTML file populated with quotes here
  })
})

