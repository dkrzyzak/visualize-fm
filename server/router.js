const express = require('express');
const { getChart } = require('billboard-top-100');

const router = express.Router();

router.get('/billboard100', (req, res) => {
	const { date } = req.query;
	const chartDate = date || '2016-08-27';

	getChart('hot-100', chartDate, (err, chart) => {
		if (err) {
			console.log('Wystąpił błąd', err);
			return res.send([]);
		}

		if (!chart) {
			return res.send([]);
		}

		return res.status(200).send(chart.songs);
	});
});

module.exports = router;
