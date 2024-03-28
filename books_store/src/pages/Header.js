import React from "react"; // Import React library
import { NavLink } from "react-router-dom"; // Import NavLink from react-router-dom library
import logo from "../images/hand-book-logo-illustration-art-background-43965136.webp"; // Import logo image


const Header = () => { // Define Header functional component
 
  return (
    <div className="header">
      <img src={logo} alt="logo" style={{border:"2px dotted yellow"}}/>
      <NavLink to="/allbooks" className="headerbtn">Books</NavLink>
      <NavLink to="/allstudents" className="headerbtn">Students</NavLink>
      <NavLink to="/addbook" className="headerbtn">New Book</NavLink>
      <NavLink to="/newstudent" className="headerbtn">New Student</NavLink>
      <NavLink to="/" className="headerbtn">Log-Out</NavLink>
    </div>
  );
};

export default Header; // Export Header component
