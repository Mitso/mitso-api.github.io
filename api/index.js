const pgp = require('pg-promise')(/* options */);
const  host = process.env.PGPHOST,
    port = process.env.PGPORT,
    name = process.env.PGPDATABASE,
    username = process.env.PGUSER,
    passphrase = process.env.PGPORT;
   
const db = pgp(`postgres://${username}:${passphrase}@${host}:${port}/${name}`);
exports.db = db;
