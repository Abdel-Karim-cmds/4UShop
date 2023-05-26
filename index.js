
const express = require('express')
const port = 3000
const app = express()
const bodyparser = require("body-parser");
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ entended: false }))
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const filestore = require("session-file-store")(sessions)

app.set('views','views')
app.set('view engine', 'hbs');
app.use(express.static('public'))

const oneDay = 1000 * 60 * 60 * 24;

//Firebase configuration

const admin = require('firebase-admin')

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const Authentication = require('firebase/auth')
const Initialize = require('firebase/app')

const db = admin.firestore()


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC__wmwrcOCPgMIUyOFY7xDQzyfsG0jZDg",
    authDomain: "ushop-fe0bc.firebaseapp.com",
    projectId: "ushop-fe0bc",
    storageBucket: "ushop-fe0bc.appspot.com",
    messagingSenderId: "1061723264657",
    appId: "1:1061723264657:web:34f64b47f08031fcf21130",
    measurementId: "G-2S37QKG3BK"
  };
  
const firebaseApp = Initialize.initializeApp(firebaseConfig);

// End of Firebase initialization

//Remove cache

app.use((request, response, next) => {
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");
    next()
});


//GET METHODS

app.get('/', (request,response)=>{
    // response.render('home')
    response.redirect('/login-page')
})

app.get('/login-page', (request,response)=>{
    response.render('login')
})

app.get('/login-page', (request,response)=>{
    response.render('login')
})

//POST METHODS


//PUT METHODS


//DELETE METHODS

app.listen(port, ()=> console.log(`Server is listenning on port ${port}`))