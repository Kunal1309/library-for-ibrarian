// Importing necessary dependencies from React
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Functional component for displaying all students
const AllStudents = () => {
  // State to manage fetched student data and count of students
  const [data, setData] = useState([]); // Array to store student data
  const [count, setCount] = useState([]); // Variable to store count of students
  const navigate = useNavigate(''); // Hook to navigate between routes

  // Effect hook to fetch data when component mounts
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token'); // Get token from local storage
      const result = await fetch(`${window.location.origin}/students`, { headers: {"Authorization" : `${token}`} });
      const res = await result.json();
      // Redirect to login page if authentication fails
      if(res.error == "Authentication Failed"){
        navigate('/');
      }
      setCount(res.count); // Set count of students in state
      setData(res.data); // Set fetched student data in state
    }

    fetchData(); // Call fetchData function
  },[]); // Empty array as dependency means effect runs only once on mount

  // Function to navigate to single student details page
  const SingleStudent = (id) => {
    navigate(`/student/${id}`); // Navigate to student details page with student id
  };

  // Rendering UI to display all students
  return (
    <div className="allstudents">
      <table className="table">
      <tr>
          <th className="totalBooks" colSpan={6}>Total Students In Library: <span>{count}</span></th>
        </tr>
        <tr>
          <th>Sr. No.</th>
          <th>Student Name</th>
          <th>Year</th>
          <th>Branch</th>
          <th>Books Taken</th>
          <th> More Info / Edit / Delete</th>
        </tr>
        {data.map((ele, ind) => {
          return (
            <tr key={ind}>
              <td>{ind + 1}</td>
              <td>{ele.studentName + " " + ele.lastName}</td>
              <td>{ele.year}</td>
              <td>{ele.branch}</td>
              <td>01</td>
              <td className="tdbtn">
                <button className="btnblue" onClick={(e) => SingleStudent(ele._id)}>More Info. / Edit / Delete</button>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default AllStudents; // Exporting the component
