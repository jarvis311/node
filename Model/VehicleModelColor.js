import mongoose from "mongoose";

var vehicle_model_colorSchema = new mongoose.Schema({
    id: Number,
    vehicle_information_id: mongoose.Schema.Types.ObjectId,
    color_name: {
        type: String,
        default: "NA"
    },
    color_code: {
        type: String,
        default: "NA"
    },
    image: {
        type: String,
        default: null
    }
}, { timestamps: true })

const vehicle_model_color = mongoose.model('vehicle_model_color', vehicle_model_colorSchema)

export default vehicle_model_color