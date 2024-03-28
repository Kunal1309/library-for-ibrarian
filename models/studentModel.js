import mongoose from 'mongoose'; // Importing mongoose for MongoDB schema creation

// Creating a mongoose schema for student details
const studentSchema = mongoose.Schema(
    {
      studentName:{
        type: String,
        required : true,
      },
      lastName:{
        type: String,
        required : true,
      },
      address:{
        type: String,
        required : true,
      },
      cell:{
        type: Number,
        required : true,
      },
      email:{
        type: String || Number,
        required : true,
      },
      dateOfJoining:{
        type: Date,
        required : true,
      },
      branch:{
        type: String,
        required : true,
      },
      fatherName:{
        type: String,
        required : true,
      },
      motherName:{
        type: String,
        required : true,
      },
      year:{
        type: Number,
        required : true,
      },
      parentCell:{
        type: Number,
        required : true,
      },
      studentImg:{
        type: String,
        required : true,
      },
      studentForm:{
        type: String,
        required : true,
      },
      books:{
        BookName: {
          type: String
        },
        AutherName:  {
          type: String
        },
        edition: {
          type: Number
        }
      }
    },
    {
      timestamps: true // Automatically add createdAt and updatedAt fields
    }
);

export const Student = mongoose.model('Student', studentSchema);  // Creating a model named 'Student' using the studentSchema





/** This code defines a mongoose schema for student details with the following fields:

1) studentName: String type, required field for the student's name.
2) lastName: String type, required field for the student's last name.
3) address: String type, required field for the student's address.
4) cell: Number type, required field for the student's cell number.
5) email: String or Number type, required field for the student's email address or number.
6) dateOfJoining: Date type, required field for the student's date of joining.
7) branch: String type, required field for the student's branch of study.
8) fatherName: String type, required field for the student's father's name.
9) motherName: String type, required field for the student's mother's name.
10)year: Number type, required field for the student's year of study.
11) parentCell: Number type, required field for the parent's cell number.
12) 1studentImg: String type, required field for the student's image path.
13) studentForm: String type, required field for the student's form path.
14) books: Sub-document containing details of books borrowed by the student, 
           including book name, author name, and edition.

The schema also includes timestamps: true option, which automatically adds 
createdAt and updatedAt fields to the documents in the collection. The schema
 is then exported as a model named 'Student' using mongoose.model.  */