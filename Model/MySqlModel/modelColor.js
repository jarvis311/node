import { DataTypes } from "sequelize";
import { sequelize } from '../../connecttion/mysqlconn.js'

export const ModelColorTable = sequelize.define("vehicle_model_colors", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    vehicle_information_id: {
        type: DataTypes.INTEGER,
    },
    color_name: {
        type: DataTypes.STRING,
    },
    color_code: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    },
},
    {
        tableName: "vehicle_model_color"
    })

// sequelize.sync().then(() => {
//     console.log('Book table created successfully!');
// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });

