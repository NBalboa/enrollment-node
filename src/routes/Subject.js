const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "./public/images" });

const { check, validationResult } = require("express-validator");

const subjectValidations = [
    check("subject_code").notEmpty().withMessage("Subject code is required"),
    check("subject_description").notEmpty().withMessage("Subject description is required"),
    check("unit").notEmpty().withMessage("Unit is required")
]


router.post('/add_subject', subjectValidations ,function(req,res){


    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.json({errors: errors.array()})
    }

    const db = new Database();
    const conn = db.connection;

    const {subject_code, subject_description, unit} = req.body;

    date_now = date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const query = "INSERT INTO subjects (subject_code, subject_description, unit, created_at, updated_at) VALUES (?, ?, ?, ?, ?)";

    const values = [subject_code, subject_description, unit, date_now, date_now];

    conn.connect( function isConnect(err){
        if (err) throw err;

        conn.query(query, values, function(err, result){
            if(err) {
                if(err.errno === 1062){
                    return res.json({data: "Subject code already exists"})
                }
                else {
                    throw err;
                }
            };
            res.json({data: "Subject successfully added"})
        })
    })

})

router.get('/list_subjects', function(req,res){

    const db = new Database();
    const conn = db.connection;

    const query = "SELECT * FROM subjects";

    conn.connect( function isConnect(err){
        if(err) throw err;
        conn.query(query, function(err, result){
            if(err) throw err;
            res.json({data: result})
        })

    })

})

router.get('/get_subject/:id', function(req,res){

    const db = new Database();
    const conn = db.connection;

    const query = "SELECT * FROM subjects WHERE id = ?";
    const id = req.params.id;

    conn.connect( function isConnect(err){
        if(err) throw err;

        conn.query(query, [id], function(err, result){
            if(err) throw err;
            if(result.length === 0){
                res.json({ data: "Subject not found" });
            }else{
                res.json({ data: result[0] });
            }
        })

    })

})

router.put('/update_subject/:id', function(req,res){

    const db = new Database();
    const conn = db.connection;

    const {subject_code, subject_description, unit} = req.body;
    const id = req.params.id;

    date_now = date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const query = "UPDATE subjects SET subject_code = ?, subject_description = ?, unit = ?, updated_at = ? WHERE id = ?";
    const values = [subject_code, subject_description, unit, date_now, id];

    conn.connect( function isConnect(err){
        if(err) throw err;

        conn.query(query, values, function(err, result){
            if(err) throw err;
            res.json({data: "success"})
        })

    })

})

router.delete('/delete_subject/:id', function(req,res){

    const db = new Database();

    const conn = db.connection;

    const id = req.params.id;

    const query = "DELETE FROM subjects WHERE id = ?";
    conn.connect( function isConnect(err){
        if (err) throw err;
        conn.query(query, [id], function(err, result){
            if(err) throw err;
            res.json({data: "success"})
        })
    })
})

//search subject by subject code and subject description

router.get('/search_subject/:type/:keyword', function(req,res){

    const db = new Database();
    const conn = db.connection;

    const keyword = req.params.keyword;
    const type = req.params.type;

    let query = "";

    if(type === "subject_code"){
        query = "SELECT * FROM subjects WHERE subject_code LIKE ?";
    }
    else if(type === "subject_description"){
        query = "SELECT * FROM subjects WHERE subject_description LIKE ?";
    }

    if(query){

        const values = ["%" + keyword + "%"];

        conn.connect(function isConnect(err) {
        if (err) throw err;
            conn.query(query, values, function(err, result) {
                if (err) throw err;
                if (result.length === 0) {
                    res.json({ data: "No result found", success: false });
                } else {
                    res.json({ data: result });
                }
            });
        });
    }




    

})


module.exports = router;