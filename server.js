const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser');

const { hashPassword, verifyPassword } = require( './utils/salt');

const { createClient } = require('@supabase/supabase-js');
// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.ENDPOINT, process.env.PUBLIC);

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
    await supabase
    .from("generic")
    .select('*')
    .then(({ data, error }) => {
        if (error) throw error;
        res.json(data);
    }).catch((error) => {
        console.log('ERROR:', error)
    });
});

app.post('/signup', async (req, res) => {
    const data = req.body;
    const hashedPassword = await hashPassword(data.password);
    //TO REVIEW 
    const isPasswordMatch = await verifyPassword(data.password, hashedPassword);
    if (!isPasswordMatch) {
        throw new Error('Passwords do not match');
    }
   
    const {error } = await supabase
    .from('users')
    .insert({ 
        first_name: data.name,
        last_name: data.surname,
        mobile: data.phone,
        email: data.email_address,
        username: data.username,
        password: hashedPassword
    });
    res.status(201).json({ message: 'User registered successfully' });

   if (error) {
        res.status(500).json({ error: error.message });
    }
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