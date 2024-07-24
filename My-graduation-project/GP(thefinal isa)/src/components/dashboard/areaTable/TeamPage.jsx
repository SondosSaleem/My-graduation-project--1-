import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getData } from '../../../ApiHelper';

const TeamPage = () => {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getData(`/teams/${teamId}`);
        if (response.error) {
          setError(response.error);
        } else {
          setTeamData(response.data);
        }
      } catch (error) {
        console.log(error);
        setError("Fetch Team failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  return (
    <div>
      {loading ? (
        <p>Loading team data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <h2>{teamData.title}</h2>
          {/* Render other team data */}
        </div>
      )}
    </div>
  );
};

export default TeamPage;
