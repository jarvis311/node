
import express from 'express';
const app = express();
import fileupload from 'express-fileupload';
import cors from 'cors';
import router from "./route/route.js"
import './connecttion/conn.js'
const port = process.env.PORT || 3535;
app.use(fileupload())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "DELETE"],
    })
);

app.use(router)

app.listen(port, () => {
    console.log(`server Running on ${port}`);
})
