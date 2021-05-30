const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.pluralize(null);
mongoose
	.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('połączono z bazą danych');
	})
	.catch(console.log);

const db = mongoose.connection;

// MODELS AND SCHEMAS

const topGenresSchema = new Schema({
	year: Number,
	genres: [
		{
			genre: String,
			count: Number,
		},
	],
});

const TopGenresPerYearModel = mongoose.model('topGenresPerYear', topGenresSchema);

const allTimeGenrePositions = new Schema({
	id: String,
	data: [
		{
			x: Number,
			y: Number,
		},
	],
});

const AllTimeGenrePositionsModel = mongoose.model('allTimeGenresPositions', allTimeGenrePositions);

module.exports = {
	db,
	TopGenresPerYearModel,
	AllTimeGenrePositionsModel,
};
