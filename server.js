if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config() // tidak menggunakan .load()
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes')
const port = 3000
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL,
  {
    useNewUrlParser: true, // UNTUK MENCEGAH TIMBUL WARNING DEPRECATED
    // useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

 app.set('view engine', 'ejs')
 // set where is view coming from
 app.set('views', __dirname + '/views') // memberi tahu path views
 app.set('layout', 'layouts/layout')
 app.use(expressLayouts)
 app.use(express.static('public'))

 app.use('/', indexRouter)

 app.listen(process.env.PORT || port,()=>{
  console.log(`this app use port:${port}`)
 })