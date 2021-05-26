import axios from 'axios';

const baseURL = `http://localhost:${process.env.REACT_APP_API_PORT}`;

export const instance = axios.create({
	baseURL,
});

export default instance;
