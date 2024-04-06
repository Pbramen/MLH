import express from 'express';
import router from "./Router/router.js";
const app = express();

app.use(router);

app.listen(8000, () => {
    console.log("This app is listening to port 8000");
})