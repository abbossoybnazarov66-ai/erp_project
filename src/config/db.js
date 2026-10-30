import { Pool } from "pg";

const pool = new Pool({
    user: process.env.PG_NAME,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT,
    password: process.env.PG_PASSWORD,
});


export default pool;