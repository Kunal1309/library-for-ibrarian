import express from "express"; // Import express for creating router
import { Book } from "../models/bookModel.js"; // Import Book model for database operations
import multer from "multer"; // Import multer for file uploads
import path from "path"; // Import path for file path operations

const router = express.Router(); // Create router instance

// File Storage configuration using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images"); // Set destination directory for file uploads
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    ); // Set filename for uploaded files
  },
});

const upload = multer({
  storage: storage,
});

// Route for adding a new book into the database
router.post("/", upload.single("file"), async (req, res) => {
  try {
    // Check if all required fields are provided in the request body
    if (
      !req.body.bookName ||
      !req.body.autherName ||
      !req.body.edition ||
      !req.body.date ||
      !req.body.numberCopies
    ) {
      return res.status(400).send({
        message:
          "Send all required field : Book Name, Auther Name, Edition, Date, Number Of Copies, File",
      });
    }

    // Create a new book object
    const newBook = {
      bookName: req.body.bookName,
      autherName: req.body.autherName,
      edition: req.body.edition,
      date: req.body.date,
      numberCopies: req.body.numberCopies,
      file: req.body.file,
    };

    // Save the new book to the database
    const book = await Book.create(newBook);

    return res.status(400).send(book); // Send response with the newly created book
  } catch (error) {
    res.status(500).send(error.message); // Send error response if there's an error
  }
});

// Route for getting all books from the database
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({}); // Fetch all books from the database
    return res.status(200).json({
      count: books.length,
      data: books,
    }); // Send response with the list of books
  } catch (error) {
    res.status(500).send(error.message); // Send error response if there's an error
  }
});

// Route for getting a book with a matching ID from the database
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract book ID from request params
    const book = await Book.findById(id); // Find the book by ID in the database
    return res.status(200).json(book); // Send response with the book data
  } catch (error) {
    res.status(500).send(error.message); // Send error response if there's an error
  }
});

// Route for updating a book with the help of ID in the database
router.patch("/:id", async (req, res) => {
  try {
    // Check if all required fields are provided in the request body
    if (
      !req.body.bookName ||
      !req.body.autherName ||
      !req.body.edition ||
      !req.body.date ||
      !req.body.numberCopies ||
      !req.body.file
    ) {
      return res.status(400).send({
        message: `${req.body} Send all required field : Book Name, Auther Name, Edition, Date, Number Of Copies, File `,
      });
    }

    const { id } = req.params; // Extract book ID from request params

    // Update the book with the provided ID in the database
    const book = await Book.findByIdAndUpdate(id, {
      bookName: req.body.bookName,
      autherName: req.body.autherName,
      edition: req.body.edition,
      date: req.body.date,
      numberCopies: req.body.numberCopies,
      file: req.body.file,
      bookOrStudent: req.body.bookOrStudent,
    });

    book.save(); // Save the updated book

    return res.status(200).json(book); // Send response with the updated book data
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message); // Send error response if there's an error
  }
});

// Route for deleting a book with the help of ID in the database
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract book ID from request params
    const result = await Book.findByIdAndDelete(id); // Find and delete the book by ID in the database
    if (!result) {
      return res.status(404).json({ message: "Book Not Found" });
    }
    return res.status(200).json({ message: "Book Deleted Successfully" }); // Send success message if book is deleted
  } catch (error) {
    return res.status(500).send({ message: error.message }); // Send error response if there's an error
  }
});

export default router; // Export the router
