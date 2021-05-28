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

const TopGenresPerYear = mongoose.model('topGenresPerYear', topGenresSchema);

module.exports = {
	db,
	TopGenresPerYear,
};
