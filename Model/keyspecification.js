import mongoose from "mongoose";

const keyspecificationationSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 1
    },
    name: {
        type: String
    },
    icon: {
        type: String,
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