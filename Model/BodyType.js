import mongoose from "mongoose";

const bodytypsSchema = new mongoose.Schema({
    id: Number,
    category_id: mongoose.Schema.Types.ObjectId,
    name: String,
    image: String,
    status: {
        type: Number,
        default: 0
    },
    position: {
        type: String,
        default: 0
    }

}, { timestamps: true })

const bodytypes = mongoose.model('bodytypes', bodytypsSchema)

export default bodytypes