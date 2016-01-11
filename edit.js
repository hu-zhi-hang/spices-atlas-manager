var os = require('os');
var path = require('path');
var exec = require('child_process').exec;
var fs = require('fs-extra');
var express = require('express');
var bodyParser = require("body-parser");
var multer  = require('multer');
var file_upload = require('./lib/file_upload.js');
var upload = multer({ dest: 'public/data/imgs/upload/' });
var SpiceModel = require('./model/spice.model.js');
var app = express();

module.exports = function() {
	//run webpack
	console.log('running webpack....');
	exec('webpack --watch', function(err, stdout, stderr) {
		if (err || stderr) {
			console.error('webpack error: ' + err + ';' + stderr);
			return;
		}
		console.log(stdout);
		console.log('webpack ok');
	})
	startServer();
}

function startServer() {
	app.use(express.static('public'));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	app.post('/add', function (req, res) {
	    var postdata = JSON.parse(req.body.spice);
	    var spiceModel = new SpiceModel();
	    //to do deal the picture
	    // console.log(postdata);return;
	    file_upload.upload(postdata.pic);
	    return;
	  	spiceModel.add(postdata);
	});


	app.post('/addpic', upload.single('picture'), function (req, res) {
		var file = req.file;
	    var pic_path = file.path;
	    var new_path = pic_path + file.originalname;
	    fs.move(pic_path, new_path, function(err) {
	    	if (err) {
	    		console.log('rename file error: ' + err);
	    		return;
	    	}
	    	console.log('rename file ok');
	    	var pic_url = new_path.replace('public' + path.sep, '');
	    	res.end(pic_url);
	    })
	});

	var server = app.listen(3000, function () {
		var host = server.address().address;
		var port = server.address().port;
		//the command to open broswer
		var lunch_cmd = 'start http://127.0.0.1:';
		(os.platform() === 'linux') && (lunch_cmd = 'sensible-browser http://127.0.0.1:');

		console.log('local server listening at http://%s:%s', host, port);
		console.log('starting broswer....');
		exec(lunch_cmd + port, function(){
			console.log('broswer started');
		})
	});
}