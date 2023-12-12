import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import Sidebar from '../Sidebar/DisSidebar';
import { app } from '../../../firebaseconfig';
import { getFirestore, collection, addDoc, serverTimestamp, query, getDocs, where, Timestamp } from 'firebase/firestore';

const Sales = () => {
  const [users, setUsers] = useState([]);
  const [newTasks, setNewTasks] = useState({}); // Use an object to store tasks for each user
  const db = getFirestore(app);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const usersCollection = await getDocs(query(collection(db, 'users')));
          const usersData = usersCollection.docs.map((doc) => ({ ...doc.data(), UID: doc.data().UID }));
          setUsers(usersData);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      

    fetchUsers();
  }, [db]);

  const handleAddTask = async (userId) => {
    try {
      const taskForUser = newTasks[userId] || '';
  
      if (taskForUser.trim() !== '') {
        const taskData = {
          Task: taskForUser,
          user: userId,
          TimeStamp: serverTimestamp(),
          status: 'ongoing'
        };
  
        await addDoc(collection(db, 'Tasks'), taskData);
        console.log('Task added successfully!');
        setNewTasks({ ...newTasks, [userId]: '' }); // Clear the text box after adding the task
        alert('Task submitted successfully!');
      } else {
        alert('Task cannot be empty.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  
  const listItemStyle = {
    marginBottom: '20px',
    padding: '20px',
    border: '2px solid #3498db',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    width: '300px', 
    marginRight: '20px',
    backgroundColor: '#f4f4f4', // Background color
  };
  
  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };
  
  const buttonStyle = {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    marginTop: '10px',
  };
  return (
    <>
      <div className="list">
        <Sidebar />
        <div className="listContainer">
          <Navbar />

          <h2 style={{ textAlign: 'center' }}>Sales Team</h2>


          <ul>
            {users.map((user, index) => (
              <li key={index} style={listItemStyle}>
                <strong>Name:</strong> {user.name}, <strong>Email:</strong> {user.email}
                <input
                  type="text"
                  value={newTasks[user.UID] || ''}
                  onChange={(e) => setNewTasks({ ...newTasks, [user.UID]: e.target.value })}
                  placeholder="Enter Task"
                  style={inputStyle}
                />
                <button onClick={() => handleAddTask(user.UID)} style={buttonStyle}>
                  Add Task
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sales;
