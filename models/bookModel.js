import mongoose from 'mongoose'; // Importing mongoose for MongoDB schema creation

// Creating a mongoose schema for books
const bookSchema = mongoose.Schema(
    {
      bookName:{
        type: String,
        required : true,
      },
      autherName:{
        type: String,
        required : true,
      },
      edition:{
        type: Number,
        required : true,
      },
      date:{
        type: Date,
        required : true,
      },
      numberCopies:{
        type: Number,
        required : true,
      },
      file:{
        type: String,
        required : true,
      },
      student:{
        type: String
      }
    },
    {
      timestamps: true // Automatically add createdAt and updatedAt fields
    }
);

export const Book = mongoose.model('Book', bookSchema); // Creating a model named 'Book' using the bookSchema




/** This code defines a mongoose schema for books with the following fields:

1) bookName: String type, required field for the name of the book.
2) autherName: String type, required field for the name of the author.
3) edition: Number type, required field for the edition number of the book.
4) date: Date type, required field for the publication date of the book.
5) numberCopies: Number type, required field for the number of copies available.
6) file: String type, required field for the file path (assuming it's related to the book).
7) student: String type, optional field for referencing the student who borrowed the book.

The schema also includes timestamps: true option, which automatically adds createdAt 
and updatedAt fields to the documents in the collection. The schema is then exported 
as a model named 'Book' using mongoose.model. */


