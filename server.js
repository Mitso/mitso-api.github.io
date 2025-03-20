const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser');

const { createClient } = require('@supabase/supabase-js')
const { db } = require('./api/db');

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.ENDPOINT, process.env.PUBLIC)

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
const corsOptions = {
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


//EXPRESSJS ROUTE HANDLERS
app.get('/', async (req, res) => {
    const getData = await supabase 
        .from('generic')
        .select('*')
        .then(({ data, error }) => {
            if (error) throw error;
            return data;
        });
    console.log('Prod server data:', getData);
  
    // await db.query('SELECT $1:name FROM $2:name', ['*', 'generic'])
    //     .then((data) => {
    //         console.log('Local server data:', data);
    //         res.json({
    //             msg: 'Testing'
    //         });
    //     })
    //     .catch((error) => {
    //         console.log('ERROR:', error)
    //     })  
});


/*
    Error handling middleware
        https://github.com/expressjs/express/blob/master/examples/web-service/index.js
*/
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({ error: err.message });
});

app.use((req, res) => {
    res.status = 404;
    res.send({
        error: 'Sorry, not found.'
    });
});


app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Express API server listening on http://${process.env.HOST}:${process.env.PORT}`)
});