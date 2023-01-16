if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}




const express = require("express");
const app = express();
//bcrypt allows use to hash passwords to make sure the application is entirely secure.
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

//calling our initialize function from the passport-config.js file
const initializePassport = require('./passport-config.js')
initializePassport(
    passport, 
    email =>{
    return users.find(user => user.email === email),
    id => users.find(user => user.id === id),
})

const users = [] //this variable is created to save the info since we are not connecting to database
//In order to use ejs syntax, we need to tell the server
app.set('view-engine', 'ejs')

//this line of code is taking the request from 
//the email, password accessing them in the code 
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//Creating router for login.ejs and register.ejs
app.get('/', checkAuthenticated, (req, res) =>{
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login', checkAuthenticated, (req, res) =>{
    res.render('login.ejs')
})

app.post('/login',checkAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})) 

app.get('/register', checkAuthenticated, (req, res) =>{
    res.render('register.ejs')
})

//We are using asynchronous code here,
//so we use try and catch here
app.post('/register',checkAuthenticated, async (req, res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('register')
    }
    console.log(users)
})

    app.delete('/logout', (req, res)=>{
        req.logOut()
        res.redirect('/login')
    })

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
    
}
app.listen(8080)


