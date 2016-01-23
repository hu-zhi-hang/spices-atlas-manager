/**
 * manage image upload
 * current upload to qiniu 
 * qiniu space name: huzhihang
 * 
 */
var qiniu = require('qiniu');
var path = require('path');
var async = require('async');
var ACCESS_KEY = 'NM7jVqtDu8qjCTA0TtE9gXSnDiBIJZStoim1vZXH';
var SECRET_KEY = 'jAgQyfEihQvgwNsWTuECdFCp0JF9Fd5UgvUPglEV';
var prefix = 'spice/';

qiniu.conf.ACCESS_KEY = ACCESS_KEY;
qiniu.conf.SECRET_KEY = SECRET_KEY;
var putPolicy = new qiniu.rs.PutPolicy('huzhihang');
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  //putPolicy.returnBody = returnBody;
  //putPolicy.asyncOps = asyncOps;
  //putPolicy.expires = expires;
var uptoken = putPolicy.token();

module.exports = {
	uptoken : uptoken,
	upload : function(files, cb) {
			var new_files = [];
			var extra = new qiniu.io.PutExtra();
			  //extra.params = params;
			  //extra.mimeType = mimeType;
			  //extra.crc32 = crc32;
			  //extra.checkCrc = checkCrc;
			async.each(files, function(file, callback) {
				var filePath = path.resolve(path.dirname(__dirname), 'public/'+file.url);
				qiniu.io.putFile(uptoken, prefix + path.basename(file.url), filePath, extra, function(err, ret) {
					if(!err) {
					  // 上传成功， 处理返回值
					  console.log('single image upload ok...', ret.key, ret.hash);
					  file.url = 'http://7xlxdo.com1.z0.glb.clouddn.com/'+ret.key;
					  new_files.push(file);
					  callback(null);
					  // ret.key & ret.hash
					} else {
					  // 上传失败， 处理返回代码
					  callback(err);
					  // http://developer.qiniu.com/docs/v6/api/reference/codes.html
					}
				});
			}, function(err) {
				if (err) {
					console.error('error happend while uploading images: ');	
					console.error(err);	
					return;
				}
				cb(new_files);
			})
	}
}

