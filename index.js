var express	= require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	session = require('express-session'),
	//methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	port = process.env.PORT||1050;
	app.use(express.static('./public/app'));
	app.use(cookieParser());
	//app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(bodyParser.raw());
	app.use(session({
		secret: 'secrettexthere',
		saveUninitialized: true,
		resave: true,
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	require('./Model/dbConnection');
	require('./Routes/passport')(passport);
	require('./Routes/order')(app, passport);
	//require('./Routes/passportUser')(passport);
	require('./Routes/AuthUser')(app, passport);


	


	app.listen(port, function(){
		console.log('server running on port:', port);
	});