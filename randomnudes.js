var RandomNudes = (function() {

	function create(graph) {
		let _author = "" + randomFrom(graph["authors"]);
		
		let _message = [];
		let _word = "" + randomFrom(graph[_author]["start"]);

		while (_word != "END" && _message.length < 50) {
			_message.push(_word);
			_word = randomFrom(graph[_author]["words"][_word]);
		}
		
		return { author: _author, message: _message.join(" "), color: graph[_author]["color"]};
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
		create: create
	}

})();

$(document).ready(function() {
	jQuery.getJSON("http://raw.githubusercontent.com/andvagorion/andvagorion.github.io/master/nevernudes.json", function(graph) {
		
		for (let i = 0; i < 25; i++) {
			let ul = document.createElement("ul");

			let msg = RandomNudes.create(graph);
			let li = document.createElement("li");
			let author = document.createElement("div");
			author.className = "author";
			author.innerHTML = msg.author;
			
			author.style.color = "" + msg.color;
			li.appendChild(author);

			let message = document.createElement("div");
			message.innerHTML = msg.message;
			li.appendChild(message);

			ul.appendChild(li);
			document.body.appendChild(ul);
		}

	});

});