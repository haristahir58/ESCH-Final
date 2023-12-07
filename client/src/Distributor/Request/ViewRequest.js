import React, { useEffect, useState } from 'react';
import Sidebar from "../Components/Sidebar/DisSidebar";
import Navbar from "../Components/navbar/Navbar";

const ViewRequest = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch data from the server when the component mounts
    const fetchData = async () => {
      try {
        const res = await fetch("/distributor/request", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 200) {
          const data = await res.json();
          setRequests(data);
        } else {
          // Handle errors here
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
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
                <th className="tableCell">Request ID</th>
                <th className="tableCell">Name</th>
                <th className="tableCell">Email</th>
                <th className="tableCell">City</th>
                <th className="tableCell">Address</th>
                <th className="tableCell">Date</th>
                <th className="tableCell">Experience</th>
                <th className="tableCell">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((row) => (
                <tr key={row.id}>
                  <td className="tableCell">{row._id}</td>
                  <td className="tableCell">{row.userId.name}</td>
                  <td className="tableCell">{row.userId.email}</td>
                  <td className="tableCell">{row.userId.city}</td>
                  <td className="tableCell">{row.userId.address}</td>
                  <td className="tableCell">{row.requestDate}</td>
                  <td className="tableCell">{row.experience}</td>
                  <td className="tableCell">
                    <span className={`status ${row.status}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewRequest;
