import React, { useState } from 'react';
import axios from 'axios';
import './predict.css';

function predict() {
  const [data, setData] = useState({
    rdSpend: '',
    administration: '',
    marketingSpend: '',
    state: ''
  });
  const [predictedProfit, setPredictedProfit] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/predict', {
        "rdSpend": parseFloat(data.rdSpend),
        "administration": parseFloat(data.administration),
        "marketingSpend": parseFloat(data.marketingSpend),
        "state": data.state
      });
      setPredictedProfit(response.data.predicted_profit);
      setError(null);
    } catch (err) {
      console.error('Error predicting profit:', err);
      setError('Error predicting profit');
      setPredictedProfit(null);
    }
  };

  return (
    <div className="App">
      <h1>Profit Predictor</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-container">
          <input type="number" name="rdSpend" value={data.rdSpend} onChange={handleChange} placeholder="R&D Spend" required />
        </div>
        <div className="input-container">
          <input type="number" name="administration" value={data.administration} onChange={handleChange} placeholder="Administration" required />
        </div>
        <div className="input-container">
          <input type="number" name="marketingSpend" value={data.marketingSpend} onChange={handleChange} placeholder="Marketing Spend" required />
        </div>
        <div className="input-container">
          <select name="state" value={data.state} onChange={handleChange} required>
            <option value="">Select State</option>
            <option value="New York">New York</option>
            <option value="California">California</option>
            <option value="Florida">Florida</option>
          </select>
        </div>
        <div className="button-container">
          <button type="submit" className="button">Predict Profit</button>
        </div>
      </form>
      {predictedProfit !== null && (
        <div className='color-predict'>
          <h2>Predicted Profit: ${predictedProfit.toFixed(2)}</h2>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default predict;