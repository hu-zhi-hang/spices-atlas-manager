var fs = require('fs-extra');
var path = require('path');
module.exports = function(dataPath) {
	this.dataPath = dataPath || path.resolve(__dirname, '../data/spices.json');
	dataPath = this.dataPath;
	this.add = function(newData, callback) {
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
					callback(err);
					return;
				}
				console.log('update local spices.json ok');
				callback(null);
			});
		});
	}

	this.update = function(newData, callback) {
		this.getLocalData(function(err, spices){
			if (err) {
				console.log(err);
				return;
			}
			var index = getSingleSpice(newData.id, spices);
			spices[index] = newData;
			console.log(newData);
			updateFile(spices, function(err) {
				if (err) {
					callback(err);
					return;
				}
				console.log('update local spices.json ok');
				callback(null);
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
	function getSingleSpice (id, spices) {
		spices.forEach(function(spice, index){
			if (spice.id === id) {
				return index;
			}		
		})
	}

	return this;
}