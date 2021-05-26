const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { getChart } = require('billboard-top-100');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/billboard100', (req, res) => {
	const { date } = req.query;
	console.log(date);
	const chartDate = date || '2016-08-27';

	getChart('hot-100', chartDate, (err, chart) => {
		if (err) {
			console.log(err);
			res.status(500).end();
		}

		if (!chart) {
			res.send([]);
		}

		res.status(200).send(chart.songs);
	});
});

const port = 8080;

app.listen(port, () => {
	console.log('serwer startuje na porcie ' + port);
});
