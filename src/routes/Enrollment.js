const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();


router.get("/test", function(req,res){
    res.send("test");
})

router.post("/add_enrollment", function(req,res){
    const db = new Database();
    const conn = db.connection;

    

    const {ay} = req.body;

    date_now = date = new Date().toISOString().slice(0, 19).replace("T", " ");
    const values = [
      [ay, 1, 1, date_now, date_now],
      [ay, 2, 0, date_now, date_now],
    ];

    const checkValues = "SELECT * FROM enrollments WHERE ay = ?";

    conn.beginTransaction(function(err){
        if(err) throw err;
        conn.query(checkValues, [ay], function(err, result){
            if(err) throw err;
            if(result.length > 0){
                conn.rollback(function(){
                    res.json({data: "Academic year already exist"})
                })
            }
            else{
                const query = "INSERT INTO enrollments (ay, sem, open, created_at, updated_at) VALUES ?";
                conn.query(query, [values], function(err, result){
                    if(err) throw err;
                    conn.commit(function(err){
                        if(err) throw err;
                        res.json({data: "Academic year added added"})
                    })
                })
            }
        })
    })
})

router.get("/get_enrollment", function(req,res){
    const db = new Database();
    const conn = db.connection;

    const query = "SELECT * FROM enrollments";

    conn.connect(function(err){
        if(err) throw err;
        conn.query(query, function (err, result) {
          if (err) throw err;
          res.json({ data: result });
        });
    })
})

router.put("/update_enrollment", function(req,res){
    const db = new Database();
    const conn = db.connection;

    const {id, open} = req.body;

    const query = "UPDATE enrollments SET open = ? WHERE id = ?";
    conn.connect(function(err){
        if(err) throw err;
        conn.query(query, [open, id], function(err, result){
            if(err) throw err;
            res.json({data: "Academic year updated"})
        })
    })
})

router.get("/get_enrollment_open", function(req,res){

    const db = new Database();
    const conn = db.connection;

    const query =
      "SELECT id, ay FROM admission.enrollments WHERE open = 1 group by ay";

    conn.connect(function(err){
        if(err) throw err;
        conn.query(query, function(err, result){
            if(err) throw err;
            res.json({data: result});
        })
    })
})

router.get("/get_sem_open/:ay/", function(req,res){

    const db = new Database();
    const conn = db.connection;

    const {ay, open} = req.params;

    const query =
        "SELECT id, sem FROM admission.enrollments WHERE ay = ? AND open = 1";

    conn.connect(function(err){
        if(err) throw err;
        conn.query(query, [ay, open], function(err, result){
            if(err) throw err;
            res.json({data: result});
        })
    })
})


module.exports = router;