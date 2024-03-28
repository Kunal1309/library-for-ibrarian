import mongoose from "mongoose"; // Importing mongoose for MongoDB schema creation

// Creating a mongoose schema for user login details
const logInSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Custom validation for email format
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Using regex to validate email format
        },
        message: "Invalid email address format", // Error message for invalid email format
      },
    },
    password: {
      type: String,
      required: true, // Password is required
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export const LogIn = mongoose.model("LogIn", logInSchema); // Creating a model named 'LogIn' using the logInSchema




/** This code defines a mongoose schema for user login details with the following fields:

1) name: String type, required field for the user's name.
2) mobile: Number type, required field for the user's mobile number.
3) email: String type, required and unique field for the user's email address. 
It also includes custom validation using regex to ensure a valid email format.
password: String type, required field for the user's password.

The schema also includes timestamps: true option, which automatically adds
 createdAt and updatedAt fields to the documents in the collection. The schema 
 is then exported as a model named 'LogIn' using mongoose.model. */
