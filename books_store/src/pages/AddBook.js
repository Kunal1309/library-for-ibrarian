// Importing necessary dependencies from Material-UI and React Router
import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import logo from "../images/Book_Image.jpeg";
import { useNavigate } from "react-router-dom";

// Functional component for adding a new book
const AddBook = () => {
  // State to manage form data
  const [data, setData] = useState({
    file: logo,
    bookName: " ",
    autherName: " ",
    edition: " ",
    date: " ",
    numberCopies: " ",
  });

  let name, value;

  // Function to handle file input change
  function handleChange(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setData({ ...data, file: reader.result });
    };
    reader.onerror = (error) => {
      console.log(error);
    };
  }

  // Function to handle form input changes
  const handleInputs = (e) => {
    e.preventDefault();
    name = e.target.name;
    if (name !== "file") {
      value = e.target.value;
    }
    setData({ ...data, [name]: value });
  };

  // Function to navigate to the main page after adding a book
  const navigate = useNavigate();
  const NavigateToMainPage = async (e) => {
    e.preventDefault();

    // Validating form data
    if (
      !data.bookName ||
      !data.autherName ||
      !data.edition ||
      !data.date ||
      !data.numberCopies ||
      data.file === logo
    ) {
      setData({ ...data, file: logo });
      return alert(
        "Send all required field : Book Name, Auther Name, Edition, Date, Number Of Copies, File"
      );
    }
    const token = localStorage.getItem("token");

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(data),
    };

    // Sending a POST request to add a new book
    fetch(`${window.location.origin}/books/`, requestOptions)
      .then((response) => {
        response.json();
        if (response.error == "Authentication Failed") {
          navigate("/");
        }
      })
      .then(alert("Book Added In Library Successfully!"));

    // Resetting form data and navigating to all books page
    setData({
      file: logo,
      bookName: " ",
      autherName: " ",
      edition: " ",
      date: " ",
      numberCopies: " ",
    });
    navigate("/allbooks");
  };

  // Styling for hidden input
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
    <form className="addbook" encType="multipart/form-data">
      <Box
        sx={{
          width: 500,
          maxWidth: "100%",
          margin: 10,
        }}
      >
        <h3>Fill New Books Details Here!</h3>
        {/* Form fields for book details */}
        <TextField
          name="bookName"
          value={data.bookName}
          onChange={handleInputs}
          fullWidth
          label="Book Name"
          id="fullWidth"
          margin="normal"
        />
        <TextField
          name="autherName"
          value={data.autherName}
          onChange={handleInputs}
          fullWidth
          label="Auther Name"
          id="fullWidth"
          margin="normal"
        />
        <TextField
          name="edition"
          value={data.edition}
          onChange={handleInputs}
          fullWidth
          type="number"
          label="Edition"
          id="fullWidth"
          margin="normal"
        />
        <TextField
          name="numberCopies"
          value={data.numberCopies}
          onChange={handleInputs}
          fullWidth
          type="number"
          label="Number of Copies"
          id="fullWidth"
          margin="normal"
        />
        <TextField
          name="date"
          value={data.date}
          onChange={handleInputs}
          fullWidth
          type="date"
          label="Available In Library Date"
          id="fullWidth"
          margin="normal"
        />
        {/* Upload button for book image */}
        <Button
          name="file"
          value={data.file}
          type="file"
          onChange={handleChange}
          component="label"
          variant="contained"
          color="success"
          startIcon={<CloudUploadIcon />}
        >
          Upload Image
          <VisuallyHiddenInput type="file" />
        </Button>
        <p style={{ color: "red" }}>{`Keep File Size < 201KB`}</p>
        <div className="addbookbtn">
          <Button
            onClick={NavigateToMainPage}
            type="submit"
            fullWidth
            className="btn_In"
            variant="contained"
            size="large"
            endIcon={<SendIcon />}
          >
            Add Book
          </Button>
        </div>
      </Box>
      <img src={data.file} className="bookImage" alt="book" />
    </form>
  );
};

export default AddBook;
