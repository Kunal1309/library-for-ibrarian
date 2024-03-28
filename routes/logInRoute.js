// Importing necessary modules and libraries
import express from "express"; // Express framework for Node.js
import "dotenv/config"; // dotenv for environment variables
import { LogIn } from "../models/loginModel.js"; // Importing loginModel for user authentication
import multer from "multer"; // Multer for file uploads
import path from "path"; // Path module for file paths
import bcrypt from "bcrypt"; // Bcrypt for password hashing
import jwt from "jsonwebtoken"; // JSON Web Tokens for user authentication
import Auth, { localVariables } from "../middleware/Auth.js"; // Custom middleware for authentication
import otpGenerator from "otp-generator"; // OTP Generator for generating OTPs
import getMail from "./mailer.js"; // Function to send emails
import linkMail from "./linkMailer.js"; // Function to send emails with links

// Initializing Express Router and variables
const router = express.Router();
const emailArray = [];
let otp;

// File Storage configuration using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images"); // Destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    ); // File naming logic
  },
});

const upload = multer({
  storage: storage,
});

// Helping Function to create array of Emails of Registered Members
function emailList(rest) {
  rest.map((ele) => {
    emailArray.push(ele.email);
  });
  return emailArray;
}

// Middleware function to verify user existence
async function verifyUser(req, res, next) {
  try {
    const { email } = req.method == "GET" ? req.params : req.body;

    // Check if the user exists
    let exist = await LogIn.findOne({ email: email });
    if (!exist) {
      return res.status(404).send({ error: "Can't find User!" });
    } else {
      next(); // Proceed to the next middleware or route handler
    }
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}


// Route for user registration
router.post("/register", async (req, res) => {
  try {
    // Check for required fields in the request body
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.mobile ||
      !req.body.password
    ) {
      return res.status(400).send({
        message: "Send all required field : Name, Email, mobile No., Password",
      });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user object
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: secPass,
    };

    // Save the new user to the database
    const user = await LogIn.create(newUser);

    return res.status(400).send(user); // Send response
  } catch (error) {
    res.status(500).send(error.message);// Send error response
  }
});

// Route to send registration mail for approval
router.post("/registerMail", getMail);

// Route to authenticate user
router.post("/authenticate", verifyUser, (req, res) => res.end());

// Route to generate JWT after login by email id & password
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await LogIn.findOne({ email });
    const verifyPass = await bcrypt.compare(password, user.password);
    if (verifyPass) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          name: user.name,
          password: user.password,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      return res.json(token); // Send token response
    } else {
      res.status(400).json({ error: "Password is wrong" }); // Send error response
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send error response
  }
});

// Route to get list of emails of all users
router.get("/listofemail", async (req, res) => {
  try {
    const result = await LogIn.find(); 
    const list = emailList(result); // Get list of emails
    return res.status(201).json(list);  // Send response
  } catch (error) {
    return res.status(404).send({ error: "Problem with Email List" }); // Send error response
  }
});

// Route to get user data by email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    if (!email) return res.status(501).send({ error: "Invalid Username" });

    const result = await LogIn.findOne({ email: email });

    const { password, ...rest } = result.toJSON();

    return res.status(201).send(rest); // Send response
  } catch (error) {
    return res.status(404).send({ error: "Cannot Find User Data" }); // Send error response
  }
});

// Route to generate OTP for user
router.get(
  "/generateOTP/:email",
  verifyUser,
  localVariables,
  async (req, res) => {
    otp = await otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    req.app.locals.OTP = otp;
    return res.status(201).send({ otp }); // Send OTP response
  }
);

// Route to verify OTP
router.get("/verifyOTP/:code", (req, res) => {
  const code = req.params;
  if (otp == code.code) {
    req.app.locals.OTP = null; // Reset the OTP value
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "Verify Successfully!" }); // Send success message
  }

  return res.status(401).send({ error: "Invalid OTP" }); // Send error response
});

// Route to update user details
router.put("/updateuser", Auth, (req, res) => {
  try {
    const { userId } = req.user;
    if (userId) {
      const body = req.body;
      LogIn.updateOne({ _id: userId }, body);
      return res.status(201).send({ msg: "User upadted ....!" }); // Send success message
    }
  } catch (error) {
    return res.status(500).send(error.message); // Send error response
  }
});

// Route to handle forgot password functionality
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body; // Extract email from request body
  try {
    const oldUser = await LogIn.findOne({ email }); // Find user by email in the database
    if (!oldUser) {
      return res.json({ status: "User not exist" }); // Send response if user doesn't exist
    }
    const secrete = process.env.JWT_SECRET + oldUser.password; // Create a secret string for JWT
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secrete, {
      expiresIn: "5m", // Set expiration time for the token
    });
    const link = `http://localhost:3000/login/reset-password/${oldUser._id}/${token}`; // Generate reset password link
    linkMail(link, email, req, res); // Send the link via email
  } catch (error) {
    res.send(error); // Send error response if an error occurs
  }
});

// Route to reset password
router.put("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params; // Extract id and token from request parameters
  const oldUser = await LogIn.findOne({ _id: id }); // Find user by id in the database
  if (!oldUser) {
    return res.json({ status: "User not exist" }); // Send response if user doesn't exist
  }
  const secrete = process.env.JWT_SECRET + oldUser.password; // Create a secret string for JWT
  try {
    const verify = jwt.verify(token, secrete);// Verify the token
    if (verify) {
      const salt = await bcrypt.genSalt(10); // Generate salt for password hashing
      const secPass = await bcrypt.hash(req.body.password, salt); // Hash the new password
      const user = await LogIn.updateOne({ _id: id }, { password: secPass }); // Update user password
    }
    res.json({ message: "Verified" }); // Send success message
  } catch (error) {
    res.json({ error }); // Send error response if an error occurs during verification
  }
});

export default router;
