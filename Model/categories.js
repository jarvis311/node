import mongoose from "mongoose";
const cataroiesSchema = new mongoose.Schema({
    // php_id: Number,
    id: Number,
    category_name: String,
    status: { type: Number, default: 1 },
    thumb_image: String,
}, { timestamps: true })

const Cataroies = mongoose.model('Cataroies', cataroiesSchema)

export default Cataroies