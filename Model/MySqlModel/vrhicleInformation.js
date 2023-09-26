import { DataTypes } from "sequelize";
import { sequelize } from '../../connecttion/mysqlconn.js'


export const VehicleInformationTable = sequelize.define("vehicle_informations", {

    id: {
        type: DataTypes.NUMBER,
        primaryKey: true
    },
    brand_id: {
        type: DataTypes.INTEGER
    },
    category_id: {
        type: DataTypes.INTEGER
    },
    model_name: {
        type: DataTypes.STRING,
        default: "NA"
    },
    fuel_type: {
        type: DataTypes.STRING,
        default: "NA"
    },
    avg_rating: {
        type: DataTypes.STRING,
        default: "NA"
    },
    review_count: {
        type: DataTypes.NUMBER,
        default: "NA"
    },
    variant_name: {
        type: DataTypes.STRING,
        default: "NA"
    },
    min_price: {
        type: DataTypes.STRING,
        default: 0
    },
    max_price: {
        type: DataTypes.STRING,
        default: 0
    },
    price_range: {
        type: DataTypes.STRING,
        default: "NA"
    },
    image: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        default: "NA"
    },
    launched_at: {
        type: DataTypes.STRING,
        default: null
    },
    Launch_date: {
        type: DataTypes.STRING,
        default: null
    },
    model_popularity: {
        type: DataTypes.STRING,
        default: 0
    },
    mileage: {
        type: DataTypes.STRING,
        default: "NA"
    },
    engine: {
        type: DataTypes.STRING,
        default: "NA"
    },
    style_type: {
        type: DataTypes.STRING,
        default: "NA"
    },
    max_power: {
        type: DataTypes.STRING,
        default: "NA"
    },
    showroom_price: {
        type: DataTypes.STRING,
        default: 0
    },
    on_road_price: {
        type: DataTypes.STRING,
        default: 0
    },
    is_popular_search: {
        type: DataTypes.NUMBER,
        default: 0
    },
    is_upcoming: {
        type: DataTypes.NUMBER,
        default: 0
    },
    is_latest: {
        type: DataTypes.NUMBER,
        default: 0
    },
    price_desc: {
        type: DataTypes.STRING,
        default: null
    },
    highlights_desc: {
        type: DataTypes.STRING,
        default: null
    },
    key_specs: {
        type: DataTypes.STRING,
        default: null
    },
    manufacturer_desc: {
        type: DataTypes.STRING,
        default: null
    },
    body_type: {
        type: DataTypes.STRING,
        default: "NA"
    },
    is_most_search: {
        type: DataTypes.STRING,
        default: "NA"
    },
    expired_date: {
        type: DataTypes.STRING
    },
    start_date: {
        type: DataTypes.STRING
    },
    rating: { type: DataTypes.STRING, default: 0 },
    link: {
        type: DataTypes.STRING,
        default: null
    },
    rto_price: {
        type: DataTypes.NUMBER,
        default: 0
    },
    insurance_price: {
        type: DataTypes.NUMBER,
        default: 0
    },
    other_price: {
        type: DataTypes.NUMBER,
        default: 0
    },
    is_new: {
        type: DataTypes.NUMBER,
        default: 0
    },
    bodytype_id: {
        // type: DataTypes.NUMBER,
        type: DataTypes.NUMBER,
        default: 0
    },
    is_content_writer: {
        type: DataTypes.NUMBER,
        default: 0
    }
});