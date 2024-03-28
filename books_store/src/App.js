// Importing necessary dependencies and styles
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Layout from "./pages/Layout.js";
import AddBook from "./pages/AddBook.js";
import AllStudents from "./pages/AllStudents";
import NewStudent from "./pages/NewStudent.js";
import AllBooks from "./pages/AllBooks.js";
import BookById from "./pages/BookById.js";
import StudentById from "./pages/StudentById.js";
import PasswordReset from "./pages/PasswordReset";

function App() {
  return (
    <div className="App">
      {/* Setting up the BrowserRouter for routing */}
      <BrowserRouter>
        <Routes>
          {/* Route for the Home page */}
          <Route index element={<Home />} />

          {/* Route for other pages inside the Layout */}
          <Route path="/" element={<Layout />}>
            {/* Nested routes for different pages */}
            <Route path="allbooks" element={<AllBooks />} />
            <Route path="book/:id" element={<BookById />} />
            <Route path="student/:id" element={<StudentById />} />
            <Route path="addbook" element={<AddBook />} />
            <Route path="allstudents" element={<AllStudents />} />
            <Route path="newstudent" element={<NewStudent />} />
          </Route>
          <Route
            path="login/reset-password/:id/:token"
            element={<PasswordReset />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
