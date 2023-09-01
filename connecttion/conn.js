import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/RTO-Scrpping')
    .then(() => {
        console.log('connation for RTO Mongoose');
    }).catch((err) => {
        console.log(err);
    })