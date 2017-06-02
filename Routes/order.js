console.log('oooooooorrrrrddd');
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

module.exports = function(app, passport) {

	app.get('/logout',function(req, res) {
		req.logout();
		console.log('llllllllllllll');
        res.json({error: 'logout'});
    });

	app.post('/cpanel/dashbord',isLoggedIn, function(req, res) {
       res.json({id:req.user._id, success:'ok'});
    });

	app.get('/cpanel/dashbord',function(req, res) {
       res.status(200).json({success: 'logged in successfully'});
    });	

    app.get('/errorlogin',function(req, res) {
       res.status(401).json({error: 'auth error'});
    });

	app.post('/cpanel/login', passport.authenticate('local-login',{
        successRedirect:'/cpanel/dashbord',
        failureRedirect:'/errorlogin',
        failureFlash:false
    }));

    app.post('/imageUpload', multipart, function(req, res){
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

    app.post('/addproduct', function(req, res){
    	var data = req.body;
    	Products.create({name: data.name, price: data.price, description: data.description, original_path: data.original_path, image_path: data.image_path, category: data.category, }, function(err){
    		if(err) return res.status(400).json({status: false, error: err.message,});
    		else return res.status(200).json({ status: true, message: 'Product Inserted Successfully'});
    	});
    });
    app.get('/productlist', function(req, res){
    	Products.find({}, function(err, products){
    		//console.log(products);
    		if(err) return res.status(400).json({status: false, error: err.message,});
    		else return res.status(200).json({ status: true, data: products });
    	});
    });
    app.get('/getProductEdit/:id', function(req, res){
    	var id = req.params.id;
    	Products.findOne({_id: id}, function(err, products){
    		if(err) return res.status(400).json({status: false, error: err.message,});
    		else return res.status(200).json({ status: true, data: products });
    	});
    });
    app.post('/postUpdateProduct', function(req, res){
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



/*	app.post('/cpanel/login', function(req, res) {
		var data = {};
		data.name = 'admin';
		data.email = 'admin@shop.com';
		data.password = 'admin@shop.com';
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
	function isLoggedIn(req,res,next) {
        if(req.isAuthenticated())
            return next();
        //res.json({message:'home'});
        return res.redirect('/errorlogin');
    }

