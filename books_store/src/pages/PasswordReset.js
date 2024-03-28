import React from "react";
import "../App.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import logo from "../images/hand-book-logo-illustration-art-background-43965136.webp";
import { useFormik } from "formik";
import { logInValidate2 } from "../helper/validate2";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const PasswordReset = () => {
  // Get id and token from URL params
  const { id, token } = useParams();

  // Formik for password reset form
  const forgetPassformik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: logInValidate2, // Validation function from helper
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Send PUT request to reset password
      fetch(`${window.location.origin}/login/reset-password/${id}/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password }),
      });
      // Clear form values after submission
      forgetPassformik.setValues({
        password: "",
        confirmPassword: "",
      });
      // Show success toast message
      toast("Password Updated Successfully...You can LogIn now");
    },
  });

  return (
    <div style={{ display: "flex" }}>
      {/* Library logo */}
      <img
        className="homeLogo"
        style={{ margin: "5% 5% 0% 5%" }}
        src={logo}
        alt="library logo"
      />
      {/* Toast component for displaying messages */}
      <Toaster></Toaster>
      {/* Password reset form */}
      <div className="homeForgetPasswordDiv" style={{ margin: "15% 5% 0% 5%" }}>
        <p className="welcome">WELCOME - TO - LIBRARY</p>
        {/* Form submission */}
        <form onSubmit={forgetPassformik.handleSubmit}>
          {/* Input field for new password */}
          <div className="textfield">
            <TextField
              {...forgetPassformik.getFieldProps("password")}
              fullWidth
              label="Enter New Password"
              id="fullWidth"
            />
          </div>
          {/* Input field for confirming new password */}
          <div className="textfield">
            <TextField
              {...forgetPassformik.getFieldProps("confirmPassword")}
              fullWidth
              label="Confirm New Password"
              id="fullWidth"
            />
          </div>
          {/* Button to update password */}
          <Button
            type="submit"
            fullWidth
            className="btn_In"
            variant="contained"
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
