import React from 'react';

const AreaProgressChart = ({ data }) => {
  return (
    <div className="progress-bar">
      <div className="progress-bar-info">
        <h4 className="progress-bar-title">Teams Progress</h4>
      </div>
      <div className="progress-bar-list">
        {data?.map((progressbar) => (
          <div className="progress-bar-item" key={progressbar._id}>
            <div className="bar-item-info">
              <p className="bar-item-info-name">{progressbar.name}</p>
              <p className="bar-item-info-value">{progressbar.progress}%</p>
            </div>
            <div className="bar-item-full">
              <div
                className="bar-item-filled"
                style={{
                  width: `${progressbar.progress}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaProgressChart;
