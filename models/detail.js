const mongoose = require('mongoose');
const Schema = mongoose.Schema;

detailSchema = new Schema( {
	Name: String,
	image1:String,
	added_date:{
		type: Date,
		default: Date.now
	}
}),
Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;