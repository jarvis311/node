
import mysql from 'mysql2/promise'
// const con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'rto_sumit'
// })

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'rto_sumit',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const con = await pool.getConnection();

// con.connect((err) => {
//     if (err) throw err
//     console.log('Database Connected')
// })

export default con
