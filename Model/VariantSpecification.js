import mongoose from "mongoose";

var VariantSpecificationSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: 0
    },
    name: String
})

var VariantSpecification = mongoose.model('VariantSpecification', VariantSpecificationSchema)

export default VariantSpecification