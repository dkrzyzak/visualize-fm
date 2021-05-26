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

const userSchema = new Schema({
	name: String,
	password: String,
});

const UserModel = mongoose.model('users', userSchema);

module.exports = {
	db,
	UserModel,
};
