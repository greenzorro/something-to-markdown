$(function () {

	toHtml();
	toRich();
	toDouban();

})


// markdown to html
function toHtml () {
	var plain = $(".something .plain_text");
	$(".to_html").click(function () {
		var markdown = $(".markdown .text").val();
		plain.html(MarkdownToHtml(markdown));
		typeSwitch("plain");
	})
}

// markdown to rich text
function toRich () {
	var rich = $(".something .rich_text");
	$(".to_rich").click(function () {
		var markdown = $(".markdown .text").val();
		rich.html(MarkdownToHtml(markdown));
		typeSwitch("rich");
	})
}

// markdown to douban
function toDouban () {
	var rich = $(".something .rich_text");
	$(".to_douban").click(function () {
		var markdown = $(".markdown .text").val();
		rich.html(MarkdownToHtml(markdown));
		rich.find("h2").each(function () {
			$(this).replaceWith("<p>【" + $(this).html() + "】</p>");
		})
		rich.find("h3").each(function () {
			$(this).replaceWith("<p>[" + $(this).html() + "]</p>");
		})
		rich.find("a").each(function () {
			$(this).replaceWith($(this).html());
		})
		rich.find("img").each(function (index) {
			$(this).replaceWith("<p><图片" + parseInt(index+1) + "></p>");
		});
		rich.find("b").each(function () {
			$(this).replaceWith($(this).html());
		})
		rich.find("strong").each(function () {
			$(this).replaceWith($(this).html());
		})
		rich.find("i").each(function () {
			$(this).replaceWith($(this).html());
		})
		rich.find("em").each(function () {
			$(this).replaceWith($(this).html());
		})
		rich.find("hr").each(function () {
			$(this).remove();
		})
		rich.find("blockquote").each(function () {
			$(this).replaceWith($(this).html());
		})
		rich.find("ol").each(function () {
			var content = "";
			$(this).find("li").each(function (index) {
				content = content + parseInt(index+1) + ". " + $(this).html() + "<br>";
			})
			$(this).replaceWith("<p>" + content + "</p>");
		})
		rich.find("ul").each(function () {
			var content = "";
			$(this).find("li").each(function () {
				content = content + "· " + $(this).html() + "<br>";
			})
			$(this).replaceWith("<p>" + content + "</p>");
		})
		typeSwitch("rich");
	})
}


// switch between plain text and rich text
function typeSwitch (type) {
	switch(type){
		case "plain":
			$(".something .text").hide();
			$(".something .plain_text").show();
			break;
		case "rich":
			$(".something .text").hide();
			$(".something .rich_text").show();
			break;
		default:
			break;
	}
}


// convert markdown to html
function MarkdownToHtml (markdown) {
	var converter = new Showdown.converter();
	return converter.makeHtml(markdown);
}


