
// import mysql from 'mysql2/promise'
// // const con = mysql.createConnection({
// //     host: 'localhost',
// //     user: 'root',
// //     password: '',
// //     database: 'rto_sumit'
// // })

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize('test_db', 'root', '', {
    host: 'localhost',
    dialect: "mysql"
});
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'rto_scapping',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

// const con = await pool.getConnection();

// // con.connect((err) => {
// //     if (err) throw err
// //     console.log('Database Connected')
// // })

// export default con