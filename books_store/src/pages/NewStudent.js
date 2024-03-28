import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import studentPic from "../images/student_Image.avif";
import studentForm from "../images/student_Form.jpeg";
import { useNavigate } from "react-router-dom";

const NewStudent = () => {
  // State to manage form data
  const [data, setData] = useState({
    studentImg: studentPic,
    studentForm: studentForm,
    studentName: " ",
    address: " ",
    cell: " ",
    branch: " ",
    email: " ",
    year: " ",
    motherName: " ",
    fatherName: " ",
    parentCell: " ",
    lastName: " ",
    dateOfJoining: " ",
  });

  const navigate = useNavigate();

  // Function to handle image file change for student image
  function handleChange(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setData({ ...data, studentImg: reader.result });
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  }

  // Function to handle image file change for student form
  function handleFormChange(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setData({ ...data, studentForm: reader.result });
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  }

  let name, value;

  // Function to handle input changes in the form
  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    if (name !== "image" || name !== "form") {
      value = e.target.value;
    }
    setData({ ...data, [name]: value });
  };

  // Function to handle form submission
  const NavigateToMainPage = async (e) => {
    e.preventDefault();

    // Validation for required fields
    if (
      !data.studentName ||
      !data.address ||
      !data.cell ||
      !data.branch ||
      !data.email ||
      !data.year ||
      !data.motherName ||
      !data.fatherName ||
      !data.parentCell ||
      !data.lastName ||
      data.studentImg === studentPic ||
      data.studentForm === studentForm
    ) {
      setData({ ...data, studentImg: studentPic });
      setData({ ...data, studentForm: studentForm });
      return alert("Fill all required field");
    }

    // Fetch request to add student data
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(data),
    };

    fetch(`${window.location.origin}/students/`, requestOptions)
      .then((response) => {
        response.json();
        if (response.error == "Authentication Failed") {
          navigate("/");
        }
      })
      .then(alert("Student Added In Library Successfully!"));

    // Reset form data and navigate to main page
    setData({
      studentImg: studentPic,
      studentForm: studentForm,
      studentName: " ",
      address: " ",
      cell: " ",
      branch: " ",
      email: " ",
      year: " ",
      motherName: " ",
      fatherName: " ",
      parentCell: " ",
      lastName: " ",
      dateOfJoining: " ",
    });

    navigate("/allstudents");
  };

  // Styled component for visually hidden input
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  return (
    <form encType="multipart/form-data">
      <div className="newStudent">
        {/* Box component for styling */}
        <Box
          sx={{
            width: 500,
            maxWidth: "100%",
            margin: 10,
          }}
        >
          <h3>New Students Details !</h3>
          {/* Text fields for student details */}
          <TextField
            name="studentName"
            value={data.studentName}
            onChange={handleInputs}
            fullWidth
            label="Student Name"
            id="fullWidth"
            margin="normal"
          />
          <TextField
            name="lastName"
            value={data.lastName}
            onChange={handleInputs}
            fullWidth
            label="Last Name"
            id="fullWidth"
            margin="normal"
          />
          <TextField
            fullWidth
            name="address"
            value={data.address}
            onChange={handleInputs}
            label="Address"
            id="fullWidth"
            margin="normal"
          />
          <TextField
            fullWidth
            name="email"
            value={data.email}
            onChange={handleInputs}
            label="Email"
            id="fullWidth"
            margin="normal"
          />
          <TextField
            fullWidth
            name="cell"
            value={data.cell}
            onChange={handleInputs}
            type="number"
            label="Mobile No."
            id="fullWidth"
            margin="normal"
          />
          <TextField
            fullWidth
            name="dateOfJoining"
            value={data.joinDate}
            onChange={handleInputs}
            type="date"
            label="Date of Joining"
            id="fullWidth"
            margin="normal"
          />
          <TextField
            fullWidth
            name="branch"
            value={data.branch}
            onChange={handleInputs}
            label="Branch"
            id="fullWidth"
            margin="normal"
          />
          <TextField
            fullWidth
            name="year"
            value={data.year}
            onChange={handleInputs}
            type="number"
            label="Year"
            id="fullWidth"
            margin="normal"
          />
          <TextField
            fullWidth
            name="fatherName"
            value={data.fatherName}
            onChange={handleInputs}
            label="Father Name"
            id="fullWidth"
            margin="normal"
          />
          <TextField
            fullWidth
            name="motherName"
            value={data.motherName}
            onChange={handleInputs}
            label="Mother Name"
            id="fullWidth"
            margin="normal"
          />
          <TextField
            fullWidth
            name="parentCell"
            value={data.parentCell}
            onChange={handleInputs}
            type="number"
            label="Parents Contact No."
            id="fullWidth"
            margin="normal"
          />
          {/* Buttons to upload images */}
          <div className="studentImgBtnDiv">
            <Button
              onChange={handleChange}
              name="image"
              component="label"
              variant="contained"
              color="success"
              startIcon={<CloudUploadIcon />}
            >
              Upload Student Image
              <VisuallyHiddenInput type="file" />
            </Button>

            <Button
              onChange={handleFormChange}
              name="form"
              component="label"
              variant="contained"
              color="success"
              startIcon={<CloudUploadIcon />}
            >
              Upload Form
              <VisuallyHiddenInput type="file" />
            </Button>
          </div>
          {/* Error message for file size */}
          <p
            style={{ color: "red", marginLeft: "40%", marginTop: "2%" }}
          >{`Keep Both File Size < 201KB`}</p>
          {/* Button to add student */}
          <div className="addbookbtn">
            <Button
              onClick={NavigateToMainPage}
              fullWidth
              className="btn_In"
              variant="contained"
              size="large"
              endIcon={<SendIcon />}
            >
              Add Student
            </Button>
          </div>
        </Box>
        {/* Div to display uploaded images */}
        <div className="studentImg">
          <img src={data.studentImg} className="studentImage" alt="student" />
          <img src={data.studentForm} className="formImage" alt="form" />
        </div>
      </div>
    </form>
  );
};

export default NewStudent; // Export NewStudent component
