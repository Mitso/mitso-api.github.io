const express = require('express'),
    cors = require('cors');
//bodyParser = require('body-parser');

const app = express();

express.json(); 
express.urlencoded({extended: true });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
const corsOptions = {
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//EXPRESSJS ROUTE HANDLERS
app.get('/', async (req, res) => {
    res.json({
        hello: "world"
    });
});

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`Express API server listening on http//${process.env.HOST}:${process.env.PORT}`)
});