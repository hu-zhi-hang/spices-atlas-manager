require('expose?$!expose?jQuery!jquery');
require("bootstrap-webpack");
var spices = require('./data/spices.json');
var Vue = require('vue');
var curSpiceModel = {
	name: {
		cn: '',
		py4Filter: '',
		pinyin: '',
		en: ''
	},
	pic: []
};

var vm = new Vue({
	el: '#app',
	data: {
		spices: spices,
		filter_keywords: '',
		curSpice: curSpiceModel,
		editStatus: {
			text: '正在添加',
			isAdding: true	
		},
		pinyinRes: [],
		pinyinRes_filter: ""
	},
	methods: {
		choseSpice: function(id) {
			for (var i=0; i < spices.length; i++) {
				if (spices[i].id === id) {
					this.curSpice = spices[i];
					this.editStatus.text = '正在编辑 - '+ spices[i].name.cn + ' id = '+id;
					this.editStatus.isAdding = false;
					break;
				}
			}
		},
		choseAdd: function() {
			this.editStatus.isAdding = true;
			this.editStatus.text = '正在添加';
			this.curSpice = curSpiceModel;
		},
		submit: submit,
		getPinyin: function(e) {
			e.preventDefault();
			getPinyin(function(res) {
				vm.pinyinRes = res.pinyin;
				vm.pinyinRes_filter = res.py4Filter.join("");
			});
		}
	},
	ready: function() {
		var $file_upload = $(".picFile");
		$file_upload.change(function(){
			var oFile = $(this).get()[0].files[0];
			var filedata = new FormData();
			filedata.append('picture', oFile);
			$.ajax({
		        url: '/addpic',
		        type: 'POST',
		        data: filedata,
		        cache: false,
		        dataType: 'json',
		        processData: false,
		        contentType: false,
		        success: function(res) {
		        	console.log(res);
		        },
		        error: function(res) {
		        	(typeof vm.curSpice.pic == 'undefined') && (vm.curSpice.pic = []);
					vm.curSpice.pic.push({
						"url": res.responseText,
						"desc": ""
					});
		        }
			})
		})
	}
})

function submit(e) {
	e.preventDefault();
	var $spice_form = $('.spice_form');
	var data = curSpiceModel;
	var formdata = $spice_form.serializeArray();
	data.name.cn = getFormValue('cn_name', formdata);
	data.name.en = getFormValue('en_name', formdata);
	data.name.pinyin = getFormValue('pinyin', formdata, true);
	data.name.py4Filter = getFormValue('py4Filter', formdata);
	data.name.nickname = getFormValue('nick_name', formdata);
	data.pic = vm.curSpice.pic;
	data.id = vm.curSpice.id;
	
	
	var data = JSON.stringify(vm.curSpice);
	var action = vm.isAdding ? '/add' : '/update';
	$.ajax({
		url: action,
		type: 'post',
		dataType: 'json',
		data: 'spice=' + data,
		success: function(res){
			if (res.success) {
				alert('update success!!');
				location.reload();
			} else {
				console.log(res.error);
				alert('update error, check console');
			}
		}
	})
}

function getFormValue(key, src, isArray) {
	isArray || (isArray = false);
	var resArray = [];
	for (var i = 0; i < src.length; i++) {
		if (src[i].name.indexOf(key) != -1) {
			if (!isArray) {
				return src[i].value;
			} else {
				resArray.push(src[i].value);
				continue;
			}
		}
	}
	return resArray;
}
//type: 0,带音标;1,不带音标
function getPinyin(callback) {
	
	$.ajax({
		type: "get",
		dataType: "json",
		url: "/pinyin",
		data: {
			words: $("#cnName").val()
		},
		success: function(res) {
			callback(res);
		},
		error: function(err) {
			console.error(err);
		}

	})
}