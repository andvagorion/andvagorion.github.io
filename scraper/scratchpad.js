var Scraper = (function() {
  
  function init(fn) {
    if(window.jQuery) {
      fn();
    } else {   
      var script = document.createElement('script'); 
      document.head.appendChild(script);  
      script.type = 'text/javascript';
      script.src = "//code.jquery.com/jquery-3.3.1.min.js";
      script.onload = fn;
    }
  }
  
  function scrape(selector) {
    init(function() { _scrape(selector) });
  }
  
  function _scrape(selector) {
    var values = [];
    jQuery(selector).each(function(idx, el) {
      let _name = el.innerHTML.trim();
      values.push(_name);
    });
    console.log(values.length);
    var _json = JSON.stringify(values);

    createOutput(_json);
  }
 
  function createOutput(content) {
    let _o = createOverlay();
    let _c = createContent(content);
    _o.appendChild(_c);
  }
  
  function createContent(content) {
    let _c = document.createElement("textArea");
    let _style = {
      width: "100%",
      height: "100%"
    };
    Object.assign(_c.style, _style);
    _c.value = content;
    return _c;
  }
  
  function createOverlay() {
    let _o = document.createElement("div");
    let _style = {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(255,255,255,0.75)",
      boxSizing: "border-box",
      padding: "50px",
      zIndex: getHighestZ()
    };
    Object.assign(_o.style, _style);
    
    let _close = document.createElement("input");
    _close.type = "button";
    _close.value = "X";
    let _cStyle = {
      position: "fixed",
      top: "5px",
      right: "5px"
    };
    Object.assign(_close.style, _cStyle);
    
    _close.addEventListener("click", function() {
      _o.parentNode.removeChild(_o);
    });
    
    _o.appendChild(_close);
    document.body.appendChild(_o);
    return _o;
  }
  
  function getHighestZ() {
    return Math.max.apply(null, 
      jQuery.map(jQuery('body *'), function(e,n) {
        if (jQuery(e).css('position') != 'static')
          return parseInt(jQuery(e).css('z-index')) || 1;
    }));
  }
  
  return {
    scrape: scrape
  }
})();

//Scraper.scrape("#mw-content-text .wikitable tbody tr td:nth-child(1)");
Scraper.scrape(".songlist a");