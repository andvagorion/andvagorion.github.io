"use strict";

NodeList.prototype.getByClassName = function(className) {
  for (let i = 0; i < this.length; i++) {
    if (this[i].className == className) {
      return this[i];
    }
  }
};

Element.prototype.show = function() {
  this.style.display = "block";
  this.style.opacity = 1;
};

Element.prototype.hide = function() {
  this.style.opacity = 0;
  this.addEventListener("transitionend", this.afterHide, false);
};

Element.prototype.afterHide = function() {
  this.style.display = "none";
  this.removeEventListener("transitionend", this.afterHide);
};

Element.prototype.addClass = function(className) {
  if (!this.classList.contains(className)) {
    this.classList.add(className);
  }
}

Element.prototype.removeClass = function(className) {
  if (this.classList.contains(className)) {
    this.classList.remove(className);
  }
}

Element.prototype.toggleClass = function(className) {
  if (this.classList.contains(className)) {
    this.classList.remove(className);
  } else {
    this.classList.add(className);
  }
};

Function.prototype.debounce = function(delay) {
  var fn = this
  return function() {
    fn.args = arguments
    fn.timeout_id && clearTimeout(fn.timeout_id)
    fn.timeout_id = setTimeout(function() { return fn.apply(fn, fn.args) }, delay)
  }
};

Number.prototype.intInRange = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
