import React, { useState } from "react"; // Import React and useState hook
import "../App.css"; // Import CSS styles
import TextField from "@mui/material/TextField"; // Import TextField component from MUI library
import Button from "@mui/material/Button"; // Import Button component from MUI library
import logo from "../images/hand-book-logo-illustration-art-background-43965136.webp"; // Import logo image
import { useNavigate } from "react-router-dom"; // Import useNavigate hook from react-router-dom library
import { Toaster } from "react-hot-toast"; // Import Toaster component from react-hot-toast library
import { useFormik } from "formik"; // Import useFormik hook from formik library
import { logInValidate } from "../helper/validate"; // Import validation function from helper file
import { logInValidate1 } from "../helper/validate1"; // Import validation function from helper file
import { logInValidate3 } from "../helper/validate3"; // Import validation function from helper file
import { logInValidate4 } from "../helper/validate4"; // Import validation function from helper file
import toast from "react-hot-toast"; // Import toast function from react-hot-toast library

const Home = () => { // Define Home functional component
  // Define state variables using useState hook
  const [logInBlock, setLoginBlock] = useState("block");
  const [getOtpBlock, setGetOtpBlock] = useState("none");
  const [registerBlock, setRegisterBlock] = useState("none");
  const [forgetPassBlock, setForgetPassBlock] = useState("none");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate(); // Initialize navigate function from react-router-dom

  // Functions to toggle display blocks
  const GetOTPModule = () => {
    setLoginBlock("none");
    setGetOtpBlock("block");
    setForgetPassBlock("none");
  };

  const RegisterModule = () => {
    setLoginBlock("none");
    setGetOtpBlock("none");
    setRegisterBlock("block");
    setForgetPassBlock("none");
  };

  const LogInModule = () => {
    setLoginBlock("block");
    setGetOtpBlock("none");
    setRegisterBlock("none");
    setForgetPassBlock("none");
  };

  const handleForgetPassword = () => {
    setForgetPassBlock("block");
    setLoginBlock("none");
    setGetOtpBlock("none");
    setRegisterBlock("none");
  };

  // Function to handle guest login
  async function GuestHandling() {
    // Fetch access token from server
    const accesstoken = await fetch(`${window.location.origin}/login/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "titarekunal@gmail.com",
        password: "Kunal@1309",
      }),
    });

    const token = await accesstoken.json(); // Parse response to JSON
    localStorage.setItem("token", `${"bearer" + " " + token}`); // Store token in local storage
    navigate("/allbooks"); // Navigate to "/allbooks" route
  }

  // Function to resend OTP
  async function OtpResend() {
    // Fetch OTP from server
    const mailOtp = await fetch(
      `${window.location.origin}/login/generateOTP/titarekunal@gmail.com`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    const otp = await mailOtp.json(); // Parse response to JSON
    let realOtp = otp.otp; // Get OTP value
    // Send OTP to registered email
    fetch(`${window.location.origin}/login/registerMail`, {
      method: "POST",
      // mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: realOtp }),
    });
    toast("Otp Sent to Owner mail"); // Display toast notification
  }

  // Formik hook for login form
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: logInValidate, // Validation function
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Submit login form data to server
      const accesstoken = await fetch(`${window.location.origin}/login/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const token = await accesstoken.json(); // Parse response to JSON

      // Handle error if password is wrong
      if (token.error == "Password is wrong") {
        formik.setValues({
          email: "",
          password: "",
        });
        return alert("Password is wrong");
      }

      // Clear form values
      formik.setValues({
        email: "",
        password: "",
      });
      localStorage.setItem("token", `${"bearer" + " " + token}`);  // Store token in local storage
      navigate("/allbooks"); // Navigate to "/allbooks" route
    },
  });

  // Formik hook for OTP form
  const otpformik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      conpassword: "",
    },
    validate: logInValidate1, // Validation function
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Submit OTP form data to server
      const mailOtp = await fetch(
        `${window.location.origin}/login/generateOTP/titarekunal@gmail.com`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );
      const otp = await mailOtp.json(); // Parse response to JSON
      let realOtp = otp.otp; // Get OTP value
      // Send OTP and registration data to server
      fetch(`${window.location.origin}/login/registerMail`, {
        method: "POST",
        // mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: realOtp,
          name: values.name,
          email: values.email,
          mobile: values.mobile,
        }),
      });
      // Set state with registration data
      setNewName(values.name);
      setNewEmail(values.email);
      setNewMobile(values.mobile);
      setNewPassword(values.password);
      otpformik.setValues({
        name: "",
        email: "",
        mobile: "",
        password: "",
        conpassword: "",
      });
      RegisterModule(); // Toggle display to registration module
    },
  });

  // Formik hook for registration OTP form
  const registerformik = useFormik({
    initialValues: {
      otp: "",
    },
    validate: logInValidate4, // Validation function
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Verify OTP with server
      fetch(`${window.location.origin}/login/verifyOTP/${values.otp}`)
        .then((response) => {
          response.json();
          // Handle error for invalid OTP
          if (response.error == "Invalid OTP") {
            return alert("Invalid OTP!");
          }
          // Register user with server
          fetch(`${window.location.origin}/login/register`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newName,
              email: newEmail,
              mobile: newMobile,
              password: newPassword,
            }),
          });
        })
        .then(
          alert("Registration completed Successfully. Now you can LogIn !")
        );
      registerformik.setValues({ otp: "" }); // Clear form values
      setNewName(""); // Clear registration data
      setNewEmail("");
      setNewMobile("");
      setNewPassword("");
      LogInModule(); // Toggle display to login module
    },
  });

  // Formik hook for forget password form
  const forgetPassformik = useFormik({
    initialValues: {
      email: "",
    },
    validate: logInValidate3,  // Validation function
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Send password reset link to email
      fetch(`${window.location.origin}/login/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      forgetPassformik.setValues({email: ""}); // Clear form values
      toast("Password Reset Link sent to your Registered Email"); // Display toast notification
      LogInModule(); // Toggle display to login module
    },
  });

  return (
    <div className="home">
      {/* Logo and Toaster components */}
      <img className="homeLogo" src={logo} alt="library logo" />

      <Toaster></Toaster>

    {/* Login, OTP, Registration, and Forget Password modules */}
      {/* Login Module */}
      <div className="homeFirstDiv" style={{ display: logInBlock }}>
        {/* Welcome message and slogan */}
        <p className="welcome">WELCOME - TO - LIBRARY</p>
        <p className="slok">
          I measure the progress of a community by the degree of progress which
          women have achieved... Dr. B. R. Ambedkar
        </p>
        {/* Login form */}
        <form onSubmit={formik.handleSubmit}>
          {/* Email and password fields */}
          <div className="homeFirstDiv_childFirstDiv">
            <div className="textfield">
              <TextField
                {...formik.getFieldProps("email")}
                fullWidth
                label="Email"
                id="fullWidth"
              />
            </div>
            <div className="textfield">
              <TextField
                {...formik.getFieldProps("password")}
                fullWidth
                label="Password"
                type="password"
                id="fullWidth"
              />
            </div>
          </div>
          {/* Sign-In button */}
          <Button
            type="submit"
            fullWidth
            className="btn_In"
            variant="contained"
          >
            Sign-In
          </Button>
        </form>
        {/* Links for forgot password, new user, and guest login */}
        <p className="or" onClick={handleForgetPassword}>
          Forgate Password ?
        </p>
        <p className="or" onClick={GetOTPModule}>
          New Here ?
        </p>
        <p className="or" onClick={GuestHandling}>
          Guest Log-In ?
        </p>
      </div>

     {/* OTP Module */}
      <div className="homeSecondDiv" style={{ display: getOtpBlock }}>
        {/* Welcome message */}
        <p className="welcome">WELCOME - TO - LIBRARY</p>
         {/* OTP form */}
        <form onSubmit={otpformik.handleSubmit}>
          {/* Registration fields */}
          <div className="homeFirstDiv_childFirstDiv">
            <div className="textfield">
              <TextField
                {...otpformik.getFieldProps("name")}
                fullWidth
                label="Name"
                id="fullWidth"
              />
            </div>
            <div className="textfield">
              <TextField
                {...otpformik.getFieldProps("email")}
                fullWidth
                label="Email"
                id="fullWidth"
              />
            </div>
            <div className="textfield">
              <TextField
                {...otpformik.getFieldProps("mobile")}
                fullWidth
                label="Mobile No."
                id="fullWidth"
              />
            </div>
            <div className="textfield">
              <TextField
                {...otpformik.getFieldProps("password")}
                fullWidth
                label="Password"
                type="password"
                id="fullWidth"
              />
            </div>
            <div className="textfield">
              <TextField
                {...otpformik.getFieldProps("conpassword")}
                fullWidth
                label="Confirm Password"
                type="password"
                id="fullWidth"
              />
            </div>
          </div>
          {/* Get OTP button */}
          <Button
            type="submit"
            fullWidth
            className="btn_In"
            variant="contained"
          >
            Get OTP
          </Button>
        </form>
        {/* Link to back to Login module */}
        <p className="or" onClick={LogInModule}>
          ---Back to Log In
        </p>
      </div>

      {/* Registration Module */}
      <div className="homeThirdDiv" style={{ display: registerBlock }}>
        {/* Welcome message */}
        <p className="welcome">WELCOME - TO - LIBRARY</p>
        {/* Registration OTP form */}
        <form onSubmit={registerformik.handleSubmit}>
          <div className="homeFirstDiv_childFirstDiv">
            <div className="textfield">
              <p className="OtpNotice">
                OTP sent to Owner, for Registration you need that OTP as a permission from Owner !
              </p>
              <TextField
                {...registerformik.getFieldProps("otp")}
                fullWidth
                label="Verify OTP"
                id="fullWidth"
              />
            </div>
            <p className="or" onClick={OtpResend}>
              Resend OTP ?
            </p>
          </div>
          {/* Register button */}
          <Button
            type="submit"
            fullWidth
            className="btn_In"
            variant="contained"
            style={{ marginTop: "2%" }}
          >
            Register
          </Button>
        </form>
        {/* Link to back to Login module */}
        <p className="or" onClick={LogInModule}>
          ---Back to Log In
        </p>
      </div>

      {/* Forget Password Module */}
      <div
        className="homeForgetPasswordDiv"
        style={{ display: forgetPassBlock }}
      >
        {/* Welcome message */}
        <p className="welcome">WELCOME - TO - LIBRARY</p>
        <form onSubmit={forgetPassformik.handleSubmit}>
          <div className="homeFirstDiv_childFirstDiv">
            <div className="textfield">
              <TextField
                {...forgetPassformik.getFieldProps("email")}
                fullWidth
                label="Enter Email"
                id="fullWidth"
              />
            </div>
          </div>
          {/* Send Link Button */}
          <Button
            type="submit"
            fullWidth
            className="btn_In"
            variant="contained"
          >
            Send Link
          </Button>
        </form>
        {/* Link to back to Login module */}
        <p className="or" onClick={LogInModule}>
          ---Back to Log In
        </p>
      </div>
    </div>
  );
};

export default Home; // Export Home component

