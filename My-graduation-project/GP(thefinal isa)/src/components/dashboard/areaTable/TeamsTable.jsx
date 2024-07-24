import React, { useEffect, useState } from "react";
import { Alert, LinearProgress, Tooltip } from "@mui/material";
import "./AreaTable.css";
import TaskModal from "./TaskModal";
import { getData } from "../../../ApiHelper";
import axios from "axios";

const TABLE_HEADS = ["Profile Img", "Name", "Progress"];

const TeamsTable = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMemberTasks, setSelectedMemberTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await getData("/users/getMe");
        if (response && response.data.role) {
          setUserRole(response.data.role);
          fetchTeamData(response.data.role); // Pass the user role to fetchTeamData
          console.log("Role :", response.data.role);
        } else {
          console.error("Response data or role not found in the response:", response);
        }
      } catch (error) {
        console.error("Error fetching user role:", error.response?.data || error.message);
      }
    };

    fetchUserRole();
  }, []);

  const fetchTeamData = async (role) => {
    setLoading(true);
    setError("");
    try {
      let teamData;

      if (role === "manger") {
        const selectedTeam = JSON.parse(localStorage.getItem('selectedTeam'));
        if (!selectedTeam) {
          setError("No team data found.");
          return;
        }
        const loggedInUserId = selectedTeam.teamLeader._id;
        setCurrentUser(loggedInUserId);

        const membersData = selectedTeam.members.filter(
          (member) => member._id!== loggedInUserId
        );

        teamData = { members: membersData };
      } else {
        const response = await getData('/teams/getMyTeam');
        console.log(response);
        const loggedInUserId = response.data.teamLeader._id;
        setCurrentUser(loggedInUserId);

        const membersData = response.data.members.filter(
          (member) => member._id!== loggedInUserId
        );

        teamData = { members: membersData };
      }

      setMembers(teamData.members);
    } catch (error) {
      console.log(error);
      setError("Fetch Team Members failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewTasks = async (memberId) => {
    try {
      const response = await getData(`/tasks/getTasksForOneMember/${memberId}`);
      setSelectedMemberTasks(response.data.Tasks);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      setSelectedMemberTasks([]);
    }
  };

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Team Members</h4>
      </div>
      <div className="data-table-diagram">
        {loading? (
          <p style={{color: 'var(--xl-text-color)'}}>Loading...</p>
        ) : error? (
          <Alert severity="error" className="error-message">
            {error}
          </Alert>
        ) : members.length === 0? (
          <Alert severity="warning" className="no-tasks-message">
            No members yet
          </Alert>
        ) : (
          <table>
            <thead>
              <tr>
                {TABLE_HEADS.map((th, index) => (
                  <th key={index}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id}>
                  <td>
                    <div
                      className="profile-img"
                      style={{
                        backgroundImage: `url(${member.profileImg || "http://localhost:4000/users/OIP.jpeg"})`,
                      }}
                    ></div>
                  </td>
                  <td>{member.name}</td>
                  <td>
                    <Tooltip title={`${Math.floor(member.progress || 0)}%`} arrow>
                      <LinearProgress
                        variant="determinate"
                        value={Math.floor(member.progress) || 0}
                        style={{ width: "100%" }}
                      />
                    </Tooltip>
                  </td>
                  {/* <td>
                    
                    <button
                      className="teams-button"
                      onClick={() => alert(`Calling ${member.name}`)}
                    >
                      Call
                    </button>
                    <button
                      className="teams-button"
                      onClick={() => alert(`Chatting with ${member.name}`)}
                    >
                      Chat
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tasks={selectedMemberTasks}
      />
    </section>
  );
};

export default TeamsTable;