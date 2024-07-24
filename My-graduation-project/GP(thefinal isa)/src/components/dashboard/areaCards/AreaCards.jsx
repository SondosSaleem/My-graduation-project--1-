import React, { useEffect, useState } from "react";
import AreaCard from "./AreaCard";
import { getData } from "../../../ApiHelper";
import Alert from '@mui/material/Alert';
import "../areaCards/AreaCards.css";

const AreaCards = ({ memberId }) => {
  const [tasksData, setTasksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await getData("/users/getMe");
      if (response && response.data.role) {
        setUserRole(response.data.role);
        fetchTasksData(response.data.role); // Pass the user role to fetchTasksData
        console.log("Role :", response.data.role);
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

    // Determine the endpoint based on the user role
    const endpoint = role === "member" ? "/tasks/getMyTasks" : "/tasks/";

    try {
      const response = await getData(endpoint);
      console.log("response now:", response);
      if (response.error) {
        setError(response.error);
      } else if (response.Tasks && Array.isArray(response.Tasks)) {
        const tasks = response.Tasks;
        const totalTasks = response.totalTasks;
        const statusCount = {};

        // Count the number of tasks in each status
        tasks.forEach(task => {
          const status = task.status;
          if (statusCount[status]) {
            statusCount[status]++;
          } else {
            statusCount[status] = 1;
          }
        });

        // Reshape data for area cards using the status count
        const reshapedData = Object.entries(statusCount).map(([status, count]) => ({
          title: status.toUpperCase(),
          value: count,
          text: `Tasks ${status}`,
        }));

        setTasksData({ totalTasks, statesData: reshapedData });
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Alert severity="error" className="error-message">{error}</Alert>;
  }

  const { totalTasks, statesData } = tasksData;

  return (
    <section className="content-area-cards">
      {statesData.map((data, index) => (
        <AreaCard
          key={index}
          colors={["#e4e8ef", "#475be8"]}
          percentFillValue={(data.value / totalTasks) * 100} // Calculate the percent fill value
          cardInfo={data}
          endpoint={userRole === "member" ? "/tasks/getMyTasks" : "/tasks/"} // Pass the endpoint conditionally
        />
      ))}
    </section>
  );
};

export default AreaCards;
