import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components";
import { SidebarProvider } from "../../context/SidebarContext";
import "./team.css";
import { getData } from "../../ApiHelper";
import TeamsTable from "../../components/dashboard/areaTable/TeamsTable";

const Team = () => {
  return (
    <TeamsTable/>
  );
};

export default Team;
