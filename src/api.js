import axios from 'axios';

const api = axios.create({
  baseURL: 'https://winrate-tracker.onrender.com/api', // Replace with your backend server URL
});

export default api;
