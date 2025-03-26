const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const { hashPassword, verifyPassword } = require( './utils/salt');
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


const passwordSalt = async (password) => {
    const hashedPassword = await hashPassword(password);
    const isPasswordMatch = await verifyPassword(password, hashedPassword);
    if (!isPasswordMatch) {
        throw new Error('Passwords do not match');
    }
    return {
        match: isPasswordMatch, 
        pass: hashedPassword
    }
}




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
    const bodyData = req.body;
    const hashes = await passwordSalt(bodyData.password);
    const user = {
        first_name: bodyData.name,
        last_name: bodyData.surname,
        mobile: bodyData.phone,
        email: bodyData.email_address,
        username: bodyData.username,
        password: hashes.pass
    };
    let err, status;
    
    if(hashes.match) {
        const { data, error } = await supabase.auth.signUp(user);
        if (error) {
            err = error; 
            return;
        }
      
        if (data.user.aud) {
            const { error } = await supabase
            .from('users')
            .insert(user);

            if (error) {
                err = error
                return;
            } 
            status = 'Success';
        }
        res.status(201).json({ user: data });
    } else {
        err = new Error('Sorry, something went wrong.')
    }

    if (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    const bodyData = req.body;
    console.log('Loggin user:', bodyData);

    const hashes = await passwordSalt(bodyData.password);
    let err;
    if(hashes.match) {
        const { data, error } = await supabase.auth.signInWithPassword({ 
            username: bodyData.username,
            password: hashes.pass
        });
        err = error;
        console.log('Auth data:', data);
    } else {
        throw new Error('Sorry, something went wrong.')
    }
    if (err) {
        res.status(500).json({ error: err.message });
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