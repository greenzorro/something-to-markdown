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
	hidden.find("a").each(function () {  //清除锚链接
		if(!$(this).attr("href") || $(this).attr("href")[0] == "#"){  //如果不带链接地址、或者只有锚链接，就删除该a标签
			$(this).remove();
		}
	})
	hidden.find("hr").remove();  //清除分隔线
	hidden.find("canvas").remove();  //清除canvas
	hidden.find("noscript").remove();  //清除noscript
	hidden.find("hr").remove();  //清除分隔线
	hidden.find("br").replaceWith(" ");  //换行符转换为空格
	hidden.find("figure img").wrap("<p></p>");  //figure内的图片，包裹p标签
	hidden.find("figcaption").each(function () {  //figcaption转换为em标签
		$(this).replaceWith("<em>" + $(this).html() + "</em>");
	})
	hidden.find("sup").each(function () {  //sup转换为em标签
		$(this).replaceWith("<em>" + $(this).html() + "</em>");
	})
	hidden.find("sub").each(function () {  //sub转换为em标签
		$(this).replaceWith("<em>" + $(this).html() + "</em>");
	})
	hidden.find("small").each(function () {  //small转换为em标签
		$(this).replaceWith("<em>" + $(this).html() + "</em>");
	})
	hidden.find("center").each(function () {  //center转换为em标签
		$(this).replaceWith("<em>" + $(this).html() + "</em>");
	})
	hidden.find("q").each(function () {  //q转换为blockquote标签
		$(this).replaceWith("<blockquote>" + $(this).html() + "</blockquote>");
	})

	// 清除medium文章中的缩略图
	hidden.find("img").each(function () {
		if ($(this).attr("src") && $(this).attr("src").indexOf("medium") > 0 && $(this).attr("src").indexOf("freeze") > 0) {
			$(this).remove();
		}
	})

	// invision中的图片注解转换为em标签
	hidden.find(".wp-caption-text").each(function () {
		$(this).replaceWith("<p><em>" + $(this).html() + "</em></p>");
	})

	// invision中的Tweeter引用转换为blockquote
	hidden.find(".inv-tweet-sa").each(function () {
		$(this).wrap("<blockquote></blockquote>");
	})

	clearNestedTag("header,footer,hgroup,figure,span,div,section,article,details,main");  //清除可嵌套的标签
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
}
