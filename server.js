require('dotenv').config()
const express = require('express')
const app = express();
const esj = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose');
const session = require("express-session")
const flash = require("express-flash")
const MongoDbStore = require("connect-mongo")


// Database connection
 mongoose.connect('mongodb://localhost/pizza')
.then((result) => console.log('Database connected...'))
.catch((err) => console.log(err))

//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store: MongoDbStore.create({
        mongoUrl:process.env.MONGO_CONNECTION_URL 
    }),
    cookie: { maxAge:100 * 60 * 60 * 24 }
}))

app.use(flash())

//Assets
app.use(express.static('public'))
app.use(express.json())
//set template engine
app.use(expressLayout)

//Global Middleware
app.use((req,res,next) => {
    res.locals.session = req.session
    next()
})

app.set('views', path.join(__dirname,'/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

app.listen(PORT , ()=> {
    console.log(`listning on port ${PORT}`);
})