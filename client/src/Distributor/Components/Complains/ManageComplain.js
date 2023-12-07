import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../Sidebar/DisSidebar";

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/distributor/complaints');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        console.error('Failed to fetch complaints.');
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleAction = async (complainId, action) => {
    try {
      const res = await fetch(`/distributor/complaints/${complainId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ action }),
      });

      if (res.status === 200) {
        // Update the status in the component's state
        const updatedComplaints = [...complaints];
        const complainIndex = updatedComplaints.findIndex((complaint) => complaint._id === complainId);

        if (complainIndex !== -1) {
          updatedComplaints[complainIndex].status = action === "resolve" ? "resolved" : "rejected";
          setComplaints(updatedComplaints);
        }
      } else {
        console.error('Error handling action:', res.statusText);
      }
    } catch (error) {
      console.error('Error handling action:', error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />

          <table className="table">
            <thead>
              <tr>
                <th className="tableCell">Complain ID</th>
                <th className="tableCell">Complain Title</th>
                <th className="tableCell">Product</th>
                <th className="tableCell">Status</th>
                <th className="tableCell">Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td className="tableCell">{complaint._id}</td>
                  <td className="tableCell">{complaint.title}</td>
                  <td className="tableCell">{complaint.productId.title}</td>
                  <td className="tableCell">
                    <span className={`status ${complaint.status}`}>{complaint.status}</span>
                  </td>
                  <td className="tableCell">
                    <button className="buttonLink" onClick={() => handleAction(complaint._id, "resolve")}>Resolve</button>
                    <button className="buttonLink" onClick={() => handleAction(complaint._id, "reject")}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
