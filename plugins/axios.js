import axios from 'axios';

axios.defaults.baseURL = 'https://adonisbackend.onrender.com';
axios.defaults.withCredentials = true;

export default axios;
