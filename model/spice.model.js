var fs = require('fs-extra');
var path = require('path');
module.exports = function(dataPath) {
	this.dataPath = dataPath || path.resolve(__dirname, '../data/spices.json');
	dataPath = this.dataPath;
	this.add = function(newData) {
		this.getLocalData(function(err, spices){
			if (err) {
				console.log(err);
				return;
			}
			var maxId = getMaxId(spices);
			newData.id = maxId + 1;
			spices.push(newData);
			updateFile(spices, function(err) {
				if (err) {
					console.log(err);
					return;
				}
				console.log('update local spices.json ok');
			});
		});
	}

	this.getLocalData = function(callback) {
		fs.readJson(this.dataPath, function(err, spices) {
			if (err) {
				console.error();
				callback('readJson error: ' + err);
			}
			callback(null, spices);
		});
	}

	function getMaxId(spices) {
		var ids = [];
		spices.forEach(function(spice){
			ids.push(spice.id);
		})
		return ids.sort(function(a, b) {
		  return a - b;
		})[ids.length-1];
	}
	function updateFile(spices, callback) {
		fs.writeJson(dataPath, spices, function(err) {
			if (err) {
				callback('update file , writeJson error: ' + err);
				return;
			}
			callback(null);
		})
	}

	return this;
}