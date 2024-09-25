//EXPRESSJS PACKAGES
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { initializeApp } = require('firebase/app')
const configs  = require('./firebase')
const { getFirestore, collection, getDocs } = require('firebase/firestore')

//EXPRESSJS APP INITIALIZATION & API APP CONFIGURATION
const firebaseApp = initializeApp(configs)
const app = express()
const corsOptions = {
        origin: 'http://localhost:5173',
        methods: 'HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    }

express.json()
express.urlencoded({extended: true })
// Use body-parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.options('*', cors(corsOptions)) // enable pre-flight request for POST request

//FIREBASE DB FUNCTIONS
const store = getFirestore()

//EXPRESSJS ROUTE HANDLERS
app.get('/', async (req, res) => {
    const getData = await getDocs(collection(store, 'home'))
    getData.forEach(item => {
        console.log('>>', item.id, item.data())
    })
    res.send('Running express.js API')
})


app.post('/signup', cors(corsOptions), (req, res) => {
    res.send('The server has received your request.')
})

app.listen(process.env.PORT, () => {
    console.log(`Express API server listening on http:localhost:${process.env.PORT}`)
})