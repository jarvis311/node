import cheerio from "cheerio";
import axios from "axios";
import Bodytypes from '../Model/BodyType.js'
import scrap_data from '../controller/ScrappingController.js'
import helper from "../helper/helper.js";
import strip_tags from 'strip-tags'
import PriceVariant from "../Model/priceVariant.js";
import VariantSpecification from "../Model/VariantSpecification.js";
import VariantKey from "../Model/VariantKeySpec.js";
import vehicle_model_color from "../Model/VehicleModelColor.js";
import CategoryModel from "../Model/categories.js"
import keyspecification from "../Model/keyspecification.js"
import vehicle_information from "../Model/VehicleInformation.js";





export const getVehicleInformationData = async (req, res) => {
    try {
        const getData = await vehicle_information.aggregate([
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand_id',
                    foreignField: '_id',
                    as: 'brand_id',
                    pipeline: [{
                        $project: { id: 1, name: 1 },
                    }],
                },

            },
            {
                $unwind: '$brand_id' // Unwind the 'brand_id' array
            },
            {
                $lookup: {
                    from: 'cataroies',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category_id',
                    pipeline: [{
                        $project: { id: 1, category_name: 1 }
                    }]
                }
            },
            {
                $unwind: '$category_id' // Unwind the 'category_id' array
            }
        ])
        res.json(getData)
    } catch (error) {
        res.json(error.message)
    }
};
