import axios from 'axios';

const port = process.env.PORT || process.env.REACT_APP_API_PORT;
const domain = process.env.REACT_APP_ON_HEROKU ? 'https://visualizefm.herokuapp.com' : 'http://localhost';
const baseURL = `${domain}:${port}`;
console.log(baseURL);
export const instance = axios.create({
	baseURL,
});

export default instance;
