import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddModal.css";
import { getData, postData } from "../../../../ApiHelper";
import { FaTimes } from "react-icons/fa";

const AddModal = ({ isOpen, onClose, setOpen, handleAddTask }) => {
  const initialTaskData = {
    title: "",
    description: "",
    deadline: "",
    startDate: "",
    member: "",
    // document: null,
  };

  const [taskData, setTaskData] = useState(initialTaskData);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch team members when the modal opens
      getData("/teams/getMyTeam")
        .then(response => {
          if (response && response.data && response.data.members) {
            const Members = response.data.members;
            setMembers(Members);
          } else {
            console.error("Invalid response structure:", response);
          }
        })
        .catch(error => {
          console.error("Error fetching team members", error);
        });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setTaskData({ ...taskData, document: e.target.files[0] });
    }
  };

  const closeModal = () => {
    setOpen(false);
    onClose();
    setTaskData(initialTaskData);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("title", taskData.title);
    formData.append("description", taskData.description);
    formData.append("deadline", taskData.deadline);
    formData.append("startDate", taskData.startDate);
    formData.append("member", taskData.member);
    // if (taskData.document) {
    //   formData.append("document", taskData.document);
    // }

    postData("/tasks", formData)
      .then(response => {
        handleAddTask(response.data);
        closeModal();
      })
      .catch(error => {
        console.error("Error adding task", error);
      });
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : "modal-closed"}`}>
      <div className="modal-overlay" onClick={closeModal}></div>
      <div className="modal-content">
        <button className="close-button" onClick={closeModal}>
          <FaTimes />
        </button>
        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          placeholder="Title"
          className="modal-input"
          style={{marginTop: "50px"}}
        />
        <input
          type="text"
          name="description"
          value={taskData.description}
          onChange={handleChange}
          placeholder="Description"
          className="modal-input"
        />
        <input
          type="date"
          name="startDate"
          value={taskData.startDate}
          onChange={handleChange}
          placeholder="Start Date"
          className="modal-input"
        />
        <input
          type="date"
          name="deadline"
          value={taskData.deadline}
          onChange={handleChange}
          placeholder="Deadline"
          className="modal-input"
        />
        <select
          name="member"
          onChange={handleChange}
          value={taskData.member}
          className="modal-input"
        >
          <option value="">Assign to Member</option>
          {members.map((member) => (
            <option key={member._id} value={member._id}>
              {member.name}
            </option>
          ))}
        </select>
        {/* <input
          type="file"
          name="document"
          onChange={handleFileChange}
          className="modal-input"
        /> */}
        <button className="modal-button submit-button" onClick={handleSubmit}>
          Submit Task
        </button>
      </div>
    </div>
  );
};

export default AddModal;