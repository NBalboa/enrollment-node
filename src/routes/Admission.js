const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "./public/images" }); 
const { check, validationResult } = require("express-validator");
const shortUUID = require("short-uuid");


const admissionFields = [
  check("first_name").notEmpty().withMessage("First Name must have value").escape(),
  check("last_name").notEmpty().withMessage("Last name must have value").escape(),
  check("middle_name").notEmpty().withMessage("Middle name must have value").escape(),
  check("gender").notEmpty().withMessage("Gender must have value").escape(),
  check("dob").notEmpty().withMessage("Date of Birth must have value").isISO8601().withMessage("Date of Birth must be a date").escape(),
  check("pob").notEmpty().withMessage("Place of Birth must have value").escape(),
  check("nationality").notEmpty().withMessage("Nationality must have value").escape(),
  check("civil_status").notEmpty().withMessage("Civil Status must have value").escape(),
  check("religion").notEmpty().withMessage("Religion must have value").escape(),
  check("tribe").notEmpty().withMessage("Tribe must have value").escape(),
  check("current_street").notEmpty().withMessage("Current Street must have value").escape(),
  check("current_barangay").notEmpty().withMessage("Current Barangay must have value").escape(),
  check("current_province").notEmpty().withMessage("Current Province must have value").escape(),
  check("current_zipcode").notEmpty().withMessage("Current Zipcode must have value").escape(),
  check("current_phone").notEmpty().withMessage("Current Phone must have value").escape(),
  check("current_telphone").notEmpty().withMessage("Current Telephone must have value").escape(),
  check("permanent_street").notEmpty().withMessage("Permanent Street must have value").escape(),
  check("permanent_barangay").notEmpty().withMessage("Permanent Barangay must have value").escape(),
  check("permanent_province").notEmpty().withMessage("Permanent Province must have value").escape(),
  check("permanent_zipcode").notEmpty().withMessage("Permanent Zipcode must have value").escape(),
  check("permanent_phone").notEmpty().withMessage("Permanent Phone must have value").escape(),
  check("permanent_telphone").notEmpty().withMessage("Permanent Telephone must have value").escape(),
  check("type_of_admission").notEmpty().withMessage("Type of Admission must have value").escape(),
  check("enrollment_status").notEmpty().withMessage("Enrollment Status must have value").escape(),
  check("program").notEmpty().withMessage("Program must have value").escape(),
  check("semester").notEmpty().withMessage("Semester must have value").escape(),
  check("year_level").notEmpty().withMessage("Year Level must have value").escape(),
  check("f_fullname").notEmpty().withMessage("Father's Full Name must have value").escape(),
  check("f_edu").notEmpty().withMessage("Father's Education must have value").escape(),
  check("f_occ").notEmpty().withMessage("Father's Occupation must have value").escape(),
  check("m_fullname").notEmpty().withMessage("Mother's Full Name must have value").escape(),
  check("m_edu").notEmpty().withMessage("Mother's Education must have value").escape(),
  check("m_occ").notEmpty().withMessage("Mother's Occupation must have value").escape(),
];

router.post(
  "/admit",
  upload.single("profile"),
  admissionFields,
  async function (req, res) {
    const db = new Database();
    const conn = db.connection;

    // console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.json({ errors: errors.array(), success: false });
    }


    let newFileName = "";

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

  

    let uniqueId = student_id

      if (!uniqueId) {
        const currentYear = new Date().getFullYear();
        const lastTwoDigits = currentYear.toString().slice(-2);

        uniqueId =
          "ADMITTED_ID-" + shortUUID.generate() + lastTwoDigits;
      }


    const query =
      "INSERT INTO students(student_id, first_name, middle_name, last_name, gender, dob, pob, nationality, civil_status, religion, tribe, disability, scholarship, current_street, current_barangay, current_province, current_zipcode, current_phone, current_telphone, permanent_street, permanent_barangay, permanent_province, permanent_zipcode, permanent_phone, permanent_telphone, type_of_admission, enrollment_status, program, semester, year_level, f_fullname, f_edu ,f_occ, m_fullname, m_edu , m_occ, g_fullname, g_relationship, g_address, g_mobile, sy, profile, role, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    let uploadProfile = "";

    if(newFileName !== ""){
      uploadProfile = `images/${newFileName}`
    }


    const values = [
      uniqueId,
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
      uploadProfile,
      'student',
      date_now,
      date_now,
    ];

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
        res.json({ data: "Student Admitted" });
      });
    });
  }
);

router.put(
  "/update/:id",
  upload.single("profile"),
  admissionFields,
  async function (req, res) {
    const db = new Database();
    const conn = db.connection;
    //check if file isn't empty

    // console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.json({ errors: errors.array(), success: false });
    }

    let newFileName = "";

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

    const { id } = req.params;

    date_now = date = new Date().toISOString().slice(0, 19).replace("T", " ");

    let query =
      "UPDATE students SET student_id = ? ,first_name = ?,middle_name = ?,last_name = ?,gender = ?,dob = ?,pob = ?, nationality = ?,civil_status = ?, religion = ?, tribe = ?, disability = ?, scholarship = ?, current_street = ?, current_barangay = ?, current_province = ?, current_zipcode = ?, current_phone = ?, current_telphone = ?, permanent_street = ?, permanent_barangay = ?, permanent_province = ?, permanent_zipcode = ?, permanent_phone = ?, permanent_telphone = ?, type_of_admission = ?, enrollment_status = ?, program = ?, semester = ?, year_level = ?, f_fullname = ?, f_edu = ?, f_occ = ?, m_fullname = ?, m_edu = ?, m_occ = ?, g_fullname = ?, g_relationship = ?, g_address = ?, g_mobile = ?, sy = ?, username = ?, password = ?, profile = ?, updated_at = ? WHERE id = ?";

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

    if (newFileName === "") {
      query =
        "UPDATE students SET student_id = ? ,first_name = ?,middle_name = ?,last_name = ?,gender = ?,dob = ?,pob = ?, nationality = ?,civil_status = ?, religion = ?, tribe = ?, disability = ?, scholarship = ?, current_street = ?, current_barangay = ?, current_province = ?, current_zipcode = ?, current_phone = ?, current_telphone = ?, permanent_street = ?, permanent_barangay = ?, permanent_province = ?, permanent_zipcode = ?, permanent_phone = ?, permanent_telphone = ?, type_of_admission = ?, enrollment_status = ?, program = ?, semester = ?, year_level = ?, f_fullname = ?, f_edu = ?, f_occ = ?, m_fullname = ?, m_edu = ?, m_occ = ?, g_fullname = ?, g_relationship = ?, g_address = ?, g_mobile = ?, sy = ?, username = ?, password = ?, updated_at = ? WHERE id = ?";
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
  }
);

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

router.post("/search/:type/:keyword",
  [check("type").escape(), check("keyword").notEmpty().withMessage("Search field must have value").escape()], 
  async function(req, res) {

  const db = new Database();
  const conn = db.connection;

  // console.log(req.params.type)
  // console.log(req.params.keyword)

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.json({errors: errors.array()}) 
  }

  // console.log("no errors")

  // res.send("wahh")

  const value = [`%${req.params.keyword}%`]

  let query = ""

  if(req.params.type === "student_id"){
    query = "SELECT * FROM students WHERE student_id LIKE ?"
  }else if(req.params.type === "name"){
    query = "SELECT * FROM students WHERE CONCAT(first_name, ' ', middle_name, ' ', last_name) LIKE ?"
  }

  await conn.connect((err) => {
    
    conn.query(query,value, function (err, result) {
      if(err) throw err;
      res.json({result});
    })
  })

})


router.get("/counting", async function(req, res){
  const db = new Database();
  const conn = db.connection;

  const query = `SELECT COUNT(*) as total, sum(gender = "Male") as male, sum(gender = "Female") as Female FROM students`

  await conn.connect(function connectingDBErr(err){
    if(err) throw err;
    conn.query(query, function queryERR(err, result){

      if(err) throw err;
      res.json(result);
    })

  })

})

router.get("/recent_add", async function(req, res){

  const db = new Database();
  const conn = db.connection;

  const query = `SELECT id, student_id , first_name, last_name, middle_name,enrollment_status, type_of_admission, program FROM students ORDER BY created_at DESC LIMIT 5`;

  conn.connect(function connectingDBErr(err){
    if(err) throw err;

    conn.query(query, function queryERR(err, result){
      if(err) throw err;

      res.json(result);

    })

  })

})

module.exports = router;