import mongoose from "mongoose";


const BrandsSchema = new mongoose.Schema({
    id: Number,
    category_id: Number,
    name: String,
    headtag: {
        type: String,
        default: null
    },
    test_drive_link: {
        type: String,
        default: "NA"
    },
    is_popular: {
        type: Number,
        default: 0
    },
    title: String,
    logo: { type: String, default: null },
}, { timestamps: true })

const Brands = mongoose.model('Brands', BrandsSchema)

export default Brands