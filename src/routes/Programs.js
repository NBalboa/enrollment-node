const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();



router.get("/test", function(req,res){
    res.send("test");
})

router.post("/add_program", function(req,res){

    const db = new Database();
    const conn = db.connection;

    const { program_name, major} = req.body;

    date_now = date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const query = "INSERT INTO programs (program_name, major, open, created_at, updated_at) VALUES (?, ?,?,?,?)";


    conn.beginTransaction(function(err){
        //check if program already exists
        conn.query("SELECT * FROM programs WHERE program_name = ? AND major = ?", [program_name, major], function(err, result){
            if(err) throw err;
            if(result.length > 0){
                res.json({data: "Program already exists"})
            }else{
                //insert program
                conn.query(query, [program_name, major, 1,date_now,date_now], function(err, result){
                    if(err) throw err;
                    conn.commit(function(err){
                        if(err) throw err;
                        res.json({data: "Program added"})
                    })
                })
            }
        })
    })

})


router.get("/get_programs", function(req,res){
    const db = new Database();
    const conn = db.connection;

    const query = "SELECT * FROM programs";


    conn.query(query, function(err, result){
        if(err) throw err;
        conn.query(query, function (err, result) {
          if (err) throw err;
          res.json({ data: result });
        });
    })
})

router.post("/update_program_open", function(req,res){

    const db = new Database();
    const conn = db.connection;

    const { program_id, open} = req.body;

    date_now = date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const query = "UPDATE programs SET open = ?, updated_at = ? WHERE id = ?";

    conn.beginTransaction(function(err){
        conn.query(query, [open, date_now, program_id], function(err, result){
            if(err) throw err;
            conn.commit(function(err){
                if(err) throw err;
                res.json({data: "Program updated"})
            })
        })
    })

})

router.delete("/delete_program", function(req,res){

    const db = new Database();

    const conn = db.connection;

    const { program_id } = req.body;

    const query = "DELETE FROM programs WHERE id = ?";

    conn.beginTransaction(function(err){
        if (err) throw err

        conn.query(query, [program_id], function(err, result){
            if(err) throw err;
            conn.commit(function(err){
                if(err) throw err;
                res.json({data: "Program deleted"})
            })
        })
    })

})


router.get("/get_programs_open", function(req,res){

    const db = new Database();
    const conn = db.connection;

    const query =
      "SELECT id, IFNULL(CONCAT(program_name, IF(major = '', '', CONCAT(' MAJOR IN ', major))), program_name) AS program FROM programs WHERE open = 1";


      conn.connect(function(err){
            if(err) throw err;
            conn.query(query, function(err, result){
                if(err) throw err;
                res.json({data: result})
            })
        })
})


module.exports = router;