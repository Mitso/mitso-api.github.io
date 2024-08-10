const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser')

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
app.get('/', (req, res) => {
    res.send('Running express.js API')
})


app.post('/signup', cors(corsOptions), (req, res) => {
    //API server validation
    // req.body.full_name
    // req.body.mobile_number
    // req.body.email_address
    res.send('The server has received your request.')
    //connect to a remote database.
    console.log('req', req.body)
})

app.listen(PORT, () => {
    console.log(`Express API server listening on http:localhost:${PORT}`)
})