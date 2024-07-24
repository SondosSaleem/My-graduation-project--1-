import React, { useState, useContext, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import { Sidebar } from "../../components";
import { SidebarProvider } from "../../context/SidebarContext";
import { ThemeContext } from "../../context/ThemeContext";
import "./Calender.css";
import { getData } from "../../ApiHelper";

Modal.setAppElement("#root");

export default function Calender() {
  const { theme } = useContext(ThemeContext);
  const [selectedButton, setSelectedButton] = useState(5);
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await getData("/users/getMe");
      if (response && response.data.role) {
        setUserRole(response.data.role);
        fetchTasks(response.data.role); // Pass the user role to fetchTasks
        console.log("Role :", response.data.role);
      } else {
        console.error("Response data or role not found in the response:", response);
      }
    } catch (error) {
      console.error("Error fetching user role:", error.response?.data || error.message);
    }
  };

  const fetchTasks = async (role) => {
    const endpoint = role === "member" ? "/tasks/getMyTasks" : "/tasks/";
    try {
      const response = await getData(endpoint);
      if (response.Tasks && Array.isArray(response.Tasks)) {
        const taskEvents = response.Tasks.map(task => ({
          title: task.title,
          start: task.startDate,
          end: task.deadline, // Add the end date here if available
          memberName: task.member.name // Assuming task object contains memberName
        }));
        setEvents(taskEvents);
      } else {
        console.error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Failed to fetch tasks data:", error);
    }
  };

  const openModal = (date) => {
    setNewEventDate(date);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDateClick = (arg) => {
    openModal(arg.dateStr);
  };

  return (
    <>
      <SidebarProvider>
        <Sidebar
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
        <div className={`app ${theme}`}>
          <div className="calendar-container">
            <h1>Calendar</h1>

            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              weekends={true}
              events={events}
              dateClick={handleDateClick}
              eventContent={renderEventContent}
              themeSystem="bootstrap"
              customButtons={{
                myCustomButton: {
                  text: "Add Event",
                  click: handleDateClick,
                },
              }}
            />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}

// a custom render function
function renderEventContent(eventInfo) {
  return (
    <div>
      <i style={{ color: "var(--xl-text-color)" }}>{eventInfo.event.title}</i>
      <br />
      <small style={{ color: "var(--xl-text-color)" }}>Assigned to: {eventInfo.event.extendedProps.memberName}</small> {/* Display member's name */}
    </div>
  );
}

// import React, { useState, useContext, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import Modal from "react-modal";
// import { Sidebar } from "../../components";
// import { SidebarProvider } from "../../context/SidebarContext";
// import { ThemeContext } from "../../context/ThemeContext";
// import "./Calender.css";
// import { getData, postData } from "../../ApiHelper";

// Modal.setAppElement("#root");

// export default function Calender() {
//   const { theme } = useContext(ThemeContext);
//   const [selectedButton, setSelectedButton] = useState(5);
//   const [events, setEvents] = useState([]);
//   const [modalIsOpen, setIsOpen] = useState(false);
//   const [newEventTitle, setNewEventTitle] = useState("");
//   const [newEventDate, setNewEventDate] = useState("");
//   const [newEventDeadline, setNewEventDeadline] = useState("");
//   const [userRole, setUserRole] = useState("");

//   useEffect(() => {
//     fetchUserRole();
//   }, []);

//   const fetchUserRole = async () => {
//     try {
//       const response = await getData("/users/getMe");
//       if (response && response.data.role) {
//         setUserRole(response.data.role);
//         fetchTasks(response.data.role); // Pass the user role to fetchTasks
//         console.log("Role :", response.data.role);
//       } else {
//         console.error("Response data or role not found in the response:", response);
//       }
//     } catch (error) {
//       console.error("Error fetching user role:", error.response?.data || error.message);
//     }
//   };

//   const fetchTasks = async (role) => {
//     const endpoint = role === "member" ? "/tasks/getMyTasks" : "/tasks/";
//     try {
//       const response = await getData(endpoint);
//       if (response.Tasks && Array.isArray(response.Tasks)) {
//         const taskEvents = response.Tasks.map(task => ({
//           title: task.title,
//           start: task.startDate,
//           end: task.deadline,
//           memberName: task.member.name // Assuming task object contains memberName
//         }));
//         setEvents(taskEvents);
//       } else {
//         console.error("Unexpected response structure");
//       }
//     } catch (error) {
//       console.error("Failed to fetch tasks data:", error);
//     }
//   };

//   const openModal = (date) => {
//     setNewEventDate(date);
//     setIsOpen(true);
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//   };

//   const handleDateClick = (arg) => {
//     if (userRole === "manager") {
//       openModal(arg.dateStr);
//     }
//   };  

//   const handleEventSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await postData("/create-event", {
//         title: newEventTitle,
//         startDate: newEventDate,
//         deadline: newEventDeadline
//       });
//       if (response && response.data) {
//         setEvents([...events, {
//           title: response.data.title,
//           start: response.data.startDate,
//           end: response.data.deadline
//         }]);
//         closeModal();
//       } else {
//         console.error("Failed to create event:", response);
//       }
//     } catch (error) {
//       console.error("Error creating event:", error.response?.data || error.message);
//     }
//   };

//   return (
//     <>
//       <SidebarProvider>
//         <Sidebar
//           selectedButton={selectedButton}
//           setSelectedButton={setSelectedButton}
//         />
//         <div className={`app ${theme}`}>
//           <div className="calendar-container">
//             <h1>Calendar</h1>
//             {/* Add your custom button here */}
//             <button onClick={handleDateClick}>Add Event</button>
//             <FullCalendar
//               plugins={[dayGridPlugin, interactionPlugin]}
//               initialView="dayGridMonth"
//               weekends={true}
//               events={events}
//               dateClick={handleDateClick}
//               eventContent={renderEventContent}
//               themeSystem="bootstrap"
              
//             />
//           </div>
//         </div>
//       </SidebarProvider>

//       {userRole === "manager" && (
//         <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
//           <h2>Add New Event</h2>
//           <form onSubmit={handleEventSubmit}>
//             <label>
//               Title:
//               <input
//                 type="text"
//                 value={newEventTitle}
//                 onChange={(e) => setNewEventTitle(e.target.value)}
//                 required
//               />
//             </label>
//             <label>
//               Start Date:
//               <input
//                 type="date"
//                 value={newEventDate}
//                 onChange={(e) => setNewEventDate(e.target.value)}
//                 required
//               />
//             </label>
//             <label>
//               Deadline:
//               <input
//                 type="date"
//                 value={newEventDeadline}
//                 onChange={(e) => setNewEventDeadline(e.target.value)}
//                 required
//               />
//             </label>
//             <button type="submit">Add Event</button>
//           </form>
//         </Modal>
//       )}
//     </>
//   );
// }

// function renderEventContent(eventInfo) {
//   return (
//     <div>
//       <i style={{ color: "var(--xl-text-color)" }}>{eventInfo.event.title}</i>
//       <br />
//       <small style={{ color: "var(--xl-text-color)" }}>Assigned to: {eventInfo.event.extendedProps.memberName}</small> {/* Display member's name */}
//     </div>
//   );
// }
