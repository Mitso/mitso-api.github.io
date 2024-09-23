//EXPRESSJS PACKAGES
const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser')
const { getFirestore, collection, getDocs } = require('firebase/firestore')

//EXPRESSJS APP INITIALIZATION & API APP CONFIGURATION
const app = express()
const PORT = '8080',
    corsOptions = {
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

app.listen(PORT, () => {
    console.log(`Express API server listening on http:localhost:${PORT}`)
})