import mongoose from "mongoose";

const VariantSpecificationSchema = new mongoose.Schema({
    php_id: {
        type: Number,
        default: 1
    },
    name: String
})
var VariantSpecification = mongoose.model('Variant_specifications', VariantSpecificationSchema)

export default VariantSpecification