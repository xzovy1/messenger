const express = require("express");
const app = express();
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || PORT;

app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) });