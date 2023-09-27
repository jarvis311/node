import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql', etc.
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'rto_sumit',
});
