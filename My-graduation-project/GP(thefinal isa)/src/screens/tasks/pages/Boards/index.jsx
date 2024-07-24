
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { onDragEnd } from "../../helpers/onDragEnd";
import { AddOutline } from "react-ionicons";
import AddModal from "../../components/Modals/AddModal";
import Task from "../../components/Task";
import "./Boards.css";
import { getData, updateData } from "../../../../ApiHelper";

const Boards = () => {
  const [columns, setColumns] = useState({
    newAssigned: { name: "New Assigned", items: [] },
    inProgress: { name: "In Progress", items: [] },
    overdue: { name: "Overdue", items: [] },
    completed: { name: "Completed", items: [] },
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [loading, setLoading] = useState(false);
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

      if (response.error) {
        setError(response.error);
      } else if (response.Tasks && Array.isArray(response.Tasks)) {
        const tasks = response.Tasks;
        const newColumns = {
          newAssigned: { name: "New Assigned", items: [] },
          inProgress: { name: "In Progress", items: [] },
          overdue: { name: "Overdue", items: [] },
          completed: { name: "Completed", items: [] },
        };

        tasks.forEach((task) => {
          if (task.status === "newAssigned") {
            newColumns.newAssigned.items.push(task);
          } else if (task.status === "inProgress") {
            newColumns.inProgress.items.push(task);
          } else if (task.status === "overdue") {
            newColumns.overdue.items.push(task);
          } else if (task.status === "completed") {
            newColumns.completed.items.push(task);
          }
        });

        setColumns(newColumns);
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

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setError("");
      if (userRole === "member") {
        const completeTaskResponse = await updateData(`/tasks/completeTask/${taskId}`, {status: newStatus});
        console.log("status:", completeTaskResponse)
        if (completeTaskResponse === newStatus) {
          const updatedColumns = { ...columns };
          Object.keys(updatedColumns).forEach((columnId) => {
            updatedColumns[columnId].items = updatedColumns[columnId].items.map((task) => {
              if (task._id === taskId) {
                return { ...task, status: newStatus };
              }
              return task;
            });
          });
          setColumns(updatedColumns);
        } else {
          console.log("error in updating status");
        }
        const status = response.data.status;
        console.log(`Updated status: ${status}`);
  
        await handleTaskCompletion(taskId, newStatus);
  
        return response;
      } else {
        setError("User is not a member. Cannot update task status.");
        return null;
      }
    } catch (error) {
      console.error('Error updating task status:', error.response?.data || error.message);
      throw error;
    }
  };  

 /*  const handleTaskCompletion = async (taskId, newStatus) => {
    try {
      if (newStatus === "completed") {
        const completeTaskResponse = await updateData(`/tasks/completeTask/${taskId}`, {});
        console.log("Task completed:", completeTaskResponse);
      }
    } catch (error) {
      console.error('Error completing task:', error.response?.data || error.message);
      throw error;
    }
  }; */

  const openModal = (columnId) => {
    setSelectedColumn(columnId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddTask = (taskData) => {
    const newColumns = { ...columns };
    newColumns[selectedColumn].items.push(taskData);
    setColumns(newColumns);
  };

  const handleRemoveTask = (taskId) => {
    const updatedColumns = { ...columns };
    Object.keys(updatedColumns).forEach((columnId) => {
      updatedColumns[columnId].items = updatedColumns[columnId].items.filter(
        (task) => task._id !== taskId
      );
    });
    setColumns(updatedColumns);
  };

  const hasNoTasks = () => {
    return Object.values(columns).every(
      (column) => column.items && column.items.length === 0
    );
  };

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && hasNoTasks() && <div>No tasks for you yet.</div>}
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns, updateTaskStatus)}>
        <div className="board-container">
          {Object.entries(columns).map(([columnId, column], index) => (
            <div className="column" key={columnId}>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="column-content">
                    <div className="column-header">{column.name}</div>
                    {column.items &&
                      column.items.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Task
                                task={task}
                                provided={provided}
                                onRemove={userRole === "team leader" ? handleRemoveTask : null}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {userRole === "team leader" && index === 0 && (
                <div onClick={() => openModal(columnId)} className="add-task">
                  <AddOutline color={"var(--font-color)"} />
                  Add Task
                </div>
              )}
            </div>
          ))}
        </div>
      </DragDropContext>

      <AddModal
        isOpen={modalOpen}
        onClose={closeModal}
        setOpen={setModalOpen}
        handleAddTask={handleAddTask}
      />
    </>
  );
};

export default Boards;
