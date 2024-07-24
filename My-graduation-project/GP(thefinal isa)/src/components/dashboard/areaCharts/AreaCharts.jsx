import { useEffect, useState } from "react";
import AreaBarChart from "./AreaBarChart"
import AreaProgressChart from "./AreaProgressChart"
import { getData } from "../../../ApiHelper";
import AreaLine from "./AreaLine";
import Predict from "../predict/Predict";

const AreaCharts = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeamsData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getData('/teams/');
        if (response.error) {
          setError(response.error);
        } else {
          setTeamsData(response.data);  // Assuming response.data is an array of team data
          console.log(response.data);
        }
      } catch (error) {
        console.log(error);
        setError("Fetch Teams failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsData();
  }, []);
  return (
    <section className="content-area-charts">
      <AreaLine />
      <Predict />
    </section>
  )
}

export default AreaCharts
