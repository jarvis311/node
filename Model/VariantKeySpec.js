import mongoose from "mongoose";

var VariantKeySpec = new mongoose.Schema({
    php_id: {
        type: Number,
        default: 0,
        unique: true, // Ensure uniqueness
        index: true   // Create an index for better performance
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

// var inc = 1
// VariantKeySpec.pre('save', async function (next) {
//     try {
//         const maxPhpId = await this.constructor.findOne({}, { php_id: 1 }, { sort: { php_id: -1 } });
//         console.log("saceedfjlsdjfsklh", inc++)

//         // Increment php_id by 1
//         this.php_id = maxPhpId ? maxPhpId.php_id + 1 : 1;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

var VariantKey = mongoose.model('VariantKey', VariantKeySpec)
export default VariantKey 