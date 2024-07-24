import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const TaskModal = ({ open, onClose, tasks }) => {
    console.log(tasks)
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        width: 400, 
        bgcolor: 'background.paper', 
        boxShadow: 24, 
        p: 4 
      }}>
        <Typography variant="h6" component="h2">
          Tasks
        </Typography>
        <div>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div key={index}>
                <Typography variant="body1">title: {task.title}</Typography>
                <Typography variant="body2">description: {task.description}</Typography>
                <Typography variant="body2">Status: {task.status}</Typography>
              </div>
            ))
          ) : (
            <Typography variant="body1">No tasks available</Typography>
          )}
        </div>
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default TaskModal;
