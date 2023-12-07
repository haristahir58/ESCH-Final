import React, { useEffect, useState } from 'react';
import Sidebar from "../Components/Sidebar/SoleSidebar";
import Navbar from "../Components/navbar/Navbar";

const RequestsManage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/soleDistributor/view-requests", {
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
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const res = await fetch(`/soleDistributor/view-requests/${requestId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ action }),
      });

      if (res.status === 200) {
        const updatedRequests = [...requests];
        const updatedRequestIndex = updatedRequests.findIndex(request => request._id === requestId);

        if (updatedRequestIndex !== -1) {
          updatedRequests[updatedRequestIndex].status = action === "accept" ? "accepted" : "rejected";
          setRequests(updatedRequests);
        }

        // Handle success, e.g., show a success message
      } else {
        console.error("Failed to perform action");
        // Handle errors here
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />

          <table className="table">
            <thead>
              <tr>
                <th className="tableCell">Name</th>
                <th className="tableCell">Email</th>
                <th className="tableCell">City</th>
                <th className="tableCell">Address</th>
                <th className="tableCell">Date</th>
                <th className="tableCell">Experience</th>
                <th className="tableCell">Status</th>
                <th className="tableCell">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((row) => (
                <tr key={row._id}>
                  <td className="tableCell">{row.userId.name}</td>
                  <td className="tableCell">{row.userId.email}</td>
                  <td className="tableCell">{row.userId.city}</td>
                  <td className="tableCell">{row.userId.address}</td>
                  <td className="tableCell">{row.requestDate}</td>
                  <td className="tableCell">{row.experience}</td>
                  <td className="tableCell">
                    <span className={`status ${row.status}`}>{row.status}</span>
                  </td>
                  <td className="tableCell">
                    <button className="buttonLink" onClick={() => handleAction(row._id, "accept")}>Accept</button>
                    <button className="buttonLink" onClick={() => handleAction(row._id, "reject")}>Reject</button>
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

export default RequestsManage;
