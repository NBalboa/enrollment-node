const express = require("express");
const bodyParser = require("body-parser");
const Database = require("./configs/Database");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const auth = require("./middleWare/auth");


const cors = require("cors")

const app = express();

const images = multer({dest: "./public/images"})


app.use("/images", express.static('public/images'))
app.use(bodyParser.json());
app.use(cors())
app.options("*", cors());
app.use(cookieParser());

app.use(session({
    secret: "butterfly",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))




const Admission = require('./routes/Admission')
const Admin = require('./routes/Admin')
const Subject = require('./routes/Subject')
const Student = require('./routes/Student')

app.use('/api/admission', Admission)
app.use('/api/admin', Admin)
app.use('/api/subject', Subject)
app.use('/api/student', Student)


app.listen(3000, function() {
    const db = new Database();
    db.TestConnection()
    console.log("Server running on 3000")
})