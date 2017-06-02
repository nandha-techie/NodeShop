var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var Admin = require('../Model/Admin');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		console.log('serializeUser ');
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
		 	//console.log('email ', email,' password ',password);
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
};
