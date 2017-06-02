var express	= require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	port = process.env.PORT||1050;
	app.use(express.static('./public/app'));
	//app.use(express.static('./public/app/BE_assets/uploads'));

	app.use(bodyParser.json());
	
	app.use(passport.initialize());
	app.use(passport.session());

	require('./Model/dbConnection');
	require('./Routes/passport')(passport);
	require('./Routes/order')(app, passport);


	


	app.listen(port,function(){
		console.log('server running on port:', port);
	});