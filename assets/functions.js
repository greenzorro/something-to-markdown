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
	hidden.find("a").each(function () {  //清除锚链接
		if(!$(this).attr("href")){
			$(this).remove();
		}
	})
	hidden.find("hr").each(function () {  //清除分隔线
		$(this).remove();
	})
	hidden.find("figcaption").each(function () {  //清除figcaption
		$(this).replaceWith("<p>" + $(this).html() + "</p>");
	})
	clearNestedTag("header,footer,hgroup,figure,span,div,section,article,details");  //清除可嵌套的标签
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