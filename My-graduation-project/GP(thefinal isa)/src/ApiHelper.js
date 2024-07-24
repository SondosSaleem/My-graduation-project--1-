import axios from "axios";

const API_BASE_URL = 'http://localhost:4000/api/v1/';

const api = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 50000, // request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

const getUserToken = () => {
  return sessionStorage.getItem('token'); // Adjust this to however you store the token
};

api.interceptors.request.use(
  (config) => {
    const token = getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getData = async (request) => {
  try {
    const response = await api.get(request);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postData = async (request, params) => {
  try {
    const response = await api.post(request, params);
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};

export const putData = async (request, params) => {
  try {
    const response = await api.put(request, params, {
      headers: {
        'Content-Type': params instanceof FormData ? 'multipart/form-data' : 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error sending data:", error);
    throw error;
  }
};

export const deleteData = async (request) => {
  try {
      const response = await api.delete(request);
      return response;
  } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
  }
};

export const updateData = async (request, params) => {
  try {
    const response = await api.patch(request, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;  // Return the response data
  } catch (error) {
    console.error('Error in updateData:', error.response?.data || error.message);
    throw error;
  }
};

export const uploadFile = async (endpoint, file) => {
  const formData = new FormData();
  formData.append('profileImg', file);  // Change this line

  try {
    const response = await api.put(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Include this if you need to send cookies with the request
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error.response?.data || error.message);
    throw error;
  }
};
