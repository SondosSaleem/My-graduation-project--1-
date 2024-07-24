from flask import Flask, request, jsonify
import numpy as np
import pickle

app = Flask(__name__)

# Load the trained model
with open('model.pkl', 'rb') as file:
    regressor = pickle.load(file)

# Utility function to process input data
def process_input_data(new_data):
    state_mapping = {'New York': [1, 0, 0], 'California': [0, 1, 0], 'Florida': [0, 0, 1]}
    state_encoded = state_mapping[new_data[3]]
    processed_data = state_encoded + new_data[:3]
    processed_data = np.array(processed_data).reshape(1, -1)
    return processed_data

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    new_data = [
        data['R&D Spend'],
        data['Administration'],
        data['Marketing Spend'],
        data['State']
    ]
    processed_data = process_input_data(new_data)
    predicted_profit = regressor.predict(processed_data)
    return jsonify({'predicted_profit': predicted_profit[0]})

if __name__ == '__main__':
    app.run(debug=True)