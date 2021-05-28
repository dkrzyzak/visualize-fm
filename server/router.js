const express = require('express');
const { TopGenresPerYear } = require('./mongo');
const { get100List } = require('./helpers');

const router = express.Router();

router.get('/billboard100', async (req, res) => {
	const { date } = req.query;
	const chartDate = date || '2016-08-27';
	let hot100List;

	try {
		hot100List = await get100List(chartDate, 2);
		return res.send(hot100List).end();
	} catch (e) {
		return res.send([]).end();
	}
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
	try {
		const x = await TopGenresPerYear.find({ year: { $gte: startYear, $lt: startYear + 5 } });
		res.send(x).end();
	} catch (e) {
		console.log(e);
		return res.status(500).end();
	}
});

module.exports = router;
