import React, { useEffect, useState } from "react";
import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../components";
import Sidebar from "../../components/sidebar/Sidebar";
import { getAuthUser } from "../../helper/Storage";
import { getData } from "../../ApiHelper";
import TeamTable from "../../components/dashboard/areaTable/TeamTable";

const Dashboard = () => {
  const [selectedButton, setSelectedButton] = useState(1);
  const [memberId, setMemberId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getAuthUser();
    if (user && user._id) {
      setMemberId(user._id);
      console.log("ID is " + user._id);
    }
    fetchUserRole();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await getData("/users/getMe");
      if (response && response.data && response.data.role) {
        setUserRole(response.data.role);
        console.log("User role: ", response.data.role);
      } else {
        console.error(
          "Response data or role not found in the response:",
          response
        );
      }
    } catch (error) {
      console.error(
        "Error fetching user role:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />
      <div className="content-area">
        <AreaTop />
        {!loading && userRole !== "manger" && (
          <>
            <AreaCards memberId={memberId} />
            <AreaTable />
          </>
        )}
        {loading && <h3>Loading..</h3>}
        {!loading && userRole === "manger" && (
          <div>
            <AreaCharts />
            <TeamTable />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
