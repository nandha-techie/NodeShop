var LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook').Strategy;
var bcrypt = require('bcrypt-nodejs');
// var Admin = require('../Model/Admin');
var Users = require('../Model/Users');

module.exports = function(passport) {
	passport.serializeUser(function(user, authuser) {
		// console.log(user);
		authuser(null, user.id);
	});
	
	passport.deserializeUser(function(id, authuser) {
		// console.log(id);
		Users.findById(id ,function(err, user) {
			authuser(err, user);
		});
	});

passport.use('local-userLogin', new LocalStrategy({
			usernameField:'email',
			passwordField:'password',
			passReqToCallback:true
	 },
	 function(req,email,password,authuser) {
	 	//console.log(email);
	 	Users.findOne({ email: email }, function(err, user) {
	 		if(err){
	 			return authuser(err);
                //throw err
            }
            var UsersObj = new Users();
            var actual ;
            if (user != null){
             actual = UsersObj.validPassword(password, user.password);
            }
	 		if(!actual){
	 			return authuser(null, false);
            }else{
            	//console.log(user);
            	//console.log(user);
             	return authuser(null, user);
            } 
	 	});
	}));

}