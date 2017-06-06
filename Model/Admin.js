var mongoose = require('mongoose'),
	validators 		=	require('mongoose-validators'),
	bcrypt = require('bcrypt-nodejs'),
	Schema 		=	mongoose.Schema;

	AdminSchema	=	new Schema({
		firstname: {
			type: String,
			required: true, /*Null not allow*/
			validate: [
				validators.isLength(3, 100), /*validate length is between 3 to 25*/
			],
		},
		lastname: {
			type: String,
			required: true, /*Null not allow*/
			validate: [
				validators.isLength(3, 25), /*validate length is between 3 to 25*/
			],
		},
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
			index: {
				unique: true, /*unique validation/index*/
			},
			validate: [
				validators.isEmail(), /*validate is email*/
			],
		},
		password: {
			type: String,
			required: true, /*Null not allow*/
			// validate: [validators.isLength(8, 25), /*validate length is between 8 to 25*/],
		},
		isAdmin: {
			type: Boolean,
			default: true,
		},
		type:{
			type:String,
			default:'admin'
		},
	}, {
		collection: 'admin', // table name
		toObject: {
			virtuals: true, // enable virtual fields
		},
		toJSON: {
			virtuals: true, // enable virtual fields
		},
	});

	AdminSchema.methods.generateHash = function(password) {
		console.log('password '+password);
		return bcrypt.hashSync(password,bcrypt.genSaltSync(8), null);
	};

	AdminSchema.methods.validPassword = function(password, dbpass) {
		console.log('pass '+password+' dbpass '+dbpass);
		return bcrypt.compareSync(password, dbpass);
	};

module.exports=mongoose.model('admin',AdminSchema);


