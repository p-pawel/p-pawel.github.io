var data;
var question;
var expected = [];
var questionsTotal;
var questionsDone;

$(function() {

	$("#quiz").hide();
	$("#done").hide();
	
	if (localStorage.getItem("data") != null) {
		$("#data").val(localStorage.getItem("data"));
	}

	$("#start").click(function() {
		$(this).hide();
		$("#data").hide();
		localStorage.setItem("data", $("#data").val());
		data = JSON.parse($("#data").val());
		$("#setup").hide();
		$("#quiz").show();
		shuffle(data);
		questionsTotal = data.length;
		questionsDone = 0;
		next();
	});

	$("#next").click(function() {
		next();
	});

	$("#check").click(
			function() {
				var actual = [];
				$("#answers input:checked").each(function() {
					actual.push($(this).data("no"))
				});
				console.log(actual);
				var errors = 0;
				$("#answers label").removeClass("alert-success alert-danger")
						.addClass("alert-info");
				expected.forEach(function(val) {
					if (actual.indexOf(val) >= 0) {
						markAnswer(val, true);
					} else {
						markAnswer(val, false);
						errors++;
					}
				});
				actual.forEach(function(val) {
					if (expected.indexOf(val) >= 0) {
						markAnswer(val, true);
					} else {
						markAnswer(val, false);
						errors++;
					}
				});
				if (errors == 0) {
					$("#next").show();
				}
			});
});

function markAnswer(no, state) {
	$("#answers label[data-no=" + no + "] ").addClass(
			state ? "alert-success" : "alert-danger").removeClass(
			!state ? "alert-success alert-info" : "alert-danger alert-info");
}



function next() {
	$("#next").hide();
	$("#question").text("");
	$("#answers").text("");

	question = data.pop();
	if (question==null) {
		$("#quiz").hide();
		$("#done").show();
	}
	$("#question").html(question.question);
	var i = 1;

	expected = [];
	shuffle(question.answers);

	question.answers.forEach(function(entry) {
		console.log(entry);
		var text = entry;
		if (text[0] === '*') {
			expected.push(i);
			text = text.substring(1);
		}
		$("#answers").append(
				"<li><label class='answer alert alert-info'  data-no=" + i
						+ "  for='answer" + i
						+ "'><input type='checkbox' data-no=" + i
						+ " id='answer" + i + "'>" + text + "</label></li>");
		i++;
	});
	
	$("li").change(function() {
		$(this).find("label").toggleClass("selected");
	});
	
	$("#progress").css("width",(100*questionsDone/questionsTotal)+"%");
	questionsDone++;
	


};

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};
