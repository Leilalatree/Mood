/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
// 		loginInfo.nickname = loginInfo.nickname || '';
 		loginInfo.password = loginInfo.password || '';
		loginInfo.email = loginInfo.email || '';
		// if (loginInfo.nickname.length < 5) {
		// 	return callback('账号最短为 5 个字符');
		// }

		if (!checkEmail(loginInfo.email)) {
			return callback('邮箱地址不合法');
		}
		if (loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		console.log(loginInfo)
		// var users = JSON.parse(localStorage.getItem('$users') || '[]');
		// 公司：172.16.19.213:5656
		// 学校:172.100.89.127
		mui.ajax('http://172.100.89.127:5656/mood/login', {
			data: loginInfo,
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 80000, //超时时间设置为10秒；
			success: function(data) {
				loginInfo.token = data.token
				var users = JSON.parse(localStorage.getItem('$users') || '[]');
				users.push(loginInfo);
				localStorage.setItem('$users', JSON.stringify(users));
				return callback();
			},
			error: function(xhr, type, errorThrown) {				
				const errorTextObj = xhr.responseText;
				if(errorTextObj){
					const errorText = errorTextObj.error
					mui.alert(errorText, "错误", "OK", null);
					return;
				}
				mui.alert("<网络连接失败，请重新尝试一下>", "错误", "OK", null);
			}
		});
		
		
		var authed = users.some(function(user) {
			return loginInfo.email == user.email && loginInfo.password == user.password;
		});
		
		
		if (authed) {
			return owner.createState(loginInfo.account, callback);
		} else {
			return callback('用户名或密码错误');
		}
	};

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};

	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.nickname = regInfo.nickname || '';
		regInfo.password = regInfo.password || '';
		// regInfo.email = regInfo.email || '';
		if (regInfo.nickname.length < 5) {
			console.log(regInfo.nickname)
			return callback('用户名最短需要 5 个字符');
		}
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}

		mui.ajax('http://172.16.19.213:5656/mood/register', {
			data: regInfo,
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 80000, //超时时间设置为10秒；
			success: function(data) {
				var users = JSON.parse(localStorage.getItem('$users') || '[]');
				users.push(regInfo);
				localStorage.setItem('$users', JSON.stringify(users));
				return callback();
			},
			error: function(xhr, type, errorThrown) {
				
				const errorTextObj = xhr.responseText;
				if(errorTextObj){
					const errorText = errorTextObj.error
					mui.alert(errorText, "错误", "OK", null);
					return;
				}
				mui.alert("<网络连接失败，请重新尝试一下>", "错误", "OK", null);
			}
		});

	};
// 	function postData(url){
// 		mui.ajax('http://172.16.19.213:5656/mood/register', {
// 			data: regInfo,
// 			dataType: 'json', //服务器返回json格式数据
// 			type: 'post', //HTTP请求类型
// 			timeout: 80000, //超时时间设置为10秒；
// 			success: function(data) {
// 				var users = JSON.parse(localStorage.getItem('$users') || '[]');
// 				users.push(regInfo);
// 				localStorage.setItem('$users', JSON.stringify(users));
// 				return callback();
// 			},
// 			error: function(xhr, type, errorThrown) {
// 				
// 				const errorTextObj = xhr.responseText;
// 				if(errorTextObj){
// 					const errorText = errorTextObj.error
// 					mui.alert(errorText, "错误", "OK", null);
// 					return;
// 				}
// 				mui.alert("<网络连接失败，请重新尝试一下>", "错误", "OK", null);
// 			}
// 		});
// 	}

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		//var settings = owner.getSettings();
		//settings.gestures = '';
		//owner.setSettings(settings);
	};

	var checkEmail = function(email) {
		email = email || '';
		return (email.length > 3 && email.indexOf('@') > -1);
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if (!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
	/**
	 * 获取本地是否安装客户端
	 **/
	owner.isInstalled = function(id) {
		if (id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch (e) {}
		} else {
			switch (id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled()
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled()
				default:
					break;
			}
		}
	}
}(mui, window.app = {}));
