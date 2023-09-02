import mongoose from "mongoose";

var VariantKeySpec = new mongoose.Schema({
    id: {
        type: Number,
        default: 0
    },
    vehicle_information_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: 0
    },
    variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: 0
    },
    specification_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: 0,
    },
    name: {
        type: String,
        default: "NA"
    },
    value: {
        type: String,
        default: "NULL"
    },
    is_specification: {
        type: Number,
        default: 0
    },
    is_feature: {
        type: Number,
        default: 0
    },
    variant_key_id: {
        type: Number,
        default: 0
    },
    is_update: {
        type: Number,
        default: 0
    },
    show_key_feature: {
        type: Number,
        default: 0
    },
    show_overview: {
        type: Number,
        default: 0
    },
    is_scraping: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

var VariantKey = mongoose.model('VariantKey', VariantKeySpec)

export default VariantKey 