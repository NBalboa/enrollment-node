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
    sy,
    profile,
  } = req.body;

  const query =
    "INSERT INTO students(student_id, first_name, middle_name, last_name, gender, dob, pob, nationality, civil_status, religion, tribe, disability, scholarship, current_street, current_barangay, current_province, current_zipcode, current_phone, current_telphone, permanent_street, permanent_barangay, permanent_province, permanent_zipcode, permanent_phone, permanent_telphone, type_of_admission, enrollment_status, program, semester, year_level, f_fullname, f_edu ,f_occ, m_fullname, m_edu , m_occ, g_fullname, g_relationship, g_address, g_mobile, sy , profile, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

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
    sy,
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

router.put('/update/:id', upload.single("profile"), async function(req, res) {
  const db = new Database();
  const conn = db.connection;
  //check if file isn't empty

  let newFileName = '';


  if (req.file !== undefined) {
    let fileType = req.file.mimetype.split("/")[1];
    console.log("file type", fileType);
    newFileName = req.file.filename + "." + fileType;
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
  }
  

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
    sy,
    username,
    password,
  } = req.body;

  const {id} = req.params;

  date_now = date = new Date().toISOString().slice(0, 19).replace("T", " ");

  let query = "UPDATE students SET student_id = ? ,first_name = ?,middle_name = ?,last_name = ?,gender = ?,dob = ?,pob = ?, nationality = ?,civil_status = ?, religion = ?, tribe = ?, disability = ?, scholarship = ?, current_street = ?, current_barangay = ?, current_province = ?, current_zipcode = ?, current_phone = ?, current_telphone = ?, permanent_street = ?, permanent_barangay = ?, permanent_province = ?, permanent_zipcode = ?, permanent_phone = ?, permanent_telphone = ?, type_of_admission = ?, enrollment_status = ?, program = ?, semester = ?, year_level = ?, f_fullname = ?, f_edu = ?, f_occ = ?, m_fullname = ?, m_edu = ?, m_occ = ?, g_fullname = ?, g_relationship = ?, g_address = ?, g_mobile = ?, sy = ?, username = ?, password = ?, profile = ?, updated_at = ? WHERE id = ?";
  let values = [
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
    sy,
    username,
    password,
    `images/${newFileName}`,
    date_now,
    id,
  ];

  if(newFileName === ''){
    query = "UPDATE students SET student_id = ? ,first_name = ?,middle_name = ?,last_name = ?,gender = ?,dob = ?,pob = ?, nationality = ?,civil_status = ?, religion = ?, tribe = ?, disability = ?, scholarship = ?, current_street = ?, current_barangay = ?, current_province = ?, current_zipcode = ?, current_phone = ?, current_telphone = ?, permanent_street = ?, permanent_barangay = ?, permanent_province = ?, permanent_zipcode = ?, permanent_phone = ?, permanent_telphone = ?, type_of_admission = ?, enrollment_status = ?, program = ?, semester = ?, year_level = ?, f_fullname = ?, f_edu = ?, f_occ = ?, m_fullname = ?, m_edu = ?, m_occ = ?, g_fullname = ?, g_relationship = ?, g_address = ?, g_mobile = ?, sy = ?, username = ?, password = ?, updated_at = ? WHERE id = ?";
    values = [
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
      sy,
      username,
      password,
      date_now,
      id,
    ];
  }
  

    await conn.connect((err) => {
      if (err) throw err;
      conn.query(query, values, (err, result) => {
        if (err) {
          if (err.errno === 1062) {
            res.json({ data: "Student I.D. is already existed" });
            return;
          } else {
            throw err;
          }
        }

        console.log(result);
        res.json({ data: "Update Sucessfully" });
      });
    });

})

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


  await conn.connect((err) => {
    if(err) throw err;
    conn.query(query, id, function(err, result){
      if(err) throw err;
  
      if(result.length === 0){
        res.json({data: "Student wasn't existed"})
      }else{
        res.json(result);
  
      }
    })
  })

  console.log(id);
})

router.post("/search", async function(req, res) {
  const db = new Database();
  const conn = db.connection;

  console.log("connected to search")

  const {student_id, name} = req.body

  let query = "SELECT * FROM students";

  if(student_id && !name){
    query = `SELECT * FROM students WHERE student_id LIKE '%${student_id}%'`
  }
  else if(name && !student_id){
    query = `SELECT * FROM students WHERE CONCAT(first_name, ' ', middle_name, ' ', last_name) LIKE '%${name}%'`
  }

  console.log(query);

  await conn.connect((err) => {
    if(err) throw err;
    
    conn.query(query, function (err, result) {
      if(err) throw err;
      console.log(result)
      res.json({result});
    })
  })

})

module.exports = router;