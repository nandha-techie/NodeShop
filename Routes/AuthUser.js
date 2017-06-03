var Admin = require('../Model/Admin'),
	Users = require('../Model/Users'),
	moment	=	require('moment'),
	Multiparty	=	require('connect-multiparty'),
	//_ =	require("underscore"),
	fs = require('fs'),
	bcrypt = require('bcrypt-nodejs'),
	//gm = require('gm'),
	gm = require('gm').subClass({ imageMagick: true }),
	Async =	require("async"),
	path = require('path'),
	exec = require('child_process').exec,
	imagemagick = require('imagemagick'),
	multipart =	Multiparty();

module.exports = function(app, passport) {

	app.get('/previewAll', function(req, res, next) {
        res.status(200).json({success: 'Logout successfully'});
    });

    app.post('/signup', function(req, res, next){
    	var data = req.body;
    	var password = Users.generateHash(data.password);
    	Async.waterfall([
    		function(callback){ Users.findOne({email: data.email}).exec(function(err, user){ callback(err, user);}); },
    		function(user, callback){
    			if(user) callback({ statusCode: 409, message: "Email Already Registered", });
    			else{
    				Users.create({ name: data.name, email: data.email, phone: data.phone, password: password, status: true, }, function(err, user){
    					callback(err, user);
    				});
    			}
    		},	
    	],
			function(err, user){
				if(err) return res.status((err.statusCode != undefined) ? err.statusCode : 400).json({ status: false, error: err.message, });
				else return res.status(200).json({ status: true, data: user });
			}
    	);
    });

}