const express = require("express");
const app = express();
//bcrypt allows use to hash passwords to make sure the application is entirely secure.
const bcrypt = require('bcrypt')

const users = [] //this variable is created to save the info since we are not connecting to database
//In order to use ejs syntax, we need to tell the server
app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

//Creating router for login.ejs and register.ejs
app.get('/', (req, res) =>{
    res.render('index.ejs', {name: 'Wisdom'})
})

app.get('/login', (req, res) =>{
    res.render('login.ejs')
})

app.post('/login', (req, res) =>{

})

app.get('/register', (req, res) =>{
    res.render('register.ejs')
})

//We are using asynchronous code here,
//so we use try and catch here
app.post('/register', async (req, res) =>{
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
app.listen(3000)


