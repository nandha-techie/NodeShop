var mongoose = require('mongoose'),
	validators 		=	require('mongoose-validators'),
	bcrypt = require('bcrypt-nodejs'),
	Schema 		=	mongoose.Schema;

	OrdersSchema	=	new Schema({
		name: {
			type: String,
			required: true, /*Null not allow*/
			validate: [
				validators.isLength(3, 25), /*validate length is between 3 to 25*/
			],
		},
		category: {
			type: String,
			required: true, /*Null not allow*/
		},
		original_path: {
			type: String,
			required: true, /*Null not allow*/
		},
		image_path: {
			type: String,
			required: true, /*Null not allow*/
		},
		price: {
			type: Number,
			required: true, /*Null not allow*/
			// validate: [validators.isLength(8, 25), /*validate length is between 8 to 25*/],
		},
		status: {
			type: Boolean,
			default: true,
		},
		description: {
			type: String,
			required: true, /*Null not allow*/
		},
	}, {
		collection: 'products', // table name
		toObject: {
			virtuals: true, // enable virtual fields
		},
		toJSON: {
			virtuals: true, // enable virtual fields
		},
	});

	

module.exports = mongoose.model('products', OrdersSchema);


