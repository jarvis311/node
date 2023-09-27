import { VehicleInformationTable } from "../Model/MySqlModel/vehicleInformation.js";
import mongoose from "mongoose";
import Cataroies from "../Model/categories.js";
import Brands from "../Model/Brands.js";
import vehicle_information from "../Model/VehicleInformation.js";
import { ModelColorTable } from "../Model/MySqlModel/modelColor.js";
import { PriceVariantTable } from "../Model/MySqlModel/priceVariant.js";
import { VariantkeySpec } from "../Model/MySqlModel/variantKeySpec.js";
import VariantSpecification from "../Model/VariantSpecification.js";
import { VariantSpecificationsTable } from "../Model/MySqlModel/variantSpecifications.js";


export const MysqltoMongodbConver = async (req, res) => {
    try {
        console.log("=============Insiode================== ")
        const postData = await vehicle_information.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(req.body.vehicleId) } },
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
            },
            // vehicle_model_colors 
            {
                $lookup: {
                    from: 'vehicle_model_colors',
                    localField: '_id',
                    foreignField: 'vehicle_information_id',
                    as: 'modelColor',
                }
            },
            // vehicle_price_variant 
            {
                $lookup: {
                    from: 'vehicle_price_variants',
                    localField: '_id',
                    foreignField: 'vehicle_information_id',
                    as: 'priceVariant',
                }
            },
            // vehicle_price_variant 
            {
                $lookup: {
                    from: 'variant_key_specs',
                    localField: '_id',
                    foreignField: 'vehicle_information_id',
                    as: 'keySpec',
                }
            }
        ])
        const mongooseData = postData[0]

        if (mongooseData) {
            try {
                const findIsExistOrNot = await VehicleInformationTable.findOne({ where: { id: mongooseData.php_id } })

                if (findIsExistOrNot) {
                    console.log("If findIsExistOrNot")
                } else {
                    console.log("else findIsExistOrNot")
                    const createData = await VehicleInformationTable.create({
                        id: mongooseData.php_id,
                        brand_id: mongooseData.brand_id.id,
                        category_id: mongooseData.category_php_id,
                        bodytype_id: mongooseData.brand_php_id,
                        bind_id: mongooseData?.bind_id || 0,
                        model_name: mongooseData.model_name,
                        fuel_type: mongooseData.fuel_type,
                        avg_rating: mongooseData.avg_rating,
                        review_count: mongooseData.review_count,
                        variant_name: mongooseData.variant_name,
                        min_price: Number(mongooseData.min_price),
                        max_price: Number(mongooseData.max_price),
                        price_range: mongooseData.price_range,
                        search_count: mongooseData?.search_count || 0,
                        popular_count: mongooseData?.popular_count || 0,
                        status: mongooseData.status,
                        is_content_writer: mongooseData.is_content_writer,
                        is_designer: mongooseData.is_designer || 0,
                        on_road_price: Number(mongooseData.on_road_price),
                        is_popular_search: mongooseData.is_popular_search,
                        is_upcoming: mongooseData.is_upcoming,
                        is_latest: mongooseData.is_latest,
                        is_recommended: mongooseData.php_id,
                        highlights_desc: mongooseData.highlights_desc,
                        price_desc: mongooseData.price_desc,
                        key_specs: mongooseData.key_specs,
                        manufacturer_desc: mongooseData.manufacturer_desc,
                        link: mongooseData.link,
                        rto_price: mongooseData.rto_price,
                        insurance_price: mongooseData.insurance_price,
                        other_price: mongooseData.other_price,
                    })
                    if (createData) {
                        console.log("---------createData--------")
                        if ("modelColor" in mongooseData) {
                            for (const item of mongooseData?.modelColor) {
                                await ModelColorTable.create({
                                    id: item.php_id,
                                    vehicle_information_id: item.php_vehicle_information_id,
                                    color_name: item.color_name,
                                    color_code: item.color_code,
                                    image: item.image,
                                    createdAt: item.createdAt,
                                    updatedAt: item.updatedAt,
                                    created_at: item.createdAt,
                                    updated_at: item.updatedAt,
                                })

                            }
                        }
                        if ("priceVariant" in mongooseData) {
                            for (const item of mongooseData?.priceVariant) {
                                await PriceVariantTable.create({
                                    id: item.php_id,
                                    vehicle_information_id: item.php_vehicle_information_id,
                                    name: item.name,
                                    link: item.link,
                                    engine: item.engine,
                                    price_range: item.price_range,
                                    price: item.price,
                                    review_count: item.review_count,
                                    rating: item.rating,
                                    status: item.status,
                                    fuel_type: item.fuel_type,
                                    ex_show_room_rice: item.ex_show_room_rice,
                                    mileage: item.mileage,
                                    rto_price: item.rto_price,
                                    insurance_price: item.insurance_price,
                                    other_price: item.other_price,
                                    on_road_price: item.on_road_price,
                                    latest_update: item.latest_update,
                                    is_scrapping: item.is_scrapping,
                                    launched_at: item.launched_at,
                                    image: item.image,
                                    created_at: item.createdAt,
                                    updated_at: item.updatedAt,
                                    createdAt: item.createdAt,
                                    updatedAt: item.updatedAt,
                                })
                            }
                        }

                        if ("keySpec" in mongooseData) {
                            for (const item of mongooseData.keySpec) {
                                await VariantkeySpec.create({
                                    id: item.php_id,
                                    vehicle_information_id: item.php_vehicle_information_id,
                                    variant_id: item.php_variant_id,
                                    specification_id: item.php_specification_id,
                                    name: item.name,
                                    value: item.value,
                                    is_feature: item.is_feature,
                                    variant_key_id: item.php_variant_key_id,
                                    is_specification: item.is_specification,
                                    is_update: item.is_update,
                                    show_key_feature: item.show_key_feature,
                                    show_overview: item.show_overview,
                                    is_scraping: item.is_scraping,
                                    created_at: item.createdAt,
                                    updated_at: item.updatedAt,
                                    createdAt: item.createdAt,
                                    updatedAt: item.updatedAt,
                                })
                            }
                        }
                    }
                }
                const VarSpec = await VariantSpecification.find({})

                VarSpec.map(async (item) => {
                    const findVarSpec = await VariantSpecificationsTable.findOne({ where: { name: item.name } })
                    if (!findVarSpec) {
                        await VariantSpecificationsTable.create({ name: item.name })
                    }
                })
            } catch (error) {
                return res.json(error.message)
            }
        }
        // const response = await VehicleInformationTable.findAll({})
        res.send(postData)
    } catch (error) {
        console.log(error)
    }
}