import express from "express"; // Importing express framework
import "dotenv/config"; // Importing dotenv for environment variables
import mongoose from "mongoose"; // Importing mongoose for MongoDB connection
import booksRoute from "./routes/booksRoute.js"; // Importing books route
import studentsRoute from "./routes/studentsRoute.js"; // Importing students route
import logInRoute from "./routes/logInRoute.js"; // Importing login route
import cors from "cors"; // Importing cors for handling Cross-Origin Resource Sharing
import Auth from "./middleware/Auth.js"; // Importing authentication middleware
import path from "path";

const __dirname = path.resolve();

const app = express(); // Creating an express application
const port = process.env.PORT || 5555; // Setting up the port for the server
const mongoDB_URL = process.env.MONGODB_URL; // MongoDB connection URL from environment variables


// Middleware for Parsing Request Body
app.use(express.json({ limit: "10mb" }));

// Middleware for Handling Cors Policy
app.use(cors());

// Route for login functionality
app.use("/login", logInRoute);

// Route for books management with authentication middleware
app.use("/books", Auth, booksRoute);

// Route for students management with authentication middleware
app.use("/students", Auth, studentsRoute);

//Route to run Frontend (named "books_store") in Backend
app.get('/', (req, res) => {
  app.use(express.static(path.resolve(__dirname, "books_store", "build")));
  res.sendFile(path.resolve(__dirname, "books_store", "build", "index.html"));
})

// Connecting to MongoDB and starting the server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("App is connected to Database Successfully");
    app.listen(port, () => {
      console.log(`App is listening to Port : ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });


//  This code sets up an Express server with routes for managing books, 
// students, and login functionality. It includes middleware for parsing 
// request bodies, handling CORS policies, and authentication. The server 
// connects to MongoDB using the provided URL and starts listening on the 
// specified port.

