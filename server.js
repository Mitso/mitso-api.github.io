const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    url = require('node:url');
const { saltPassword } = require('./utils/saltPassword');

const { createSSRClient } = require('./lib/supabase-ssr');
const supabase = require('./lib/supabase');
const printName  = require('./lib/test');

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
    console.log('Node module loader:', printName);
    //supabase.auth.onAuthStateChange((event, session) => {
    //     console.log('\tAuth change: Event::', event)
    //     console.log('\tAuth change: Session::', session)
    // });
    // const { data, error } = await supabase.auth.getSession();
    // console.log('\tGet user session:', data, error);

    // const { data: { user } } = await supabase.auth.getUser();
    // console.log('\tGet user:', user);
    // console.log('Reqeest Headers::' ,req.headers);

    // const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    // console.log('URL', fullUrl);

    const results = {
        msg: 'Molweni sizwe'
    }
    res.send(results);
});
app.post('/signup', async (req, res) => {
    const bodyData = req.body;
    const hashes = await saltPassword(bodyData.password);
    const user = {
        first_name: bodyData.name,
        last_name: bodyData.surname,
        name: bodyData.name + ' ' + bodyData.surname,
        phone: bodyData.mobile,
        email: bodyData.email_address,
        username: bodyData.username,
        password: hashes.pass
    };
    let err;
    try {
        const { data, error } =  await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: user,
                emailRedirectTo: 'http://localhost:3000/',   
            }
        })
        if (error) {
            err = error
            return;
        };
        const userResponse =  data.user.user_metadata
        const userObject = {
            user_id: userResponse.sub,
            username: userResponse.surname,
            phone_verified: userResponse.phone_verified,
            phone: userResponse.phone,
            email_verified: userResponse.email_verified,
            email: userResponse.email,
            fullname: userResponse.name,
            first_name: userResponse.first_name,
            last_name: userResponse.last_name
        }
        res.status(201).json(userObject);
    } catch (error) {
        err = error
        console.log('Signup: Error =>', error);
    }
    if (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/auth/confirm", async function (req, res) {
    const { data: { user1 } } = await supabase.auth.getUser();
    console.log('Auth confirm: Client Lib - Get user =>', user1);
    const token_hash = req.query.token_hash,
        type = req.query.type,
        redirectTo = req.query.next ?? "/";
    console.log('Auth confirm - Endpoint request =>', req)
    if (token_hash && type) {
        const supabase_ssr = createSSRClient({ req, res });
        const { error } = await supabase_ssr.auth.verifyOtp({
            type,
            token_hash,
        });

        //Activate login
        if (!error) {
            /*
                - get user session.
                - get user metadata.
                    - Insert user metadata into postgres db.
                    ::So that login can also just retrieve and verify user against either auth and db or db data.
            */

            const { data: { user } } = await supabase_ssr.auth.getUser();
            console.log('Auth confirm - SSR - Get user =>', user)
            //Which users table insert?
            // const { error } =  await supabase_ssr.from('user_profiles').insert([
            //     user.user_metadata
            // ]);
            // if (error) {
            //     console.error("Error inserting user:", error);
            // }
            res.redirect(303, redirectTo);
            return;
        }
    }
    // return the user to an error page with some instructions
    res.redirect(303, '/auth/auth-code-error')
});
app.get('/auth/auth-code-error', (req, res) => {
    console.log('Auth failure redirect:', req.query, req.headers)
});

app.post('/login', async (req, res) => {
    const bodyData = req.body;
    const { data, error } = await supabase.from('auth.users').select().eq("email", bodyData.email).single();
    console.log('Login: Client Lib - Get user -> data =>', data);
    console.log('Login: Client Lib - Get user -> error =>', error);
   
    console.log('Login: frontend details =>', bodyData);

    const supabase_ssr = createSSRClient({ req, res });
    const { data: { user } } = await supabase_ssr.auth.getUser();
    console.log('Login - SSR - Get user =>', user)
    //const supabase_ssr = createSSRClient({ req, res });
    
    // const { data, error } = await supabase
    //     .from("users")
    //     .select()
    // const { data, error } = await supabase.auth.getUser();

    // console.log('Login supabase response:', data, error);

    //let err;
    res.status(201).json({
        test: 'Test'
    });
    // if(hashes.match) {
    //     // const { data, error } = await supabase.auth.signInWithPassword({ 
    //         username: bodyData.username,
    //         password: hashes.pass
    //     });
    //     err = error;
    //     console.log('Loggin response:', data, err);

    //     const { data: { user } } = await supabase.auth.getUser();
    //     console.log('Login:', user);
    //     return
    // } else {
    //     err = new Error('Sorry, something went wrong.')
    // }
    // if (err) {
    //     res.status(500).json({ error: err.message });
    // }
});
/*
    Error handling middleware
        https://github.com/expressjs/express/blob/master/examples/web-service/index.js
*/
app.use((req, res) => {
    res.status = 404;
    res.send({
        error: 'Sorry, not found.'
    });
});

//Start server
app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Express API server listening on http://${process.env.HOST}:${process.env.PORT}`)
});