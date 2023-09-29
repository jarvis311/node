import { DataTypes } from "sequelize";
import { sequelize } from '../../connecttion/mysqlconn.js'

export const PriceVariantTable = sequelize.define("VehiclePriceVariant", {
    vehicle_information_id: {
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    link: {
        type: DataTypes.STRING
    },
    engine: {
        type: DataTypes.STRING
    },
    price_range: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.STRING
    },
    review_count: {
        type: DataTypes.FLOAT
    },
    rating: {
        type: DataTypes.FLOAT
    },
    status: {
        type: DataTypes.STRING
    },
    fuel_type: {
        type: DataTypes.STRING
    },
    ex_show_room_rice: {
        type: DataTypes.INTEGER
    },
    mileage: {
        type: DataTypes.DOUBLE
    },
    rto_price: {
        type: DataTypes.INTEGER
    },
    insurance_price: {
        type: DataTypes.INTEGER
    },
    other_price: {
        type: DataTypes.INTEGER
    },
    on_road_price: {
        type: DataTypes.DOUBLE
    },
    latest_update: {
        type: DataTypes.TEXT
    },
    is_scrapping: {
        type: DataTypes.TINYINT
    },
    launched_at: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.STRING
    },
    created_at: {
        type: DataTypes.DATE
    },
    updated_at: {
        type: DataTypes.DATE
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    },
    deleted_at: {
        type: DataTypes.DATE
    },
    deleted_by: {
        type: DataTypes.INTEGER
    },
},
    {
        tableName: 'vehicle_price_variant'
    }
)

// sequelize.sync().then(() => {
//     console.log('Book table created successfully!');
// }).catch((error) => {
//     console.error('Unable to create table : ', error);
// });


