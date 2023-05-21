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

router.get("/data/:sy/:sem/:program", function(req,res){

    const db = new Database();
    const conn = db.connection;

    const {sy, sem, program} = req.params;

    const query = 
        `SELECT first_name, middle_name, last_name, date_format(dob, '%M %e, %Y') as birthdate, pob, nationality, civil_status, religion, tribe, scholarship, concat(current_street, " ", current_barangay, " ", current_province, " ", current_zipcode) as address_1, current_phone as phone_1, concat(permanent_street, " ", permanent_barangay, " ", permanent_province, " ", permanent_zipcode ) as address_2, permanent_phone as phone_2, type_of_admission, enrollment_status, semester, year_level, sy, f_fullname as father_name, f_edu as father_education, f_occ as father_occ, m_fullname as mother_name, m_edu as mother_education, m_occ as mother_occupation, g_fullname as guardian_name, g_relationship as guardian_relationship, g_address as guardian_address, g_mobile as guardian_contact FROM students WHERE sy = ? AND semester = ? AND program = ?`;
    
    conn.connect(function isConnect(err) {
    if (err) throw err;
        conn.query(query, [sy,sem,program] ,function isQuery(err, results) {
            if (err) throw err;

            console.log(results);
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(results);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // Set the response headers to indicate that an Excel file is being returned as an attachment
            res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
            "Content-Disposition",
            "attachment; filename=student_data.xlsx"
            );

            res.send(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
        });
    });
})

router.get("/academic_year", function(req,res){
    const db = new Database();
    const conn = db.connection;

    const query = "SELECT id, sy, semester FROM students GROUP BY sy,semester ORDER BY sy, semester";

    conn.connect(function(err){
        if(err) throw err;
        conn.query(query, function(err, results){
            if(err) throw err;
            res.json({data: results})
        })
    })
})

router.get("/filter_by_year/:year/:sem", function(req,res){
    const db = new Database();
    const conn = db.connection;

    const query = "SELECT * FROM students WHERE sy = ? AND semester = ? ";
    conn.connect(function(err){
        if(err) throw err;
        conn.query(query, [req.params.year, req.params.sem], function(err, results){
            if(err) throw err;
            res.json({data: results})
        })
    })
})

router.get("/count/:year/:sem", function(req,res){

    const db = new Database();
    const conn = db.connection;
    
    console.log(req.params.year);

    const query = `SELECT COUNT(*) as total, sum(gender = "Male") as male, sum(gender = "Female") as Female FROM students WHERE sy = ? and semester = ?`;

    conn.connect(function(err){
        if(err) throw err;
        conn.query(query, [req.params.year, req.params.sem], function(err, results){
            if(err) throw err;
            res.json({data: results})
        })
    })
})

router.get("/student_denomination", function(req,res){


    const db = new Database();
    const conn = db.connection;

    const query = `SELECT id, program, COUNT(*) as total, sum(gender = "Male") as male, sum(gender = "Female") as female, semester, sy,
	                sum(year_level = "1st") as first_year,sum(year_level = "2nd") as second_year,sum(year_level = "3rd") as third_year,sum(year_level = "4th") as fourth_year
                    FROM students GROUP BY program,semester,sy ORDER BY sy DESC`;

    conn.connect(function(err){
        if(err) throw err;
        conn.query(query, function(err, results){
            if(err) throw err;
            res.json({data: results})
        })
    })
})



module.exports = router;
