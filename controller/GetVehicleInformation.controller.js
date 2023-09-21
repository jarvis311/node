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
        const getData = await vehicle_information.aggregate({})
        res.json(getData)
    } catch (error) {
        res.json(error.message)
    }
};
