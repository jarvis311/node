import express from 'express';
const router = express.Router()
import Scrappingconroller from "../controller/scrapping.js"
import Bikecontroler from "../controller/ScrappingController.js"
import MysqltoMongodb from '../controller/MysqltoMongodb.js';
import ScrappingCarConroller from '../controller/CarScrappingController.js';
import mongoose from 'mongoose';

router.post('/scrap_bike', Bikecontroler.scrap_data)


//*********************mysql to Mongo start**************************** */

router.post("/catagroies", MysqltoMongodb.categories)
router.post("/brands", MysqltoMongodb.brands)
router.post("/bodytype", MysqltoMongodb.bodytype)
router.post("/vehicalcolor", MysqltoMongodb.vehicalcolor)
router.post("/variant_specifications", MysqltoMongodb.variant_specifications)
router.post("/vehicle_information", MysqltoMongodb.vehicle_informations)
router.post("/variant_key_specs", MysqltoMongodb.variant_key_specs)
router.post("/price_variants", MysqltoMongodb.price_variants)

router.post("/deleteMany", async (req, res) => {
    const collectionsToDelete = ['variantkeys', 'variantspecifications', 'vehicle_informations', 'vehicle_model_colors', 'pricevariants'];
    for (const collectionName of collectionsToDelete) {
        try {
            await mongoose.connection.db.dropCollection(collectionName);
            console.log(`Collection '${collectionName}' deleted.`);
            res.send("Ok, Table is deleted !!!")
        } catch (error) {
            console.error(`Error deleting collection '${collectionName}': ${error.message}`);
        }
    }
})

//*********************mysql to Mongo end**************************** */
export default router