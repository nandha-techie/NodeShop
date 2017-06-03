var mongoose = require('mongoose'),
	validators 		=	require('mongoose-validators'),
	bcrypt = require('bcrypt-nodejs'),
	Schema 		=	mongoose.Schema;

	UsersSchema = new Schema({
		name: {
			type: String,
			required: true, /*Null not allow*/
			validate: [
				validators.isLength(3, 100), /*validate length is between 3 to 25*/
			],
		},
		email: {
			type: String,
			required: true, /*Null not allow*/
		},
		phone: {
			type: Number,
			required: true, /*Null not allow*/
		},
		password: {
			type: String,
			required: true, /*Null not allow*/
		},
		status: {
			type: Boolean,
			default: true,
		},
	}, {
		collection: 'users', // table name
		toObject: {
			virtuals: true, // enable virtual fields
		},
		toJSON: {
			virtuals: true, // enable virtual fields
		},
	});

	UsersSchema.methods.generateHash=function(password) {
		console.log('password '+password);
		return bcrypt.hashSync(password,bcrypt.genSaltSync(8), null);
	};

	UsersSchema.methods.validPassword = function(password, dbpass) {
		console.log('pass '+password+' dbpass '+dbpass);
		return bcrypt.compareSync(password, dbpass);
	};
	
module.exports = mongoose.model('users', UsersSchema);


