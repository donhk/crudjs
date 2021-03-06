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
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const myAwesomeDB = mydb.db('mydatabase')
  var cursor = myAwesomeDB.collection('quotes').find().toArray((err, result) => {
     if (err) return console.log(result)
     // render index.ejs
     res.render('index.ejs', {quotes: result})
  })
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
app.put('/quotes', (req, res) => {
  // Handle put request
  const myAwesomeDB = mydb.db('mydatabase')
  myAwesomeDB.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  // Handle delete  
  const myAwesomeDB = mydb.db('mydatabase')
  myAwesomeDB.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})
