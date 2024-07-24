// import { TimeOutline } from "react-ionicons";
// import React, { useEffect, useState } from "react";
// import "./Task.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import SideBar from "../../../../components/sidebar/Sidebar";
// import { SidebarProvider } from "../../../../context/SidebarContext";
// import { getData, deleteData } from "../../../../ApiHelper"; 

// const Task = ({ task, provided, onRemove }) => {
//     const [selectedButton, setSelectedButton] = useState(2);
//     const { title, description, deadline, member } = task; // Include member in destructuring
//     const [userRole, setUserRole] = useState("");

//     useEffect(() => {
//         fetchUserRole();
//     }, []);

//     const fetchUserRole = async () => {
//         try {
//             const response = await getData("/users/getMe");
//             if (response && response.data.role) {
//                 setUserRole(response.data.role);
//             } else {
//                 console.error("Response data or role not found in the response:", response);
//             }
//         } catch (error) {
//             console.error("Error fetching user role:", error.response?.data || error.message);
//         }
//     };

//     const handleRemove = async () => {
//         try {
//             const response = await deleteData(`/tasks/${task._id}`);
//             if (response.status === 200) {
//                 onRemove(task._id);
//             } else {
//                 console.error("Failed to delete task:", response);
//             }
//         } catch (error) {
//             console.error("Error deleting task:", error.response?.data || error.message);
//         }
//     };

//     return (
//         <SidebarProvider>
//             <SideBar
//                 selectedButton={selectedButton}
//                 setSelectedButton={setSelectedButton}
//             />
//             <div
//                 ref={provided.innerRef}
//                 {...provided.draggableProps}
//                 {...provided.dragHandleProps}
//                 className="task-container"
//             >
//                 {userRole === "team leader" && (
//                     <span className="task-actions">
//                         <FontAwesomeIcon icon={faTrash} onClick={handleRemove} />
//                     </span>
//                 )}
//                 <div className="task-details">
//                     <span className="task-title">{title}</span>
//                     <span className="task-description">{description}</span>
//                     {userRole === "team leader" && member && member.name && (
//                         <div className="task-assigned-to">
//                             <span>Assigned to: </span>
//                             <span className="task-assigned-to-member"> {member.name}</span>
//                         </div>
//                     )}
//                 </div>
//                 <div className="task-separator"></div>
//                 <div className="task-footer">
//                     <div className="task-deadline">
//                         <TimeOutline
//                             color={"var(--font-color)"}
//                             width="19px"
//                             height="19px"
//                         />
//                         <span className="task-deadline-text">{deadline}</span>
//                     </div>
//                 </div>
//             </div>
//         </SidebarProvider>
//     );
// };

// export default Task;


import { TimeOutline } from "react-ionicons";
import React, { useEffect, useState } from "react";
import "./Task.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SideBar from "../../../../components/sidebar/Sidebar";
import { SidebarProvider } from "../../../../context/SidebarContext";
import { getData, deleteData } from "../../../../ApiHelper"; 

const Task = ({ task, provided, onRemove }) => {
    const [selectedButton, setSelectedButton] = useState(2);
    const { title, description, deadline, member } = task;
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        fetchUserRole();
    }, []);

    const fetchUserRole = async () => {
        try {
            const response = await getData("/users/getMe");
            if (response && response.data.role) {
                setUserRole(response.data.role);
            } else {
                console.error("Response data or role not found in the response:", response);
            }
        } catch (error) {
            console.error("Error fetching user role:", error.response?.data || error.message);
        }
    };

    const handleRemove = async () => {
        // Hide the task element immediately
        try {
            const response = await deleteData(`/tasks/${task._id}`);
            if (response.status === 200) {
                onRemove(task._id);
            } else {
                console.error("Failed to delete task:", response);
            }
        } catch (error) {
            console.error("Error deleting task:", error.response?.data || error.message);
            
        }
    };

    return (
        <SidebarProvider>
            <SideBar
                selectedButton={selectedButton}
                setSelectedButton={setSelectedButton}
            />
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="task-container"
                id={`task-${task._id}`}
            >
                {userRole === "team leader" && (
                    <span className="task-actions">
                        <FontAwesomeIcon icon={faTrash} onClick={handleRemove} />
                    </span>
                )}
                <div className="task-details">
                    <span className="task-title">{title}</span>
                    <span className="task-description">{description}</span>
                    {userRole === "team leader" && member && member.name && (
                        <div className="task-assigned-to">
                            <span>Assigned to: </span>
                            <span className="task-assigned-to-member">{member.name}</span>
                        </div>
                    )}
                </div>
                <div className="task-separator"></div>
                <div className="task-footer">
                    <div className="task-deadline">
                        <TimeOutline
                            color={"var(--font-color)"}
                            width="19px"
                            height="19px"
                        />
                        <span className="task-deadline-text">{deadline}</span>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default Task;
