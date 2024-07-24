import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle

class StartupProfitPredictor:
    def __init__(self, dataset_path):
        self.dataset_path = dataset_path
        self.regressor = None
        self.ct = None
        self.load_data()
        self.train_model()

    def load_data(self):
        self.dataset = pd.read_csv(self.dataset_path)
        self.X = self.dataset.iloc[:, :-1].values
        self.y = self.dataset.iloc[:, -1].values

    def encode_categorical_data(self):
        self.ct = ColumnTransformer(transformers=[('encoder', OneHotEncoder(), [3])], remainder='passthrough')
        self.X = np.array(self.ct.fit_transform(self.X))

    def train_model(self):
        self.encode_categorical_data()
        X_train, X_test, y_train, y_test = train_test_split(self.X, self.y, test_size=0.2, random_state=0)
        self.regressor = LinearRegression()
        self.regressor.fit(X_train, y_train)
        with open('model.pkl', 'wb') as file:
            pickle.dump(self.regressor, file)
        self.evaluate_model(X_test, y_test)

    def evaluate_model(self, X_test, y_test):
        y_pred = self.regressor.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)
        print(f"Mean Absolute Error: {mae:.2f}")
        print(f"Mean Squared Error: {mse:.2f}")
        print(f"Root Mean Squared Error: {rmse:.2f}")
        print(f"R-squared: {r2:.2f}")

    def predict_profit(self, new_data):
        state_mapping = {'New York': [1, 0, 0], 'California': [0, 1, 0], 'Florida': [0, 0, 1]}
        state_encoded = state_mapping[new_data[3]]
        processed_data = state_encoded + new_data[:3]
        processed_data = np.array(processed_data).reshape(1, -1)
        predicted_profit = self.regressor.predict(processed_data)
        return predicted_profit[0]