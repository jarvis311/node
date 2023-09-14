import mongoose from "mongoose";

const keyspecificationationSchema = new mongoose.Schema({
    // php_id: {
    //     type: Number,
    //     default: 1
    // },
    id: {
        type: Number,
        default: 1
    },
    name: {
        type: String
    },
    icon: {
        type: String,
        default:null
    },
    deleted_by: {
        type: Number,
        default: null
    },
    deleted_at: {
        type: String,
        default: null
    },
}, { timestamps: true })
var keyspecification = mongoose.model('Keyspecification', keyspecificationationSchema)

export default keyspecification