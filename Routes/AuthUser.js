var Admin = require('../Model/Admin'),
	Users = require('../Model/Users'),
    Products = require('../Model/Products'),
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
        Products.find({}).exec(function(err, products) {
            if(err){
                return res.status((err.statusCode != undefined) ? err.statusCode : 400).json({ status: false, error: err.message, });
            }else res.status(200).json({status: true, data: products});
        });    
    });

	app.get('/errorUserlogin', function(req, res, next) {
		req.logout();
        res.status(401).json({status : false, error: 'Unauthorized User'});
	});

	app.get('/userSuccessLogin', isLoggedIn, function(req, res, next) {
		res.status(200).json({ message: 'Logged in Successfully',});
	});

	app.post('/userLogin', passport.authenticate('local-userLogin', {
        successRedirect:'/userSuccessLogin',
        failureRedirect:'/errorUserlogin',
    }));

    app.post('/signup', function(req, res, next) {
    	var data = req.body;
    	var userObj = new Users();
    	var password = userObj.generateHash(data.password);
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

    app.get('/fbProfile', isLoggedIn, function(req, res){
    	console.log(req.user);
    	res.status(200).json({user: req.user});
    });

    app.get('/facebooklogin/callback', passport.authenticate('facebook',
    	{ successRedirect : '/fbProfile', failureRedirect: '/errorUserlogin' }));

    app.get('/auth/facebook',
  		passport.authenticate('facebook', { scope: ['email'] })
	);
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	else return res.redirect('/errorUserlogin');
}