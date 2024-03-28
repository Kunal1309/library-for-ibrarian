// Importing necessary dependencies from React
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Functional component for displaying all books
const AllBooks = () => {
  // State to manage fetched data and count of books
  const [data, setData] = useState([]); // Array to store book data
  const [count, setCount] = useState([]); // Variable to store count of books
  const navigate = useNavigate(); // Hook to navigate between routes
  const token = localStorage.getItem('token'); // Get token from local storage

  // Effect hook to fetch data when component mounts
  useEffect(() => {
    async function fetchData() {
      const result = await fetch(`${window.location.origin}/books`, { headers: {"Authorization" : `${token}`} });
      const res = await result.json();

      // Redirect to login page if authentication fails
      if(res.error == "Authentication Failed"){
        navigate('/');
      }
      setData(res.data); // Set fetched data in state
      setCount(res.count); // Set count of books in state
    }

    fetchData(); // Call fetchData function
  },[]); // Empty array as dependency means effect runs only once on mount

  // Function to navigate to single book details page
  const SingleBook = (id) => {
    navigate(`/book/${id}`); // Navigate to book details page with book id
  }
  
  // Rendering UI to display all books
  return (
    <div className="allbooks">
      <table className="table">
        <tr>
          <th className="totalBooks" colSpan={6}>Total Books In Library: <span>{count}</span></th>
        </tr>
        <tr>
          <th>Sr. No.</th>
          <th>Book Name</th>
          <th>Auther Name</th>
          <th>Total Copies</th>
          <th>Available Copies</th>
          <th> More Info / Edit / Delete</th>
        </tr>
        {data.map((ele, ind) => {
          return (
            <tr key={ind}>
              <td>{ind+1}</td>
              <td>{ele.bookName}</td>
              <td>{ele.autherName}</td>
              <td>{ele.numberCopies}</td>
              <td>{ele.numberCopies}</td>
              <td className="tdbtn">
                <button className="btnblue" onClick={(e) => SingleBook(ele._id)}>More Info. / Edit / Delete</button>
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default AllBooks; // Exporting the component
