
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
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage')

const { log } = require('console')

app.set('views', 'views')
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
    store: new filestore({ logFn: function () { } }),
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
const upload = multer({ storage: multer.memoryStorage() })

// End of Firebase initialization

//Remove cache

app.use((request, response, next) => {
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");
    next()
});


//Personal Middleware
function isAdmin(request, response, next) {
    console.log(request.cookies)
    const { user } = request.cookies
    if (user) next();
    else {
        response.redirect('/admin-login')
    }
}

//GET METHODS

//Home page
app.get('/', (request, response) => {
    // response.render('Home')
    response.redirect('/admin-dashboard')
})

//Login page for users
app.get('/login-page', (request, response) => {
    response.render('login')
})

//Admin login page
app.get('/admin-login', (request, response) => {
    response.render('Admin login')
})

//Admin dashboard
app.get('/admin-dashboard', isAdmin, (request, response) => {
    response.render('Admin dashboard')
})

//Products route for admin
app.get('/admin-dashboard/products/:item', isAdmin, (request, response) => {
    response.render('Admin Product')
})

app.get('/admin-dashboard/orders', isAdmin, (request, response) => {
    response.render('Admin orders')
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

app.post('/admin-signin', (request, response) => {
    log(request.body)
    const { email, password } = request.body
    const user = {
        email: email,
        password: password,
        user: 'admin'
    }

    if (email === 'mariamebaschirou@gmail.com' && password === '12345678') {
        request.session.user = user
        request.session.save()
        response.cookie('user', "admin")
        response.redirect('/admin-dashboard')
    }
})


//Upload image
// app.post('/upload-file', upload.fields([
//     {
//         name:"images"
//     },
//     {
//         name:"images2"
//     }
// ]), async (request, response) => {
app.post('/upload-file', upload.array("images"), async (request, response) => {
    const received_pics = request.files

    const { color_code, color_name, price_obj } = request.body
    const { table, product_price, product_name, product_description } = request.query

    const prices = JSON.parse(price_obj)

    const docRef = db.collection(table).doc(product_name)
    const doc = await docRef.get()

    if (doc.exists) {
        console.log("product already exists")
        return response.status(409).json({
            message: 'Product Already exists'
        })
    }
    else {
        const pictures = received_pics.map(async picture => await uploadImage(table, product_name, color_name, picture.buffer, picture.mimetype, picture.originalname))

        const picLoop = async () => {
            let mypics = []
            for await (const picture of pictures) {
                mypics.push(picture)
            }
            return mypics
        }
    
        await docRef.update({
            'Base_price': product_price,
            'Description': product_description,
            [color_name]:
            {
                Color: color_code,
                Price: prices,
                Pictures: await picLoop()
            }
        })

        .catch(async error => {
            log("YO")
            await docRef.set({
                'Base_price': product_price,
                'Description': product_description,
                [color_name]:
                {
                    Color: color_code,
                    Price: prices,
                    Pictures: await picLoop()
                }

            })
        })
    }
    
    return response.status(200).json({
        message: 'Successful insertion'
    })

    



    // const docRef = db.collection(table).doc(product_name)
    // const doc = await docRef.get();

    // if (!doc.exists) {
    // //     console.log('No such document!');
    // return response.status(200).json({
    //     message: 'Product does not exist'
    // })
    // } else {
    //     console.log('Document data:', doc.data());
    //     return response.status(409).json({
    //         message: 'Product Already exists'
    //     })
    // }

    // log(doc.data())



    // Specify the document path and collection name
    // const documentPath = 'vetements/Beluga';
    // const documentPath = `${table}/${product_name}`
    // const collectionName = table;

    // Retrieve all the subcollections within the document
    // const documentRef = db.doc(documentPath);
    // const collectionsSnapshot = await documentRef.listCollections();

    // Iterate over the collections and retrieve their IDs
    // const collectionIds = collectionsSnapshot.map((collection) => collection.id);

    // Log the collection IDs
    // console.log(collectionIds);

    // const subcollections = collectionIds[1]

    // const details = [

    // ]

    // const sizes = []

    // collectionIds.forEach(async element => {
    //     let sizesObj = {}
    //     // log(element)
    //     const docRef = db.collection(table).doc(product_name).collection(element).get()
    //     .then( async snapshots =>{
    //         snapshots.forEach(snapshot => {
    //             log(snapshot.id)
    //             log(snapshot.Name)
    //             sizesObj = {
    //                 ...sizesObj,
    //                 [element]:snapshot.data()
    //             }
    //             // log(element.data())
    //         });
    //         sizes.push(sizesObj)
    //     })
    //     .catch(error =>{
    //         log(error)
    //     })

    // const doc = await docRef.get();

    // log(await docRef)
    // log(doc.data())
    // log(sizesObj)
    // });



    // console.log(request.files)
    // const files = request.files
    // log(request.body)
    // log(request.query)
    // const {table} = request.query

    // const {colors, product_name, product_price, product_description,color_names} = request.body

    // log(colors)
    // log(colors.length)
    // const docRef = db.collection(table).doc(product_name)
    // const doc = await docRef.get();
    // for (let i = 0; i < colors.length; i++) {
    //     const color = colors[i];
    //     const col_names = color_names[i] 
    //     // log(color)

    //     const imageSet = files.filter(image => image.fieldname == `images${i}`)
    //     // log(imageSet)
    //     handleUpload(table,product_name,imageSet,color,col_names,product_description,product_price)

    // }
    // log(request.headers.)

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

async function handleUpload(table, name, images, color_code, color_name, description, price) {
    let docRef = db.collection(table).doc(name)
    docRef.set({
        "description": description,
        "price": price
    })
    // let docRef
    const myPics = []
    for (let i = 0; i < images.length; i++) {
        myPics.push(await uploadImage(table, name, images[i].buffer, images[i].mimetype, images[i].originalname))
    }

    const title = `${color_code} - ${color_name}`

    await docRef.update({
        [title]: admin.firestore.FieldValue.arrayUnion(...myPics),
    });

}

// async function uploadImage(table, name, buffer, mimetype, originalname) {
async function uploadImage(table, name, color, buffer, mimetype, originalname) {
    try {


        const dateTime = giveCurrentDateTime();

        const storageRef = ref(storage, `${table}/${name}/${color}/${originalname + "    " + dateTime}`)

        // Create file metadata including the content type
        const metadata = {
            contentType: mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL
    } catch (error) {
        // return res.status(400).send(error.message)
        console.log(error)
    }
}

app.listen(port, () => console.log(`Server is listenning on port ${port}`))