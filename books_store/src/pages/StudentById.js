import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import studentPic from "../images/student_Image.avif";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import studentForm from "../images/student_Form.jpeg";
import { styled } from "@mui/material/styles";

const StudentById = () => {
  // State variables
  const [data, setData] = useState([]); // Holds student data fetched from API
  const [updateData, setUpdateData] = useState([]); // Holds updated student data
  const { id } = useParams(); // Get student ID from URL params
  const [editForm, setEditForm] = useState("none"); // Controls display of edit form
  const [displayDetails, setDisplayDetail] = useState("block"); // Controls display of student details
  const token = localStorage.getItem("token"); // Get token from localStorage

  // State variable to hold updated data for form submission
  const [newData, setNewData] = useState({
    studentImg: studentPic,
    studentForm: studentForm,
    studentName: " ",
    lastName: " ",
    address: " ",
    cell: " ",
    branch: " ",
    email: " ",
    year: " ",
    motherName: " ",
    fatherName: " ",
    parentCell: " ",
    dateOfJoining: " ",
  });

  const navigate = useNavigate(); // Navigation hook

  // Fetch student data from API on component mount and when updateData state changes
  useEffect(() => {
    async function Res() {
      const result = await fetch(`${window.location.origin}/students/${id}`, {
        headers: { authorization: `${token}` },
      });
      const res = await result.json();
      setData(res);
    }

    Res();
  }, [id, updateData]);

  // Function to switch to edit mode and populate form with existing data
  const moduleChange = () => {
    setEditForm("block");
    setDisplayDetail("none");
    setNewData({
      studentImg: data.studentImg,
      studentForm: data.studentForm,
      studentName: data.studentName,
      lastName: data.lastName,
      address: data.address,
      cell: data.cell,
      branch: data.branch,
      email: data.email,
      year: data.year,
      motherName: data.motherName,
      fatherName: data.fatherName,
      parentCell: data.parentCell,
      dateOfJoining: data.dateOfJoining,
    });
  };

  // Function to handle form submission for updating student details
  const StudentUpdate = (e) => {
    e.preventDefault();

    // Validation checks for required fields
    if (
      !newData.studentName ||
      !newData.address ||
      !newData.cell ||
      !newData.branch ||
      !newData.email ||
      !newData.year ||
      !newData.motherName ||
      !newData.fatherName ||
      !newData.parentCell ||
      !newData.lastName ||
      newData.studentImg == studentPic ||
      newData.studentForm == studentForm
    ) {
      setNewData({ ...newData, studentImg: studentPic });
      setNewData({ ...newData, studentForm: studentForm });
      return alert("Fill all required field");
    }

    // Prepare request options for PATCH request to update student data
    const requestOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify(newData),
    };

    // Send PATCH request to update student data
    fetch(`${window.location.origin}/students/${id}`, requestOptions).then(
      (response) =>
        response.json().then(alert("Student Updated In Library Successfully!"))
    );

    // Reset form and update state to display student details
    setEditForm("none");
    setDisplayDetail("block");
    setUpdateData(newData);
  };

  // Function to cancel editing and revert to display student details
  const reverseModule = () => {
    setEditForm("none");
    setDisplayDetail("block");
  };

  // Function to delete student permanently
  const DeleteStudent = () => {
    if (window.confirm("Are you want it to delete Permanently?")) {
      const token = localStorage.getItem("token");

      // Send DELETE request to delete student
      fetch(`${window.location.origin}/students/${id}`, {
        method: "DELETE",
        headers: { authorization: `${token}` },
      })
        .then((res) => {
          res.json();
          if (res.error == "Authentication Failed") {
            navigate("/");
          }
        })
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    }

    // Navigate to all students page after deletion
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

  let name, value;

  // Function to handle form input changes
  const handleInputs = (e) => {
    name = e.target.name;
    if (name !== "studentImg" || name !== "studentForm") {
      value = e.target.value;
    }

    setNewData({ ...newData, [name]: value });
  };

  // Function to handle image upload for student image
  function handleChange(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setNewData({ ...newData, studentImg: reader.result });
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  }

  // Function to handle image upload for student form
  function handleFormChange(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setNewData({ ...newData, studentForm: reader.result });
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  }

  return (
    <div>
      {/* Edit form for updating student details */}
      <div style={{ display: editForm }} className="updateStudent">
        {/* Cancel button and update header */}
        <div style={{ display: "flex", marginBottom: "3%" }}>
          <Button
            onClick={reverseModule}
            style={{
              backgroundColor: "red",
              color: "blue",
              fontWeight: "700",
              padding: "5px",
              marginLeft: "0px",
              marginRight: "5%",
              border: "1px dotted yellow",
            }}
          >
            Cancel
          </Button>
          <h3>Update Students Details !</h3>
        </div>
        {/* Form for updating student details */}
        <div className="updateImgInfo">
          <form>
            {/* Text fields for student details */}
            <TextField
              name="studentName"
              value={newData.studentName}
              onChange={handleInputs}
              fullWidth
              label="Student Name"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              name="lastName"
              value={newData.lastName}
              onChange={handleInputs}
              fullWidth
              label="Last Name"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="address"
              value={newData.address}
              onChange={handleInputs}
              label="Address"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="email"
              value={newData.email}
              onChange={handleInputs}
              label="Email"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="cell"
              value={newData.cell}
              onChange={handleInputs}
              type="number"
              label="Mobile No."
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="dateOfJoining"
              value={newData.dateOfJoining}
              onChange={handleInputs}
              type="date"
              label="Date of Joining"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="branch"
              value={newData.branch}
              onChange={handleInputs}
              label="Branch"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="year"
              value={newData.year}
              onChange={handleInputs}
              type="number"
              label="Year"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="fatherName"
              value={newData.fatherName}
              onChange={handleInputs}
              label="Father Name"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="motherName"
              value={newData.motherName}
              onChange={handleInputs}
              label="Mother Name"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="parentCell"
              value={newData.parentCell}
              onChange={handleInputs}
              type="number"
              label="Parents Contact No."
              id="fullWidth"
              margin="normal"
            />
            {/* Buttons for image upload */}
            <div className="studentImgBtnDiv">
              <Button
                onChange={handleChange}
                component="label"
                variant="contained"
                color="success"
                startIcon={<CloudUploadIcon />}
              >
                Replace Student Image
                <VisuallyHiddenInput type="file" />
              </Button>

              <Button
                onChange={handleFormChange}
                component="label"
                variant="contained"
                color="success"
                startIcon={<CloudUploadIcon />}
              >
                Replace Form
                <VisuallyHiddenInput type="file" />
              </Button>
            </div>
            {/* Button for updating student details */}
            <div className="addbookbtn">
              <Button
                onClick={StudentUpdate}
                fullWidth
                className="btn_In"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
              >
                Update Student Details
              </Button>
            </div>
          </form>
          {/* Display updated student images */}
          <div className="updateStudentImg">
            <img
              src={newData.studentImg}
              className="updateStudentImage"
              alt="student"
            />
            <img
              src={newData.studentForm}
              className="updateFormImage"
              alt="form"
            />
          </div>
        </div>
      </div>

      {/* Display student details */}
      <div style={{ display: displayDetails }} className="singleStudentBlock">
        {/* Buttons for edit and delete operations */}
        <div className="btnBlock">
          <button className="btngreen" onClick={moduleChange}>
            Edit
          </button>
          <button className="btnred" onClick={DeleteStudent}>
            Delete
          </button>
        </div>
        {/* Display student information */}
        <div className="studentbyid">
          <img src={data.studentImg} alt="Student Imgage" />
          {/* Display student details in a flex layout */}
          <div className="studentbyidFlex">
            <div>
              <h3>Student Name :</h3>
              <p>{data.studentName + " " + data.lastName}</p>
            </div>
            <div>
              <h3>Year ( Branch ):</h3>
              <p>{data.year + " " + "(" + data.branch + ")"}</p>
            </div>
            <div>
              <h3>Cell :</h3>
              <p>{data.cell}</p>
            </div>
            <div>
              <h3>Email :</h3>
              <p>{data.email}</p>
            </div>
          </div>
          {/* Display additional student details */}
          <div className="studentbyidFlex">
            <div>
              <h3>Date Of Join :</h3>
              <p>{data.dateOfJoining}</p>
            </div>
            <div>
              <h3>Address :</h3>
              <p>{data.address}</p>
            </div>
            <div>
              <h3>Father Name :</h3>
              <p>{data.fatherName}</p>
            </div>
            <div>
              <h3>Mother Name :</h3>
              <p>{data.motherName}</p>
            </div>
            <div>
              <h3>Parent Cell :</h3>
              <p>{data.parentCell}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Display books taken by the student */}
      <div style={{ display: displayDetails }} className="bookBySingleStudent">
        <table className="table">
          <tr>
            <th>Sr. No.</th>
            <th>Book Name</th>
            <th>Auther</th>
            <th>Edition</th>
            <th>Books Taken</th>
          </tr>
            {data.books ?.map((ele, ind) => {
              if(ele !== null){
                return (
                  <tr key={ind}>
                    <td>{ind + 1}</td>
                    <td>{ele.BookName}</td>
                    <td>{ele.AutherName}</td>
                    <td>{ele.edition}</td>
                    <td>01</td>
                  </tr>
                )
              }
            })}
        </table>
      </div>
    </div>
  );
};

export default StudentById;
