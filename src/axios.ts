import axios from 'axios';

const port = process.env.PORT || process.env.REACT_APP_API_PORT;
const baseURL = `http://localhost:${port}`;

export const instance = axios.create({
	baseURL,
});

export default instance;
