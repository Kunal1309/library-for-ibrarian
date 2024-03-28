// Importing necessary dependencies from React and Material-UI
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../images/hand-book-logo-illustration-art-background-43965136.webp";
import TextField from "@mui/material/TextField";
import logo1 from "../images/Book_Image.jpeg"; // Importing default book image
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

// Functional component to display book details by ID
const BookById = () => {
  // Initializing state variables using useState hook
  let index = 0; // Counter for book copies
  let [bookCopies, setBookCopies] = useState(0); // State for available book copies
  const [data, setData] = useState([]); // State for fetched book data
  const [updateData, setUpdateData] = useState([]); // State for updated book data
  const [studentId, setStudentId] = useState(); // State for selected student ID
  const { id } = useParams(); // Accessing parameter ID from URL
  const [editForm, setEditForm] = useState("none"); // State for edit form visibility
  const [addStudent, setAddStudent] = useState("none"); // State for add student form visibility
  const [displayDetails, setDisplayDetail] = useState("flex"); // State for book details visibility
  const [studentList, setstudentList] = useState([]); // State for list of students
  const [studenName, setStudenName] = useState(""); // State for student name input
  const [allStudents, setAllStudents] = useState([]); // State for all students data
  const navigate = useNavigate(); // Hook for navigation
  const token = localStorage.getItem("token"); // Accessing token from local storage

  // State for new data to update book details
  const [newData, setNewData] = useState({
    file: logo, // Default book image
    bookName: " ",
    autherName: " ",
    edition: " ",
    numberCopies: " ",
    date: " ",
  });

  // State for selected student data
  const [studentData, setStudentData] = useState();

  // Effect hook to fetch book details by ID when component mounts or ID updates
  useEffect(() => {
    async function fetchData() {
      const result = await fetch(`${window.location.origin}/books/${id}`, {
        headers: {
          authorization: `${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const res = await result.json();
      // Redirect to login page if authentication fails
      if (res.error == "Authentication Failed") {
        navigate("/");
      }
      setData(res); // Set fetched book data in state
    }

    fetchData(); // Call fetchData function
  }, [id, updateData]); // Dependencies include ID and updated data

  // Effect hook to fetch all students data when component mounts
  useEffect(() => {
    async function fetchStudents() {
      const token = localStorage.getItem("token");
      const result = await fetch(`${window.location.origin}/students`, {
        headers: { Authorization: `${token}` },
      });
      const res = await result.json();
      // Redirect to login page if authentication fails
      if (res.error == "Authentication Failed") {
        navigate("/");
      }
      setAllStudents(res.data); // Set fetched students data in state
    }
    fetchStudents(); // Call fetchStudents function
  }, []); // Empty array as dependency means effect runs only once on mount

  // Effect hook to update available book copies when book data or index changes
  useEffect(() => {
    let result = parseInt(data.numberCopies) - parseInt(index);
    setBookCopies(parseInt(result));
  });

  // Function to toggle edit form visibility and populate data
  const moduleChange = () => {
    // Set states to control form visibility and populate data
    setEditForm("block");
    setAddStudent("none");
    setDisplayDetail("none");
    setNewData({
      bookName: data.bookName,
      autherName: data.autherName,
      edition: data.edition,
      numberCopies: data.numberCopies,
      date: data.date,
    });
  };

  // Function to toggle add student form visibility and populate data
  const moduleAddStudent = () => {
    // Set states to control form visibility and populate data
    setAddStudent("block");
    setEditForm("none");
    setDisplayDetail("none");
    setNewData({
      bookName: data.bookName,
      autherName: data.autherName,
      edition: data.edition,
      numberCopies: data.numberCopies,
      date: data.date,
    });
  };

  // Function to revert to default module visibility
  const reverseModule = () => {
    // Set states to revert to default module visibility
    setEditForm("none");
    setAddStudent("none");
    setDisplayDetail("flex");
  };

  // Function to delete book from library
  async function DeleteBook() {
    // Confirmation before deleting book
    if (window.confirm("Are you want it to delete Permanently?")) {
      await fetch(`${window.location.origin}/books/${id}`, {
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
    navigate("/allbooks"); // Redirect to all books page after deletion
  }

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

  // Function to handle image upload and update state
  const handleImage = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setNewData({ ...data, file: reader.result });
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  };

  let name, value;
  // Function to handle input changes and update state
  const handleInputs = (e) => {
    name = e.target.name;
    if (name !== "file") {
      value = e.target.value;
    }
    setNewData({ ...newData, [name]: value });
  };

  // Function to handle student input changes and fetch student list
  const handleStudentInputs = async (e) => {
    value = e.target.value;
    setStudenName(value);
    const result = await fetch(`${window.location.origin}/students/studentList`, {
      method: "POST",
      headers: { authorization: `${token}` },
      body: JSON.stringify({
        value: studenName,
      }),
    });
    const listofstudent = await result.json();
    setstudentList(listofstudent);
  };

  // Function to handle book update
  const handleBookUpdate = (e) => {
    e.preventDefault();

    // Validate if all required fields are filled
    if (
      !newData.bookName ||
      !newData.autherName ||
      !newData.edition ||
      !newData.date ||
      !newData.numberCopies ||
      !newData.file
    ) {
      setNewData({ ...newData, file: logo }); // Set default book image
      return alert(
        "Send all required field : Book Name, Auther Name, Edition, Date, Number Of Copies, File"
      );
    }

    // Update book details via PATCH request
    fetch(`${window.location.origin}/books/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `${token}`,
      },
      body: JSON.stringify(newData),
    }).then((response) =>
      response.json().then(alert("Book Updated In Library Successfully!"))
    );

    setEditForm("none"); // Hide edit form
    setDisplayDetail("flex"); // Show book details
    setUpdateData(newData); // Update state with new data
  };

  
  // Function to handle click on a student in the list
  const handleClickOnStudent = (ele) => {
    setStudenName(ele.studentName + " " + ele.lastName); // Set student name
    setStudentId(ele._id); // Set student ID
    setStudentData({
      studentImg: ele.studentImg,
      studentForm: ele.studentForm,
      studentName: ele.studentName,
      lastName: ele.lastName,
      address: ele.address,
      cell: ele.cell,
      branch: ele.branch,
      email: ele.email,
      year: ele.year,
      motherName: ele.motherName,
      fatherName: ele.fatherName,
      parentCell: ele.parentCell,
      dateOfJoining: ele.dateOfJoining,
      books: ele.books
        ? [
            ...ele.books,
            {
              BookName: newData.bookName,
              AutherName: newData.autherName,
              edition: newData.edition,
            },
          ]
        : [
            {
              BookName: newData.bookName,
              AutherName: newData.autherName,
              edition: newData.edition,
            },
          ],
    });
  };

  // Function to handle student table update
  const handleStudentUpdate = (e) => {
    e.preventDefault();
    if(bookCopies <= 0){
      alert ("No Book Available. All Books Distributed Already!")
    } else{
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `${token}`,
        },
        body: JSON.stringify(studentData),
      };
  
      fetch(`${window.location.origin}/students/${studentId}`, requestOptions).then(
        (response) =>
          response
            .json()
            .then(alert("Student Table Updated In Library Successfully!"))
      );
    }
    reverseModule(); // Revert to default module visibility
  };

  // Return JSX for rendering UI components
  return (
    <div>
      <div style={{ display: editForm }} className="updateStudent">
        <div style={{ display: "flex", "margin-bottom": "3%" }}>
          <Button
            onClick={reverseModule}
            style={{
              backgroundColor: "red",
              color: "blue",
              fontWeight: "700",
              padding: "5px",
              "margin-left": "0px",
              "margin-right": "5%",
              border: "1px dotted yellow",
            }}
          >
            Cancel
          </Button>
          <h3>Update Book Details !</h3>
        </div>
        <div className="updateImgInfo">
          <form>
            <TextField
              name="bookName"
              value={newData.bookName}
              onChange={handleInputs}
              fullWidth
              label="Book Name"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              name="autherName"
              value={newData.autherName}
              onChange={handleInputs}
              fullWidth
              label="Auther Name"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="edition"
              value={newData.edition}
              onChange={handleInputs}
              label="Edition"
              id="fullWidth"
              margin="normal"
            />
            <TextField
              fullWidth
              name="numberCopies"
              value={newData.numberCopies}
              onChange={handleInputs}
              label="Total Copies"
              id="fullWidth"
              margin="normal"
            />
            <div className="studentImgBtnDiv">
              <Button
                onChange={handleImage}
                component="label"
                variant="contained"
                color="success"
                startIcon={<CloudUploadIcon />}
              >
                Replace Book Image
                <VisuallyHiddenInput type="file" />
              </Button>
            </div>
            <div className="addbookbtn">
              <Button
                onClick={handleBookUpdate}
                type="submit"
                fullWidth
                className="btn_In"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
              >
                Update Book Details
              </Button>
            </div>
          </form>
          <div className="updateStudentImg">
            <img
              src={newData.file ? newData.file : logo1}
              className="updateBookImage"
              alt="form"
            />
          </div>
        </div>
      </div>
      <div style={{ display: addStudent }} className="updateStudent">
        <div style={{ display: "flex", "margin-bottom": "3%" }}>
          <Button
            onClick={reverseModule}
            style={{
              backgroundColor: "red",
              color: "blue",
              fontWeight: "700",
              padding: "5px",
              "margin-left": "0px",
              "margin-right": "5%",
              border: "1px dotted yellow",
            }}
          >
            Cancel
          </Button>
          <h3>Add New Student who taking this Book !</h3>
        </div>
        <div className="updateImgInfo" style={{ display: "flex" }}>
          <form style={{ width: "50%" }}>
            <div style={{ display: "flex" }}>
              <p style={{ fontSize: "large", color: "white", width: "100%" }}>
                <span style={{ fontWeight: "bold" }}>Book:- </span>
                {newData.bookName}
              </p>
              <p style={{ fontSize: "large", color: "white", width: "100%" }}>
                <span style={{ fontWeight: "bold" }}>Auther:- </span>
                {newData.autherName}
              </p>
            </div>
            <TextField
              name="StudentName"
              value={studenName}
              onChange={handleStudentInputs}
              fullWidth
              label="Student Name"
              id="fullWidth"
              margin="normal"
              style={{ marginTop: "10%" }}
            />
            <div className="addbookbtn">
              <Button
                onClick={handleStudentUpdate}
                type="submit"
                fullWidth
                className="btn_In"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
              >
                Update Student Table
              </Button>
            </div>
          </form>
          <div style={{ width: "45%", margin: "2%" }}>
            {studentList.map((ele, ind) => {
              if (
                ele.lastName.includes(studenName) ||
                ele.studentName.includes(studenName) ||
                ele._id.includes(studenName)
              ) {
                return (
                  <div
                    key={ind}
                    onClick={(e) => handleClickOnStudent(ele)}
                    style={{ color: "black", display: "flex", marginTop: "5%" }}
                  >
                    <p
                      style={{
                        color: "blue",
                        fontWeight: "bolder",
                        marginLeft: "2%",
                        marginRight: "3%",
                      }}
                    >
                      {ind + 1})
                    </p>
                    <div>
                      <p>
                        Id:-
                        <span style={{ fontWeight: "bolder" }}>{ele._id}</span>
                      </p>
                      <p>
                        Name:-
                        <span style={{ fontWeight: "bolder" }}>
                          {ele.studentName + " " + ele.lastName}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
      <div style={{ display: displayDetails }} className="bookbyid">
        <img src={data.file ? data.file : logo} alt="book Imgage" />
        <div className="bookbyidFlex">
          <div>
            <h3>Book Name :</h3>
            <p>{data.bookName}</p>
          </div>
          <div>
            <h3>Auther Name :</h3>
            <p>{data.autherName}</p>
          </div>
          <div>
            <h3>Edition :</h3>
            <p>{data.edition}</p>
          </div>
          <div>
            <h3>Total Copies :</h3>
            <p>{data.numberCopies}</p>
          </div>
          <div>
            <h3>Available Copies :</h3>
            <p>{bookCopies}</p>
          </div>
          <div>
            <h3>Books Distribution :</h3>
            <p>Given In Below Table</p>
          </div>
        </div>
        <div className="btnBlock">
          <button className="btnYellow" onClick={moduleAddStudent}>
            Add Student
          </button>
          <button className="btngreen" onClick={moduleChange}>
            Edit
          </button>
          <button className="btnred" onClick={DeleteBook}>
            Delete
          </button>
        </div>
      </div>

      <div style={{ display: displayDetails, overflow: "auto" }}>
        <table className="table">
          <tr>
            <th>Sr. No.</th>
            <th>Student Name</th>
            <th>Year</th>
            <th>Branch</th>
            <th>Books Taken</th>
          </tr>
            {allStudents.map((ele, ind) => {
              if (ele.books) {
                return ele.books.map((singleBook, ind) => {
                  if (singleBook.BookName === data.bookName) {
                    index++;
                    return (
                      <tr key={ind}>
                        <td>{index}</td>
                        <td>
                          { ele.studentName +
                            " " +
                            ele.lastName}
                        </td>
                        <td>{ele.year}</td>
                        <td>{ele.branch}</td>
                        <td>01</td>
                      </tr>
                    );
                  }
                });
              }
            })}
        </table>
      </div>
    </div>
  );
};

export default BookById; // Export BookById component
