const express = require('express');
const app = express();
const dotenv = require('dotenv'); 
dotenv.config();
const path = require('path'); 
const mongoose = require('mongoose'); 
const bodyParser = require('body-parser');
const methodOverride = require('method-override');



const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');



app.set('view engine', 'pug'); 
app.set('views', __dirname + '/views')
app.use(methodOverride('_method'))
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false})); 


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
  
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use(function (req, res, next) {
  res.status(404).render('404')
})
  start();