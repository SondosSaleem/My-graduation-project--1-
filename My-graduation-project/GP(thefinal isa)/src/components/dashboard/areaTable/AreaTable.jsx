import React, { useEffect, useState } from 'react';
import "./AreaTable.css";
import { Link } from 'react-router-dom';
import { Alert } from '@mui/material';
import { getData } from '../../../ApiHelper';

const TABLE_HEADS = ["Tasks", "Deadline", "Status"];

const AreaTable = () => {
  const [tasksData, setTasksData] = useState({ Tasks: [], totalTasks: 0, status: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await getData("/users/getMe");
      if (response && response.data.role) {
        setUserRole(response.data.role);
        fetchTasksData(response.data.role);
      } else {
        console.error("Response data or role not found in the response:", response);
      }
    } catch (error) {
      console.error("Error fetching user role:", error.response?.data || error.message);
    }
  };

  const fetchTasksData = async (role) => {
    setLoading(true);
    setError("");
    try {
      const endpoint = role === "team leader" ? "/tasks/" : "/tasks/getMyTasks";
      const response = await getData(endpoint);
      console.log("response:", response)
      if (response.error) {
        setError(response.error);
      } else if (response.Tasks && Array.isArray(response.Tasks)) {
        setTasksData({ Tasks: response.Tasks, totalTasks: response.Tasks.length, status: response.Tasks.status });
      } else {
        setError("Unexpected response structure");
      }
    } catch (error) {
      console.error("Fetch Tasks failed:", error);
      setError("Fetch Tasks failed.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Latest Tasks</h4>
        <Link to="/tasks"><button className="see-more-button">See more</button></Link>
      </div>
      <div className="data-table-diagram">
        {loading ? (
          <p style={{color: 'var(--xl-text-color)'}}>Loading...</p>
        ) : error ? (
          <Alert severity="error" className="error-message">{error}</Alert>
        ) : tasksData.totalTasks === 0 ? (
          <Alert severity="warning" className="no-tasks-message">No tasks for you</Alert>
        ) : (
          <table>
            <thead>
              <tr>
                {TABLE_HEADS?.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasksData.Tasks?.map((task) => {
                return (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{new Date(task.deadline).toLocaleDateString()}</td>
                    <td>
                      <div className="dt-status">
                        <span className={`dt-status-dot dot-${task.status}`}></span>
                        <span className="dt-status-text">{task.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AreaTable;
