const express = require("express");
const bodyParser = require("body-parser");
const Database = require("./configs/Database");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const cors = require("cors")

const app = express();

const images = multer({dest: "./public/images"})


app.use("/images", express.static('public/images'))
app.use(bodyParser.json());
app.use(cors())
app.options("*", cors());

const Admission = require('./routes/Admission')

app.use('/api/admission', Admission)

app.listen(3000, function() {
    const db = new Database();
    db.TestConnection()
    console.log("Server running on 3000")
})