const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "./public/images" });
const { check, validationResult } = require("express-validator");
const XLSX = require("xlsx");



const studentLoginValidation = [
    check("username").notEmpty().withMessage("Username is required"),
    check("password").notEmpty().withMessage("Password is required")
]

router.post('/login', studentLoginValidation , function(req,res){
    const db = new Database();
    const conn = db.connection;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({errors: errors.array()})
    }

    const {username, password} = req.body;

    const query = "SELECT * FROM students WHERE username = ? AND password = ?";
    conn.connect( function isConnect(err){

        if(err) throw err;
        conn.query(query, [username, password], function isQuery(err, result){
            if(err) throw err;
            if(result.length > 0){
                req.session.student = result[0];
                res.json({data: result[0], message: "success"})
            }else{
                res.json({error: "Username or password is incorrect"})
            }
        })
    })
})

router.get("/data", function(req,res){

    const db = new Database();
    const conn = db.connection;

    const query = `SELECT first_name, middle_name, last_name, date_format(dob, '%M %e, %Y') as birthdate, pob, nationality, civil_status, religion, tribe, scholarship, concat(current_street, " ", current_barangay, " ", current_province, " ", current_zipcode) as address_1, current_phone as phone_1, concat(permanent_street, " ", permanent_barangay, " ", permanent_province, " ", permanent_zipcode ) as address_2, permanent_phone as phone_2, type_of_admission, enrollment_status, semester, year_level, sy, f_fullname as father_name, f_edu as father_education, f_occ as father_occ, m_fullname as mother_name, m_edu as mother_education, m_occ as mother_occupation, g_fullname as guardian_name, g_relationship as guardian_relationship, g_address as guardian_address, g_mobile as guardian_contact FROM students`;
    

    conn.connect( function isConnect(err){
        if(err) throw err;
        conn.query(query, function isQuery(err, results){
            if(err) throw err;
            

            console.log(results);
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(results);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // Set the response headers to indicate that an Excel file is being returned as an attachment
            res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader("Content-Disposition", "attachment; filename=student_data.xlsx");


                res.send(
                XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
                );
            })
    })
})



module.exports = router;
