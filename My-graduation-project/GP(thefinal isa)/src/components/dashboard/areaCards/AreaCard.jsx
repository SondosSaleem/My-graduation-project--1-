import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { getData } from "../../../ApiHelper";

const AreaCard = ({ colors, percentFillValue, cardInfo, endpoint }) => {
  const [loading, setLoading] = useState(false);
  const [fetchTasks, setFetchTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasksData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getData(endpoint);
        if (response.error) {
          setError(response.error);
        } else {
          setFetchTasks(response.Tasks);
        }
      } catch (error) {
        console.log(error);
        setError("Fetch data failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasksData();
  }, [endpoint]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const filledValue = (percentFillValue / 100) * 360; // 360 degrees for a full circle
  const remainedValue = 360 - filledValue;

  const data = [
    { name: "All Tasks", value: remainedValue },
    { name: "Status Task", value: filledValue },
  ];

  const renderTooltipContent = (value) => {
    return `${Math.floor((value / 360) * 100)} %`;
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{cardInfo.value}</div>
        <p className="info-text">{cardInfo.text}</p>
      </div>
      <div className="area-card-chart">
        <PieChart width={100} height={100}>
          <Pie
            data={data}
            cx={50}
            cy={45}
            innerRadius={20}
            fill="#e4e8ef"
            paddingAngle={0}
            dataKey="value"
            startAngle={-270}
            endAngle={150}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={renderTooltipContent} />
        </PieChart>
      </div>
    </div>
  );
};

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  percentFillValue: PropTypes.number.isRequired,
  cardInfo: PropTypes.object.isRequired,
  endpoint: PropTypes.string.isRequired,
};

export default AreaCard;
