$(function () {
    $(".something textarea").keyup(function(){  //keyup事件处理 
    	convertToMarkdown();
    }).bind("paste",function(){  //CTR+V事件处理 
    	convertToMarkdown();
    });
    convertToMarkdown();  //转换默认文本
})


// 将html转换为markdown，写入右边的框
function convertToMarkdown () {
	var source = $(".something textarea");
	var target = $(".markdown textarea");
	target.html(toMarkdown(clearRichHtml(source.val())));
	$(".hidden").html("");
}

// 清除富文本中的特殊html标签
function clearRichHtml (node) {
	var hidden = $(".hidden");
	hidden.html(node);
	hidden.find("div").each(function () {  //读取写在背景中的图片，转换成img标签
		if ($(this).css("background-image") != "none" && $(this).css("background-image").length > 0) {
			var imgUrl = $(this).css("background-image").split("url(")[1].split(")")[0];
			$(this).prepend("<p><img src='" + imgUrl + "' /></p>");
		};
	})
	hidden.html(hidden.html().replace(/\t/g,""));  //清除制表符
	hidden.find("a").each(function () {  //清除锚链接
		if(!$(this).attr("href") || $(this).attr("href")[0] == "#"){  //如果不带链接地址、或者只有锚链接，就删除该a标签
			$(this).remove();
		}
	})
	removeTag("hr,canvas,noscript");  //清除标签
	wrapTag("figure,figcaption","p");  //包裹p标签
	transformTag("br","<p> ","</p>");  //转换为p标签
	transformTag("q","<blockquote>","</blockquote>");  //转换为blockquote标签
	transformTag("center,figcaption","<p><em>","</em></p>");  //转换为em标签

	// 清除空的em标签
	hidden.find("em").each(function () {
		if ($(this).html() == "") {
			$(this).remove();
		}
	})
	// 清除多余的嵌套em标签
	hidden.find("em em").each(function () {
		$(this).replaceWith($(this).html());
	})

	// 清除medium文章中的缩略图
	hidden.find("img").each(function () {
		if ($(this).attr("src") && $(this).attr("src").indexOf("medium") > 0 && $(this).attr("src").indexOf("freeze") > 0) {
			$(this).remove();
		}
	})

	// invision
	transformTag(".wp-caption-text","<p><em>","</em></p>");  //图片注解转换为em标签
	wrapTag(".inv-tweet-sa","blockquote");  //Tweeter引用转换为blockquote

	// 清除无用标签
	clearNestedTag("header,footer,hgroup,figure,span,div,section,article,details,main,cite,sup,sub,small");
	hidden.html(hidden.html().replace(/<!--[\w\W\r\n]*?-->/gmi, ''));  //清除注释
	return hidden.html();

	// 清除可嵌套的标签，保留标签内容，标签名为字符串，用“,”分隔
	function clearNestedTag (tagName) {
		var tagList = tagName.split(",");  //将标签列表分成数组
		for (var i = 0; i < tagList.length; i++) {  //依次处理每个标签
			while(hidden.find(tagList[i]).length > 0){  //反复循环直到清除所有相同标签
				hidden.find(tagList[i]).each(function () {
					$(this).replaceWith($(this).html());  //清除标签，保留内容
				})
			}
		};
	}

	// 处理多种标签，提取其内容，用特定标签包裹，用“,”分隔
	function transformTag(tagName, tagHead, tagTail) {
		var tagList = tagName.split(",");  //将标签列表分成数组
		for (var i = 0; i < tagList.length; i++) {  //依次处理每个标签
			hidden.find(tagList[i]).each(function () {  //清除标签，保留内容，包裹新的标签
				$(this).replaceWith([tagHead, $(this).html(), tagTail].join(""));
			})
		};
	}

	// 清除多种标签，用“,”分隔
	function removeTag(tagName) {
		var tagList = tagName.split(",");  //将标签列表分成数组
		for (var i = 0; i < tagList.length; i++) {  //依次处理每个标签
			hidden.find(tagList[i]).remove();
		};
	}

	// 包裹多种标签，用“,”分隔
	function wrapTag(tagName, wrap) {
		var tagList = tagName.split(",");  //将标签列表分成数组
		for (var i = 0; i < tagList.length; i++) {  //依次处理每个标签
			hidden.find(tagList[i]).wrap(["<", wrap, "></", wrap, ">"].join(""));
		};
	}
}
