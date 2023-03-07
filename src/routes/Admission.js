const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "./public/images" }); 


router.post("/admit", upload.single("profile"), async function (req, res) {
  const db = new Database();
  const conn = db.connection;

  let fileType = req.file.mimetype.split("/")[1];
  console.log("file type", fileType);
  let newFileName = req.file.filename + "." + fileType;
  console.log(newFileName);

  fs.rename(
    `./public/images/${req.file.filename}`,
    `./public/images/${newFileName}`,
    function (err) {
      if (err) {
        return res.send(400);
      }
    }
  );

  date_now = date = new Date().toISOString().slice(0, 19).replace("T", " ");

  const {
    student_id,
    first_name,
    middle_name,
    last_name,
    gender,
    dob,
    pob,
    nationality,
    civil_status,
    religion,
    tribe,
    disability,
    scholarship,
    current_street,
    current_barangay,
    current_province,
    current_zipcode,
    current_phone,
    current_telphone,
    permanent_street,
    permanent_barangay,
    permanent_province,
    permanent_zipcode,
    permanent_phone,
    permanent_telphone,
    type_of_admission,
    enrollment_status,
    program,
    semester,
    year_level,
    f_fullname,
    f_edu,
    f_occ,
    m_fullname,
    m_edu,
    m_occ,
    g_fullname,
    g_relationship,
    g_address,
    g_mobile,
    profile,
  } = req.body;

  const query =
    "INSERT INTO students(student_id, first_name, middle_name, last_name, gender, dob, pob, nationality, civil_status, religion, tribe, disability, scholarship, current_street, current_barangay, current_province, current_zipcode, current_phone, current_telphone, permanent_street, permanent_barangay, permanent_province, permanent_zipcode, permanent_phone, permanent_telphone, type_of_admission, enrollment_status, program, semester, year_level, f_fullname, f_edu ,f_occ, m_fullname, m_edu , m_occ, g_fullname, g_relationship, g_address, g_mobile, profile, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

  const values = [
    student_id,
    first_name,
    middle_name,
    last_name,
    gender,
    dob,
    pob,
    nationality,
    civil_status,
    religion,
    tribe,
    disability,
    scholarship,
    current_street,
    current_barangay,
    current_province,
    current_zipcode,
    current_phone,
    current_telphone,
    permanent_street,
    permanent_barangay,
    permanent_province,
    permanent_zipcode,
    permanent_phone,
    permanent_telphone,
    type_of_admission,
    enrollment_status,
    program,
    semester,
    year_level,
    f_fullname,
    f_edu,
    f_occ,
    m_fullname,
    m_edu,
    m_occ,
    g_fullname,
    g_relationship,
    g_address,
    g_mobile,
    `images/${newFileName}`,
    date_now,
    date_now,
  ];

  await conn.connect((err) => {
    if (err) throw err;
    conn.query(query, values, (err, result) => {
      if (err) {
        if(err.errno === 1062){
          res.json({ data: "Student I.D. is already existed" });
          return;
        }
        else{
          throw err;
        }
      };

      console.log(result);
      res.json({ data: "Student Admitted" });
    });
  });
});

router.delete('/delete/:id', async function(req, res) {
  const db = new Database();
  const conn = db.connection;

  const {id} = req.params;
  const query = "DELETE FROM students WHERE id = ?"


  console.log(`working id ${id}`)
  await conn.connect((err) => {
    if(err) throw err;
      conn.query(query, id, function (err, result) {
        if(err) throw err;

        let deleted = result.affectedRows;

        if(deleted === 0){
          res.json({ data: "Student is not existed/Already Deleted" });

        }else{
          res.json({ data: "Student Deleted" });
        }
      })
  })




})

router.get("/students", async function (req, res) {
  const db = new Database();
  const conn = db.connection;

  console.log("Working api");

  const query = "SELECT * FROM students";

  conn.query(query, function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

router.get("/student/:id", async function (req, res) {
  const db = new Database();
  const conn = db.connection;

  const {id} = req.params;

  const query = "SELECT * FROM students WHERE id = ?"

  conn.query(query, id, function(err, result){
    if(err) throw err;

    if(result.length === 0){
      res.json({data: "Student wasn't existed"})
    }else{
      res.json(result);

    }
  })

  console.log(id);
})

module.exports = router;