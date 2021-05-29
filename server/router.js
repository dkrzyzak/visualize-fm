const express = require('express');
const path = require('path');
const { getChart } = require('billboard-top-100');
const { TopGenresPerYear } = require('./mongo');
const { formatDataForLineChart } = require('./helpers');

const router = express.Router();

router.get('/billboard100', async (req, res) => {
	const { date } = req.query;
	const chartDate = date || '2016-08-27';

	getChart('hot-100', chartDate, (err, chart) => {
		if (err) {
			console.log('Wystąpił błąd:', err);
			return res.send([]).end();
		}

		if (!chart) {
			console.log('Empty chart.');
			return res.send([]).end();
		}

		return res.send(chart.songs).end();
	});
});

router.post('/topGenresPerYear/:year', async (req, res) => {
	const year = req.params.year;

	try {
		const newSummary = new TopGenresPerYear({ year, genres: req.body });
		await newSummary.save();
		return res.status(201).end();
	} catch (e) {
		console.log(e);
		return res.status(500).end();
	}
});

router.get('/topGenresPerYear/:startYear', async (req, res) => {
	const startYear = parseInt(req.params.startYear);
	const yearRange = parseInt(req.query.yearRange);

	try {
		const x = await TopGenresPerYear.find({ year: { $gte: startYear, $lt: startYear + yearRange } });
		res.send(x).end();
	} catch (e) {
		console.log(e);
		return res.status(500).end();
	}
});

router.get('/topGenresPerYear', async (req, res) => {
	try {
		const x = await TopGenresPerYear.find();
		const formattedData = formatDataForLineChart(x);
		res.send(formattedData).end();
	} catch (e) {
		console.log(e);
		return res.status(500).end();
	}
});

router.get('/getPort', (req, res) => res.send(process.env.PORT));

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../build/index.html'));
});

router.get('/*', (req, res) => res.redirect('/'));

module.exports = router;
