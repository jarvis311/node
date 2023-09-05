import mongoose from "mongoose";

const VariantSpecificationSchema = new mongoose.Schema({
    php_id: {
        type: Number,
        default: 1
    },
    name: String
})
var VariantSpecification = mongoose.model('VariantSpecification', VariantSpecificationSchema)

export default VariantSpecification