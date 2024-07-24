import React, { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { Container, TextField, Button, Avatar, Box, InputAdornment, IconButton } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { getData, putData, uploadFile } from "../../ApiHelper";
import { Alert } from 'antd';
import { removeAuthUser } from "../../helper/Storage";

function Profile() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    profileImg: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    getData('/users/getMe')
      .then(response => {
        console.log("data:", response);
        const { name, email, phone, profileImg } = response.data;
        setProfileData({ name, email, phone, profileImg, password: '' });
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };
  
  const handleSave = async () => {
    // Prepare form data for profile update
    const formData = { ...profileData };
    const originalPassword = formData.password;
    delete formData.password; // Remove password from formData if not being changed
  
    if (selectedFile) {
      try {
        const uploadResponse = await uploadFile('/users/updateProfileImage', selectedFile);
        formData.profileImg = uploadResponse; 
      } catch (error) {
        console.error('Error uploading file:', error);
        setAlerts([...alerts, { message: "Error uploading file", type: "error" }]);
        return;
      }
    }
  
    try {
      const response = await putData('/users/updateMe', formData);
      console.log('Profile data saved:', response);
      setAlerts([...alerts, { message: "Profile data updated successfully", type: "success" }]);
      setProfileData(prevData => ({
        ...prevData,
        profileImg: response.profileImg
      }));
    } catch (error) {
      console.error('Error updating profile data:', error);
      setAlerts([...alerts, { message: "Error updating profile data", type: "error" }]);
    }
  
    // Check if the password has been changed
    if (originalPassword && originalPassword !== "") {
      const passwordData = { password: originalPassword };
      try {
        const response = await putData('/users/changeMyPassword', passwordData);
        console.log('Password updated:', response);
        setAlerts([...alerts, { message: "Password updated successfully", type: "success" }]);
  
        // Log out user and redirect to homepage
        logoutUser();
      } catch (error) {
        console.error('Error updating password:', error);
        setAlerts([...alerts, { message: "Error updating password", type: "error" }]);
      }
    }
  };

// Function to handle user logout
const logoutUser = () => {
  // Clear user data from local storage or context
  removeAuthUser();
  // Redirect to homepage
  window.location.href = '/';
};
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfileData({ ...profileData, profileImg: URL.createObjectURL(file) });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const commonTextFieldStyles = {
    color: 'var(--font-color)',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'var(--font-color)',
      },
      '&:hover fieldset': {
        borderColor: 'var(--font-color)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'var(--font-color)',
      },
      '& input': {
        color: 'var(--font-color)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'var(--font-color)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'var(--font-color)',
    },
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            message={alert.message}
            type={alert.type}
            showIcon
            closable
            onClose={() => setAlerts(alerts.filter((_, i) => i !== index))}
            style={{ marginBottom: 20 }}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <h1 style={commonTextFieldStyles}>Profile</h1>
        <Avatar
          src={profileData.profileImg}
          sx={{ width: 80, height: 80, mx: 80 }}
        />
      </Box>
      <form noValidate autoComplete="off">
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          value={profileData.name}
          onChange={handleChange}
          sx={commonTextFieldStyles}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          value={profileData.email}
          onChange={handleChange}
          sx={commonTextFieldStyles}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Phone Number"
          name="phone"
          value={profileData.phone}
          onChange={handleChange}
          sx={commonTextFieldStyles}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Upload Picture"
          value={selectedFile ? selectedFile.name : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton component="label">
                  <CloudUploadIcon sx={commonTextFieldStyles} />
                  <VisuallyHiddenInput
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                  />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              color: 'var(--font-color)',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'var(--font-color)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--font-color)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--font-color)',
                },
                '& input': {
                  color: 'var(--font-color)',
                },
              },
            }
          }}
          sx={commonTextFieldStyles}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={profileData.password}
          onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={(e) => e.preventDefault()}
                  sx={commonTextFieldStyles}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={commonTextFieldStyles}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ padding: "10px 40px 10px 40px" }}>
            Save
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default Profile;
