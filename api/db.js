//https://github.com/vitaly-t/pg-promise
const pgp = require('pg-promise')(/* options */);

// Database connection;
const cn = {
    host: process.env.PGPHOST, 
    port: process.env.PGPORT,
    database: process.env.PGPDATABASE,
    user: process.env.PGUSER,
    password: passphrase = process.env.PGPPASS,

    // to auto-exit on idle, without having to shut down the pool;
    // see https://github.com/vitaly-t/pg-promise#library-de-initialization
    allowExitOnIdle: true
};
// You can check for all default values in:
// https://github.com/brianc/node-postgres/blob/master/packages/pg/lib/defaults.js

const db = pgp(cn); // Database instance;
exports.db = db;
