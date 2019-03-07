

function tabbar() {
	this.subpages = []; //页面的html
	this.tabBarTitles = []; //标题名
	this.tabBarSelectImages = []; //选中的图片
	this.tabBarUnSelectImages = []; //未选中的图片
	this.tabBarSelectTextColor = []; //选中的文本颜色
	this.tabBarUnSelectTextColor = []; //未选中的文本颜色
	this.defaultSelectIndex = 0; //默认选中的索引
	var subpage_style = {
		top: '0px',
		bottom: '51px'
	};
	var aniShow = {};
	var aArr = []; //a标签数组
	var imgArr = []; //img标签数组
	var labelSpanArr = []; //span标签数组
	
	this.init = function() { //添加视图
		var nav = document.querySelector("nav");
		for(var i = 0; i < tabbar.subpages.length; i++) {
			var a = document.createElement("a");
			a.className = "mui-tab-item mui-active";
		    a.href = tabbar.subpages[i];
			a.id = i;
			aArr.push(a);
			nav.appendChild(a);
			
			var span = document.createElement("span");
			span.className = "mui-icon";
		    	var img = document.createElement("img");
		    img.width = "20";
		    img.height = "20";
		    	if(i == tabbar.defaultSelectIndex) {
		    		img.src = tabbar.tabBarSelectImages[i];
			}else {
		    		img.src = tabbar.tabBarUnSelectImages[i];
			}
			imgArr.push(img);
			span.appendChild(img);
			a.appendChild(span);
 
			var span2 = document.createElement("span");
			span2.className = "mui-tab-label";
			span2.innerHTML = tabbar.tabBarTitles[i];
			if(i == tabbar.defaultSelectIndex) {
				span2.style.color = tabbar.tabBarSelectTextColor[i];
			}else {
				span2.style.color = tabbar.tabBarUnSelectTextColor[i];
			}
			labelSpanArr.push(span2);
			a.appendChild(span2);
		}
	}
 
	this.showTabBar = function() {
		//创建子页面，首个选项卡页面显示，其它均隐藏；
		mui.plusReady(function() {
			var self = plus.webview.currentWebview();
			for(var i = 0; i < tabbar.subpages.length; i++) {
				var temp = {};
				var sub = plus.webview.create(tabbar.subpages[i], tabbar.subpages[i], subpage_style);
				if(i == tabbar.defaultSelectIndex) {
					temp[tabbar.subpages[i]] = "true";
					mui.extend(aniShow, temp);
				} else {
					sub.hide();
				}
				self.append(sub);
			}
		});
		//当前激活选项
		var activeTab = tabbar.defaultSelectIndex;
		//选项卡点击事件
		mui('.mui-bar-tab').on('tap', 'a', function(e) {
			var targetTab = this.getAttribute('href');
			var id = this.getAttribute('id');
			if(targetTab == id) {
				return;
			}
			for (var i=0; i<labelSpanArr.length; i++) {
				var label = labelSpanArr[i];
				label.style.color = tabbar.tabBarUnSelectTextColor[i];
				var img = imgArr[i];
				img.src = tabbar.tabBarUnSelectImages[i];
			}
			labelSpanArr[id].style.color = tabbar.tabBarSelectTextColor[id];
			imgArr[id].src = tabbar.tabBarSelectImages[id];
 
			//显示目标选项卡
			//若为iOS平台或非首次显示，则直接显示
			if(mui.os.ios || aniShow[targetTab]) {
				plus.webview.show(targetTab);
			} else {
				//否则，使用fade-in动画，且保存变量
				var temp = {};
				temp[targetTab] = "true";
				mui.extend(aniShow, temp);
				plus.webview.show(targetTab, "fade-in", 300);
			}
			//隐藏当前;
			plus.webview.hide(activeTab);
			//更改当前活跃的选项卡
			activeTab = id;
		});
	}
}