var Admin = require('../Model/Admin'),
	Products = require('../Model/Products'),
	moment	=	require('moment'),
	Multiparty	=	require('connect-multiparty'),
	fs = require('fs'),
	bcrypt = require('bcrypt-nodejs'),
	//gm = require('gm'),
	gm = require('gm').subClass({ imageMagick: true }),
	Async =	require("async"),
	path = require('path'),
	exec = require('child_process').exec,
	imagemagick = require('imagemagick'),
	multipart =	Multiparty();
	var paypal = require('paypal-rest-sdk');

module.exports = function(app, passport) {

	app.get('/adminLogout',function(req, res, next) {
		req.logout();
        res.status(200).json({success: 'Logout successfully'});
    });

	app.post('/cpanel/dashbord',isLoggedIn, function(req, res, next) {
       res.status(200).json({status : true, id:req.user._id, success:'ok'});
    });

	app.get('/cpanel/dashbord',function(req, res, next) {
       res.status(200).json({success: 'logged in successfully'});
    });	

    app.get('/errorlogin',function(req, res, next) {
    	req.logout();
        res.status(401).json({status : false, error: 'Unauthorized Admin'});
    });

	app.post('/cpanel/login', passport.authenticate('local-login',{
        successRedirect:'/cpanel/dashbord',
        failureRedirect:'/errorlogin',
    }));

    app.post('/imageUpload', isLoggedIn, multipart, function(req, res, next){
    	var file = req.files.file, upload = '/uploads/', rootPath = path.join(__dirname, '../public/app' + upload),
			thumbnail = path.join(upload, 'thumbnail/');
			//console.log(thumbnail);
			//console.log(upload);
			//functions.mkDirNotExists([upload, thumbnail,]);
			if(!file) return res.status(400).json({ status: false, error: "Please select Image File", });
			else{
				var originalFilename = file.originalFilename.replace(/ /g,'').replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, ''),
				originalExtension = path.extname(originalFilename).toLowerCase(), extension = ['.jpg', '.png', '.gif', '.jpeg'],
				fileName = moment.utc().format("YYYYMMDDHHmmssSS-") + originalFilename,
				filePath = rootPath + fileName;
				Async.waterfall([
					function(callback){ fs.readFile(file.path, callback); },
					function(fileData, callback){fs.writeFile(filePath, fileData, callback);},
					function(callback){ callback(null);},
					// function(callback){
					// 	console.log(filePath);
						// imagemagick.resize({
					 //          srcPath: filePath,
					 //          dstPath: thumbnail + fileName,
					 //          width:   200
					 //        }, callback);
					 // gm(filePath).resize(20, 20, '%').write(filePath, function(err){
		    //                 callback(err)
      //           		});
      					//fs.writeFile(thumbnail + fileName, path.file, callback);
						//gm(filePath).resize(240, 240).write(thumbnail + fileName, callback);
					//},
				],
					function(err){
						if(err){
							return res.status(400).json({ status: false, error: err.message, });
						}else{
							return res.status(200).json({ status: true, rootPath: filePath, filePath: upload + fileName, fileName: fileName, });
						}
					}
				);	
			}
    });

    app.get('/deleteProduct/:id', isLoggedIn, function(req, res, next){
    	var productId = req.params.id;
    	Async.waterfall([
    		function(callback){ Products.findOne({_id: productId}).exec(function(err, product){ callback(err, product);}); },
    		function(product, callback){
    			if(product){
    				product.set({status: false,}).save(function(err){
	    				callback(err, product);
	    			});
	    		}else callback({ message: req.__("Product Not Found"), statusCode: 404, });
    		},	
    	],
			function(err, product){
				if(err) return res.status((err.statusCode != undefined) ? err.statusCode : 400).json({ status: false, error: err.message, });
				else return res.status(200).json({ status: true, data: product });
			}
    	);
    });

    app.post('/addproduct', isLoggedIn, function(req, res, next){
    	var data = req.body;
    	Products.create({name: data.name, price: data.price, description: data.description, original_path: data.original_path, image_path: data.image_path, category: data.category, }, function(err){
    		if(err) return res.status(400).json({status: false, error: err.message,});
    		else return res.status(200).json({ status: true, message: 'Product Inserted Successfully'});
    	});
    });
    app.get('/productlist', isLoggedIn, function(req, res, next){
    	Products.find({status:true}, function(err, products){
    		//console.log(products);
    		if(err) return res.status(400).json({status: false, error: err.message,});
    		else return res.status(200).json({ status: true, data: products });
    	});
    });
    app.get('/getProductEdit/:id', isLoggedIn, function(req, res, next){
    	var id = req.params.id;
    	Products.findOne({_id: id }, function(err, products){
    		if(err) return res.status(400).json({status: false, error: err.message,});
    		else return res.status(200).json({ status: true, data: products });
    	});
    });
    app.post('/postUpdateProduct', isLoggedIn, function(req, res, next){
    	var data = req.body;
    	Async.waterfall([
    		function(callback){ Products.findOne({_id: data._id}).exec(function(err, product){ callback(err, product);}); },
    		function(product, callback){
    			if(product){
    				product.set({name: data.name, price: data.price, description: data.description, original_path: data.original_path, image_path: data.image_path, category: data.category,}).save(function(err){
	    				callback(err, product);
	    			});
	    		}else callback({ message: req.__("Product Not Found"), statusCode: 404, });
    		},	
    	],
			function(err, product){
				if(err) return res.status((err.statusCode != undefined) ? err.statusCode : 400).json({ status: false, error: err.message, });
				else return res.status(200).json({ status: true, data: product });
			}
    	);
    	
    });
    app.get('/testing', function(req, res){
    	paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
    'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM',
    'headers' : {
		'custom': 'header'
    }
});
  //   	paypal.configure({
		//   'mode': 'sandbox', //sandbox or live
		//   'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
		//    'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM',
		//    'headers' : {
		// 'custom': 'header'
  //   }
		  //'client_id': 'AR7zpxInav-dF2_EhGCtgrxb_Vw78FkqwHxFg0_q7-757lHtu-vZ5jyiQ9XokSTXp7Tt0wc31WplT6Dg',
		  //'client_secret': 'EJoAHVToGOiKacZEI1FMbBEZbUjl0RG5Up7gR000GodBFcrdXUfX-Mxkb1XhkMxQKALuBFTiaBK_ydLo'
		//});
		// var card_data = {
		//   "type": "visa",
		//   "number": "4417119669820331",
		//   "expire_month": "11",
		//   "expire_year": "2018",
		//   "cvv2": "123",
		//   "first_name": "Joe",
		//   "last_name": "Shopper",
		//   "amount": "100"
		// };
		var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "credit_card",
        "funding_instruments": [{
            "credit_card": {
                "type": "visa",
                "number": "4417119669820331",
                "expire_month": "11",
                "expire_year": "2018",
                "cvv2": "874",
                "first_name": "Joe",
                "last_name": "Shopper",
                "billing_address": {
                    "line1": "52 N Main ST",
                    "city": "Johnstown",
                    "state": "OH",
                    "postal_code": "43210",
                    "country_code": "US"
                }
            }
        }]
    },
    "transactions": [{
        "amount": {
            "total": "7",
            "currency": "USD",
            "details": {
                "subtotal": "5",
                "tax": "1",
                "shipping": "1"
            }
        },
        "description": "This is the payment transaction description."
    }]
};

		paypal.creditCard.create(create_payment_json, function(error, credit_card){
		  if (error) {
		    console.log(error);
		    return res.status(400).json({'data' : error, error: true});
		    //throw error;
		  } else {
		    console.log("Create Credit-Card Response");
		    console.log(credit_card);
		    return res.status(200).json({'data' : credit_card, error: false});
		  }
		});
    });
    



/*	app.post('/cpanel/login', function(req, res) {
		var data = {};
		data.name = 'admin';
		data.email = 'admin@shop.com';
		data.password = 'admin123';
		data.firstname = 'admin@shop.com';
		data.lastname = 'admin@shop.com';
		console.log(data);
		Admin.create({name: data.name, email : data.email, password: data.password, firstname: data.firstname, lastname: data.lastname,}, function(err, admin){
			if(err) return res.status((err.statusCode != undefined) ? err.statusCode : 400).json({ status: false, error: err.message, });
			else return res.status(200).json({status: true, data : admin });
		});
		var pass = 'admin123',
		data = bcrypt.hashSync(pass,bcrypt.genSaltSync(8), null);
		return res.status(200).json({status: true, data : data });
	});*/

};
	function isLoggedIn(req, res, next) {
        if(req.isAuthenticated())
            return next();
        else return res.redirect('/errorlogin');
    }

