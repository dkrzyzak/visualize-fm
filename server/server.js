require('dotenv').config();
const cors = require('cors');
const express = require('express');
const router = require('./router');
require('./mongo');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/', router);

const port = process.env.REACT_APP_API_PORT;
app.listen(port, () => {
	console.log('serwer startuje na porcie ' + port);
});
