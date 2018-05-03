var Markov = (function() {

  var tracks = ["Science & Technology", "Research & Education", "Media & Journalism", "Leisure & Lifestyle", "Politics & Society", "Business & Innovation", "Arts & Culture", "Mobility & City"];
  var languages = ["English", "German"];
  var topics = ["Blockchain", "Cancel the Apocalypse", "Smart Cities", "Teens & Kids", "We Can Work It Out", "MEDIA CONVENTION Berlin", "POP", "Tech for Good", "Fe:male Digital Footprint", "GIG (Global Innovation Gathering)", "Music & Sovereignity", "FinTech", "re:learn", "re:health", "Immersive Arts", "Law Lab"];
  var experiences = ["Beginner", "Advanced", "Everyone"];
  var formats = ["Talk", "Workshop", "Discussion"];
  var stages = ["Kids Space", "Lab1886 Truck", "Makerspace indoor", "Makerspace outdoor", "Media Cube", "Meet Up 1", "Meet Up 2", "POP-up Room", "rp:International Space", "Speakers' Corner", "Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5", "Stage 6", "Stage 7", "Stage 8", "Stage 9", "Stage J", "Stage T", "Technikmuseum", "train2re:publica", "Xtra - rp18 side events"];
  var depth = 5;

  function createTimetable() {

    let _sesscal = document.getElementById("content");

    _sesscal.appendChild(createTimeHeader("9:00"));
    _sesscal.appendChild(createSlot("09:00", "09:45"));

    _sesscal.appendChild(createTimeHeader("10:00"));
    _sesscal.appendChild(createSlot("10:00", "11:00"));

    _sesscal.appendChild(createTimeHeader("11:00"));
    _sesscal.appendChild(createSlot("11:00", "11:30"));

    _sesscal.appendChild(createTimeHeader("12:00"));
    _sesscal.appendChild(createSlot("12:00", "13:00"));

    _sesscal.appendChild(createTimeHeader("13:00"));
    _sesscal.appendChild(createSlot("13:00", "13:45"));

    _sesscal.appendChild(createTimeHeader("14:00"));
    _sesscal.appendChild(createSlot("14:00", "15:00"));

    _sesscal.appendChild(createTimeHeader("15:00"));
    _sesscal.appendChild(createSlot("15:00", "16:00"));

    _sesscal.appendChild(createTimeHeader("16:00"));
    _sesscal.appendChild(createSlot("16:00", "16:30"));

    _sesscal.appendChild(createTimeHeader("17:00"));
    _sesscal.appendChild(createSlot("17:00", "17:45"));

    _sesscal.appendChild(createTimeHeader("18:00"));
    _sesscal.appendChild(createSlot("18:00", "18:30"));

  }

  function createTimeHeader(time) {
    let _calgroup = document.createElement("div");
    _calgroup.className = "calgroup";

    let _prev = document.createElement("div");
    _prev.className = "prevhour";
    _prev.innerHTML = "╱╲";
    _calgroup.appendChild(_prev);

    let _time = document.createElement("h3");
    _time.className = "timeslot";
    _time.innerHTML = time;
    _calgroup.appendChild(_time);

    let _next = document.createElement("div");
    _next.className = "nexthour";
    _next.innerHTML = "╲╱";
    _calgroup.appendChild(_next);

    return _calgroup;
  }

	function createSlot(start, end) {

    let _session = document.createElement("div");
    _session.className = "session";

    let _details = document.createElement("div");
    _details.className = "session-details";
    _session.appendChild(_details);

    let _time = document.createElement("div");
    _time.className = "time";
    _time.appendChild(createSpan(start));
    _time.appendChild(document.createElement("br"));
    _time.appendChild(createSpan("-"));
    _time.appendChild(document.createElement("br"));
    _time.appendChild(createSpan(end));
    _details.appendChild(_time);

    let _main = document.createElement("div");
    _main.className = "main";

    let _inner = document.createElement("div");
    _inner.className = "inner";
    _main.appendChild(_inner);

    let _track = document.createElement("span");
    _track.className = "track";
    _track.innerHTML = randomFromArray(tracks);
    _inner.appendChild(_track);

    let _sessionTitle = document.createElement("h3");
    _sessionTitle.className = "session-title";
    _sessionTitle.innerHTML = createSlotTitle();
    _inner.appendChild(_sessionTitle);

    _details.appendChild(_main);

    let _cats = document.createElement("div");
    _cats.className = "cats";
    let _innerCats = document.createElement("div");
    _innerCats.className = "inner";

    _innerCats.appendChild(createSpan(randomFromArray(languages)));
    _innerCats.appendChild(document.createElement("br"));
    _innerCats.appendChild(createSpan(randomFromArray(formats)));;
    _innerCats.appendChild(document.createElement("br"));
    _innerCats.appendChild(createSpan(randomFromArray(experiences)));

    _cats.appendChild(_innerCats);
    _details.appendChild(_cats);

    let _stage = document.createElement("div");
    _stage.className = "stage";
    let _innerStage = document.createElement("div");
    _innerStage.className = "inner";

    let _stageTitle = document.createElement("h4");
    _stageTitle.innerHTML = randomFromArray(stages);
    _innerStage.appendChild(_stageTitle);

    _stage.appendChild(_innerStage);
    _details.appendChild(_stage);

    return _session;
  }

  function createSpan(text) {
    let _span = document.createElement("span");
    _span.innerHTML = text;
    return _span;
  }

  function createSlotTitle() {

		let _word = "" + randomFrom(window.graph.start);

		let _next = "";

		while (_next != "END" && _word.length < 250) {
			_word += _next;
			let _curr = _word.slice(-depth);
			_next = randomFrom(window.graph.words[_curr]);
			if (_next == "(" && _word.indexOf("(") >= 0) {
				_next = ")";
			}
			if (_next == ")" && _word.indexOf("(") < 0) {
				_next = "END";
			}
		}

		if (_word.indexOf("(") >= 0 && _word.indexOf(")") < 0){
			_word += ")";
		}

		return _word;
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

  function randomFromArray(arr) {
    return arr[getRandomIntInclusive(0, arr.length - 1)];
  }

	//The maximum is inclusive and the minimum is inclusive
	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	return {
		createTimetable: createTimetable
	}

})();

/*
$(document).ready(function() {
	jQuery.getJSON("http://www.stefangaertner.net/nevernudes/nevernudes.json", function(graph) {
    window.graph = graph;

    create
  }
});
*/
(function () {

  Markov.createTimetable();

})();
