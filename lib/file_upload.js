var qiniu = require('qiniu');
var path = require('path');
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
	upload : function(files) {
			var extra = new qiniu.io.PutExtra();
			  //extra.params = params;
			  //extra.mimeType = mimeType;
			  //extra.crc32 = crc32;
			  //extra.checkCrc = checkCrc;
			files.map(function(file, index, origin_files) {
				var filePath = path.resolve(path.dirname(__dirname), 'public/'+file.url);
				qiniu.io.putFile(uptoken, prefix + path.basename(file.url), filePath, extra, function(err, ret) {
					if(!err) {
					  // 上传成功， 处理返回值
					  console.log('image upload ok...', ret.key, ret.hash);
					  file.url = 'http://7xlxdo.com1.z0.glb.clouddn.com/'+ret.key;
					  return file;
					  // ret.key & ret.hash
					} else {
					  // 上传失败， 处理返回代码
					  console.log(err);
					  // http://developer.qiniu.com/docs/v6/api/reference/codes.html
					}
				});
			})
	}
}

