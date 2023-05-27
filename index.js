
const express = require('express')
const port = 3000
const app = express()
const bodyparser = require("body-parser");
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ entended: true }))
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const filestore = require("session-file-store")(sessions)
const multer = require('multer')
const {getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage')

const {log} = require('console')

app.set('views','views')
app.set('view engine', 'hbs');
app.use(express.static('public'))

const oneDay = 1000 * 60 * 60 * 24;


// cookie parser middleware
app.use(cookieParser());

//session middleware
app.use(sessions({
    name: "User_Session",
    secret: "8Ge2xLWOImX2HP7R1jVy9AmIT0ZN68oSH4QXIyRZyVqtcl4z1I",
    saveUninitialized: false,
    cookie: { maxAge: oneDay, httpOnly: false },
    resave: false,
    store: new filestore({ logFn: function() {} }),
    path: "./sessions/"
}));


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

//Initialize firebase cloud storage and get a reference to the service
const storage = getStorage()

//Setting up multer  as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage()})

// End of Firebase initialization

//Remove cache

app.use((request, response, next) => {
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");
    next()
});


//Personal Middleware
function isAdmin(request,response,next){
    console.log(request.cookies)
    const {user} = request.cookies
    if(user) next();
    else{
        response.redirect('/admin-login')
    }
}

//GET METHODS

//Home page
app.get('/', (request,response)=>{
    // response.render('Home')
    response.redirect('/admin-dashboard')
})

//Login page for users
app.get('/login-page', (request,response)=>{
    response.render('login')
})

//Admin login page
app.get('/admin-login',(request,response)=>{
    response.render('Admin login')
})

//Admin dashboard
app.get('/admin-dashboard', isAdmin,(request,response)=>{
    response.render('Admin dashboard')
})

//Products route
app.get('/products/:item',(request,response)=>{
    response.render('Admin Product')
})


//Logout

app.get('/logout', (request, response) => {
    request.session.destroy((err) => {
        if (err) throw err;
        request.session = null;
        response.clearCookie('user')
        response.clearCookie('User_Session')
        response.redirect('/')
    })
})

//POST METHODS

//Sign in for the admin

app.post('/admin-signin',(request,response)=>{
    log(request.body)
    const {email, password} = request.body
    const user = {
        email: email,
        password: password,
        user: 'admin'
    }

    if(email === 'mariamebaschirou@gmail.com' && password === '12345678'){
        request.session.user = user
        request.session.save()
        response.cookie('user', "admin")
        response.redirect('/admin-dashboard')
    }
})


//Upload image
app.post('/upload-file', upload.fields([
    {
        name:"images"},
    {
        name:"images2"
    }
]), async (request, response) => {
    // app.post('/upload-file', upload.array("images"), async (request, response) => {
    console.log(request.files)
    log(request.body)
    log(request.query)
    const {table} = request.query
    // log(request.headers.)
    try {
        const dateTime = giveCurrentDateTime();

        const storageRef = ref(storage, `${table}/${request.file.originalname + "       " + dateTime}`);

        // Create file metadata including the content type
        const metadata = {
            contentType: request.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, request.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('File successfully uploaded.');
        return response.send({
            message: 'file uploaded to firebase storage',
            name: request.file.originalname,
            type: request.file.mimetype,
            downloadURL: downloadURL
        })
    } catch (error) {
        // return res.status(400).send(error.message)
        console.log(error)
    }
})

//PUT METHODS


//DELETE METHODS


//My functions
const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
}

app.listen(port, ()=> console.log(`Server is listenning on port ${port}`))