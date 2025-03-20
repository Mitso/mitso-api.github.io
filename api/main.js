const postgres =require('postgres');

// Database connection;
const cn = {
    host: 'db.arrtiqaifolxcrxdoado.supabase.co', 
    port: process.env.PGPORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_NAME,
    password: process.env.PASS
};

/*
    Alternative
        postgres 1)     pgp('postgres://username:password@host:port/database')
        pg-promise 2)   postgresql://${cn.user}:${cn.password}@${cn.host}:${cn.port}/${cn.database}
*/
const sql = postgres(`postgresql://${cn.user}:${cn.password}@${cn.host}:${cn.port}/${cn.database}`); // Database instance;
exports.sql = sql;