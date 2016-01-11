var fs = require('fs-extra');
var editStart = require('./edit');
var path = require('path');
var dataPath = path.resolve(__dirname, '../spices-atlas/data/spices.json');
var localDataPath = path.resolve(__dirname, './data/spices.json');

//查找data.js
fs.exists(dataPath, initer);

function initer(exists){
	if (!exists) {
		console.log('can\'t find data in ' + dataPath);
		return;
	}
	console.log('find data ok');
	//将data copy过来
	fs.copy(dataPath, localDataPath, function(err){
		if (err) return console.error('copy data error: ' + err);
  		console.log('copy data ok');
  		//启动服务器
  		editStart();
	})
}