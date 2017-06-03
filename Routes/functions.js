




LocalFunctions.mkDirNotExists = function(array){
	_.each(array, function(item, index){
		if(!fs.existsSync(item)){ fs.mkdirSync(item, 755); }; // create path if not exists
		exec('sudo chmod 755 -R ' + item);
	});
};