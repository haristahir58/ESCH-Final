import React, { useState, useEffect } from "react";
import Navbar from "./Components/ShopNavbar";
import Footer from "./Components/ShopFooter";
import './Components/Style/ComplainView.css'

export default function ViewComplains() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetch('/shopkeeper/complaints')
      .then((response) => response.json())
      .then((data) => {
        setComplaints(data);
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="complaints-container">
        <h2 style={{textAlign:'center', margin: '36px',color: '#8a8383'}}>View Complaints</h2>
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Product Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint._id}>
                <td>{complaint.title}</td>
                <td>{complaint.productId.title}</td>
                <td>{complaint.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
