import cheerio from "cheerio";
import axios from "axios";
import bodytypes from '../Model/BodyType.js'
import helper from "../helper/helper.js";
import strip_tags from 'strip-tags'
import vehicle_information from "../Model/VehicleInformation.js";
import PriceVariant from "../Model/priceVariant.js";
import VariantSpecification from "../Model/VariantSpecification.js";
import VariantKey from "../Model/VariantKeySpec.js";
import vehicle_model_color from "../Model/VehicleModelColor.js";
import Brands from "../Model/Brands.js";
import con from "../connecttion/mysqlconn.js";


var category_id;
var link;


const scrap_cars = async (input, brand) => {
    try {

        category_id = input.category
        link = input.link
        var brand = brand
        var brand_id = brand.id
        if (input.scrap_type == "brand") {
            var new_bike_url = "https://www.cardekho.com/cars/" + brand.name
        } else {
            var res_specific_bikes = await get_specific_car(link, input, brand)
            return res_specific_bikes;
        }
        var data_res_arr = await scrap_coman_code(new_bike_url)
        console.log('first')
        if ('items' in data_res_arr) {
            var new_cars = data_res_arr.items.map(async (val) => {
                // var cheakid = await vehicle_information.find().select({ id: 1 }).sort({ _id: -1 }).limit(1)
                // var tokenid = cheakid.length !== 0 ? cheakid[0].id + 1 : 1
                // const id = tokenid
                brand_id = brand_id
                const avg_rating = val.avgRating ? val.avgRating : 0
                const review_count = val.reviewCount ? val.reviewCount : 0
                const variant_name = val.variantName ? val.variantName : "NA"
                let min_price = val.minPrice ? val.minPrice : 0
                let max_price = val.maxPrice ? val.maxPrice : 0
                const price_range = val.priceRange ? val.priceRange : "NA"
                const status = val.status ? val.status : "NA"
                const launched_at = val.launchedAt ? val.launchedAt : "NA"
                const model_name = val.modelName
                const mileage = val.mileage ? parseFloat(val.mileage) : 0
                const engine = val.engine ? parseFloat(val.engine) : 0
                const fuel_type = val.fuelType ? val.fuelType : "NA"
                const showroom_price = val.exShowRoomPrice ? val.exShowRoomPrice : "NA"
                const model_popularity = val.modelPopularity ? val.modelPopularity : "NA"
                const style_type = val.vehicleType ? val.vehicleType : "NA"
                const category_id = 2
                const on_road_price = val.minOnRoadPrice ? val.minOnRoadPrice : val.exShowRoomPrice ? val.exShowRoomPrice : "NA"
                var new_car_url = val.modelUrl
                var images_url = val.modelPictureURL
                var specification_url = val.modelSpecsURL


                if (showroom_price.includes('Lakh')) {
                    let price = showroom_price.replace(/[^0-9-]+/g, '');
                    price += '000';
                    showroom_price = price;
                }
                if (on_road_price.includes('Lakh')) {
                    let price = on_road_price.replace(/[^0-9-]+/g, '');
                    price += '000';
                    on_road_price = price;
                }

                if (min_price.includes('Lakh')) {
                    let price = min_price.replace(/[^0-9-]+/g, '');
                    price += '000';
                    min_price = price;
                }
                if (max_price != 0) {

                    if (max_price.includes('Lakh')) {
                        let price = max_price.replace(/[^0-9-]+/g, '');
                        price += '000';
                        max_price = price;
                    }
                } else {

                    max_price = 0
                }

                const cardata = {
                    // id: id,
                    category_id: category_id,
                    brand_id: brand_id,
                    link: link,
                    scrap_type: input.scrap_type,
                    model_name: model_name,
                    fuel_type: fuel_type,
                    avg_rating: avg_rating,
                    review_count: review_count,
                    variant_name: variant_name,
                    min_price: min_price,
                    max_price: max_price,
                    price_range: price_range,
                    status: status,
                    launched_at: launched_at,
                    model_popularity: model_popularity,
                    mileage: mileage,
                    engine: engine,
                    style_type: style_type,
                    showroom_price: showroom_price,
                    on_road_price: on_road_price,
                }
                // var car_exist = await vehicle_information.findOne({ $and: [{ brand_id: brand_id }, { model_name: model_name }] })
                const [rows, filed] = await con.query("SELECT * FROM `vehicle_information` WHERE `brand_id`= " + `'${brand_id}'` + " AND `model_name` LIKE " + `'${model_name}'`)
                const car_exist = rows[0]

                if (car_exist) {
                    var vehicle_information_id = car_exist.id
                    // await vehicle_information.findOneAndUpdate({ $and: [{ brand_id: brand_id }, { model_name: model_name }] }, cardata, { new: true })
                    const qr = ("UPDATE " + `vehicle_information ` + "SET " + `brand_id = ${brand_id} ,category_id = ${category_id}, model_name = '${model_name}',fuel_type = '${fuel_type}',avg_rating = ${avg_rating}, review_count = ${review_count} ,variant_name = '${variant_name}',min_price='${min_price}',max_price=${max_price},status='${status}', launched_at='${launched_at}',model_popularity='${model_popularity}',mileage=${mileage},engine=${engine},style_type='${style_type}',showroom_price='${showroom_price}',on_road_price='${on_road_price}',link='${link}' WHERE brand_id = ${brand_id} AND model_name LIKE '${model_name}'`)
                    const update = await con.query(qr)

                    await get_vehicle_other_details(new_car_url, vehicle_information_id, 0, cardata)
                } else {
                    // var res = await vehicle_information.create(cardata)
                    const qr = ("INSERT INTO vehicle_information( brand_id, category_id, model_name, fuel_type, avg_rating, review_count, variant_name, min_price, max_price, status, launched_at, model_popularity, mileage, engine, style_type, showroom_price, on_road_price, link  )") + ' VALUES ' + (`(${brand_id}, ${category_id},'${model_name}','${fuel_type}',${avg_rating},${review_count},'${variant_name}','${min_price}',${max_price},'${status}','${launched_at}','${model_popularity}',${mileage},${engine},'${style_type}','${showroom_price}','${on_road_price}','${link}')`)

                    let craete = await con.query(qr)

                    let vehicle_information_id = craete[0].insertId
                    await get_vehicle_other_details(new_car_url, vehicle_information_id, 0, cardata)
                }

            })
        }
        if (new_cars) {
            if ('upcomingCars' in data_res_arr) {
                var url = data_res_arr.upcomingCars.url ? data_res_arr.upcomingCars.url : null
                if (url) {
                    await upcoming_car_by_brand(url)
                } else {
                    return (await helper.macthError('Upcoming Car Not Scrapped'))
                }
            }
        } else {
            if ('upcomingCars' in data_res_arr) {
                var url = data_res_arr.upcomingCars.url ? data_res_arr.upcomingCars.url : null
                if (url) {
                    await upcoming_car_by_brand(url)
                } else {
                    return (await helper.macthError('Upcoming Car Not Scrapped'))
                }
            }
        }
        return data_res_arr
    } catch (err) {
        console.log(err);
    }
}

const get_vehicle_other_details = async (url, vehicle_information_id, variant_id = 0, input) => {

    var new_car_url = "https://www.cardekho.com" + url
    var variant_data_arr = await scrap_coman_code(new_car_url)

    if ('quickOverview' in variant_data_arr) {
        var feature = variant_data_arr.quickOverview.list ? variant_data_arr.quickOverview.list : "NA"

        if (feature) {
            if (typeof feature !== "string") {
                var specs = feature.map((valde) => {
                    var specs_arr = valde.iconname ? valde.iconname : "NA"

                    if (valde.iconname == "Transmission") {
                        specs_arr = valde.iconname
                    } else {
                        specs_arr = valde.iconvalue ? valde.iconvalue : ""
                    }
                    return specs_arr
                })
                var key_fear = specs.map((valuedata) => {
                    return valuedata
                })
            } else {
                key_fear = "NA"
            }
        } else {
            key_fear = "NA"
        }
        /*Multidimention Array to string conversion*/
        var key_specs = 'Features:' + key_fear

        const qr = ("UPDATE " + `vehicle_information ` + "SET " + `key_specs = '${key_specs}' WHERE id = ${vehicle_information_id}`)
        const update = await con.query(qr)
        // var update = await vehicle_information.findOneAndUpdate({ id: vehicle_information_id }, { key_specs: key_specs }, { new: true })

        //specification

        if (url in variant_data_arr) {
            if (variant_data_arr.url) {
                await get_vehicle_specification(variant_data_arr.url, vehicle_information_id, 0, input)
            }
        }
    }
    //----------------------------Vehicle Images+ colors ------------------------ Main Vehicle Images
    //insert vehicle color images
    if ('galleryColorSection' in variant_data_arr) {
        if ('items' in variant_data_arr.galleryColorSection) {
            const images = variant_data_arr.galleryColorSection.items
            images.map(async (color_img) => {

                const color_name = color_img.title ? color_img.title : "NA"
                const color_code = color_img.code ? color_img.code : "NA"
                const image = color_img.image ? color_img.image : "NA"
                const official_image = color_img.image ? color_img.image : "NA"

                const carcolor = {
                    vehicle_information_id: vehicle_information_id,
                    color_name: color_name,
                    color_code: color_code,
                    image: image
                }
                // var color_exist = await vehicle_model_color.find({ $and: [{ vehicle_information_id: vehicle_information_id }, { color_name: color_name }, { image: official_image }] }).count()
                const [rows, filed] = await con.query("SELECT * FROM `vehicle_model_color` WHERE `vehicle_information_id`= " + `${vehicle_information_id}` + " AND `color_name` = " + `'${color_name}'` + "AND `image` =" + `'${image}'`)
                const color_exist = rows[0]


                const qr = ("INSERT INTO vehicle_model_color ( vehicle_information_id, color_name, color_code, image)") + ' VALUES ' + (`(${vehicle_information_id}, '${color_name}','${color_code}','${image}')`)
                let craete = await con.query(qr)
                // var color_img = await vehicle_model_color.create(carcolor)
            })
        }
    }
    //images*****************

    //----------------------------Variant table------------------
    if ('variantTable' in variant_data_arr) {
        var variantTable = variant_data_arr.variantTable
        if ('childs' in variantTable) {
            var child_variant_ = variantTable.childs
            child_variant_.map((valdatas) => {
                if ('items' in valdatas) {
                    var childs_arr = valdatas.items.map(async (child) => {
                        var child = child.url
                        var exShowRoomPrice = child.exShowRoomPrice ? child.exShowRoomPrice : 0
                        var onRoadPrice = child.onRoadPrice ? child.onRoadPrice : 0
                        await get_variant_details(url, vehicle_information_id, exShowRoomPrice, onRoadPrice, input)
                    })
                }
            })
        }
    }

    if ('variantTable' in variant_data_arr) {
        var variantTable = variant_data_arr.variantTable
        if ('childs' in variantTable) {
            var child_variant_ = variantTable.childs
            child_variant_.map((child_variant) => {
                if ('items' in child_variant) {
                    var childs_arr = child_variant.items.map(async (child) => {
                        var url = child.url
                        var exShowRoomPrice = child.exShowRoomPrice ? child.exShowRoomPrice : 0
                        var onRoadPrice = child.onRoadPrice ? child.onRoadPrice : 0
                        await get_variant_details(url, vehicle_information_id, exShowRoomPrice, onRoadPrice, input)
                    })
                }
            })
        }
    }


    if ('pagetitle' in variant_data_arr) {
        if ('description' in variant_data_arr.pagetitle) {
            var highlights = variant_data_arr.pagetitle.description ? strip_tags(variant_data_arr.pagetitle.description) : "NA"
            var highlights_desc = highlights
        }
    }
    if ('variantTableHighlight' in variant_data_arr) {
        var price = variant_data_arr.variantTableHighlight.description ? strip_tags(variant_data_arr.variantTableHighlight.description) : "NA"
        var price_desc = price
    }

    const data = {
        highlights_desc: highlights_desc,
        price_desc: price_desc
    }
    const qr = ("UPDATE " + `vehicle_information ` + "SET " + `price_desc = '${price_desc}', highlights_desc = '${highlights_desc}' WHERE id = ${vehicle_information_id}`)

    const update = await con.query(qr)
    // const dd = await vehicle_information.findOneAndUpdate({ vehicle_information_id: vehicle_information_id }, data, { new: true })
}


const get_variant_details = async (picture_url, vehicle_information, exShowRoomPrice, onRoadPrice, input) => {
    var url = "https://www.cardekho.com" + picture_url
    var child_data = await scrap_coman_code(url)

    if ('dataLayer' in child_data) {
        let mileage = child_data.dataLayer[0].max_mileage_new ? child_data.dataLayer[0].max_mileage_new : 0
        let engine = child_data.dataLayer[0].engine_cc ? child_data.dataLayer[0].engine_cc : 0
    }
    if ('overView' in child_data) {
        var child = child_data.overView
        const vehicle_information_id = vehicle_information
        const name = child.name ? child.name : "NA"
        const price = child.priceRange ? child.priceRange : 0;
        const price_range = child.modelPriceRange ? child.modelPriceRange : 0;
        const review_count = child.reviewCount ? child.reviewCount : 0;
        const status = child.modelStatus ? child.modelStatus : "NA";
        const fuel_type = child.fuelType ? child.fuelType : "NA";
        const ex_show_room_rice = exShowRoomPrice;
        const on_road_price = onRoadPrice;
        const mileage = child_data.mileage ? child_data.mileage : 0;
        const engine = child_data.engine ? child_data.engine : 0;
        const link = "https://www.cardekho.com" + child.modelUrl

        // var cheakid = await PriceVariant.find().select({ id: 1 }).sort({ _id: -1 }).limit(1)
        // var tokenid = cheakid.length !== 0 ? cheakid[0].id + 1 : 1
        // const id = tokenid

        const variantobje = {
            // id: id,
            vehicle_information_id: vehicle_information_id,
            name: name,
            link: link,
            engine: engine,
            status: status,
            fuel_type: fuel_type,
            ex_show_room_rice: ex_show_room_rice,
            mileage: mileage,
            on_road_price: on_road_price,
            price_range: price_range,
            review_count: review_count,
        }
        // var variant_exist = await PriceVariant.findOne({ $and: [{ vehicle_information_id: vehicle_information_id }, { name: name }] })
        const [rows, filed] = await con.query("SELECT * FROM `vehicle_price_variant` WHERE `vehicle_information_id`= " + `${vehicle_information_id}` + " AND `name` = " + `'${name}'`)
        const variant_exist = rows[0]

        if (variant_exist) {
            // var variant = await PriceVariant.findOneAndUpdate({ $and: [{ vehicle_information_id: vehicle_information_id }, { name: name }] }, variantobje, { new: true })
            const qr = ("UPDATE " + `vehicle_price_variant ` + "SET " + `vehicle_information_id = ${vehicle_information_id},name='${name}',link='${link}',engine=${engine},price_range='${price_range}',status='${status}',fuel_type='${fuel_type}',on_road_price=${on_road_price}, review_count = ${review_count}, mileage=${mileage},ex_show_room_rice=${ex_show_room_rice} WHERE vehicle_information_id = ${vehicle_information_id} AND name = '${name}'`)

            const update = await con.query(qr)
            var variant_id = variant_exist.id
        } else {

            const qr = ("INSERT INTO vehicle_price_variant(vehicle_information_id,name,engine,price_range,status,fuel_type,on_road_price,review_count ,mileage ,ex_show_room_rice,link)") + ' VALUES ' +
                (`(${vehicle_information_id}, '${name}',${engine},'${price_range}','${status}','${fuel_type}',${on_road_price},${review_count},${mileage},'${ex_show_room_rice}','${link}')`)
            let variant = await con.query(qr)
            // variant = await PriceVariant.create(variantobje)
            variant_id = variant[0].insertId
        }

    }
    var used_var = {
        variant_id: variant_id,
        vehicle_information_id: vehicle_information
    }
    if ('specsTechnicalJson' in child_data) {
        if ('specification' in child_data.specsTechnicalJson) {
            child_data.specsTechnicalJson.specification.map(async (specification) => {
                const spec_name = specification.title ? specification.title : "NA"
                // var cheakid = await VariantSpecification.find().select({ id: 1 }).sort({ _id: -1 }).limit(1)
                // var tokenid = cheakid.length !== 0 ? cheakid[0].id + 1 : 1
                // const id = tokenid
                const carvar = {
                    // id: id,
                    name: spec_name
                }
                // var spec_exist = await VariantSpecification.find({ name: spec_name })
                let [rows, filed] = await con.query("SELECT * FROM `variant_specifications` WHERE `name`= " + `'${spec_name}'`)
                const spec_exist = rows[0]

                if (spec_exist) {
                    var spec_id = spec_exist.id
                } else {
                    const qr = ("INSERT INTO variant_specifications ( name)") + ' VALUES ' + `('${spec_name}')`
                    const create = await con.query(qr)
                    // var spec_id_ = await VariantSpecification.create(carvar)
                    spec_id = create[0].insertId
                }
                var used_var = {
                    variant_id: variant_id,
                    vehicle_information_id: vehicle_information,
                    specification_id: spec_id
                }
                specification.items.map(async (s) => {
                    var spec_name = s.text ? s.text : "NA"
                    var spec_value = s.value ? s.value : "NA"
                    // var v_spe_exist = await VariantKey.findOne({ $and: [{ vehicle_information_id: vehicle_information }, { variant_id: variant_id }, { specification_id: used_var.specification_id }, { name: spec_name }] })
                    let [rows, filed] = await con.query("SELECT * FROM `varient_key` WHERE `vehicle_information_id`= " + `${vehicle_information} AND variant_id = ` + `${variant_id} AND specification_id = ${spec_id} AND name = '${spec_name}'`)
                    const v_spe_exist = rows[0]
                    used_var.name = spec_name
                    used_var.value = spec_value

                    if (v_spe_exist) {
                        const updateQr = ("UPDATE " + `varient_key ` + "SET " + `vehicle_information_id = ${vehicle_information}, variant_id = ${variant_id}, specification_id = ${spec_id}, name = '${spec_name}',value = '${spec_value}'  WHERE vehicle_information_id = ${vehicle_information} AND variant_id = ${variant_id} AND specification_id = ${spec_id} AND name = '${spec_name}'`)
                        const updateVar = await con.query(updateQr)
                        // var update = await VariantKey.findOneAndUpdate({ $and: [{ vehicle_information_id: vehicle_information }, { variant_id: variant_id }, { specification_id: used_var.specification_id }, { name: spec_name }] }, used_var, { new: true })
                    } else {
                        const qr = ("INSERT INTO varient_key( vehicle_information_id, variant_id, specification_id, name, value )") + ' VALUES ' + (`(${vehicle_information}, ${variant_id},${spec_id},'${spec_name}','${spec_value.replaceAll(",", " ")}')`)
                        let craete = await con.query(qr)
                        // update = await VariantKey.create(used_var)
                    }
                })
            })
        }

        if ('featured' in child_data.specsTechnicalJson) {
            child_data.specsTechnicalJson.featured.map(async (featured) => {
                const spec_name = featured.title ? featured.title : "NA"
                // var cheakid = await VariantSpecification.find().select({ id: 1 }).sort({ _id: -1 }).limit(1)
                // var tokenid = cheakid.length !== 0 ? cheakid[0].id + 1 : 1
                // const id = tokenid
                const carvar = {
                    // id: id,
                    name: spec_name
                }
                // var spec_exist = await VariantSpecification.findOne({ name: spec_name })
                let [rows, filed] = await con.query("SELECT * FROM `variant_specifications` WHERE `name`= " + `'${spec_name}'`)
                const spec_exist = rows[0]

                if (spec_exist) {
                    var spec_id = spec_exist.id
                } else {
                    // var spec_id_ = await VariantSpecification.create(carvar)
                    const qr = ("INSERT INTO variant_specifications (name)") + ' VALUES ' + `('${spec_name}')`
                    const spec_id_ = await con.query(qr)
                    spec_id = spec_id_[0].insertId
                }
                var used_var = {
                    vehicle_information_id: vehicle_information,
                    variant_id: variant_id,
                    specification_id: spec_id
                }
                featured.items.map(async (s) => {
                    ;
                    var spec_name = s.text ? s.text : "NA"
                    var spec_value = s.value ? s.value : "NA"
                    // var v_spe_exist = await VariantKey.findOne({ $and: [{ vehicle_information_id: vehicle_information }, { variant_id: variant_id }, { specification_id: used_var.specification_id }, { name: spec_name }] })
                    let [rows, filed] = await con.query("SELECT * FROM `varient_key` WHERE `vehicle_information_id`= " + `${vehicle_information} AND variant_id = ` + `${variant_id} AND specification_id = ${spec_id} AND name = '${spec_name}'`)
                    const v_spe_exist = rows[0]

                    used_var.name = spec_name
                    used_var.value = spec_value

                    if (v_spe_exist) {
                        const updateQr = ("UPDATE " + `varient_key ` + "SET " + `vehicle_information_id = ${vehicle_information}, variant_id = ${variant_id}, specification_id = ${spec_id}, name = '${spec_name}',value = '${spec_value.replaceAll("'s", " ")}'  WHERE vehicle_information_id = ${vehicle_information} AND variant_id = ${variant_id} AND specification_id = ${spec_id} AND name = '${spec_name}'`)
                        const updateVar = await con.query(updateQr)
                        // var update = await VariantKey.findOneAndUpdate({ $and: [{ vehicle_information_id: vehicle_information }, { variant_id: variant_id }, { specification_id: used_var.specification_id }, { name: spec_name }] }, used_var, { new: true })

                    } else {
                        const qr = ("INSERT INTO varient_key( vehicle_information_id, variant_id, specification_id, name, value )") + ' VALUES ' + (`(${vehicle_information}, ${variant_id},${spec_id},'${spec_name}','${spec_value.replaceAll("'s", " ")}')`)
                        let craete = await con.query(qr)
                        // update = await VariantKey.create(used_var)

                    }
                })
            })
        }

        if ('keySpecs' in child_data.specsTechnicalJson) {
            child_data.specsTechnicalJson.keySpecs.map((key) => {
                if (key.title.toLowerCase().includes("specification")) {
                    var is_specification = 1
                    var i = key.items.map(async (item) => {
                        let [rows, filed] = await con.query("SELECT * FROM `varient_key` WHERE `vehicle_information_id`= " + `${vehicle_information} AND variant_id = ` + `${variant_id}  AND name = '${item.text}'`)
                        const u = rows[0]
                        // var u = await VariantKey.findOne({ $and: [{ vehicle_information_id: vehicle_information }, { variant_id: variant_id }, { name: item.text }] })
                        if (u) {
                            const updateQr = ("UPDATE " + `varient_key ` + "SET " + `is_specification = ${is_specification} WHERE id = ${u.id} `)
                            const updateVar = await con.query(updateQr)
                            // var u2 = await VariantKey.findOneAndUpdate({ id: u.id }, { is_specification: is_specification }, { new: true })
                        }
                    })
                }
                if (key.title.toLowerCase().includes("featured")) {
                    var is_feature = 1
                    var i = key.items.map(async (item) => {
                        let [rows, filed] = await con.query("SELECT * FROM `varient_key` WHERE `vehicle_information_id`= " + `${vehicle_information} AND variant_id = ` + `${variant_id}  AND name = '${valdatas.text}'`)
                        const u = rows[0]
                        // var u = await VariantKey.findOne({ $and: [{ vehicle_information_id: vehicle_information }, { variant_id: variant_id }, { name: spec_name }] })
                        if (u) {
                            const updateQr = ("UPDATE " + `varient_key ` + "SET " + `is_feature = ${is_feature} WHERE id = ${u.id} `)
                            const updateVar = await con.query(updateQr)

                            // var u2 = await VariantKey.findOneAndUpdate({ id: u.id }, { is_specification: is_specification }, { new: true })
                        }
                    })
                }
            })
        }

    }
}

const get_vehicle_specification = async (url, vehicle_information_id, variant_id, input) => {
    var used_var
    var url = "https://www.cardekho.com" + url

    var colors_data = await scrap_coman_code(url)
    var used_var = {
        vehicle_information_id: vehicle_information_id,
        variant_id: variant_id
    }

    if ('specsTechnicalJson' in colors_data) {
        if ('specification' in colors_data.specsTechnicalJson) {
            colors_data.specsTechnicalJson.specification.map(async (valdata) => {
                const spec_name = specification.title ? specification.title : "NA"
                // var cheakid = await VariantSpecification.find().select({ id: 1 }).sort({ _id: -1 }).limit(1)
                // var tokenid = cheakid.length !== 0 ? cheakid[0].id + 1 : 1
                // const id = tokenid
                const carvar = {
                    // id: id,
                    name: spec_name
                }
                let [rows, filed] = await con.query("SELECT * FROM `variant_specifications` WHERE `name`= " + `'${spec_name}'`)
                const spec_exist = rows[0]
                // var spec_exist = await VariantSpecification.findOne({ name: spec_name })
                if (spec_exist) {
                    var spec_id = spec_exist.id
                } else {
                    // spec_id = await VariantSpecification.create(carvar)
                    const qr = ("INSERT INTO variant_specifications ( name)") + ' VALUES ' + `('${spec_name}')`
                    const create = await con.query(qr)
                    spec_id = create[0].insertId
                }
                used_var = {
                    vehicle_information_id: vehicle_information_id,
                    variant_id: variant_id,
                    specification_id: spec_id
                }
                value.items.map(async (values) => {
                    var spec_name = values.text ? values.text : "NA"
                    var spec_value = values.value ? values.value : "NA"
                    // var v_spe_exist = await VariantKey.findOne({ $and: [{ vehicle_information_id: vehicle_information_id }, { variant_id: variant_id }, { specification_id: spec_id }, { name: spec_name }] })
                    let [rows, filed] = await con.query("SELECT * FROM `varient_key` WHERE `vehicle_information_id`= " + `${vehicle_information_id} AND variant_id = ` + `${variant_id} AND specification_id = ${spec_id} AND name = '${spec_name}'`)
                    const v_spe_exist = rows[0]

                    // var cheakid = await VariantKey.find().select({ id: 1 }).sort({ _id: -1 }).limit(1)
                    // var tokenid = cheakid.length !== 0 ? cheakid[0].id + 1 : 1
                    // used_var.id = tokenid

                    used_var.name = spec_name
                    used_var.value = spec_value

                    if (v_spe_exist) {
                        const updateQr = ("UPDATE " + `varient_key ` + "SET " + `vehicle_information_id = ${vehicle_information_id}, variant_id = ${variant_id}, specification_id = ${spec_id}, name = '${spec_name}',value = '${spec_value}'  WHERE vehicle_information_id = ${vehicle_information_id} AND variant_id = ${variant_id} AND specification_id = ${spec_id} AND name = '${spec_name}'`)
                        const updateVar = await con.query(updateQr)

                        // var update = await VariantKey.findOneAndUpdate({ $and: [{ vehicle_information_id: vehicle_information_id }, { variant_id: variant_id }, { specification_id: spec_id }, { name: spec_name }] }, used_var, { new: true })
                    } else {
                        const qr = ("INSERT INTO varient_key( vehicle_information_id, variant_id, specification_id, name, value )") + ' VALUES ' + (`(${vehicle_information_id}, ${variant_id},${spec_id},'${spec_name}','${spec_value.replaceAll(",", " ")}')`)
                        let craete = await con.query(qr)
                        // var update = await VariantKey.create(used_var)
                    }
                })
            })
        }
        if ('keySpecs' in colors_data.specsTechnicalJson) {
            colors_data.specsTechnicalJson.keySpecs.map((valudata) => {
                if (valudata.title.toLowerCase().includes("specifications")) {
                    var is_specification = 1
                    var i = valudata.items.map(async (valdatas) => {
                        let [rows, filed] = await con.query("SELECT * FROM `varient_key` WHERE `vehicle_information_id`= " + `${vehicle_information_id} AND variant_id = ` + `${variant_id}  AND name = '${valdatas.text}'`)
                        const u = rows[0]
                        // var u = await VariantKey.findOne({ vehicle_information_id: vehicle_information_id }, { variant_id: variant_id }, { name: valdatas.text })
                        if (u) {
                            const updateQr = ("UPDATE " + `varient_key ` + "SET " + `is_specification = ${is_specification} WHERE id = ${u.id} `)
                            const updateVar = await con.query(updateQr)

                            // var u2 = await VariantKey.findOneAndUpdate({ id: u.id }, { is_specification: is_specification }, { new: true })
                        }
                    })
                }
                if (valudata.title.toLowerCase().includes("Features")) {
                    var is_feature = 1
                    var i = valudata.items.map(async (valdatas) => {
                        let [rows, filed] = await con.query("SELECT * FROM `varient_key` WHERE `vehicle_information_id`= " + `${vehicle_information_id} AND variant_id = ` + `${variant_id}  AND name = '${valdatas.text}'`)
                        const u = rows[0]

                        // var u = await VariantKey.findOne({ vehicle_information_id: vehicle_information_id }, { variant_id: variant_id }, { name: valdatas.text })
                        if (u) {
                            const updateQr = ("UPDATE " + `varient_key ` + "SET " + `is_feature = ${is_feature} WHERE id = ${u.id} `)
                            const updateVar = await con.query(updateQr)

                            // var u2 = await VariantKey.findOneAndUpdate({ id: u.id }, { is_feature: is_feature }, { new: true })
                        }
                    })
                }
            })
        }
    }
}
const get_specific_car = async (link, input, brand) => {
    var data_res_arr = await scrap_coman_code(link);
    if ('overView' in data_res_arr) {
        var car_data = data_res_arr.overView;
        var res_specific_bike = car_data.name;

    } else {
        return (await helper.macthError('Model not Found'))
    }
    var brand = brand
    var brand_id = brand.id
    var new_bike_url = "https://www.cardekho.com/cars/" + brand.name;
    var data_res_arr = await scrap_coman_code(new_bike_url)

    if ('items' in data_res_arr) {
        data_res_arr?.items?.map(async (val) => {

            if (res_specific_bike == val.modelName) {
                // var cheakid = await vehicle_information.find().select({ id: 1 }).sort({ _id: -1 }).limit(1)
                // var tokenid = cheakid.length !== 0 ? cheakid[0].id + 1 : 1
                // const id = tokenid
                brand_id = brand_id
                const avg_rating = val.avgRating ? val.avgRating : 0
                const review_count = val.reviewCount ? val.reviewCount : 0
                const variant_name = val.variantName ? val.variantName : 0
                const min_price = val.minPrice ? val.minPrice : 0
                const max_price = val.maxPrice ? val.maxPrice : 0
                const price_range = val.priceRange ? val.priceRange : "NA"
                const status = val.status ? val.status : "NA"
                const launched_at = val.launchedAt ? val.launchedAt : "NA"
                const model_name = val.modelName
                const mileage = val.mileage ? parseFloat(val.mileage) : 0
                const engine = val.engine ? val.engine : 0
                const fuel_type = val.fuelType ? val.fuelType : "NA";
                const showroom_price = val.exShowRoomPrice ? val.exShowRoomPrice : "NA";
                const model_popularity = val.modelPopularity ? val.modelPopularity : "NA";
                const style_type = val.dcbdto.bodyType ? val.dcbdto.bodyType : "NA";
                const category_id = 2;
                const on_road_price = val.minOnRoadPrice ? val.minOnRoadPrice : val.exShowRoomPric ? val.exShowRoomPric : "NA";

                var new_car_url = val.modelUrl
                var images_url = val.modelPictureURL
                var specification_url = val.modelSpecsURL

                const [gg, fileds] = await con.query("SELECT * FROM `bodytypes` WHERE `name`= " + `'${style_type}'`)
                const bodytyps = gg[0]

                const cardata = {
                    // id: id,
                    category_id: category_id,
                    brand_id: brand_id,
                    link: link,
                    bodytype_id: bodytyps.id,
                    scrap_type: input.scrap_type,
                    model_name: model_name,
                    fuel_type: fuel_type,
                    avg_rating: avg_rating,
                    review_count: review_count,
                    variant_name: variant_name,
                    min_price: min_price,
                    max_price: max_price,
                    price_range: price_range,
                    status: status,
                    launched_at: launched_at,
                    model_popularity: model_popularity,
                    mileage: mileage,
                    engine: engine,
                    style_type: style_type,
                    showroom_price: showroom_price,
                    on_road_price: on_road_price,
                }

                // var car_exist = await vehicle_information.findOne({ $and: [{ model_name: model_name }, { brand_id: brand_id }] })
                const [rows, filed] = await con.query("SELECT * FROM `vehicle_information` WHERE `brand_id`= " + `'${brand_id}'` + " AND `model_name` LIKE " + `'${model_name}'`)
                const car_exist = rows[0]

                if (car_exist) {
                    var vehicle_information_id = car_exist.id

                    // await vehicle_information.findOneAndUpdate({ $and: [{ model_name: model_name }, { brand_id: brand_id }] }, cardata, { new: true })
                    const qr = ("UPDATE " + `vehicle_information ` + "SET " + `brand_id = ${brand_id}, bodytype_id=${bodytyps.id} ,category_id = ${category_id}, model_name = '${model_name}',fuel_type = '${fuel_type}',avg_rating = ${avg_rating}, review_count = ${review_count} ,variant_name = '${variant_name}',min_price='${min_price}',max_price=${max_price},status='${status}', launched_at='${launched_at}',model_popularity='${model_popularity}',mileage=${mileage},engine=${engine},style_type='${style_type}',showroom_price='${showroom_price}',on_road_price='${on_road_price}',link='${link}' WHERE brand_id = ${brand_id} AND model_name LIKE '${model_name}'`)
                    const update = await con.query(qr)
                    await get_vehicle_other_details(new_car_url, vehicle_information_id, 0, cardata)
                } else {
                    const qr = ("INSERT INTO vehicle_information( brand_id, category_id, model_name, fuel_type, avg_rating, review_count, variant_name, min_price, max_price, status, launched_at, model_popularity, mileage, engine, style_type, showroom_price, on_road_price, link ,bodytype_id )") + ' VALUES ' + (`(${brand_id}, ${category_id},'${model_name}','${fuel_type}',${avg_rating},${review_count},'${variant_name}','${min_price}',${max_price},'${status}','${launched_at}','${model_popularity}',${mileage},${engine},'${style_type}','${showroom_price}','${on_road_price}','${link}' ,${bodytyps.id})`)
                    // var res = await vehicle_information.create(cardata)

                    let craete = await con.query(qr)

                    vehicle_information_id = craete[0].insertId

                    await get_vehicle_other_details(new_car_url, vehicle_information_id, 0, cardata)
                }


            } else {
                return (await helper.macthError('Car Model Not Found'))
            }
        })
        if ('upcomingCars' in data_res_arr) {
            var url = data_res_arr.upcomingCars.url ? data_res_arr.upcomingCars.url : null
            if (url) {
                await upcoming_car_by_brand(url, input)
            }

        } else {
            return (await helper.macthError('Upcoming Car Not Scrapped'))
        }
        return (await helper.dataResponse('Vehicle Successfully Scrapped.'))
    }

}


const scrap_coman_code = async (url) => {
    const res = await axios.get(url)
    var crawler = cheerio.load(res.data).html()
    var html = crawler.split('</script>');
    var data_respone = get_string_between(html[10], '<script>window.__INITIAL_STATE__ = ', " window.__isWebp =  false;")
    var data1 = data_respone.split("; window.__CD_DATA__ =")
    var data2 = data1[0].split('" ",{}; window.__isMobile')
    let res_arr = JSON.parse(data2)
    return res_arr
}

const get_string_between = (string, start, end) => {
    string = ' ' + string;
    var ini = string.indexOf(start);
    if (ini === 0) return '';
    ini += start.length;
    let len = string.indexOf(string, end, ini) - ini;
    return string.slice(ini, len);

}

const upcoming_car_by_brand = async (url, input) => {
    var new_car_url = 'https://www.cardekho.com' + url
    var data_res_arr = await scrap_coman_code(new_car_url)
    if ('items' in data_res_arr) {
        var upcome = await insert_cars_without_items(data_res_arr.items, 'is_upcoming', input)
    }
    if (upcome) {
        if ('popularCars' in data_res_arr.pages) {
            if ('popular' in data_res_arr.popularCars) {
                await insert_cars_without_items(data_res_arr.popularCars, 'is_popular_search', input)
            }
        }
    }
}

const insert_cars_without_items = async (data_res_arr, type, input) => {
    var test = data_res_arr.map(async (val) => {
        // var cheakid = await vehicle_information.find().select({ id: 1 }).sort({ _id: -1 }).limit(1)
        // var tokenid = cheakid.length !== 0 ? cheakid[0].id + 1 : 1
        // const id = tokenid
        const brand_id = await get_brand_id(val.brandName)
        const model_name = val.modelName ? val.modelName : val.name
        const fuel_type = val.fuelType ? val.fuelType : "NA"
        const avg_rating = val.avgRating ? val.avgRating : 0
        const review_count = val.reviewCount ? val.reviewCount : 0
        const variant_name = val.variantName ? val.variantName : "NA"
        const min_price = val.minPrice ? val.minPrice.replace(',', '') : 0
        const max_price = val.maxPrice ? val.maxPrice.replace('.', '') : "NA"
        const price_range = val.priceRange ? val.priceRange : "NA"
        const status = val.status ? val.status : "NA"
        const launched_at = val.launchedAt ? val.launchedAt : "NA"
        const Launch_date = val.variantLaunchDate ? val.variantLaunchDate : "NA";
        const engine = val.engine ? val.engine : 0;
        const mileage = val.mileage ? parseFloat(val.mileage) : 0;
        const style_type = val.style_type ? val.style_type : (val.vehicleType ? val.vehicleType : "NA");
        const max_power = val.maxPower ? val.maxPower : "NA";
        const model_popularity = val.modelPopularity ? parseFloat(val.modelPopularity) : 0;
        const showroom_price = val.exShowroomPrice ? parseFloat(val.exShowroomPrice) : 0;
        const on_road_price = val.minOnRoadPrice ? parseFloat(val.minOnRoadPrice) : 0;
        const type = 1;
        category_id = category_id;

        const insert_car = {
            // id: id,
            category_id: category_id,
            link: link,
            scrap_type: 'car',
            model_name: model_name,
            fuel_type: fuel_type,
            avg_rating: avg_rating,
            review_count: review_count,
            variant_name: variant_name,
            min_price: min_price,
            max_price: max_price,
            price_range: price_range,
            status: status,
            launched_at: launched_at,
            Launch_date: Launch_date,
            model_popularity: model_popularity,
            mileage: mileage,
            engine: engine,
            style_type: style_type,
            max_power: max_power,
            showroom_price: showroom_price,
            on_road_price: on_road_price,
        }
        // var bike_exist = await vehicle_information.findOne({ $and: [{ brand_id: brand_id }, { model_name: model_name }] })
        const [rows, filed] = await con.query("SELECT * FROM `vehicle_information` WHERE `brand_id`= " + `'${brand_id}'` + " AND `model_name` LIKE " + `'${model_name}'`)
        const bike_exist = rows[0]
        var model_url = val.modelUrl
        link = model_url
        const image = ""

        if (bike_exist) {
            vehicle_information_id = bike_exist.id
            if (model_url == "NA") {
                if (val.image) {
                    //********************Image Running**********************/
                } else {
                    image = "NA"
                }
                // await vehicle_information.findOneAndUpdate({ $and: [{ brand_id: brand_id }, { model_name: model_name }] }, insert_car, { new: true })
                const qr = ("UPDATE " + `vehicle_information ` + "SET " + ` category_id = ${category_id}, model_name = '${model_name}',fuel_type = '${fuel_type}'
                ,avg_rating = ${avg_rating}, review_count = ${review_count} ,variant_name = '${variant_name}',min_price=${min_price}
                ,max_price=${max_price},status='${status}', launched_at='${launched_at}',Launch_date = ${Launch_date} , model_popularity=${model_popularity},mileage=${mileage}
                ,engine='${engine}',style_type='${style_type}',showroom_price=${showroom_price},on_road_price=${on_road_price},link='${link}'
                 WHERE brand_id = ${brand_id} AND model_name LIKE '${model_name}'`)

                const update = await con.query(qr)
            }

        } else {
            const qr = ("INSERT INTO vehicle_information( category_id, model_name, fuel_type, avg_rating, review_count, variant_name, min_price, max_price, status, launched_at, Launch_date, model_popularity, mileage, engine, style_type, showroom_price, on_road_price, link )") + ' VALUES ' + (`( ${category_id},'${model_name}','${fuel_type}',${avg_rating},${review_count},'${variant_name}','${min_price}','${max_price}','${status}','${launched_at}','${Launch_date}',${model_popularity},${mileage},'${engine}','${style_type}',${showroom_price},${on_road_price},'${link}')`)

            let craete = await con.query(qr)

            // var res = await vehicle_information.create(insert_car)
            var vehicle_information_id = craete[0].insertId
        }
        var model_url = val.modelUrl
        var car_images = await get_vehicle_other_details_latest(model_url, vehicle_information_id, 0, input)

    })
}

const get_vehicle_other_details_latest = async (url, vehicle_information_id, variant_id = 0, input) => {
    var new_car_url = "https://www.cardekho.com" + url
    var variant_data_arr = await scrap_coman_code(new_car_url)
    if ('overView' in variant_data_arr) {
        if ('images' in variant_data_arr.overView) {

        }   //********************************IMage Runnning*(*(*(*(*(*(*(*(*(*(*(*(*(*()))))))))))))) */
    }
    if ('quickOverview' in variant_data_arr) {               //Scrap Vehicle details
        var feature = variant_data_arr.quickOverview.list ? variant_data_arr.quickOverview.list : "NA"

        if (feature) {
            if (typeof feature != 'string') {
                var specs = feature.map((sp) => {
                    var specs_arr = sp.iconname ? sp.iconname : "NA"
                    if (sp.iconname == "Transmission") {
                        specs_arr = sp.iconname
                    } else {
                        specs_arr = sp.iconvalue ? sp.iconvalue : ""
                    }
                    return specs_arr
                })
                var key_fear = specs.map((key_feature) => {
                    return key_feature
                })
            } else {
                key_fear = "NA"
            }
        } else {
            key_fear = "NA"
        }
        /*Multidimention Array to string conversion*/
        var key_specs = "Features" + key_fear

        const qr = ("UPDATE " + `vehicle_information ` + "SET " + ` key_specs = '${key_specs}' WHERE id = ${vehicle_information_id}`)
        const update = await con.query(qr)

        // var update = await vehicle_information.findOneAndUpdate({ id: vehicle_information_id }, { key_specs: key_specs }, { new: true })


        if ('url' in variant_data_arr) {
            if (variant_data_arr.url) {
                await get_vehicle_specification(variant_data_arr.url, vehicle_information_id, 0)
            }
        }
    }
    //----------------------------Vehicle Images+ colors ------------------------ Main Vehicle Images

    if ('galleryColorSection' in variant_data_arr) {
        if ('items' in variant_data_arr.galleryColorSection) {
            await insert_color_img_with_item(variant_data_arr.galleryColorSection.items, vehicle_information_id, variant_id)

        }
    }
    //insert vehicle color images

    if ('galleryColorSection' in variant_data_arr) {
        if ('items' in variant_data_arr.galleryColorSection) {

            await insert_color_img_with_item(variant_data_arr.galleryColorSection.items, vehicle_information_id, variant_id, input)
        }
    }
    if ('gallerySection' in variant_data_arr) {
        var picture_url = variant_data_arr.gallerySection.items[0].url ? variant_data_arr.gallerySection.items[0].url : ""
        if (picture_url != "") {
            var images = await scrap_vehicle_images(picture_url, vehicle_information_id, input)
        } else {
            var picture_url = url + '/pictures'
            images = await scrap_vehicle_images(picture_url, vehicle_information_id, input)
        }
    }
    //----------------------------Variant table------------------

    if ('variantTable' in variant_data_arr) {
        var variantTable = variant_data_arr.variantTable
        if ('childs' in variantTable) {
            var child_variant_ = variantTable.childs
            child_variant_.map((child_variant) => {
                if ('items' in child_variant) {
                    var childs_arr = child_variant.items.map(async (child) => {
                        var url = child.url
                        var exShowRoomPrice = child.exShowRoomPrice ? child.exShowRoomPrice : 0
                        var onRoadPrice = child.onRoadPrice ? child.onRoadPrice : 0
                        await get_variant_details(url, vehicle_information_id, exShowRoomPrice, onRoadPrice, input)
                    })
                }
            })
        }
    }

    if ('pagetitle' in variant_data_arr) {
        if ('description' in variant_data_arr.pagetitle) {
            let highlights = variant_data_arr.pagetitle.description ? strip_tags(variant_data_arr.pagetitle.description) : "NA"
            var highlights_desc = highlights
        }
    }
    if ('variantTableHighlight' in variant_data_arr) {
        let price = variant_data_arr.variantTableHighlight.description ? strip_tags(variant_data_arr.variantTableHighlight.description) : "NA"
        var price_desc = price
    }
    const data = {
        highlights_desc: highlights_desc,
        price_desc: price_desc
    }

    // const qr = ("UPDATE " + `vehicle_information ` + "SET " + `price_desc = '${price_desc}', highlights_desc = '${highlights_desc.replaceAll("'s", "")}' WHERE id = ${vehicle_information_id}`)

    const qr = `UPDATE vehicle_information SET price_desc = ?, highlights_desc = ? WHERE id = ?`
    const update = await con.query(qr, [price_desc, highlights_desc.replaceAll("'s", ""), vehicle_information_id]).then(res => { }).catch(err => console.log('err>>>>>>>>>', err))
    // const update = await con.query(qr)

    // await vehicle_information.findOneAndUpdate({ vehicle_information_id: vehicle_information_id }, data, { new: true })
}

const insert_color_img_with_item = async (images, vehicle_information_id, variant_id, input) => {
    images.map(async (color_img) => {
        if (!color_exist) {
            const color_name = color_img.title ? color_img.title : "NA"
            const color_code = color_img.code ? color_img.code : "NA"
            const image = color_img.image ? color_img.image : "NA"
            const official_image = color_img.image ? color_img.image : "NA"

            const carcolor = {
                vehicle_information_id: vehicle_information_id,
                color_name: color_name,
                color_code: color_code,
                image: image
            }
            // var color_exist = await vehicle_model_color.find({ $and: [{ vehicle_information_id: vehicle_information_id }, { color_name: input.color_name }, { image: official_image }] }).count()
            const [rows, filed] = await con.query("SELECT * FROM `vehicle_model_color` WHERE `vehicle_information_id`= " + `${vehicle_information_id}` + " AND `color_name` = " + `'${color_name}'` + " AND `image` = " + `'${official_image}'`)
            const color_exist = rows[0]


            const qr = ("INSERT INTO vehicle_model_color ( vehicle_information_id, color_name, color_code, image)") + ' VALUES ' + (`(${vehicle_information_id}, '${color_name}','${color_code}','${image}')`)
            let craete = await con.query(qr)

            // var color_img = await vehicle_model_color.create(carcolor)
        }
    })
}

const scrap_vehicle_images = async (url, vehicle_information_id, variant_id = 0, input) => {
    var url = "https://www.cardekho.com" + url
    var colors_data = await scrap_coman_code(url)

    if ('colorSection' in colors_data) {
        if ('items' in colors_data.colorSection) {
            var images = colors_data.colorSection.items
            var color_images = images.map(async (color_img) => {
                const color_name = color_img.title ? color_img.title : "NA"
                const color_code = color_img.hexCode ? color_img.hexCode : "NA"
                const image = color_img.image ? color_img.image : "NA"
                const official_image = color_img.image ? color_img.image : "NA"

                const colordata = {
                    vehicle_information_id: vehicle_information_id,
                    color_name: color_name,
                    color_code: color_code,
                    image: image
                }
                // var color_exist = await vehicle_model_color.find({ $and: [{ vehicle_information_id: vehicle_information_id }, { color_name: input.color_name }, { image: official_image }] }).count()
                const [rows, filed] = await con.query("SELECT * FROM `vehicle_model_color` WHERE `vehicle_information_id`= " + `${vehicle_information_id}` + " AND `color_name` = " + `'${color_name}'` + " AND `image` = " + `'${official_image}'`)
                const color_exist = rows[0]
                if (!color_exist) {
                    const qr = ("INSERT INTO vehicle_model_color ( vehicle_information_id, color_name, color_code, image)") + ' VALUES ' + (`(${vehicle_information_id}, '${color_name}','${color_code}','${image}')`)
                    let craete = await con.query(qr)

                    // var color_img = await vehicle_model_color.create(colordata)

                }
            })
        }
    }
}

const get_brand_id = async (name) => {
    // const exist = await Brands.findOne({ $and: [{ name: name }, { category_id: category_id }] })
    const [rows, filed] = await con.query("SELECT * FROM `brands` WHERE `name`= " + `'${name}'` + " AND `category_id` = " + `${category_id}`)
    const exist = rows[0]

    if (exist) {
        return exist.id
    } else {
    }
}
export default { scrap_cars }