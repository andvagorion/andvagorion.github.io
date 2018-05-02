var RandomNudes = (function() {

	function create(graph) {
		let _author = "" + randomFrom(graph["authors"]);
		
		let _message = [];
		let _word = "" + randomFrom(graph[_author]["start"]);

		while (_word != "END" && _message.length < 50) {
			_message.push(_word);
			_word = randomFrom(graph[_author]["words"][_word]);
		}
		
		return _author + ": " + _message.join(" ");
	}

	function randomFrom(obj) {
		let _max = 0;
		for (let e in obj) {
			_max += obj[e];
		}
		let _rnd = getRandomIntInclusive(0, _max);
		for (let e in obj) {
			_rnd -= obj[e];
			if (_rnd <= 0) {
				return e;
			}
		}

		return "END";
	}

	//The maximum is inclusive and the minimum is inclusive
	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	return {
		init: init,
		create: create
	}

})();

$(document).ready(function() {
	
	jQuery.getJSON("http://raw.githubusercontent.com/andvagorion/andvagorion.github.io/master/nevernudes.json", function(graph) {

		console.log("test");
		document.body.innerHTML = RandomNudes.create(graph);

	});

});