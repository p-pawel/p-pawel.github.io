var data;
var question;
var expected = [];
var questionsTotal;
var questionsDone;
var timeStart;
var timeEnd;
var questionsWrongly = {};

$(function() {

	$("#restart").click(function() {
		restart();
	});

	$("#start").click(function() {
		localStorage.setItem("data", $("#data").val());
		data = JSON.parse($("#data").val());
		$("#setup").hide();
		$("#quiz").show();
		shuffle(data);
		questionsTotal = data.length;
		questionsDone = 0;
		timeStart = new Date().getTime();
		questionsWrongly = {};
		next();
	});
	
	$("#clean").click(function() {
		localStorage.removeItem("data");
		location.reload();
	})

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
				console.log(errors);
				if (errors == 0) {
					$("#next").show();
				}
				if (errors > 0) {
					questionsWrongly[$("#question").text()] = true;
				}
			});

	restart();
});

function markAnswer(no, state) {
	$("#answers label[data-no=" + no + "] ").addClass(
			state ? "alert-success" : "alert-danger").removeClass(
			!state ? "alert-success alert-info" : "alert-danger alert-info");
}

function restart() {
	$("#setup").show();
	$("#quiz").hide();
	$("#done").hide();

	if (localStorage.getItem("data") != null) {
		$("#data").val(localStorage.getItem("data"));
	}
}

function next() {
	$("#next").hide();
	$("#question").text("");
	$("#answers").text("");

	question = data.pop();
	if (question == null) {
		$("#quiz").hide();
		$("#done").show();
		timeEnd = new Date().getTime();
		var elapsedSeconds = Math.floor((timeEnd - timeStart) / 1000)%60;
		var elapsedMinutes = Math.floor((timeEnd - timeStart) / 60000);
		var totalWrong = Object.keys(questionsWrongly).length;
		$("#result").html("Time: " + elapsedMinutes + " min " + elapsedSeconds + " s");
		$("#result").append("<br/>Good: " + (questionsTotal - totalWrong)+ " <br/>");
		$("#result").append("Bad: " + (totalWrong) + " <br/>");
		var percent = Math.floor(100*(questionsTotal - totalWrong)/(questionsTotal));
		$("#result").append("Result: " + percent +"% <br/>");

		var wrongs = $("<ul class='list-group'></ul>");
//		wrongs.append($("<li class='list-group-item active'>Incorrect answers to questions:</li>"));
		Object.keys(questionsWrongly).forEach(function(q) {
			wrongs.append($("<li class='list-group-item'>"+q+"</li>"));
		});
		
		$("#wrongs").html(wrongs);
		
		if (totalWrong>0) {
			$("#incorrects").show();
		} else {
			$("#incorrects").hide();
		}
		return;
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

	$("#progress").css("width", (100 * questionsDone / questionsTotal) + "%");
	questionsDone++;

};

// + Jonas Raoni Soares Silva
// @ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) { // v1.0
	for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
		;
	return o;
};

