import express from "express"; // Import Express for routing
import { Student } from "../models/studentModel.js"; // Import Student model
import Auth from "../middleware/auth.js"; // Import authentication middleware
import multer from "multer"; // Import Multer for file uploads
import path from "path"; // Import Path for file paths

const router = express.Router(); // Initialize Express Router
router.use(Auth); // Use authentication middleware for all routes


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/Images'); // Set destination directory for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Set filename for uploaded files
  }
})

const upload = multer({
  storage:storage
})

//Route for Save A New Student
router.post("/", upload.single('file'), async (req, res) => {
  try {
    // Check if all required fields are provided in the request body
    if (
      !req.body.studentName ||
      !req.body.address ||
      !req.body.cell ||
      !req.body.branch ||
      !req.body.email ||
      !req.body.year ||
      !req.body.motherName ||
      !req.body.parentCell ||
      !req.body.fatherName ||
      !req.body.lastName ||
      !req.body.studentImg ||
      !req.body.studentForm ||
      !req.body.dateOfJoining
    ) {
      return res.status(400).send({
        message: "Send all required field",
      });
    }

    // Create a new student object
    const newStudent = {
      studentName: req.body.studentName,
      lastName: req.body.lastName,
      address: req.body.address,
      cell: req.body.cell,
      email: req.body.email,
      dateOfJoining: req.body.dateOfJoining,
      branch: req.body.branch,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      year: req.body.year,
      parentCell: req.body.parentCell,
      studentImg: req.body.studentImg,
      studentForm: req.body.studentForm,
    };

    // Save the new student to the database
    const student = await Student.create(newStudent);

    return res.status(400).send(student); // Send response
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message); // Send error response
  }
});

//Route for get All Student From DataBase
router.get("/", async (req, res) => {
  try {
    const students = await Student.find({}); // Retrieve all students from the database
    return res.status(200).json({
      count: students.length,
      data: students,
    }); // Send response
  } catch (error) {
    res.status(500).send(error.message); // Send error response
  }
});

// Route to get a student with matching ID from the database
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id); // Find student by ID in the database
    return res.status(200).json(student); // Send response

  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message); // Send error response
  }
});

// Route to update a student
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Update student by ID in the database
    const student = await Student.findByIdAndUpdate(id, {
      studentName: req.body.studentName,
      lastName: req.body.lastName,
      address: req.body.address,
      cell: req.body.cell,
      email: req.body.email,
      dateOfJoining: req.body.dateOfJoining,
      branch: req.body.branch,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName,
      year: req.body.year,
      parentCell: req.body.parentCell,
      studentImg: req.body.studentImg,
      studentForm: req.body.studentForm,
      books: req.body.books ? req.body.books : "",
    });
    return res.status(200).json(student); // Send response
  } catch (error) {
    res.status(500).send(error.message); // Send error response
  }
});

// Route to delete a student
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Student.findByIdAndDelete(id); // Delete student by ID from the database
     
    if (!result) { // Send response if student not found
      return res.status(404).json({ message: "Student Not Found" });
    }

    return res
      .status(200)
      .json({ message: `_${id} Student Deleted Successfully` }); // Send success message
  } catch (error) {
    return res.status(500).send({ message: error.message }); // Send error response
  }
});

// Route to search for students by name
router.post("/studentList", async(req, res)=>{
  const value = req.body.value;
  try{
    const studentNameList = [];
    const studentList = await Student.find({}); 
    // Search for students with matching name
    studentList.map((ele)=>{
      if(ele.studentName.includes(value)){
        return (studentNameList.push(ele.studentName))
      }
    })
    res.status(200).json(studentList);
  }catch(error) {
    res.status(500).send(error.message);
  }
})

export default router;
