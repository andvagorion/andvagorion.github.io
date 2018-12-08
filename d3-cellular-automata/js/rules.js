var rules = (function() {

  // var rule90 = '111001100000110100000001100101100110000110010100101001110001001000101101100010110110110001011010111001';

  var rules = [0, 1, 1, 1, 1, 0, 0, 0];

  var config = {
    radius: 5,
    distance: 15,
    columns: 50,
    rows: 50,
    wrapAround: true
  }
  var svg, g;

  var points = [];
  var lines = [];

  function init() {

    setup();
    initializeD3();
    initializeOptions();
    generateInput();
    update();

  }

  function setup() {
    var _margin = 10;
    document.body.style.margin = _margin + 'px';
    var w = window.innerWidth;
    var h = window.innerHeight;
    config.width = w - 2*_margin;
    config.height = h - config.distance - config.radius;

    //config.columns = Math.floor(w / config.distance) - 2;
    //config.rows = Math.floor(h / config.distance) - 2;
  }

  function generateInput() {
    createDataset(randomInput());
  }

  function initializeD3() {
    svg = d3.select('#rules').append('svg:svg');
    svg.attr('id', 'rules_svg').attr('width', window.innerWidth - 100).attr('height', window.innerHeight - 20);
    g = svg.append("g");
  }

  function update() {

    var t = d3.transition().duration(250);

    var circles = g.selectAll('circle').data(points, function(d) {
      return d.y + "-" + d.x;
    });
    var links = g.selectAll('line').data(lines, function(d) {
      return d.x1 + "-" + d.x2 + "-" + d.y1 + "-" + d.y2;
    });

    circles.exit()
    .transition(t)
    .style("fill-opacity", 1e-6)
    .remove();

    links.exit()
    .transition(t)
    .style("stroke-opacity", 1e-6)
    .remove();

    circles.enter().append('circle')
    .attr('cx', function(d) {
      return (d.x + 1) * config.distance;
    })
    .attr('cy', function(d) {
      return (d.y + 1) * config.distance;
    })
    .attr('r', config.radius)
    .style("fill-opacity", 1e-6)
    .transition(t)
    .style('fill-opacity', 1);

    links.enter().append('line')
    .attr('x1', function(d) {
      return (d.x1 + 1) * config.distance;
    })
    .attr('x2', function(d) {
      return (d.x2 + 1) * config.distance;
    })
    .attr('y1', function(d) {
      return (d.y1 + 1) * config.distance;
    })
    .attr('y2', function(d) {
      return (d.y2 + 1) * config.distance;
    })
    .attr('stroke-width', 1)
    .attr('stroke', 'black')
    .style("stroke-opacity", 1e-6)
    .transition(t)
    .style("stroke-opacity", 1);

  }

  function initializeOptions() {
    document.getElementById('randomInput').addEventListener('click', function() {
      generateInput();
      update();
    });

    document.getElementById('createSVG').addEventListener('click', function() {
      createSVG();
    });

    var wrap = document.getElementById('wrapAround');
    if (config.wrapAround) {
      wrap.addClass('active');
    }
    wrap.addEventListener('click', function() {
      config.wrapAround = !config.wrapAround;
      this.toggleClass('active');
    });

    var pos = 0;

    [].forEach.call(document.getElementsByClassName('fade-in'), function(el) {
      el.style.top = pos + 'px';
      pos += el.offsetHeight + 10;
      el.style.opacity = '1';
    });

    [].forEach.call(document.querySelectorAll('.expandable .icon'), function(el) {
      el.addEventListener('click', function() {
        this.parentNode.querySelector('.content').toggleClass('hidden');
      });
    });
  }

  function createSVG() {
    var svg = document.getElementById("rules_svg");
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'rules.svg';
    a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function readInput(input) {
    var retVal = [];
    for (var i = 0; i < input.length; i++) {
      var c = input.charAt(i);
      retVal.push(parseInt(c));
    }
    return retVal;
  }

  function randomInput() {
    var retVal = [];
    var c = 0;
    for (var i = 0; i < config.columns; i++) {
      var rnd = Math.round(Math.random());
      if (rnd === 1) {
        c++;
      }
      retVal.push(rnd);
    }

    // alright, IE, I'm not gonna use [].includes() ...
    //if (!retVal.includes(1)) {
    if (c < 1) {
      retVal[Number.intInRange(0, config.columns - 1)] = 1;
    }

    return retVal;
  }

  function createDataset(input) {
    points = [];
    lines = [];
    var c = 0;

    var prev = emptyArray(input.length);
    var curr = input;
    var next = calculateNext(input);
    var len = curr.length;

    while (c < config.rows) {

      for (var i = 0; i < len; i++) {
        if (curr[i] !== 1) {
          continue;
        }

        var arr = [(i > 0 && prev[i-1] === 1), prev[i] === 1, (i < (len - 1) && prev[i+1] === 1), (i > 0 && next[i-1] === 1), next[i] === 1, (i < (len - 1) && next[i+1] === 1)];
        if (c === config.rows - 1) {
          arr = arr.slice(0,3);
        }
        var one = exactlyOne(arr);

        if (one) {
          points.push({x: i, y: c});
        }

        if (i > 0 && prev[i-1] === 1) {
          lines.push({x1: i-1, x2: i, y1: c-1, y2: c});
        }

        if (prev[i] === 1) {
          lines.push({x1: i, x2: i, y1: c-1, y2: c});
        }

        if (i < len - 1 && prev[i+1] === 1) {
          lines.push({x1: i+1, x2: i, y1: c-1, y2: c});
        }

      }

      prev = curr;
      curr = next;
      next = calculateNext(curr);
      c++;
    }

  }

  function exactlyOne(arr) {
    var red = function(a, c) { return a + (c ? 1 : 0) };
    return arr.reduce(red, 0) === 1;
  }

  function emptyArray(len) {
    arr = [];
    while(len--) arr.push(0);
    return arr;
  }

  function calculateNext(row) {
    var retVal = [];
    var size = row.length;

    for (var i = 0; i < size; i++) {

      var p1;
      if (i === 0) {
        p1 = config.wrapAround ? row[size - 1] : 0;
      } else {
        p1 = row[i - 1];
      }

      var p2 = row[i];

      var p3;
      if (i === size - 1) {
        p3 = config.wrapAround ? row[0] : 0;
      } else {
        p3 = row[i + 1];
      }

      retVal.push(calculatePoint(p1, p2, p3));
    }
    return retVal;
  }

  function calculatePoint(p1, p2, p3) {
    // parse as binary
    var dec = parseInt('' + p1 + p2 + p3, 2);
    return rules[dec];
  }

  return {
    init: init
  }

})();

(function() {
  rules.init();
})();
