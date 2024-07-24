import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Tooltip, LinearProgress, Button, Modal, Box, TextField, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText } from '@mui/material';
import { getData, postData } from '../../../ApiHelper';

const TABLE_HEADS = ["Teams", "Progress", "Actions"];

const TeamTable = () => {
  const navigate = useNavigate();
  const [teamsData, setTeamsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ title: '', teamLeader: '', members: [] });
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', passwordConfirmation: '', role: 'member' });

  useEffect(() => {
    const fetchTeamsData = async () => {
      setLoading(true);
      setError("");
      try {
        const teamsResponse = await getData('/teams/');
        const usersResponse = await getData('/users/');
        console.log("team", teamsResponse)
        if (teamsResponse.error) {
          setError(teamsResponse.error);
        } else {
          setTeamsData(teamsResponse.data);
        }
        if (usersResponse.error) {
          setError(usersResponse.error);
        } else {
          setUsersData(usersResponse.result); 
        }
      } catch (error) {
        console.log(error);
        setError("Fetch data failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsData();
  }, []);

  const handleTeamClick = (team) => {
    localStorage.setItem('selectedTeam', JSON.stringify(team));
    navigate('/team');
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    resetForm();
    setOpenModal(false);
  };

  const handleOpenMemberModal = () => setOpenMemberModal(true);
  const handleCloseMemberModal = () => {
    resetMemberForm();
    setOpenMemberModal(false);
  };

  const resetForm = () => {
    setNewTeam({ title: '', teamLeader: '', members: [] });
  };

  const resetMemberForm = () => {
    setNewMember({ name: '', email: '', role: 'member' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam({ ...newTeam, [name]: value });
  };

  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setNewTeam({ ...newTeam, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postData('/teams/', newTeam);
      console.log('postTeam:', response);
      if (response.message === "Done successfully") {
        setTeamsData([...teamsData, response.data]);
        handleCloseModal();
      } else {
        setError(response.message);
      }
    } catch (error) {
      let errorMessage = "Failed to create team.";
      if (error.response && error.response.data && error.response.data.errors) {
        errorMessage = error.response.data.errors.map(err => err.msg).join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error("Error creating team:", errorMessage);
      setError(errorMessage);
    }
  };
  
  

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postData('/users/', newMember);
      console.log('postMember:', response);
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setUsersData([...usersData, response.data]);
        handleCloseMemberModal();
      } else {
        setError("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error creating member:", error.response?.data || error.message);
      setError("Failed to create member.");
    }
  };

  const teamLeaders = usersData.filter(user => user.role === 'team leader');
  const members = usersData.filter(user => user.role === 'member');

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Teams</h4>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Create Team
        </Button>
        <Button variant="contained" onClick={handleOpenMemberModal}>
          Create Member
        </Button>
      </div>
      <div className="data-table-diagram">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <Alert severity="error" className="error-message">{error}</Alert>
        ) : teamsData.length === 0 ? (
          <Alert severity="warning" className="no-tasks-message">No teams yet</Alert>
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
              {teamsData.map((team) => (
                <tr key={team._id}>
                  <td>{team.title}</td>
                  <td>
                    <Tooltip title={`${Math.round(team.teamLeader?.progress || 0)}%`} arrow>
                      <LinearProgress
                        variant="determinate"
                        value={Math.round(team.teamLeader?.progress || 0)}
                        style={{ width: "100%" }}
                      />
                    </Tooltip>
                  </td>
                  <td>
                    <Button variant="contained" onClick={() => handleTeamClick(team)}>
                      View Team
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ ...modalStyle, width: 400 }}>
          <h2>Add New Team</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Team Title"
              name="title"
              value={newTeam.title}
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="team-leader-label">Team Leader</InputLabel>
              <Select
                labelId="team-leader-label"
                id="teamLeader"
                name="teamLeader"
                value={newTeam.teamLeader}
                onChange={handleInputChange}
                label="Team Leader"
                required
              >
                {teamLeaders.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="members-label">Members</InputLabel>
              <Select
                labelId="members-label"
                id="members"
                name="members"
                multiple
                value={newTeam.members}
                onChange={handleSelectChange}
                renderValue={(selected) => selected.map(id => usersData.find(user => user._id === id)?.name).join(', ')}
                label="Members"
                required
              >
                {members.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newTeam.members.length > 0 && (
              <List>
                {newTeam.members.map((memberId) => {
                  const member = usersData.find(user => user._id === memberId);
                  return (
                    <ListItem key={memberId}>
                      <ListItemText primary={member?.name || ''} />
                    </ListItem>
                  );
                })}
              </List>
            )}
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Create Team
            </Button>
          </form>
        </Box>
      </Modal>

      <Modal open={openMemberModal} onClose={handleCloseMemberModal}>
        <Box sx={{ ...modalStyle, width: 400 }}>
          <h2>Add New Member</h2>
          <form onSubmit={handleMemberSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Member Name"
              name="name"
              value={newMember.name}
              onChange={handleMemberInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Member Email"
              name="email"
              type="email"
              value={newMember.email}
              onChange={handleMemberInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Member Password"
              name="password"
              type="password"
              value={newMember.password}
              onChange={handleMemberInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Member Password Confirmation"
              name="passwordConfirmation"
              type="password"
              value={newMember.passwordConfirmation}
              onChange={handleMemberInputChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={newMember.role}
                onChange={handleMemberInputChange}
                label="Role"
                required
              >
                <MenuItem value="team leader">Team Leader</MenuItem>
                <MenuItem value="member">Member</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Add Member
            </Button>
          </form>
        </Box>
      </Modal>
    </section>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default TeamTable;
