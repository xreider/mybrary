const express = require('express');
const app = express();
const dotenv = require('dotenv'); 
dotenv.config();
const path = require('path'); 
const csurf = require('csurf'); 
const mongoose = require('mongoose'); 
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const varMiddleware = require('./middleware/variables');
const User = require('./models/user');
const userMiddleware = require('./middleware/user');


const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');
const userRouter = require('./routes/user');


const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.MONGODB_URI
})
app.set('view engine', 'pug'); 
app.set('views', __dirname + '/views')
app.use(methodOverride('_method'))
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false})); 
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store,
}))
app.use(csurf())
app.use(varMiddleware)
app.use(userMiddleware)

const PORT = process.env.PORT || 1000;
async function start() { 
    try {
    await mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false}); 
    const db = mongoose.createConnection(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});
  
    db.on('error', error => console.log(error))
    db.once('open', () => console.log('Connected to DB'))
    app.listen(PORT, () => { console.log(`Listen to ${PORT}`) })  
    } catch(e) { console.log(e) } 
  }
  
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/user', userRouter)

app.use(function (req, res, next) {
  res.status(404).render('404')
})
  start();