const express = require('express');
const app = express();
const dotenv = require('dotenv'); 
dotenv.config();
const path = require('path'); 
const mongoose = require('mongoose'); 
const indexRouter = require('./routes/index');

app.set('view engine', 'pug');

app.use('/public', express.static(path.join(__dirname, 'public')));
 
app.use('/', indexRouter)

const PORT = process.env.PORT || 1000;
async function start() { 
    try {
    await mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false}); 
    const db = mongoose.connection;
    db.on('error', error => console.log(error))
    db.once('open', () => console.log('Connected to DB'))
    app.listen(PORT, () => { console.log(`Listen to ${PORT}`) })  
    } catch(e) { console.log(e) } 
  }
  
  start();