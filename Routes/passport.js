var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var Admin = require('../Model/Admin');
var Users = require('../Model/Users');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null,user.id);
	});
	
	passport.deserializeUser(function(id, done) {
		Admin.findById(id,function(err, user) {
			done(err, user);
		});
    });
	   
		
		
   /*function validPassword(password,dbpass) {
    console.log('input is '+password+' dbpass '+dbpass);
    var result=bcrypt.compareSync(password,dbpass);
    console.log('inside '+result);
    return result;
   }*/

	passport.use('local-login', new LocalStrategy({
			usernameField:'email',
			passwordField:'password',
			passReqToCallback:true
	 },
	 function(req,email,password,done) {
	 	Admin.findOne({ email: email }, function(err, user) {
	 		if(err){
	 			return done(err);
                //throw err
            }
            var dataExportt = new Admin();
            var actual;
            if (user != null){
             actual = dataExportt.validPassword(password, user.password);
            }
	 		if(!actual){
                //req.message = 'incorrect email id ';
	 			return done(null, false);
            }else{
             	return done(null, user);
            } 
	 	});
	}));

	passport.use('local-userLogin', new LocalStrategy({
			usernameField:'email',
			passwordField:'password',
			passReqToCallback:true
	 },
	 function(req,email,password,done) {
	 	Users.findOne({ email: email }, function(err, user) {
	 		if(err){
	 			return done(err);
                //throw err
            }
            var UsersObj = new Users();
            var actual;
            if (user != null){
             actual = UsersObj.validPassword(password, user.password);
            }
	 		if(!actual){
                //req.message = 'incorrect email id ';
	 			return done(null, false);
            }else{
             	return done(null, user);
            } 
	 	});
	}));
};
