const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "./public/images" });
const jwt = require("jsonwebtoken");
const auth = require("../middleWare/auth");

const { check, validationResult } = require("express-validator");
const { error } = require("console");

require("dotenv").config();


const adminValidation = [

    check("first_name").notEmpty().withMessage("First name is required"),
    check("last_name").notEmpty().withMessage("Last name is required"),
    check("middle_name").notEmpty().withMessage("Middle name is required"),
    check("username").notEmpty().withMessage("Username is required"),
    check("password").notEmpty().withMessage("Password is required")

]



router.post('/add_admin', upload.single("image"), adminValidation ,function(req,res){
  const db = new Database();
  const conn = db.connection;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.json({errors: errors.array()})
  }


  let newFileName = "";

  if (req.file !== undefined) {
    // console.log("image found");
    let fileType = req.file.mimetype.split("/")[1];
    console.log("file type", fileType);
    newFileName = req.file.filename + "." + fileType;

    console.log(newFileName);

    fs.rename(
      `./public/images/${req.file.filename}`,
      `./public/images/${newFileName}`,
      function (err) {
        if (err) {
          return res.sendStatus(400);
        }
      }
    );
  }
  else{
    return res.json({data: "Image is required"})
  }

//   console.log(newFileName)

//   res.send(newFileName)

  const {first_name, last_name, middle_name, username, password} = req.body;

  date_now = date = new Date().toISOString().slice(0, 19).replace("T", " ");

  const query = "INSERT INTO admins (first_name, last_name, middle_name, username, password, profile, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [first_name, last_name, middle_name, username, password, `images/${newFileName}`, "admin", date_now, date_now];

  conn.connect( function isConnect(err){
      if(err) throw err;
      conn.query(query, values, function(err, result){
          if(err) {
            if (err.errno === 1062) {
              res.json({ data: "Username already in used"});
              return;
            } else {
              throw err;
            }
          };
          return res.json({data: "success"})
      })
  })
})

const adminLoginValidation = [
    check("username").notEmpty().withMessage("Username is required"),
    check("password").notEmpty().withMessage("Password is required")
]

router.post('/login', adminLoginValidation , async function isLogin(req,res){

    const db = new Database();
    const conn = db.connection;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({errors: errors.array()})
    }


    const {username, password} = req.body;

    // const user = {name: username, password: password}

    // const accessToken = auth.generateAccessToken(user);
    // const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN)

    // auth.refreshTokens.push(refreshToken)

    // console.log(auth.refreshTokens)

    // res.json({accessToken: accessToken, refreshToken: refreshToken})

    const query = "SELECT * FROM admins WHERE username = ? AND password = ?";

    conn.connect( function isConnect(err){
        if(err) throw err;
        conn.query(query, [username, password], function isQuery(err, result){
            if(err) throw err;
            if(result.length > 0){
                res.json({data: result[0], message: "success"})
            }
            else{
                res.json({error: "Username or password is incorrect"})
            }
        })
    })
})

// router.get('/admin_profile', auth.authenticateToken, async function(req,res){

//     res.json({data: "Hello World"})
// })

// function authenticateToken(req, res, next){

//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]

//     if(!token){
//         return res.sendStatus(401)
//     }

//     jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
//         if(err) return res.sendStatus(403)
//         req.user = user
//         next()
//     })
// }



module.exports = router;