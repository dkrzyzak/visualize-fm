const { getChart } = require('billboard-top-100');

const get100List = (chartDate, repeatTimes = 1) =>
	new Promise((resolve, reject) => {
		let intervalRunCount = 0;

		const callInterval = setInterval(() => {
			console.log('rozpoczęcie interwału dla daty ' + chartDate + '; intervalRunCount: ', intervalRunCount);
			intervalRunCount++;
			const isLastRun = intervalRunCount === repeatTimes;

			getChart('hot-100', chartDate, (err, chart) => {
				if (err) {
					console.log('Wystąpił błąd:', err);
					return isLastRun ? reject(err) : null;
				}

				if (!chart) {
					return isLastRun ? reject('Empty chart.') : null;
				}

				clearInterval(callInterval);
				return resolve(chart.songs);
			});

			if (intervalRunCount === repeatTimes) {
				clearInterval(callInterval);
			}
		}, 3000);
	});

module.exports = {
	get100List,
};
