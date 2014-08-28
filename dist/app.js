(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function ($) {
  window.$ = $;
  $(document).ready(function () {
    var Game = require('./assets/game');
    if (Game.canRun()) {
      Game.init();
      // Add the container to our HTML page
      document.body.appendChild(Game.getDisplay().getContainer());
      // Load the start screen
      Game.switchScreen(require('./assets/screens/startScreen'));
    }
  });
})(require('jquery/dist/jquery.min'));

},{"./assets/game":2,"./assets/screens/startScreen":6,"jquery/dist/jquery.min":9}],2:[function(require,module,exports){
/*global $*/

//NOTE: This is a singleton

var ROT = require('rot-js').ROT;
var _display = null,
  _currentScreen = null;

var Game = {};
Game.config = require('./gameconfig');

function bindEventToScreen(event) {
  window.addEventListener(event, function (e) {
    // When an event is received, send it to the
    // screen if there is one
    if (_currentScreen !== null) {
      // Send the event type and data to the screen
      _currentScreen.handleInput(event, e);
    }
  });
}

Game.init = function () {
  _display = new ROT.Display({
    width: Game.config.dimensions.width,
    height: Game.config.dimensions.height
  });
  // Bind keyboard input events
  bindEventToScreen('keydown');
  bindEventToScreen('keyup');
  bindEventToScreen('keypress');
};

Game.getDisplay = function () {
  return _display;
};

Game.canRun = function () {
  // Check if rot.js can work on this browser
  if (!ROT.isSupported()) {
    alert("The rot.js library isn't supported by your browser.");
    return false;
  }
  return true;
};

Game.switchScreen = function (screen) {

  if (typeof(screen) == 'string') {
    screen = require(screen);
  }

  // If we had a screen before, notify it that we exited
  if (_currentScreen !== null) {
    _currentScreen.exit();
  }
  // Clear the display
  Game.getDisplay().clear();
  // Update our current screen, notify it we entered
  // and then render it
  _currentScreen = screen;
  if (_currentScreen !== null) {
    _currentScreen.enter();
    _currentScreen.render(_display);
  }

};

module.exports = Game;

},{"./gameconfig":3,"rot-js":10}],3:[function(require,module,exports){
module.exports = {

 dimensions : {
    width: 80,
    height: 24
 }
};
},{}],4:[function(require,module,exports){
var ROT = require('rot-js').ROT;

// Define our winning screen
module.exports = {
  enter: function () {
    console.log("Entered lose screen.");
  },
  exit: function () {
    console.log("Exited lose screen.");
  },
  render: function (display) {
    // Render our prompt to the screen
    for (var i = 0; i < 22; i++) {
      display.drawText(2, i + 1, "%b{red}You lose! :(");
    }
  },
  handleInput: function (inputType, inputData) {
    // Nothing to do here
  }
};

},{"rot-js":10}],5:[function(require,module,exports){
var Game = require('../game');
var ROT = require('rot-js').ROT;

// Define our playing screen
module.exports = {
  enter: function () {
    console.log("Entered play screen.");
  },
  exit: function () {
    console.log("Exited play screen.");
  },
  render: function (display) {
    display.drawText(3, 5, "%c{red}%b{white}This game is so much fun!");
    display.drawText(4, 6, "Press [Enter] to win, or [Esc] to lose!");
  },
  handleInput: function (inputType, inputData) {
    if (inputType === 'keydown') {
      // If enter is pressed, go to the win screen
      // If escape is pressed, go to lose screen
      if (inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(require('./winScreen'));
      } else if (inputData.keyCode === ROT.VK_ESCAPE) {
        Game.switchScreen(require('./loseScreen'));
      }
    }
  }
};

},{"../game":2,"./loseScreen":4,"./winScreen":7,"rot-js":10}],6:[function(require,module,exports){
var Game = require('../game');
var ROT = require('rot-js').ROT;
var gameconfig = require('../gameconfig');

module.exports = {
  enter: function () {
    console.log("Entered start screen.");
  },
  exit: function () {
    console.log("Exited start screen.");
  },
  render: function (display) {
    // Render our prompt to the screen
    display.drawText(1, 1, "%c{yellow}Javascript Roguelike");
    display.drawText(1, 2, "Press [Enter] to start!");
  },
  handleInput: function (inputType, inputData) {
    // When [Enter] is pressed, go to the play screen
    if (inputType === 'keydown') {
      if (inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(require('./playScreen'));
      }
    }
  }
};

},{"../game":2,"../gameconfig":3,"./playScreen":5,"rot-js":10}],7:[function(require,module,exports){
var ROT = require('rot-js').ROT;

// Define our winning screen
module.exports = {
  enter: function () {
    console.log("Entered win screen.");
  },
  exit: function () {
    console.log("Exited win screen.");
  },
  render: function (display) {
    // Render our prompt to the screen
    for (var i = 0; i < 22; i++) {
      // Generate random background colors
      var r = Math.round(Math.random() * 255);
      var g = Math.round(Math.random() * 255);
      var b = Math.round(Math.random() * 255);
      var background = ROT.Color.toRGB([r, g, b]);
      display.drawText(2, i + 1, "%b{" + background + "}You win!");
    }
  },
  handleInput: function (inputType, inputData) {
    // Nothing to do here
  }
};

},{"rot-js":10}],8:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],9:[function(require,module,exports){
/*! jQuery v2.1.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l=a.document,m="2.1.1",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=l.createElement("script"),b.text=a,l.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:k}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+-new Date,v=a.document,w=0,x=0,y=gb(),z=gb(),A=gb(),B=function(a,b){return a===b&&(l=!0),0},C="undefined",D=1<<31,E={}.hasOwnProperty,F=[],G=F.pop,H=F.push,I=F.push,J=F.slice,K=F.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},L="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",N="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",O=N.replace("w","w#"),P="\\["+M+"*("+N+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+O+"))|)"+M+"*\\]",Q=":("+N+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+P+")*)|.*)\\)|)",R=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),S=new RegExp("^"+M+"*,"+M+"*"),T=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),V=new RegExp(Q),W=new RegExp("^"+O+"$"),X={ID:new RegExp("^#("+N+")"),CLASS:new RegExp("^\\.("+N+")"),TAG:new RegExp("^("+N.replace("w","w*")+")"),ATTR:new RegExp("^"+P),PSEUDO:new RegExp("^"+Q),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+L+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{I.apply(F=J.call(v.childNodes),v.childNodes),F[v.childNodes.length].nodeType}catch(eb){I={apply:F.length?function(a,b){H.apply(a,J.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],!a||"string"!=typeof a)return d;if(1!==(k=b.nodeType)&&9!==k)return[];if(p&&!e){if(f=_.exec(a))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return I.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return I.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=9===k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+qb(o[l]);w=ab.test(a)&&ob(b.parentNode)||b,x=o.join(",")}if(x)try{return I.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function gb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function hb(a){return a[u]=!0,a}function ib(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function jb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function kb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||D)-(~a.sourceIndex||D);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function lb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function nb(a){return hb(function(b){return b=+b,hb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function ob(a){return a&&typeof a.getElementsByTagName!==C&&a}c=fb.support={},f=fb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fb.setDocument=function(a){var b,e=a?a.ownerDocument||a:v,g=e.defaultView;return e!==n&&9===e.nodeType&&e.documentElement?(n=e,o=e.documentElement,p=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener("unload",function(){m()},!1):g.attachEvent&&g.attachEvent("onunload",function(){m()})),c.attributes=ib(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ib(function(a){return a.appendChild(e.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(e.getElementsByClassName)&&ib(function(a){return a.innerHTML="<div class='a'></div><div class='a i'></div>",a.firstChild.className="i",2===a.getElementsByClassName("i").length}),c.getById=ib(function(a){return o.appendChild(a).id=u,!e.getElementsByName||!e.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==C&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c=typeof a.getAttributeNode!==C&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==C?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==C&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(e.querySelectorAll))&&(ib(function(a){a.innerHTML="<select msallowclip=''><option selected=''></option></select>",a.querySelectorAll("[msallowclip^='']").length&&q.push("[*^$]="+M+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+M+"*(?:value|"+L+")"),a.querySelectorAll(":checked").length||q.push(":checked")}),ib(function(a){var b=e.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+M+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ib(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",Q)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===v&&t(v,a)?-1:b===e||b.ownerDocument===v&&t(v,b)?1:k?K.call(k,a)-K.call(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],i=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:k?K.call(k,a)-K.call(k,b):0;if(f===g)return kb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?kb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},e):n},fb.matches=function(a,b){return fb(a,null,null,b)},fb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fb(b,n,null,[a]).length>0},fb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&E.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fb.selectors={cacheLength:50,createPseudo:hb,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[3]||a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+M+")"+a+"("+M+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||typeof a.getAttribute!==C&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?hb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=K.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:hb(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?hb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:hb(function(a){return function(b){return fb(a,b).length>0}}),contains:hb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:hb(function(a){return W.test(a||"")||fb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:nb(function(){return[0]}),last:nb(function(a,b){return[b-1]}),eq:nb(function(a,b,c){return[0>c?c+b:c]}),even:nb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:nb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:nb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:nb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=lb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=mb(b);function pb(){}pb.prototype=d.filters=d.pseudos,d.setFilters=new pb,g=fb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fb.error(a):z(a,i).slice(0)};function qb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function rb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function sb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function tb(a,b,c){for(var d=0,e=b.length;e>d;d++)fb(a,b[d],c);return c}function ub(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function vb(a,b,c,d,e,f){return d&&!d[u]&&(d=vb(d)),e&&!e[u]&&(e=vb(e,f)),hb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||tb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ub(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ub(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?K.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ub(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):I.apply(g,r)})}function wb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=rb(function(a){return a===b},h,!0),l=rb(function(a){return K.call(b,a)>-1},h,!0),m=[function(a,c,d){return!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>i;i++)if(c=d.relative[a[i].type])m=[rb(sb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return vb(i>1&&sb(m),i>1&&qb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&wb(a.slice(i,e)),f>e&&wb(a=a.slice(e)),f>e&&qb(a))}m.push(c)}return sb(m)}function xb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=G.call(i));s=ub(s)}I.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&fb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?hb(f):f}return h=fb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xb(e,d)),f.selector=a}return f},i=fb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&ob(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qb(j),!a)return I.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&ob(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ib(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ib(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||jb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ib(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||jb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ib(function(a){return null==a.getAttribute("disabled")})||jb(L,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fb}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return g.call(b,a)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:l,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=l.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=l,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};A.prototype=n.fn,y=n(l);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(n(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&n.each(arguments,function(a,b){var c;while((c=n.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(H.resolveWith(l,[n]),n.fn.triggerHandler&&(n(l).triggerHandler("ready"),n(l).off("ready"))))}});function I(){l.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),n.ready()}n.ready.promise=function(b){return H||(H=n.Deferred(),"complete"===l.readyState?setTimeout(n.ready):(l.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},n.ready.promise();var J=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=n.expando+Math.random()}K.uid=1,K.accepts=n.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,n.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(n.isEmptyObject(f))n.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!n.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){return M.access(a,b,c)},removeData:function(a,b){M.remove(a,b)
},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=n.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||n.isArray(c)?d=L.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:n.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=l.createDocumentFragment(),b=a.appendChild(l.createElement("div")),c=l.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";k.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|pointer|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return l.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof n!==U&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,m,o,p=[d||l],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||l,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+n.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},e||!o.trigger||o.trigger.apply(d,c)!==!1)){if(!e&&!o.noBubble&&!n.isWindow(d)){for(i=o.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||l)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:o.bindType||q,m=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),m&&m.apply(g,c),m=k&&g[k],m&&m.apply&&n.acceptData(g)&&(b.result=m.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(d)||k&&n.isFunction(d[q])&&!n.isWindow(d)&&(h=d[k],h&&(d[k]=null),n.event.triggered=q,d[q](),n.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>=0:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||l,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=l),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?Z:$):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=Z,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return n().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var ab=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bb=/<([\w:]+)/,cb=/<|&#?\w+;/,db=/<(?:script|style|link)/i,eb=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/^$|\/(?:java|ecma)script/i,gb=/^true\/(.*)/,hb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ib={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ib.optgroup=ib.option,ib.tbody=ib.tfoot=ib.colgroup=ib.caption=ib.thead,ib.th=ib.td;function jb(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function kb(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function lb(a){var b=gb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function mb(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function nb(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=n.extend({},h),M.set(b,i))}}function ob(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function pb(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}n.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=ob(h),f=ob(a),d=0,e=f.length;e>d;d++)pb(f[d],g[d]);if(b)if(c)for(f=f||ob(a),g=g||ob(h),d=0,e=f.length;e>d;d++)nb(f[d],g[d]);else nb(a,h);return g=ob(h,"script"),g.length>0&&mb(g,!i&&ob(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,o=a.length;o>m;m++)if(e=a[m],e||0===e)if("object"===n.type(e))n.merge(l,e.nodeType?[e]:e);else if(cb.test(e)){f=f||k.appendChild(b.createElement("div")),g=(bb.exec(e)||["",""])[1].toLowerCase(),h=ib[g]||ib._default,f.innerHTML=h[1]+e.replace(ab,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;n.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===n.inArray(e,d))&&(i=n.contains(e.ownerDocument,e),f=ob(k.appendChild(e),"script"),i&&mb(f),c)){j=0;while(e=f[j++])fb.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f=n.event.special,g=0;void 0!==(c=a[g]);g++){if(n.acceptData(c)&&(e=c[L.expando],e&&(b=L.cache[e]))){if(b.events)for(d in b.events)f[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);L.cache[e]&&delete L.cache[e]}delete M.cache[c[M.expando]]}}}),n.fn.extend({text:function(a){return J(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(ob(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&mb(ob(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(ob(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!db.test(a)&&!ib[(bb.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(ab,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(ob(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(ob(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,m=this,o=l-1,p=a[0],q=n.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&eb.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(c=n.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=n.map(ob(c,"script"),kb),g=f.length;l>j;j++)h=c,j!==o&&(h=n.clone(h,!0,!0),g&&n.merge(f,ob(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,n.map(f,lb),j=0;g>j;j++)h=f[j],fb.test(h.type||"")&&!L.access(h,"globalEval")&&n.contains(i,h)&&(h.src?n._evalUrl&&n._evalUrl(h.src):n.globalEval(h.textContent.replace(hb,"")))}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),n(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qb,rb={};function sb(b,c){var d,e=n(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:n.css(e[0],"display");return e.detach(),f}function tb(a){var b=l,c=rb[a];return c||(c=sb(a,b),"none"!==c&&c||(qb=(qb||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qb[0].contentDocument,b.write(),b.close(),c=sb(a,b),qb.detach()),rb[a]=c),c}var ub=/^margin/,vb=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wb=function(a){return a.ownerDocument.defaultView.getComputedStyle(a,null)};function xb(a,b,c){var d,e,f,g,h=a.style;return c=c||wb(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),vb.test(g)&&ub.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function yb(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d=l.documentElement,e=l.createElement("div"),f=l.createElement("div");if(f.style){f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===f.style.backgroundClip,e.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",e.appendChild(f);function g(){f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",f.innerHTML="",d.appendChild(e);var g=a.getComputedStyle(f,null);b="1%"!==g.top,c="4px"===g.width,d.removeChild(e)}a.getComputedStyle&&n.extend(k,{pixelPosition:function(){return g(),b},boxSizingReliable:function(){return null==c&&g(),c},reliableMarginRight:function(){var b,c=f.appendChild(l.createElement("div"));return c.style.cssText=f.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",f.style.width="1px",d.appendChild(e),b=!parseFloat(a.getComputedStyle(c,null).marginRight),d.removeChild(e),b}})}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var zb=/^(none|table(?!-c[ea]).+)/,Ab=new RegExp("^("+Q+")(.*)$","i"),Bb=new RegExp("^([+-])=("+Q+")","i"),Cb={position:"absolute",visibility:"hidden",display:"block"},Db={letterSpacing:"0",fontWeight:"400"},Eb=["Webkit","O","Moz","ms"];function Fb(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Eb.length;while(e--)if(b=Eb[e]+c,b in a)return b;return d}function Gb(a,b,c){var d=Ab.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Hb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+R[f]+"Width",!0,e))):(g+=n.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ib(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wb(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xb(a,b,f),(0>e||null==e)&&(e=a.style[b]),vb.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Hb(a,b,c||(g?"border":"content"),d,f)+"px"}function Jb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",tb(d.nodeName)))):(e=S(d),"none"===c&&e||L.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Fb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Bb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Fb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xb(a,b,d)),"normal"===e&&b in Db&&(e=Db[b]),""===c||c?(f=parseFloat(e),c===!0||n.isNumeric(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?zb.test(n.css(a,"display"))&&0===a.offsetWidth?n.swap(a,Cb,function(){return Ib(a,b,d)}):Ib(a,b,d):void 0},set:function(a,c,d){var e=d&&wb(a);return Gb(a,c,d?Hb(a,b,d,"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),n.cssHooks.marginRight=yb(k.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},xb,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ub.test(a)||(n.cssHooks[a+b].set=Gb)}),n.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=wb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Jb(this,!0)},hide:function(){return Jb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?n(this).show():n(this).hide()})}});function Kb(a,b,c,d,e){return new Kb.prototype.init(a,b,c,d,e)}n.Tween=Kb,Kb.prototype={constructor:Kb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Kb.propHooks[this.prop];return a&&a.get?a.get(this):Kb.propHooks._default.get(this)},run:function(a){var b,c=Kb.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Kb.propHooks._default.set(this),this}},Kb.prototype.init.prototype=Kb.prototype,Kb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Kb.propHooks.scrollTop=Kb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=Kb.prototype.init,n.fx.step={};var Lb,Mb,Nb=/^(?:toggle|show|hide)$/,Ob=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pb=/queueHooks$/,Qb=[Vb],Rb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Ob.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&Ob.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sb(){return setTimeout(function(){Lb=void 0}),Lb=n.now()}function Tb(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ub(a,b,c){for(var d,e=(Rb[b]||[]).concat(Rb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Vb(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&S(a),q=L.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?L.get(a,"olddisplay")||tb(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Nb.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?tb(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=L.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;L.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ub(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wb(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xb(a,b,c){var d,e,f=0,g=Qb.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Lb||Sb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:Lb||Sb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wb(k,j.opts.specialEasing);g>f;f++)if(d=Qb[f].call(j,a,k,j.opts))return d;return n.map(k,Ub,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(Xb,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Rb[c]=Rb[c]||[],Rb[c].unshift(b)},prefilter:function(a,b){b?Qb.unshift(a):Qb.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=Xb(this,n.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Tb(b,!0),a,d,e)}}),n.each({slideDown:Tb("show"),slideUp:Tb("hide"),slideToggle:Tb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Lb=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Lb=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Mb||(Mb=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(Mb),Mb=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=l.createElement("input"),b=l.createElement("select"),c=b.appendChild(l.createElement("option"));a.type="checkbox",k.checkOn=""!==a.value,k.optSelected=c.selected,b.disabled=!0,k.optDisabled=!c.disabled,a=l.createElement("input"),a.value="t",a.type="radio",k.radioValue="t"===a.value}();var Yb,Zb,$b=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return J(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?Zb:Yb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))
},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Zb={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$b[b]||n.find.attr;$b[b]=function(a,b,d){var e,f;return d||(f=$b[b],$b[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$b[b]=f),e}});var _b=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return J(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_b.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),k.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var ac=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ac," ").indexOf(b)>=0)return!0;return!1}});var bc=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bc,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},k.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cc=n.now(),dc=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+a),b};var ec,fc,gc=/#.*$/,hc=/([?&])_=[^&]*/,ic=/^(.*?):[ \t]*([^\r\n]*)$/gm,jc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,kc=/^(?:GET|HEAD)$/,lc=/^\/\//,mc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,nc={},oc={},pc="*/".concat("*");try{fc=location.href}catch(qc){fc=l.createElement("a"),fc.href="",fc=fc.href}ec=mc.exec(fc.toLowerCase())||[];function rc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function sc(a,b,c,d){var e={},f=a===oc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function tc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function uc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function vc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:fc,type:"GET",isLocal:jc.test(ec[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":pc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?tc(tc(a,n.ajaxSettings),b):tc(n.ajaxSettings,a)},ajaxPrefilter:rc(nc),ajaxTransport:rc(oc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=ic.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||fc)+"").replace(gc,"").replace(lc,ec[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=mc.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===ec[1]&&h[2]===ec[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(ec[3]||("http:"===ec[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),sc(nc,k,b,v),2===t)return v;i=k.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!kc.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(dc.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=hc.test(d)?d.replace(hc,"$1_="+cc++):d+(dc.test(d)?"&":"?")+"_="+cc++)),k.ifModified&&(n.lastModified[d]&&v.setRequestHeader("If-Modified-Since",n.lastModified[d]),n.etag[d]&&v.setRequestHeader("If-None-Match",n.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+pc+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=sc(oc,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=uc(k,v,f)),u=vc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(n.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var wc=/%20/g,xc=/\[\]$/,yc=/\r?\n/g,zc=/^(?:submit|button|image|reset|file)$/i,Ac=/^(?:input|select|textarea|keygen)/i;function Bc(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||xc.test(a)?d(a,e):Bc(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Bc(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Bc(c,a[c],b,e);return d.join("&").replace(wc,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Ac.test(this.nodeName)&&!zc.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(yc,"\r\n")}}):{name:b.name,value:c.replace(yc,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Cc=0,Dc={},Ec={0:200,1223:204},Fc=n.ajaxSettings.xhr();a.ActiveXObject&&n(a).on("unload",function(){for(var a in Dc)Dc[a]()}),k.cors=!!Fc&&"withCredentials"in Fc,k.ajax=Fc=!!Fc,n.ajaxTransport(function(a){var b;return k.cors||Fc&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Cc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Dc[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Ec[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Dc[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=n("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),l.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Gc=[],Hc=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Gc.pop()||n.expando+"_"+cc++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Hc.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Hc.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Hc,"$1"+e):b.jsonp!==!1&&(b.url+=(dc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Gc.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||l;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var Ic=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Ic)return Ic.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var Jc=a.document.documentElement;function Kc(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Kc(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Jc;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Jc})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;n.fn[b]=function(e){return J(this,function(b,e,f){var g=Kc(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=yb(k.pixelPosition,function(a,c){return c?(c=xb(a,b),vb.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Lc=a.jQuery,Mc=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Mc),b&&a.jQuery===n&&(a.jQuery=Lc),n},typeof b===U&&(a.jQuery=a.$=n),n});
//# sourceMappingURL=jquery.min.map
},{}],10:[function(require,module,exports){
module.exports = require('./lib/rot');

},{"./lib/rot":11}],11:[function(require,module,exports){
var process=require("__browserify_process"),global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/*
	This is rot.js, the ROguelike Toolkit in JavaScript.
	Version 0.5~dev, generated on Wed Jul 30 2014 21:33:18 GMT-0500 (CDT).
*/
/**
 * @namespace Add objects for Node.js enviroment
 */
if ((typeof process !== "undefined" && process !== null ? process.env : void 0) != null) {
	window = global;
	document = {
		body: {
			appendChild: function(child) {},
			scrollLeft: 0,
			scrollTop: 0
		},
		createElement: function(type) {
			var canvas;
			return canvas = {
				getBoundingClientRect: function() {
					var rect;
					return rect = {
						left: 0,
						top: 0
					};
				},
				getContext: function(type) {
					var context;
					return context = {
						_termcolor: null,
						beginPath: function() {},
						canvas: canvas,
						drawImage: function(a, b, c, d, e, f, g, h, i) {},
						fill: function() {},
						fillRect: function(x, y, w, h) {
							if(this._termcolor !== null) {
								var clearCmd = this._termcolor.clearToAnsi(this.fillStyle);
								process.stdout.write(clearCmd);
							}
						},
						fillStyle: "#000",
						fillText: function(chs, x, y) {},
						font: "monospace",
						lineTo: function(x, y) {},
						measureText: function(ch) {
							var result;
							return result = {
								width: 12
							};
						},
						moveTo: function(x, y) {},
						textAlign: "center",
						textBaseline: "middle"
					};
				},
				height: 0,
				style: {
					left: "100px",
					position: "absolute",
					top: "100px",
					visibility: "hidden"
				},
				width: 0
			};
		},
		documentElement: {
			scrollLeft: 0,
			scrollTop: 0
		}
	};
}
/**
 * @namespace Top-level ROT namespace
 */
var ROT = {
	/**
	 * @returns {bool} Is rot.js supported by this browser?
	 */
	isSupported: function() {
		return !!(document.createElement("canvas").getContext && Function.prototype.bind);
	},

	/** Default with for display and map generators */
	DEFAULT_WIDTH: 80,
	/** Default height for display and map generators */
	DEFAULT_HEIGHT: 25,

	/** Directional constants. Ordering is important! */
	DIRS: {
		"4": [
			[ 0, -1],
			[ 1,  0],
			[ 0,  1],
			[-1,  0]
		],
		"8": [
			[ 0, -1],
			[ 1, -1],
			[ 1,  0],
			[ 1,  1],
			[ 0,  1],
			[-1,  1],
			[-1,  0],
			[-1, -1]
		],
		"6": [
			[-1, -1],
			[ 1, -1],
			[ 2,  0],
			[ 1,  1],
			[-1,  1],
			[-2,  0]
		]
	},

	/** Cancel key. */
	VK_CANCEL: 3, 
	/** Help key. */
	VK_HELP: 6, 
	/** Backspace key. */
	VK_BACK_SPACE: 8, 
	/** Tab key. */
	VK_TAB: 9, 
	/** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
	VK_CLEAR: 12, 
	/** Return/enter key on the main keyboard. */
	VK_RETURN: 13, 
	/** Reserved, but not used. */
	VK_ENTER: 14, 
	/** Shift key. */
	VK_SHIFT: 16, 
	/** Control key. */
	VK_CONTROL: 17, 
	/** Alt (Option on Mac) key. */
	VK_ALT: 18, 
	/** Pause key. */
	VK_PAUSE: 19, 
	/** Caps lock. */
	VK_CAPS_LOCK: 20, 
	/** Escape key. */
	VK_ESCAPE: 27, 
	/** Space bar. */
	VK_SPACE: 32, 
	/** Page Up key. */
	VK_PAGE_UP: 33, 
	/** Page Down key. */
	VK_PAGE_DOWN: 34, 
	/** End key. */
	VK_END: 35, 
	/** Home key. */
	VK_HOME: 36, 
	/** Left arrow. */
	VK_LEFT: 37, 
	/** Up arrow. */
	VK_UP: 38, 
	/** Right arrow. */
	VK_RIGHT: 39, 
	/** Down arrow. */
	VK_DOWN: 40, 
	/** Print Screen key. */
	VK_PRINTSCREEN: 44, 
	/** Ins(ert) key. */
	VK_INSERT: 45, 
	/** Del(ete) key. */
	VK_DELETE: 46, 
	/***/
	VK_0: 48,
	/***/
	VK_1: 49,
	/***/
	VK_2: 50,
	/***/
	VK_3: 51,
	/***/
	VK_4: 52,
	/***/
	VK_5: 53,
	/***/
	VK_6: 54,
	/***/
	VK_7: 55,
	/***/
	VK_8: 56,
	/***/
	VK_9: 57,
	/** Colon (:) key. Requires Gecko 15.0 */
	VK_COLON: 58, 
	/** Semicolon (;) key. */
	VK_SEMICOLON: 59, 
	/** Less-than (<) key. Requires Gecko 15.0 */
	VK_LESS_THAN: 60, 
	/** Equals (=) key. */
	VK_EQUALS: 61, 
	/** Greater-than (>) key. Requires Gecko 15.0 */
	VK_GREATER_THAN: 62, 
	/** Question mark (?) key. Requires Gecko 15.0 */
	VK_QUESTION_MARK: 63, 
	/** Atmark (@) key. Requires Gecko 15.0 */
	VK_AT: 64, 
	/***/
	VK_A: 65,
	/***/
	VK_B: 66,
	/***/
	VK_C: 67,
	/***/
	VK_D: 68,
	/***/
	VK_E: 69,
	/***/
	VK_F: 70,
	/***/
	VK_G: 71,
	/***/
	VK_H: 72,
	/***/
	VK_I: 73,
	/***/
	VK_J: 74,
	/***/
	VK_K: 75,
	/***/
	VK_L: 76,
	/***/
	VK_M: 77,
	/***/
	VK_N: 78,
	/***/
	VK_O: 79,
	/***/
	VK_P: 80,
	/***/
	VK_Q: 81,
	/***/
	VK_R: 82,
	/***/
	VK_S: 83,
	/***/
	VK_T: 84,
	/***/
	VK_U: 85,
	/***/
	VK_V: 86,
	/***/
	VK_W: 87,
	/***/
	VK_X: 88,
	/***/
	VK_Y: 89,
	/***/
	VK_Z: 90,
	/***/
	VK_CONTEXT_MENU: 93,
	/** 0 on the numeric keypad. */
	VK_NUMPAD0: 96, 
	/** 1 on the numeric keypad. */
	VK_NUMPAD1: 97, 
	/** 2 on the numeric keypad. */
	VK_NUMPAD2: 98, 
	/** 3 on the numeric keypad. */
	VK_NUMPAD3: 99, 
	/** 4 on the numeric keypad. */
	VK_NUMPAD4: 100, 
	/** 5 on the numeric keypad. */
	VK_NUMPAD5: 101, 
	/** 6 on the numeric keypad. */
	VK_NUMPAD6: 102, 
	/** 7 on the numeric keypad. */
	VK_NUMPAD7: 103, 
	/** 8 on the numeric keypad. */
	VK_NUMPAD8: 104, 
	/** 9 on the numeric keypad. */
	VK_NUMPAD9: 105, 
	/** * on the numeric keypad. */
	VK_MULTIPLY: 106,
	/** + on the numeric keypad. */
	VK_ADD: 107, 
	/***/
	VK_SEPARATOR: 108,
	/** - on the numeric keypad. */
	VK_SUBTRACT: 109, 
	/** Decimal point on the numeric keypad. */
	VK_DECIMAL: 110, 
	/** / on the numeric keypad. */
	VK_DIVIDE: 111, 
	/** F1 key. */
	VK_F1: 112, 
	/** F2 key. */
	VK_F2: 113, 
	/** F3 key. */
	VK_F3: 114, 
	/** F4 key. */
	VK_F4: 115, 
	/** F5 key. */
	VK_F5: 116, 
	/** F6 key. */
	VK_F6: 117, 
	/** F7 key. */
	VK_F7: 118, 
	/** F8 key. */
	VK_F8: 119, 
	/** F9 key. */
	VK_F9: 120, 
	/** F10 key. */
	VK_F10: 121, 
	/** F11 key. */
	VK_F11: 122, 
	/** F12 key. */
	VK_F12: 123, 
	/** F13 key. */
	VK_F13: 124, 
	/** F14 key. */
	VK_F14: 125, 
	/** F15 key. */
	VK_F15: 126, 
	/** F16 key. */
	VK_F16: 127, 
	/** F17 key. */
	VK_F17: 128, 
	/** F18 key. */
	VK_F18: 129, 
	/** F19 key. */
	VK_F19: 130, 
	/** F20 key. */
	VK_F20: 131, 
	/** F21 key. */
	VK_F21: 132, 
	/** F22 key. */
	VK_F22: 133, 
	/** F23 key. */
	VK_F23: 134, 
	/** F24 key. */
	VK_F24: 135, 
	/** Num Lock key. */
	VK_NUM_LOCK: 144, 
	/** Scroll Lock key. */
	VK_SCROLL_LOCK: 145, 
	/** Circumflex (^) key. Requires Gecko 15.0 */
	VK_CIRCUMFLEX: 160, 
	/** Exclamation (!) key. Requires Gecko 15.0 */
	VK_EXCLAMATION: 161, 
	/** Double quote () key. Requires Gecko 15.0 */
	VK_DOUBLE_QUOTE: 162, 
	/** Hash (#) key. Requires Gecko 15.0 */
	VK_HASH: 163, 
	/** Dollar sign ($) key. Requires Gecko 15.0 */
	VK_DOLLAR: 164, 
	/** Percent (%) key. Requires Gecko 15.0 */
	VK_PERCENT: 165, 
	/** Ampersand (&) key. Requires Gecko 15.0 */
	VK_AMPERSAND: 166, 
	/** Underscore (_) key. Requires Gecko 15.0 */
	VK_UNDERSCORE: 167, 
	/** Open parenthesis (() key. Requires Gecko 15.0 */
	VK_OPEN_PAREN: 168, 
	/** Close parenthesis ()) key. Requires Gecko 15.0 */
	VK_CLOSE_PAREN: 169, 
	/* Asterisk (*) key. Requires Gecko 15.0 */
	VK_ASTERISK: 170,
	/** Plus (+) key. Requires Gecko 15.0 */
	VK_PLUS: 171, 
	/** Pipe (|) key. Requires Gecko 15.0 */
	VK_PIPE: 172, 
	/** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
	VK_HYPHEN_MINUS: 173, 
	/** Open curly bracket ({) key. Requires Gecko 15.0 */
	VK_OPEN_CURLY_BRACKET: 174, 
	/** Close curly bracket (}) key. Requires Gecko 15.0 */
	VK_CLOSE_CURLY_BRACKET: 175, 
	/** Tilde (~) key. Requires Gecko 15.0 */
	VK_TILDE: 176, 
	/** Comma (,) key. */
	VK_COMMA: 188, 
	/** Period (.) key. */
	VK_PERIOD: 190, 
	/** Slash (/) key. */
	VK_SLASH: 191, 
	/** Back tick (`) key. */
	VK_BACK_QUOTE: 192, 
	/** Open square bracket ([) key. */
	VK_OPEN_BRACKET: 219, 
	/** Back slash (\) key. */
	VK_BACK_SLASH: 220, 
	/** Close square bracket (]) key. */
	VK_CLOSE_BRACKET: 221, 
	/** Quote (''') key. */
	VK_QUOTE: 222, 
	/** Meta key on Linux, Command key on Mac. */
	VK_META: 224, 
	/** AltGr key on Linux. Requires Gecko 15.0 */
	VK_ALTGR: 225, 
	/** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
	VK_WIN: 91, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_KANA: 21, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_HANGUL: 21, 
	/** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
	VK_EISU: 22, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_JUNJA: 23, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_FINAL: 24, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_HANJA: 25, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_KANJI: 25, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_CONVERT: 28, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_NONCONVERT: 29, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_ACCEPT: 30, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_MODECHANGE: 31, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_SELECT: 41, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_PRINT: 42, 
	/** Linux support for this keycode was added in Gecko 4.0. */
	VK_EXECUTE: 43, 
	/** Linux support for this keycode was added in Gecko 4.0.	 */
	VK_SLEEP: 95 
};
/**
 * @namespace
 * Contains text tokenization and breaking routines
 */
ROT.Text = {
	RE_COLORS: /%([bc]){([^}]*)}/g,

	/* token types */
	TYPE_TEXT:		0,
	TYPE_NEWLINE:	1,
	TYPE_FG:		2,
	TYPE_BG:		3,

	/**
	 * Measure size of a resulting text block
	 */
	measure: function(str, maxWidth) {
		var result = {width:0, height:1};
		var tokens = this.tokenize(str, maxWidth);
		var lineWidth = 0;

		for (var i=0;i<tokens.length;i++) {
			var token = tokens[i];
			switch (token.type) {
				case this.TYPE_TEXT:
					lineWidth += token.value.length;
				break;

				case this.TYPE_NEWLINE:
					result.height++;
					result.width = Math.max(result.width, lineWidth);
					lineWidth = 0;
				break;
			}
		}
		result.width = Math.max(result.width, lineWidth);

		return result;
	},

	/**
	 * Convert string to a series of a formatting commands
	 */
	tokenize: function(str, maxWidth) {
		var result = [];

		/* first tokenization pass - split texts and color formatting commands */
		var offset = 0;
		str.replace(this.RE_COLORS, function(match, type, name, index) {
			/* string before */
			var part = str.substring(offset, index);
			if (part.length) {
				result.push({
					type: ROT.Text.TYPE_TEXT,
					value: part
				});
			}

			/* color command */
			result.push({
				type: (type == "c" ? ROT.Text.TYPE_FG : ROT.Text.TYPE_BG),
				value: name.trim()
			});

			offset = index + match.length;
			return "";
		});

		/* last remaining part */
		var part = str.substring(offset);
		if (part.length) {
			result.push({
				type: ROT.Text.TYPE_TEXT,
				value: part
			});
		}

		return this._breakLines(result, maxWidth);
	},

	/* insert line breaks into first-pass tokenized data */
	_breakLines: function(tokens, maxWidth) {
		if (!maxWidth) { maxWidth = Infinity; };

		var i = 0;
		var lineLength = 0;
		var lastTokenWithSpace = -1;

		while (i < tokens.length) { /* take all text tokens, remove space, apply linebreaks */
			var token = tokens[i];
			if (token.type == ROT.Text.TYPE_NEWLINE) { /* reset */
				lineLength = 0; 
				lastTokenWithSpace = -1;
			}
			if (token.type != ROT.Text.TYPE_TEXT) { /* skip non-text tokens */
				i++;
				continue; 
			}

			/* remove spaces at the beginning of line */
			while (lineLength == 0 && token.value.charAt(0) == " ") { token.value = token.value.substring(1); }

			/* forced newline? insert two new tokens after this one */
			var index = token.value.indexOf("\n");
			if (index != -1) { 
				token.value = this._breakInsideToken(tokens, i, index, true); 

				/* if there are spaces at the end, we must remove them (we do not want the line too long) */
				var arr = token.value.split("");
				while (arr[arr.length-1] == " ") { arr.pop(); }
				token.value = arr.join("");
			}

			/* token degenerated? */
			if (!token.value.length) {
				tokens.splice(i, 1);
				continue;
			}

			if (lineLength + token.value.length > maxWidth) { /* line too long, find a suitable breaking spot */

				/* is it possible to break within this token? */
				var index = -1;
				while (1) {
					var nextIndex = token.value.indexOf(" ", index+1);
					if (nextIndex == -1) { break; }
					if (lineLength + nextIndex > maxWidth) { break; }
					index = nextIndex;
				}

				if (index != -1) { /* break at space within this one */
					token.value = this._breakInsideToken(tokens, i, index, true);
				} else if (lastTokenWithSpace != -1) { /* is there a previous token where a break can occur? */
					var token = tokens[lastTokenWithSpace];
					var breakIndex = token.value.lastIndexOf(" ");
					token.value = this._breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
					i = lastTokenWithSpace;
				} else { /* force break in this token */
					token.value = this._breakInsideToken(tokens, i, maxWidth-lineLength, false);
				}

			} else { /* line not long, continue */
				lineLength += token.value.length;
				if (token.value.indexOf(" ") != -1) { lastTokenWithSpace = i; }
			}
			
			i++; /* advance to next token */
		}


		tokens.push({type: ROT.Text.TYPE_NEWLINE}); /* insert fake newline to fix the last text line */

		/* remove trailing space from text tokens before newlines */
		var lastTextToken = null;
		for (var i=0;i<tokens.length;i++) {
			var token = tokens[i];
			switch (token.type) {
				case ROT.Text.TYPE_TEXT: lastTextToken = token; break;
				case ROT.Text.TYPE_NEWLINE: 
					if (lastTextToken) { /* remove trailing space */
						var arr = lastTextToken.value.split("");
						while (arr[arr.length-1] == " ") { arr.pop(); }
						lastTextToken.value = arr.join("");
					}
					lastTextToken = null;
				break;
			}
		}

		tokens.pop(); /* remove fake token */

		return tokens;
	},

	/**
	 * Create new tokens and insert them into the stream
	 * @param {object[]} tokens
	 * @param {int} tokenIndex Token being processed
	 * @param {int} breakIndex Index within current token's value
	 * @param {bool} removeBreakChar Do we want to remove the breaking character?
	 * @returns {string} remaining unbroken token value
	 */
	_breakInsideToken: function(tokens, tokenIndex, breakIndex, removeBreakChar) {
		var newBreakToken = {
			type: ROT.Text.TYPE_NEWLINE
		}
		var newTextToken = {
			type: ROT.Text.TYPE_TEXT,
			value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
		}
		tokens.splice(tokenIndex+1, 0, newBreakToken, newTextToken);
		return tokens[tokenIndex].value.substring(0, breakIndex);
	}
}
/**
 * @returns {any} Randomly picked item, null when length=0
 */
Array.prototype.random = function() {
	if (!this.length) { return null; }
	return this[Math.floor(ROT.RNG.getUniform() * this.length)];
}

/**
 * @returns {array} New array with randomized items
 * FIXME destroys this!
 */
Array.prototype.randomize = function() {
	var result = [];
	while (this.length) {
		var index = this.indexOf(this.random());
		result.push(this.splice(index, 1)[0]);
	}
	return result;
}
/**
 * Always positive modulus
 * @param {int} n Modulus
 * @returns {int} this modulo n
 */
Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
}
/**
 * @returns {string} First letter capitalized
 */
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.substring(1);
}

/** 
 * Left pad
 * @param {string} [character="0"]
 * @param {int} [count=2]
 */
String.prototype.lpad = function(character, count) {
	var ch = character || "0";
	var cnt = count || 2;

	var s = "";
	while (s.length < (cnt - this.length)) { s += ch; }
	s = s.substring(0, cnt-this.length);
	return s+this;
}

/** 
 * Right pad
 * @param {string} [character="0"]
 * @param {int} [count=2]
 */
String.prototype.rpad = function(character, count) {
	var ch = character || "0";
	var cnt = count || 2;

	var s = "";
	while (s.length < (cnt - this.length)) { s += ch; }
	s = s.substring(0, cnt-this.length);
	return this+s;
}

/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */
String.format = function(template) {
	var map = String.format.map;
	var args = Array.prototype.slice.call(arguments, 1);

	var replacer = function(match, group1, group2, index) {
		if (template.charAt(index-1) == "%") { return match.substring(1); }
		if (!args.length) { return match; }
		var obj = args[0];

		var group = group1 || group2;
		var parts = group.split(",");
		var name = parts.shift();
		var method = map[name.toLowerCase()];
		if (!method) { return match; }

		var obj = args.shift();
		var replaced = obj[method].apply(obj, parts);

		var first = name.charAt(0);
		if (first != first.toLowerCase()) { replaced = replaced.capitalize(); }

		return replaced;
	}
	return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
}

String.format.map = {
	"s": "toString"
}

/**
 * Convenience shortcut to String.format(this)
 */
String.prototype.format = function() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift(this);
	return String.format.apply(String, args);
}

if (!Object.create) {  
	/**
	 * ES5 Object.create
	 */
	Object.create = function(o) {  
		var tmp = function() {};
		tmp.prototype = o;
		return new tmp();
	};  
}  
/**
 * Sets prototype of this function to an instance of parent function
 * @param {function} parent
 */
Function.prototype.extend = function(parent) {
	this.prototype = Object.create(parent.prototype);
	this.prototype.constructor = this;
	return this;
}
window.requestAnimationFrame =
	window.requestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.oRequestAnimationFrame
	|| window.msRequestAnimationFrame
	|| function(cb) { return setTimeout(cb, 1000/60); };

window.cancelAnimationFrame =
	window.cancelAnimationFrame
	|| window.mozCancelAnimationFrame
	|| window.webkitCancelAnimationFrame
	|| window.oCancelAnimationFrame
	|| window.msCancelAnimationFrame
	|| function(id) { return clearTimeout(id); };
/**
 * @class Visual map display
 * @param {object} [options]
 * @param {int} [options.width=ROT.DEFAULT_WIDTH]
 * @param {int} [options.height=ROT.DEFAULT_HEIGHT]
 * @param {int} [options.fontSize=15]
 * @param {string} [options.fontFamily="monospace"]
 * @param {string} [options.fontStyle=""] bold/italic/none/both
 * @param {string} [options.fg="#ccc"]
 * @param {string} [options.bg="#000"]
 * @param {float} [options.spacing=1]
 * @param {float} [options.border=0]
 * @param {string} [options.layout="rect"]
 * @param {int} [options.tileWidth=32]
 * @param {int} [options.tileHeight=32]
 * @param {object} [options.tileMap={}]
 * @param {image} [options.tileSet=null]
 */
ROT.Display = function(options) {
	var canvas = document.createElement("canvas");
	this._context = canvas.getContext("2d");
	this._data = {};
	this._dirty = false; /* false = nothing, true = all, object = dirty cells */
	this._options = {};
	this._backend = null;
	
	var defaultOptions = {
		width: ROT.DEFAULT_WIDTH,
		height: ROT.DEFAULT_HEIGHT,
		layout: "rect",
		fontSize: 15,
		spacing: 1,
		border: 0,
		fontFamily: "monospace",
		fontStyle: "",
		fg: "#ccc",
		bg: "#000",
		tileWidth: 32,
		tileHeight: 32,
		tileMap: {},
		tileSet: null,
		termColor: "xterm"
	};
	for (var p in options) { defaultOptions[p] = options[p]; }
	this.setOptions(defaultOptions);
	this.DEBUG = this.DEBUG.bind(this);

	this._tick = this._tick.bind(this);
	requestAnimationFrame(this._tick);
}

/**
 * Debug helper, ideal as a map generator callback. Always bound to this.
 * @param {int} x
 * @param {int} y
 * @param {int} what
 */
ROT.Display.prototype.DEBUG = function(x, y, what) {
	var colors = [this._options.bg, this._options.fg];
	this.draw(x, y, null, null, colors[what % colors.length]);
}

/**
 * Clear the whole display (cover it with background color)
 */
ROT.Display.prototype.clear = function() {
	this._data = {};
	this._dirty = true;
}

/**
 * @see ROT.Display
 */
ROT.Display.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
	if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
		if (options.layout) { 
			this._backend = new ROT.Display[options.layout.capitalize()](this._context);
		}

		var font = (this._options.fontStyle ? this._options.fontStyle + " " : "") + this._options.fontSize + "px " + this._options.fontFamily;
		this._context.font = font;
		this._backend.compute(this._options);
		this._context.font = font;
		this._context.textAlign = "center";
		this._context.textBaseline = "middle";
		this._dirty = true;
	}
	return this;
}

/**
 * Returns currently set options
 * @returns {object} Current options object 
 */
ROT.Display.prototype.getOptions = function() {
	return this._options;
}

/**
 * Returns the DOM node of this display
 * @returns {node} DOM node
 */
ROT.Display.prototype.getContainer = function() {
	return this._context.canvas;
}

/**
 * Compute the maximum width/height to fit into a set of given constraints
 * @param {int} availWidth Maximum allowed pixel width
 * @param {int} availHeight Maximum allowed pixel height
 * @returns {int[2]} cellWidth,cellHeight
 */
ROT.Display.prototype.computeSize = function(availWidth, availHeight) {
	return this._backend.computeSize(availWidth, availHeight, this._options);
}

/**
 * Compute the maximum font size to fit into a set of given constraints
 * @param {int} availWidth Maximum allowed pixel width
 * @param {int} availHeight Maximum allowed pixel height
 * @returns {int} fontSize
 */
ROT.Display.prototype.computeFontSize = function(availWidth, availHeight) {
	return this._backend.computeFontSize(availWidth, availHeight, this._options);
}

/**
 * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
 * @param {Event} e event
 * @returns {int[2]} -1 for values outside of the canvas
 */
ROT.Display.prototype.eventToPosition = function(e) {
	if (e.touches) {
		var x = e.touches[0].clientX;
		var y = e.touches[0].clientY;
	} else {
		var x = e.clientX;
		var y = e.clientY;
	}

	var rect = this._context.canvas.getBoundingClientRect();
	x -= rect.left;
	y -= rect.top;
	
	if (x < 0 || y < 0 || x >= this._context.canvas.width || y >= this._context.canvas.height) { return [-1, -1]; }

	return this._backend.eventToPosition(x, y);
}

/**
 * @param {int} x
 * @param {int} y
 * @param {string || string[]} ch One or more chars (will be overlapping themselves)
 * @param {string} [fg] foreground color
 * @param {string} [bg] background color
 */
ROT.Display.prototype.draw = function(x, y, ch, fg, bg) {
	if (!fg) { fg = this._options.fg; }
	if (!bg) { bg = this._options.bg; }
	this._data[x+","+y] = [x, y, ch, fg, bg];
	
	if (this._dirty === true) { return; } /* will already redraw everything */
	if (!this._dirty) { this._dirty = {}; } /* first! */
	this._dirty[x+","+y] = true;
}

/**
 * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
 * @param {int} x
 * @param {int} y
 * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
 * @param {int} [maxWidth] wrap at what width?
 * @returns {int} lines drawn
 */
ROT.Display.prototype.drawText = function(x, y, text, maxWidth) {
	var fg = null;
	var bg = null;
	var cx = x;
	var cy = y;
	var lines = 1;
	if (!maxWidth) { maxWidth = this._options.width-x; }

	var tokens = ROT.Text.tokenize(text, maxWidth);

	while (tokens.length) { /* interpret tokenized opcode stream */
		var token = tokens.shift();
		switch (token.type) {
			case ROT.Text.TYPE_TEXT:
				for (var i=0;i<token.value.length;i++) {
					this.draw(cx++, cy, token.value.charAt(i), fg, bg);
				}
			break;

			case ROT.Text.TYPE_FG:
				fg = token.value || null;
			break;

			case ROT.Text.TYPE_BG:
				bg = token.value || null;
			break;

			case ROT.Text.TYPE_NEWLINE:
				cx = x;
				cy++;
				lines++
			break;
		}
	}

	return lines;
}

/**
 * Timer tick: update dirty parts
 */
ROT.Display.prototype._tick = function() {
	requestAnimationFrame(this._tick);

	if (!this._dirty) { return; }

	if (this._dirty === true) { /* draw all */
		this._context.fillStyle = this._options.bg;
		this._context.fillRect(0, 0, this._context.canvas.width, this._context.canvas.height);

		for (var id in this._data) { /* redraw cached data */
			this._draw(id, false);
		}

	} else { /* draw only dirty */
		for (var key in this._dirty) {
			this._draw(key, true);
		}
	}

	this._dirty = false;
}

/**
 * @param {string} key What to draw
 * @param {bool} clearBefore Is it necessary to clean before?
 */
ROT.Display.prototype._draw = function(key, clearBefore) {
	var data = this._data[key];
	if (data[4] != this._options.bg) { clearBefore = true; }

	this._backend.draw(data, clearBefore);
}
/**
 * @class Abstract display backend module
 * @private
 */
ROT.Display.Backend = function(context) {
	this._context = context;
}

ROT.Display.Backend.prototype.compute = function(options) {
}

ROT.Display.Backend.prototype.draw = function(data, clearBefore) {
}

ROT.Display.Backend.prototype.computeSize = function(availWidth, availHeight) {
}

ROT.Display.Backend.prototype.computeFontSize = function(availWidth, availHeight) {
}

ROT.Display.Backend.prototype.eventToPosition = function(x, y) {
}
/**
 * @class Rectangular backend
 * @private
 */
ROT.Display.Rect = function(context) {
	ROT.Display.Backend.call(this, context);
	
	this._spacingX = 0;
	this._spacingY = 0;
	this._canvasCache = {};
	this._options = {};
}
ROT.Display.Rect.extend(ROT.Display.Backend);

ROT.Display.Rect.cache = false;

ROT.Display.Rect.prototype.compute = function(options) {
	this._canvasCache = {};
	this._options = options;

	var charWidth = Math.ceil(this._context.measureText("W").width);
	this._spacingX = Math.ceil(options.spacing * charWidth);
	this._spacingY = Math.ceil(options.spacing * options.fontSize);
	this._context.canvas.width = options.width * this._spacingX;
	this._context.canvas.height = options.height * this._spacingY;
}

ROT.Display.Rect.prototype.draw = function(data, clearBefore) {
	if (this.constructor.cache) {
		this._drawWithCache(data, clearBefore);
	} else {
		this._drawNoCache(data, clearBefore);
	}
}

ROT.Display.Rect.prototype._drawWithCache = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	var hash = ""+ch+fg+bg;
	if (hash in this._canvasCache) {
		var canvas = this._canvasCache[hash];
	} else {
		var b = this._options.border;
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = this._spacingX;
		canvas.height = this._spacingY;
		ctx.fillStyle = bg;
		ctx.fillRect(b, b, canvas.width-b, canvas.height-b);
		
		if (ch) {
			ctx.fillStyle = fg;
			ctx.font = this._context.font;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			var chars = [].concat(ch);
			for (var i=0;i<chars.length;i++) {
				ctx.fillText(chars[i], this._spacingX/2, this._spacingY/2);
			}
		}
		this._canvasCache[hash] = canvas;
	}
	
	this._context.drawImage(canvas, x*this._spacingX, y*this._spacingY);
}

ROT.Display.Rect.prototype._drawNoCache = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	if (clearBefore) { 
		var b = this._options.border;
		this._context.fillStyle = bg;
		this._context.fillRect(x*this._spacingX + b, y*this._spacingY + b, this._spacingX - b, this._spacingY - b);
	}
	
	if (!ch) { return; }

	this._context.fillStyle = fg;

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		this._context.fillText(chars[i], (x+0.5) * this._spacingX, (y+0.5) * this._spacingY);
	}
}

ROT.Display.Rect.prototype.computeSize = function(availWidth, availHeight) {
	var width = Math.floor(availWidth / this._spacingX);
	var height = Math.floor(availHeight / this._spacingY);
	return [width, height];
}

ROT.Display.Rect.prototype.computeFontSize = function(availWidth, availHeight) {
	var boxWidth = Math.floor(availWidth / this._options.width);
	var boxHeight = Math.floor(availHeight / this._options.height);

	/* compute char ratio */
	var oldFont = this._context.font;
	this._context.font = "100px " + this._options.fontFamily;
	var width = Math.ceil(this._context.measureText("W").width);
	this._context.font = oldFont;
	var ratio = width / 100;
		
	var widthFraction = ratio * boxHeight / boxWidth;
	if (widthFraction > 1) { /* too wide with current aspect ratio */
		boxHeight = Math.floor(boxHeight / widthFraction);
	}
	return Math.floor(boxHeight / this._options.spacing);
}

ROT.Display.Rect.prototype.eventToPosition = function(x, y) {
	return [Math.floor(x/this._spacingX), Math.floor(y/this._spacingY)];
}
/**
 * @class Hexagonal backend
 * @private
 */
ROT.Display.Hex = function(context) {
	ROT.Display.Backend.call(this, context);

	this._spacingX = 0;
	this._spacingY = 0;
	this._hexSize = 0;
	this._options = {};
}
ROT.Display.Hex.extend(ROT.Display.Backend);

ROT.Display.Hex.prototype.compute = function(options) {
	this._options = options;

	var charWidth = Math.ceil(this._context.measureText("W").width);
	this._hexSize = Math.floor(options.spacing * (options.fontSize + charWidth/Math.sqrt(3)) / 2);
	this._spacingX = this._hexSize * Math.sqrt(3) / 2;
	this._spacingY = this._hexSize * 1.5;
	this._context.canvas.width = Math.ceil( (options.width + 1) * this._spacingX );
	this._context.canvas.height = Math.ceil( (options.height - 1) * this._spacingY + 2*this._hexSize );
}

ROT.Display.Hex.prototype.draw = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	var cx = (x+1) * this._spacingX;
	var cy = y * this._spacingY + this._hexSize;

	if (clearBefore) { 
		this._context.fillStyle = bg;
		this._fill(cx, cy);
	}
	
	if (!ch) { return; }

	this._context.fillStyle = fg;

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		this._context.fillText(chars[i], cx, cy);
	}
}


ROT.Display.Hex.prototype.computeSize = function(availWidth, availHeight) {
	var width = Math.floor(availWidth / this._spacingX) - 1;
	var height = Math.floor((availHeight - 2*this._hexSize) / this._spacingY + 1);
	return [width, height];
}

ROT.Display.Hex.prototype.computeFontSize = function(availWidth, availHeight) {
	var hexSizeWidth = 2*availWidth / ((this._options.width+1) * Math.sqrt(3)) - 1;
	var hexSizeHeight = availHeight / (2 + 1.5*(this._options.height-1));
	var hexSize = Math.min(hexSizeWidth, hexSizeHeight);

	/* compute char ratio */
	var oldFont = this._context.font;
	this._context.font = "100px " + this._options.fontFamily;
	var width = Math.ceil(this._context.measureText("W").width);
	this._context.font = oldFont;
	var ratio = width / 100;

	hexSize = Math.floor(hexSize)+1; /* closest larger hexSize */

	var fontSize = 2*hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));

	/* closest smaller fontSize */
	return Math.ceil(fontSize)-1;
}

ROT.Display.Hex.prototype.eventToPosition = function(x, y) {
	var height = this._context.canvas.height / this._options.height;
	y = Math.floor(y/height);
	
	if (y.mod(2)) { /* odd row */
		x -= this._spacingX;
		x = 1 + 2*Math.floor(x/(2*this._spacingX));
	} else {
		x = 2*Math.floor(x/(2*this._spacingX));
	}
	
	return [x, y];
}

ROT.Display.Hex.prototype._fill = function(cx, cy) {
	var a = this._hexSize;
	var b = this._options.border;
	
	this._context.beginPath();
	this._context.moveTo(cx, cy-a+b);
	this._context.lineTo(cx + this._spacingX - b, cy-a/2+b);
	this._context.lineTo(cx + this._spacingX - b, cy+a/2-b);
	this._context.lineTo(cx, cy+a-b);
	this._context.lineTo(cx - this._spacingX + b, cy+a/2-b);
	this._context.lineTo(cx - this._spacingX + b, cy-a/2+b);
	this._context.lineTo(cx, cy-a+b);
	this._context.fill();
}
/**
 * @class Tile backend
 * @private
 */
ROT.Display.Tile = function(context) {
	ROT.Display.Rect.call(this, context);
	
	this._options = {};
}
ROT.Display.Tile.extend(ROT.Display.Rect);

ROT.Display.Tile.prototype.compute = function(options) {
	this._options = options;
	this._context.canvas.width = options.width * options.tileWidth;
	this._context.canvas.height = options.height * options.tileHeight;
}

ROT.Display.Tile.prototype.draw = function(data, clearBefore) {
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	var tileWidth = this._options.tileWidth;
	var tileHeight = this._options.tileHeight;

	if (clearBefore) {
		var b = this._options.border;
		this._context.fillStyle = bg;
		this._context.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
	}

	if (!ch) { return; }

	var chars = [].concat(ch);
	for (var i=0;i<chars.length;i++) {
		var tile = this._options.tileMap[chars[i]];
		if (!tile) { throw new Error("Char '" + chars[i] + "' not found in tileMap"); }
		
		this._context.drawImage(
			this._options.tileSet,
			tile[0], tile[1], tileWidth, tileHeight,
			x*tileWidth, y*tileHeight, tileWidth, tileHeight
		);
	}
}

ROT.Display.Tile.prototype.computeSize = function(availWidth, availHeight) {
	var width = Math.floor(availWidth / this._options.tileWidth);
	var height = Math.floor(availHeight / this._options.tileHeight);
	return [width, height];
}

ROT.Display.Tile.prototype.computeFontSize = function(availWidth, availHeight) {
	var width = Math.floor(availWidth / this._options.width);
	var height = Math.floor(availHeight / this._options.height);
	return [width, height];
}
/**
 * @class Terminal backend
 * @private
 */
ROT.Display.Term = function(context) {
	ROT.Display.Backend.call(this, context);
	this._cx = -1;
	this._cy = -1;
	this._lastColor = "";
	this._options = {};
	this._ox = 0;
	this._oy = 0;
	this._termcolor = {};
}
ROT.Display.Term.extend(ROT.Display.Backend);

ROT.Display.Term.prototype.compute = function(options) {
	this._options = options;
	this._ox = Math.floor((process.stdout.columns - options.width) / 2);
	this._oy = Math.floor((process.stdout.rows - options.height) / 2);
	this._termcolor = new ROT.Display.Term[options.termColor.capitalize()](this._context);
	this._context._termcolor = this._termcolor;
}

ROT.Display.Term.prototype.draw = function(data, clearBefore) {
	// determine where to draw what with what colors
	var x = data[0];
	var y = data[1];
	var ch = data[2];
	var fg = data[3];
	var bg = data[4];

	// determine if we need to move the terminal cursor
	var dx = this._ox + x;
	var dy = this._oy + y;
	if (dx < 0 || dx >= process.stdout.columns) { return; }
	if (dy < 0 || dy >= process.stdout.rows) { return; }
	if (dx !== this._cx || dy !== this._cy) {
		process.stdout.write(this._termcolor.positionToAnsi(dx,dy));
		this._cx = dx;
		this._cy = dy;
	}

	// terminals automatically clear, but if we're clearing when we're
	// not otherwise provided with a character, just use a space instead
	if (clearBefore) {
		if (!ch) {
			ch = " ";
		}
	}
		
	// if we're not clearing and not provided with a character, do nothing
	if (!ch) { return; }

	// determine if we need to change colors
	var newColor = this._termcolor.colorToAnsi(fg,bg);
	if (newColor !== this._lastColor) {
		process.stdout.write(newColor);
		this._lastColor = newColor;
	}

	// write the provided symbol to the display
	var chars = [].concat(ch);
	process.stdout.write(chars[0]);

	// update our position, given that we wrote a character
	this._cx++;
	if (this._cx >= process.stdout.columns) {
		this._cx = 0;
		this._cy++;
	}
}

ROT.Display.Term.prototype.computeSize = function(availWidth, availHeight) {
	return [process.stdout.columns, process.stdout.rows];
}

ROT.Display.Term.prototype.computeFontSize = function(availWidth, availHeight) {
	return 12;
}

ROT.Display.Term.prototype.eventToPosition = function(x, y) {
	return [x,y]
}
/**
 * @class Abstract terminal code module
 * @private
 */
ROT.Display.Term.Color = function(context) {
	this._context = context;
}

ROT.Display.Term.Color.prototype.clearToAnsi = function(bg) {
}

ROT.Display.Term.Color.prototype.colorToAnsi = function(fg, bg) {
}

ROT.Display.Term.Color.prototype.positionToAnsi = function(x, y) {
}
/**
 * @class xterm terminal code module
 * @private
 */
ROT.Display.Term.Xterm = function(context) {
	ROT.Display.Term.Color.call(this, context);
}
ROT.Display.Term.Xterm.extend(ROT.Display.Term.Color);

ROT.Display.Term.Xterm.prototype.clearToAnsi = function(bg) {
	return "\x1b[0;48;5;"
		+ this._termcolor(bg)
		+ "m\x1b[2J";
}

ROT.Display.Term.Xterm.prototype.colorToAnsi = function(fg, bg) {
	return "\x1b[0;38;5;"
		+ this._termcolor(fg)
		+ ";48;5;"
		+ this._termcolor(bg)
		+ "m";
}

ROT.Display.Term.Xterm.prototype.positionToAnsi = function(x, y) {
	return "\x1b[" + (y+1) + ";" + (x+1) + "H";
}

ROT.Display.Term.Xterm.prototype._termcolor = function(color) {
	var SRC_COLORS = 256.0;
	var DST_COLORS = 6.0;
	var COLOR_RATIO = DST_COLORS / SRC_COLORS;
	var rgb = ROT.Color.fromString(color);
	var r = Math.floor(rgb[0] * COLOR_RATIO);
	var g = Math.floor(rgb[1] * COLOR_RATIO);
	var b = Math.floor(rgb[2] * COLOR_RATIO);
	return r*36 + g*6 + b*1 + 16;
}
/**
 * @namespace
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
ROT.RNG = {
	/**
	 * @returns {number} 
	 */
	getSeed: function() {
		return this._seed;
	},

	/**
	 * @param {number} seed Seed the number generator
	 */
	setSeed: function(seed) {
		seed = (seed < 1 ? 1/seed : seed);

		this._seed = seed;
		this._s0 = (seed >>> 0) * this._frac;

		seed = (seed*69069 + 1) >>> 0;
		this._s1 = seed * this._frac;

		seed = (seed*69069 + 1) >>> 0;
		this._s2 = seed * this._frac;

		this._c = 1;
		return this;
	},

	/**
	 * @returns {float} Pseudorandom value [0,1), uniformly distributed
	 */
	getUniform: function() {
		var t = 2091639 * this._s0 + this._c * this._frac;
		this._s0 = this._s1;
		this._s1 = this._s2;
		this._c = t | 0;
		this._s2 = t - this._c;
		return this._s2;
	},

	/**
	 * @param {int} lowerBound The lower end of the range to return a value from, inclusive
	 * @param {int} upperBound The upper end of the range to return a value from, inclusive
	 * @returns {int} Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
	 */
	getUniformInt: function(lowerBound, upperBound) {
		var max = Math.max(lowerBound, upperBound);
		var min = Math.min(lowerBound, upperBound);
		return Math.floor(this.getUniform() * (max - min + 1)) + min;
	},

	/**
	 * @param {float} [mean=0] Mean value
	 * @param {float} [stddev=1] Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
	 * @returns {float} A normally distributed pseudorandom value
	 */
	getNormal: function(mean, stddev) {
		do {
			var u = 2*this.getUniform()-1;
			var v = 2*this.getUniform()-1;
			var r = u*u + v*v;
		} while (r > 1 || r == 0);

		var gauss = u * Math.sqrt(-2*Math.log(r)/r);
		return (mean || 0) + gauss*(stddev || 1);
	},

	/**
	 * @returns {int} Pseudorandom value [1,100] inclusive, uniformly distributed
	 */
	getPercentage: function() {
		return 1 + Math.floor(this.getUniform()*100);
	},
	
	/**
	 * @param {object} data key=whatever, value=weight (relative probability)
	 * @returns {string} whatever
	 */
	getWeightedValue: function(data) {
		var avail = [];
		var total = 0;
		
		for (var id in data) {
			total += data[id];
		}
		var random = Math.floor(this.getUniform()*total);
		
		var part = 0;
		for (var id in data) {
			part += data[id];
			if (random < part) { return id; }
		}
		
		return null;
	},

	/**
	 * Get RNG state. Useful for storing the state and re-setting it via setState.
	 * @returns {?} Internal state
	 */
	getState: function() {
		return [this._s0, this._s1, this._s2, this._c];
	},

	/**
	 * Set a previously retrieved state.
	 * @param {?} state
	 */
	setState: function(state) {
		this._s0 = state[0];
		this._s1 = state[1];
		this._s2 = state[2];
		this._c  = state[3];
		return this;
	},

	_s0: 0,
	_s1: 0,
	_s2: 0,
	_c: 0,
	_frac: 2.3283064365386963e-10 /* 2^-32 */
}

ROT.RNG.setSeed(Date.now());
/**
 * @class (Markov process)-based string generator. 
 * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>. 
 * Offers configurable order and prior.
 * @param {object} [options]
 * @param {bool} [options.words=false] Use word mode?
 * @param {int} [options.order=3]
 * @param {float} [options.prior=0.001]
 */
ROT.StringGenerator = function(options) {
	this._options = {
		words: false,
		order: 3,
		prior: 0.001
	}
	for (var p in options) { this._options[p] = options[p]; }

	this._boundary = String.fromCharCode(0);
	this._suffix = this._boundary;
	this._prefix = [];
	for (var i=0;i<this._options.order;i++) { this._prefix.push(this._boundary); }

	this._priorValues = {};
	this._priorValues[this._boundary] = this._options.prior;

	this._data = {};
}

/**
 * Remove all learning data
 */
ROT.StringGenerator.prototype.clear = function() {
	this._data = {};
	this._priorValues = {};
}

/**
 * @returns {string} Generated string
 */
ROT.StringGenerator.prototype.generate = function() {
	var result = [this._sample(this._prefix)];
	while (result[result.length-1] != this._boundary) {
		result.push(this._sample(result));
	}
	return this._join(result.slice(0, -1));
}

/**
 * Observe (learn) a string from a training set
 */
ROT.StringGenerator.prototype.observe = function(string) {
	var tokens = this._split(string);

	for (var i=0; i<tokens.length; i++) {
		this._priorValues[tokens[i]] = this._options.prior;
	}

	tokens = this._prefix.concat(tokens).concat(this._suffix); /* add boundary symbols */

	for (var i=this._options.order; i<tokens.length; i++) {
		var context = tokens.slice(i-this._options.order, i);
		var event = tokens[i];
		for (var j=0; j<context.length; j++) {
			var subcontext = context.slice(j);
			this._observeEvent(subcontext, event);
		}
	}
}

ROT.StringGenerator.prototype.getStats = function() {
	var parts = [];

	var priorCount = 0;
	for (var p in this._priorValues) { priorCount++; }
	priorCount--; /* boundary */
	parts.push("distinct samples: " + priorCount);

	var dataCount = 0;
	var eventCount = 0;
	for (var p in this._data) { 
		dataCount++; 
		for (var key in this._data[p]) {
			eventCount++;
		}
	}
	parts.push("dictionary size (contexts): " + dataCount);
	parts.push("dictionary size (events): " + eventCount);

	return parts.join(", ");
}

/**
 * @param {string}
 * @returns {string[]}
 */
ROT.StringGenerator.prototype._split = function(str) {
	return str.split(this._options.words ? /\s+/ : "");
}

/**
 * @param {string[]}
 * @returns {string} 
 */
ROT.StringGenerator.prototype._join = function(arr) {
	return arr.join(this._options.words ? " " : "");
}

/**
 * @param {string[]} context
 * @param {string} event
 */
ROT.StringGenerator.prototype._observeEvent = function(context, event) {
	var key = this._join(context);
	if (!(key in this._data)) { this._data[key] = {}; }
	var data = this._data[key];

	if (!(event in data)) { data[event] = 0; }
	data[event]++;
}

/**
 * @param {string[]}
 * @returns {string}
 */
ROT.StringGenerator.prototype._sample = function(context) {
	context = this._backoff(context);
	var key = this._join(context);
	var data = this._data[key];

	var available = {};

	if (this._options.prior) {
		for (var event in this._priorValues) { available[event] = this._priorValues[event]; }
		for (var event in data) { available[event] += data[event]; }
	} else { 
		available = data;
	}

	return this._pickRandom(available);
}

/**
 * @param {string[]}
 * @returns {string[]}
 */
ROT.StringGenerator.prototype._backoff = function(context) {
	if (context.length > this._options.order) {
		context = context.slice(-this._options.order);
	} else if (context.length < this._options.order) {
		context = this._prefix.slice(0, this._options.order - context.length).concat(context);
	}

	while (!(this._join(context) in this._data) && context.length > 0) { context = context.slice(1); }

	return context;
}


ROT.StringGenerator.prototype._pickRandom = function(data) {
	var total = 0;
	
	for (var id in data) {
		total += data[id];
	}
	var random = ROT.RNG.getUniform()*total;
	
	var part = 0;
	for (var id in data) {
		part += data[id];
		if (random < part) { return id; }
	}
}
/**
 * @class Generic event queue: stores events and retrieves them based on their time
 */
ROT.EventQueue = function() {
	this._time = 0;
	this._events = [];
	this._eventTimes = [];
}

/**
 * @returns {number} Elapsed time
 */
ROT.EventQueue.prototype.getTime = function() {
	return this._time;
}

/**
 * Clear all scheduled events
 */
ROT.EventQueue.prototype.clear = function() {
	this._events = [];
	this._eventTimes = [];
	return this;
}

/**
 * @param {?} event
 * @param {number} time
 */
ROT.EventQueue.prototype.add = function(event, time) {
	var index = this._events.length;
	for (var i=0;i<this._eventTimes.length;i++) {
		if (this._eventTimes[i] > time) {
			index = i;
			break;
		}
	}

	this._events.splice(index, 0, event);
	this._eventTimes.splice(index, 0, time);
}

/**
 * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
 * @returns {? || null} The event previously added by addEvent, null if no event available
 */
ROT.EventQueue.prototype.get = function() {
	if (!this._events.length) { return null; }

	var time = this._eventTimes.splice(0, 1)[0];
	if (time > 0) { /* advance */
		this._time += time;
		for (var i=0;i<this._eventTimes.length;i++) { this._eventTimes[i] -= time; }
	}

	return this._events.splice(0, 1)[0];
}

/**
 * Remove an event from the queue
 * @param {?} event
 * @returns {bool} success?
 */
ROT.EventQueue.prototype.remove = function(event) {
	var index = this._events.indexOf(event);
	if (index == -1) { return false }
	this._remove(index);
	return true;
}

/**
 * Remove an event from the queue
 * @param {int} index
 */
ROT.EventQueue.prototype._remove = function(index) {
	this._events.splice(index, 1);
	this._eventTimes.splice(index, 1);
}
/**
 * @class Abstract scheduler
 */
ROT.Scheduler = function() {
	this._queue = new ROT.EventQueue();
	this._repeat = [];
	this._current = null;
}

/**
 * @see ROT.EventQueue#getTime
 */
ROT.Scheduler.prototype.getTime = function() {
	return this._queue.getTime();
}

/**
 * @param {?} item
 * @param {bool} repeat
 */
ROT.Scheduler.prototype.add = function(item, repeat) {
	if (repeat) { this._repeat.push(item); }
	return this;
}

/**
 * Clear all items
 */
ROT.Scheduler.prototype.clear = function() {
	this._queue.clear();
	this._repeat = [];
	this._current = null;
	return this;
}

/**
 * Remove a previously added item
 * @param {?} item
 * @returns {bool} successful?
 */
ROT.Scheduler.prototype.remove = function(item) {
	var result = this._queue.remove(item);

	var index = this._repeat.indexOf(item);
	if (index != -1) { this._repeat.splice(index, 1); }

	if (this._current == item) { this._current = null; }

	return result;
}

/**
 * Schedule next item
 * @returns {?}
 */
ROT.Scheduler.prototype.next = function() {
	this._current = this._queue.get();
	return this._current;
}
/**
 * @class Simple fair scheduler (round-robin style)
 * @augments ROT.Scheduler
 */
ROT.Scheduler.Simple = function() {
	ROT.Scheduler.call(this);
}
ROT.Scheduler.Simple.extend(ROT.Scheduler);

/**
 * @see ROT.Scheduler#add
 */
ROT.Scheduler.Simple.prototype.add = function(item, repeat) {
	this._queue.add(item, 0);
	return ROT.Scheduler.prototype.add.call(this, item, repeat);
}

/**
 * @see ROT.Scheduler#next
 */
ROT.Scheduler.Simple.prototype.next = function() {
	if (this._current && this._repeat.indexOf(this._current) != -1) {
		this._queue.add(this._current, 0);
	}
	return ROT.Scheduler.prototype.next.call(this);
}
/**
 * @class Speed-based scheduler
 * @augments ROT.Scheduler
 */
ROT.Scheduler.Speed = function() {
	ROT.Scheduler.call(this);
}
ROT.Scheduler.Speed.extend(ROT.Scheduler);

/**
 * @param {object} item anything with "getSpeed" method
 * @param {bool} repeat
 * @see ROT.Scheduler#add
 */
ROT.Scheduler.Speed.prototype.add = function(item, repeat) {
	this._queue.add(item, 1/item.getSpeed());
	return ROT.Scheduler.prototype.add.call(this, item, repeat);
}

/**
 * @see ROT.Scheduler#next
 */
ROT.Scheduler.Speed.prototype.next = function() {
	if (this._current && this._repeat.indexOf(this._current) != -1) {
		this._queue.add(this._current, 1/this._current.getSpeed());
	}
	return ROT.Scheduler.prototype.next.call(this);
}
/**
 * @class Action-based scheduler
 * @augments ROT.Scheduler
 */
ROT.Scheduler.Action = function() {
	ROT.Scheduler.call(this);
	this._defaultDuration = 1; /* for newly added */
	this._duration = this._defaultDuration; /* for this._current */
}
ROT.Scheduler.Action.extend(ROT.Scheduler);

/**
 * @param {object} item
 * @param {bool} repeat
 * @param {number} [time=1]
 * @see ROT.Scheduler#add
 */
ROT.Scheduler.Action.prototype.add = function(item, repeat, time) {
	this._queue.add(item, time || this._defaultDuration);
	return ROT.Scheduler.prototype.add.call(this, item, repeat);
}

ROT.Scheduler.Action.prototype.clear = function() {
	this._duration = this._defaultDuration;
	return ROT.Scheduler.prototype.clear.call(this);
}

ROT.Scheduler.Action.prototype.remove = function(item) {
	if (item == this._current) { this._duration = this._defaultDuration; }
	return ROT.Scheduler.prototype.remove.call(this, item);
}

/**
 * @see ROT.Scheduler#next
 */
ROT.Scheduler.Action.prototype.next = function() {
	if (this._current && this._repeat.indexOf(this._current) != -1) {
		this._queue.add(this._current, this._duration || this._defaultDuration);
		this._duration = this._defaultDuration;
	}
	return ROT.Scheduler.prototype.next.call(this);
}

/**
 * Set duration for the active item
 */
ROT.Scheduler.Action.prototype.setDuration = function(time) {
	if (this._current) { this._duration = time; }
	return this;
}
/**
 * @class Asynchronous main loop
 * @param {ROT.Scheduler} scheduler
 */
ROT.Engine = function(scheduler) {
	this._scheduler = scheduler;
	this._lock = 1;
}

/**
 * Start the main loop. When this call returns, the loop is locked.
 */
ROT.Engine.prototype.start = function() {
	return this.unlock();
}

/**
 * Interrupt the engine by an asynchronous action
 */
ROT.Engine.prototype.lock = function() {
	this._lock++;
	return this;
}

/**
 * Resume execution (paused by a previous lock)
 */
ROT.Engine.prototype.unlock = function() {
	if (!this._lock) { throw new Error("Cannot unlock unlocked engine"); }
	this._lock--;

	while (!this._lock) {
		var actor = this._scheduler.next();
		if (!actor) { return this.lock(); } /* no actors */
		var result = actor.act();
		if (result && result.then) { /* actor returned a "thenable", looks like a Promise */
			this.lock();
			result.then(this.unlock.bind(this));
		}
	}

	return this;
}
/**
 * @class Base map generator
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 */
ROT.Map = function(width, height) {
	this._width = width || ROT.DEFAULT_WIDTH;
	this._height = height || ROT.DEFAULT_HEIGHT;
};

ROT.Map.prototype.create = function(callback) {}

ROT.Map.prototype._fillMap = function(value) {
	var map = [];
	for (var i=0;i<this._width;i++) {
		map.push([]);
		for (var j=0;j<this._height;j++) { map[i].push(value); }
	}
	return map;
}
/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
ROT.Map.Arena = function(width, height) {
	ROT.Map.call(this, width, height);
}
ROT.Map.Arena.extend(ROT.Map);

ROT.Map.Arena.prototype.create = function(callback) {
	var w = this._width-1;
	var h = this._height-1;
	for (var i=0;i<=w;i++) {
		for (var j=0;j<=h;j++) {
			var empty = (i && j && i<w && j<h);
			callback(i, j, empty ? 0 : 1);
		}
	}
	return this;
}
/**
 * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 * @augments ROT.Map
 */
ROT.Map.DividedMaze = function(width, height) {
	ROT.Map.call(this, width, height);
	this._stack = [];
}
ROT.Map.DividedMaze.extend(ROT.Map);

ROT.Map.DividedMaze.prototype.create = function(callback) {
	var w = this._width;
	var h = this._height;
	
	this._map = [];
	
	for (var i=0;i<w;i++) {
		this._map.push([]);
		for (var j=0;j<h;j++) {
			var border = (i == 0 || j == 0 || i+1 == w || j+1 == h);
			this._map[i].push(border ? 1 : 0);
		}
	}
	
	this._stack = [
		[1, 1, w-2, h-2]
	];
	this._process();
	
	for (var i=0;i<w;i++) {
		for (var j=0;j<h;j++) {
			callback(i, j, this._map[i][j]);
		}
	}
	this._map = null;
	return this;
}

ROT.Map.DividedMaze.prototype._process = function() {
	while (this._stack.length) {
		var room = this._stack.shift(); /* [left, top, right, bottom] */
		this._partitionRoom(room);
	}
}

ROT.Map.DividedMaze.prototype._partitionRoom = function(room) {
	var availX = [];
	var availY = [];
	
	for (var i=room[0]+1;i<room[2];i++) {
		var top = this._map[i][room[1]-1];
		var bottom = this._map[i][room[3]+1];
		if (top && bottom && !(i % 2)) { availX.push(i); }
	}
	
	for (var j=room[1]+1;j<room[3];j++) {
		var left = this._map[room[0]-1][j];
		var right = this._map[room[2]+1][j];
		if (left && right && !(j % 2)) { availY.push(j); }
	}

	if (!availX.length || !availY.length) { return; }

	var x = availX.random();
	var y = availY.random();
	
	this._map[x][y] = 1;
	
	var walls = [];
	
	var w = []; walls.push(w); /* left part */
	for (var i=room[0]; i<x; i++) { 
		this._map[i][y] = 1;
		w.push([i, y]); 
	}
	
	var w = []; walls.push(w); /* right part */
	for (var i=x+1; i<=room[2]; i++) { 
		this._map[i][y] = 1;
		w.push([i, y]); 
	}

	var w = []; walls.push(w); /* top part */
	for (var j=room[1]; j<y; j++) { 
		this._map[x][j] = 1;
		w.push([x, j]); 
	}
	
	var w = []; walls.push(w); /* bottom part */
	for (var j=y+1; j<=room[3]; j++) { 
		this._map[x][j] = 1;
		w.push([x, j]); 
	}
		
	var solid = walls.random();
	for (var i=0;i<walls.length;i++) {
		var w = walls[i];
		if (w == solid) { continue; }
		
		var hole = w.random();
		this._map[hole[0]][hole[1]] = 0;
	}

	this._stack.push([room[0], room[1], x-1, y-1]); /* left top */
	this._stack.push([x+1, room[1], room[2], y-1]); /* right top */
	this._stack.push([room[0], y+1, x-1, room[3]]); /* left bottom */
	this._stack.push([x+1, y+1, room[2], room[3]]); /* right bottom */
}
/**
 * @class Icey's Maze generator
 * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
 * @augments ROT.Map
 */
ROT.Map.IceyMaze = function(width, height, regularity) {
	ROT.Map.call(this, width, height);
	this._regularity = regularity || 0;
}
ROT.Map.IceyMaze.extend(ROT.Map);

ROT.Map.IceyMaze.prototype.create = function(callback) {
	var width = this._width;
	var height = this._height;
	
	var map = this._fillMap(1);
	
	width -= (width % 2 ? 1 : 2);
	height -= (height % 2 ? 1 : 2);

	var cx = 0;
	var cy = 0;
	var nx = 0;
	var ny = 0;

	var done = 0;
	var blocked = false;
	var dirs = [
		[0, 0],
		[0, 0],
		[0, 0],
		[0, 0]
	];
	do {
		cx = 1 + 2*Math.floor(ROT.RNG.getUniform()*(width-1) / 2);
		cy = 1 + 2*Math.floor(ROT.RNG.getUniform()*(height-1) / 2);

		if (!done) { map[cx][cy] = 0; }
		
		if (!map[cx][cy]) {
			this._randomize(dirs);
			do {
				if (Math.floor(ROT.RNG.getUniform()*(this._regularity+1)) == 0) { this._randomize(dirs); }
				blocked = true;
				for (var i=0;i<4;i++) {
					nx = cx + dirs[i][0]*2;
					ny = cy + dirs[i][1]*2;
					if (this._isFree(map, nx, ny, width, height)) {
						map[nx][ny] = 0;
						map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;
						
						cx = nx;
						cy = ny;
						blocked = false;
						done++;
						break;
					}
				}
			} while (!blocked);
		}
	} while (done+1 < width*height/4);
	
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			callback(i, j, map[i][j]);
		}
	}
	this._map = null;
	return this;
}

ROT.Map.IceyMaze.prototype._randomize = function(dirs) {
	for (var i=0;i<4;i++) {
		dirs[i][0] = 0;
		dirs[i][1] = 0;
	}
	
	switch (Math.floor(ROT.RNG.getUniform()*4)) {
		case 0:
			dirs[0][0] = -1; dirs[1][0] = 1;
			dirs[2][1] = -1; dirs[3][1] = 1;
		break;
		case 1:
			dirs[3][0] = -1; dirs[2][0] = 1;
			dirs[1][1] = -1; dirs[0][1] = 1;
		break;
		case 2:
			dirs[2][0] = -1; dirs[3][0] = 1;
			dirs[0][1] = -1; dirs[1][1] = 1;
		break;
		case 3:
			dirs[1][0] = -1; dirs[0][0] = 1;
			dirs[3][1] = -1; dirs[2][1] = 1;
		break;
	}
}

ROT.Map.IceyMaze.prototype._isFree = function(map, x, y, width, height) {
	if (x < 1 || y < 1 || x >= width || y >= height) { return false; }
	return map[x][y];
}
/**
 * @class Maze generator - Eller's algorithm
 * See http://homepages.cwi.nl/~tromp/maze.html for explanation
 * @augments ROT.Map
 */
ROT.Map.EllerMaze = function(width, height) {
	ROT.Map.call(this, width, height);
}
ROT.Map.EllerMaze.extend(ROT.Map);

ROT.Map.EllerMaze.prototype.create = function(callback) {
	var map = this._fillMap(1);
	var w = Math.ceil((this._width-2)/2);
	
	var rand = 9/24;
	
	var L = [];
	var R = [];
	
	for (var i=0;i<w;i++) {
		L.push(i);
		R.push(i);
	}
	L.push(w-1); /* fake stop-block at the right side */

	for (var j=1;j+3<this._height;j+=2) {
		/* one row */
		for (var i=0;i<w;i++) {
			/* cell coords (will be always empty) */
			var x = 2*i+1;
			var y = j;
			map[x][y] = 0;
			
			/* right connection */
			if (i != L[i+1] && ROT.RNG.getUniform() > rand) {
				this._addToList(i, L, R);
				map[x+1][y] = 0;
			}
			
			/* bottom connection */
			if (i != L[i] && ROT.RNG.getUniform() > rand) {
				/* remove connection */
				this._removeFromList(i, L, R);
			} else {
				/* create connection */
				map[x][y+1] = 0;
			}
		}
	}

	/* last row */
	for (var i=0;i<w;i++) {
		/* cell coords (will be always empty) */
		var x = 2*i+1;
		var y = j;
		map[x][y] = 0;
		
		/* right connection */
		if (i != L[i+1] && (i == L[i] || ROT.RNG.getUniform() > rand)) {
			/* dig right also if the cell is separated, so it gets connected to the rest of maze */
			this._addToList(i, L, R);
			map[x+1][y] = 0;
		}
		
		this._removeFromList(i, L, R);
	}
	
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			callback(i, j, map[i][j]);
		}
	}
	
	return this;
}

/**
 * Remove "i" from its list
 */
ROT.Map.EllerMaze.prototype._removeFromList = function(i, L, R) {
	R[L[i]] = R[i];
	L[R[i]] = L[i];
	R[i] = i;
	L[i] = i;
}

/**
 * Join lists with "i" and "i+1"
 */
ROT.Map.EllerMaze.prototype._addToList = function(i, L, R) {
	R[L[i+1]] = R[i];
	L[R[i]] = L[i+1];
	R[i] = i+1;
	L[i+1] = i;
}
/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */
ROT.Map.Cellular = function(width, height, options) {
	ROT.Map.call(this, width, height);
	this._options = {
		born: [5, 6, 7, 8],
		survive: [4, 5, 6, 7, 8],
		topology: 8,
		connected: false
	};
	this.setOptions(options);
	
	this._dirs = ROT.DIRS[this._options.topology];
	this._map = this._fillMap(0);
}
ROT.Map.Cellular.extend(ROT.Map);

/**
 * Fill the map with random values
 * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
 */
ROT.Map.Cellular.prototype.randomize = function(probability) {
	for (var i=0;i<this._width;i++) {
		for (var j=0;j<this._height;j++) {
			this._map[i][j] = (ROT.RNG.getUniform() < probability ? 1 : 0);
		}
	}
	return this;
}

/**
 * Change options.
 * @see ROT.Map.Cellular
 */
ROT.Map.Cellular.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
}

ROT.Map.Cellular.prototype.set = function(x, y, value) {
	this._map[x][y] = value;
}

ROT.Map.Cellular.prototype.create = function(callback) {
	var newMap = this._fillMap(0);
	var born = this._options.born;
	var survive = this._options.survive;


	for (var j=0;j<this._height;j++) {
		var widthStep = 1;
		var widthStart = 0;
		if (this._options.topology == 6) { 
			widthStep = 2;
			widthStart = j%2;
		}

		for (var i=widthStart; i<this._width; i+=widthStep) {

			var cur = this._map[i][j];
			var ncount = this._getNeighbors(i, j);
			
			if (cur && survive.indexOf(ncount) != -1) { /* survive */
				newMap[i][j] = 1;
			} else if (!cur && born.indexOf(ncount) != -1) { /* born */
				newMap[i][j] = 1;
			}			
		}
	}
	
	this._map = newMap;

	// optinially connect every space
	if (this._options.connected) {
		this._completeMaze();	
	}

	if (callback) { 
		for (var i = 0; i < this._width; i++) {
			for (var j = 0; j < this._height; j++) {
				callback(i, j, newMap[i][j]);
			}
		}
	}
}

/**
 * Get neighbor count at [i,j] in this._map
 */
ROT.Map.Cellular.prototype._getNeighbors = function(cx, cy) {
	var result = 0;
	for (var i=0;i<this._dirs.length;i++) {
		var dir = this._dirs[i];
		var x = cx + dir[0];
		var y = cy + dir[1];
		
		if (x < 0 || x >= this._width || x < 0 || y >= this._width) { continue; }
		result += (this._map[x][y] == 1 ? 1 : 0);
	}
	
	return result;
}

/**
 * Make sure every non-wall space is accessible.
 */
ROT.Map.Cellular.prototype._completeMaze = function() {
	var allFreeSpace = [];
	var notConnected = {};
	// find all free space
	for (var x = 0; x < this._width; x++) {
		for (var y = 0; y < this._height; y++) {
			if (this._freeSpace(x, y)) {
				var p = [x, y];
				notConnected[this._pointKey(p)] = p;
				allFreeSpace.push([x, y]);
			}
		}
	}
	var start = allFreeSpace[ROT.RNG.getUniformInt(0, allFreeSpace.length - 1)];

	var key = this._pointKey(start);
	var connected = {};
	connected[key] = start;
	delete notConnected[key]

	// find what's connected to the starting point
	this._findConnected(connected, notConnected, [start]);

	while(Object.keys(notConnected).length > 0) {

		// find two points from notConnected to connected
		var p = this._getFromTo(connected, notConnected);
		var from = p[0]; // notConnected
		var to = p[1]; // connected

		// find everything connected to the starting point
		var local = {};
		local[this._pointKey(from)] = from;
		this._findConnected(local, notConnected, [from], true);

		// connect to a connected square
		this._tunnelToConnected(to, from, connected, notConnected);

		// now all of local is connected
		for (var k in local) {
			var pp = local[k];
			this._map[pp[0]][pp[1]] = 0;
			connected[k] = pp;
			delete notConnected[k];
		}
	}
}

/**
 * Find random points to connect. Search for the closest point in the larger space. 
 * This is to minimize the length of the passage while maintaining good performance.
 */
ROT.Map.Cellular.prototype._getFromTo = function(connected, notConnected) {
	var from, to, d;
	var connectedKeys = Object.keys(connected);
	var notConnectedKeys = Object.keys(notConnected);
	for (var i = 0; i < 5; i++) {
		if (connectedKeys.length < notConnectedKeys.length) {
			var keys = connectedKeys;
			to = connected[keys[ROT.RNG.getUniformInt(0, keys.length - 1)]]
			from = this._getClosest(to, notConnected);
		} else {
			var keys = notConnectedKeys;
			from = notConnected[keys[ROT.RNG.getUniformInt(0, keys.length - 1)]]
			to = this._getClosest(from, connected);
		}
		d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);
		if (d < 64) {
			break;
		}
	}
	// console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);
	return [from, to];
}

ROT.Map.Cellular.prototype._getClosest = function(point, space) {
	var minPoint = null;
	var minDist = null;
	for (k in space) {
		var p = space[k];
		var d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);
		if (minDist == null || d < minDist) {
			minDist = d;
			minPoint = p;
		}
	}
	return minPoint;
}

ROT.Map.Cellular.prototype._findConnected = function(connected, notConnected, stack, keepNotConnected) {
	while(stack.length > 0) {
		var p = stack.splice(0, 1)[0];
		var tests = [
			[p[0] + 1, p[1]],
			[p[0] - 1, p[1]],
			[p[0],     p[1] + 1],
			[p[0],     p[1] - 1]
		];
		for (var i = 0; i < tests.length; i++) {
			var key = this._pointKey(tests[i]);
			if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1])) {
				connected[key] = tests[i];
				if (!keepNotConnected) {
					delete notConnected[key];
				}
				stack.push(tests[i]);
			}
		}
	}
}

ROT.Map.Cellular.prototype._tunnelToConnected = function(to, from, connected, notConnected) {
	var key = this._pointKey(from);
	var a, b;
	if (from[0] < to[0]) {
		a = from;
		b = to;
	} else {
		a = to;
		b = from;
	}
	for (var xx = a[0]; xx <= b[0]; xx++) {
		this._map[xx][a[1]] = 0;
		var p = [xx, a[1]];
		var pkey = this._pointKey(p);
		connected[pkey] = p;
		delete notConnected[pkey];
	}

	// x is now fixed
	var x = b[0];

	if (from[1] < to[1]) {
		a = from;
		b = to;
	} else {
		a = to;
		b = from;
	}
	for (var yy = a[1]; yy < b[1]; yy++) {
		this._map[x][yy] = 0;
		var p = [x, yy];
		var pkey = this._pointKey(p);
		connected[pkey] = p;
		delete notConnected[pkey];
	}
}

ROT.Map.Cellular.prototype._freeSpace = function(x, y) {
	return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] != 1;
}

ROT.Map.Cellular.prototype._pointKey = function(p) {
	return p[0] + "." + p[1];
}

/**
 * @class Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
ROT.Map.Dungeon = function(width, height) {
	ROT.Map.call(this, width, height);
	this._rooms = []; /* list of all rooms */
	this._corridors = [];
}
ROT.Map.Dungeon.extend(ROT.Map);

/**
 * Get all generated rooms
 * @returns {ROT.Map.Feature.Room[]}
 */
ROT.Map.Dungeon.prototype.getRooms = function() {
	return this._rooms;
}

/**
 * Get all generated corridors
 * @returns {ROT.Map.Feature.Corridor[]}
 */
ROT.Map.Dungeon.prototype.getCorridors = function() {
	return this._corridors;
}
/**
 * @class Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at 
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 * @augments ROT.Map.Dungeon
 */
ROT.Map.Digger = function(width, height, options) {
	ROT.Map.Dungeon.call(this, width, height);
	
	this._options = {
		roomWidth: [3, 9], /* room minimum and maximum width */
		roomHeight: [3, 5], /* room minimum and maximum height */
		corridorLength: [3, 10], /* corridor minimum and maximum length */
		dugPercentage: 0.2, /* we stop after this percentage of level area has been dug out */
		timeLimit: 1000 /* we stop after this much time has passed (msec) */
	}
	for (var p in options) { this._options[p] = options[p]; }
	
	this._features = {
		"Room": 4,
		"Corridor": 4
	}
	this._featureAttempts = 20; /* how many times do we try to create a feature on a suitable wall */
	this._walls = {}; /* these are available for digging */
	
	this._digCallback = this._digCallback.bind(this);
	this._canBeDugCallback = this._canBeDugCallback.bind(this);
	this._isWallCallback = this._isWallCallback.bind(this);
	this._priorityWallCallback = this._priorityWallCallback.bind(this);
}
ROT.Map.Digger.extend(ROT.Map.Dungeon);

/**
 * Create a map
 * @see ROT.Map#create
 */
ROT.Map.Digger.prototype.create = function(callback) {
	this._rooms = [];
	this._corridors = [];
	this._map = this._fillMap(1);
	this._walls = {};
	this._dug = 0;
	var area = (this._width-2) * (this._height-2);

	this._firstRoom();
	
	var t1 = Date.now();

	do {
		var t2 = Date.now();
		if (t2 - t1 > this._options.timeLimit) { break; }

		/* find a good wall */
		var wall = this._findWall();
		if (!wall) { break; } /* no more walls */
		
		var parts = wall.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		var dir = this._getDiggingDirection(x, y);
		if (!dir) { continue; } /* this wall is not suitable */
		
//		console.log("wall", x, y);

		/* try adding a feature */
		var featureAttempts = 0;
		do {
			featureAttempts++;
			if (this._tryFeature(x, y, dir[0], dir[1])) { /* feature added */
				//if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
				this._removeSurroundingWalls(x, y);
				this._removeSurroundingWalls(x-dir[0], y-dir[1]);
				break; 
			}
		} while (featureAttempts < this._featureAttempts);
		
		var priorityWalls = 0;
		for (var id in this._walls) { 
			if (this._walls[id] > 1) { priorityWalls++; }
		}

	} while (this._dug/area < this._options.dugPercentage || priorityWalls); /* fixme number of priority walls */

	this._addDoors();

	if (callback) {
		for (var i=0;i<this._width;i++) {
			for (var j=0;j<this._height;j++) {
				callback(i, j, this._map[i][j]);
			}
		}
	}
	
	this._walls = {};
	this._map = null;

	return this;
}

ROT.Map.Digger.prototype._digCallback = function(x, y, value) {
	if (value == 0 || value == 2) { /* empty */
		this._map[x][y] = 0;
		this._dug++;
	} else { /* wall */
		this._walls[x+","+y] = 1;
	}
}

ROT.Map.Digger.prototype._isWallCallback = function(x, y) {
	if (x < 0 || y < 0 || x >= this._width || y >= this._height) { return false; }
	return (this._map[x][y] == 1);
}

ROT.Map.Digger.prototype._canBeDugCallback = function(x, y) {
	if (x < 1 || y < 1 || x+1 >= this._width || y+1 >= this._height) { return false; }
	return (this._map[x][y] == 1);
}

ROT.Map.Digger.prototype._priorityWallCallback = function(x, y) {
	this._walls[x+","+y] = 2;
}

ROT.Map.Digger.prototype._firstRoom = function() {
	var cx = Math.floor(this._width/2);
	var cy = Math.floor(this._height/2);
	var room = ROT.Map.Feature.Room.createRandomCenter(cx, cy, this._options);
	this._rooms.push(room);
	room.create(this._digCallback);
}

/**
 * Get a suitable wall
 */
ROT.Map.Digger.prototype._findWall = function() {
	var prio1 = [];
	var prio2 = [];
	for (var id in this._walls) {
		var prio = this._walls[id];
		if (prio == 2) { 
			prio2.push(id); 
		} else {
			prio1.push(id);
		}
	}
	
	var arr = (prio2.length ? prio2 : prio1);
	if (!arr.length) { return null; } /* no walls :/ */
	
	var id = arr.random();
	delete this._walls[id];

	return id;
}

/**
 * Tries adding a feature
 * @returns {bool} was this a successful try?
 */
ROT.Map.Digger.prototype._tryFeature = function(x, y, dx, dy) {
	var feature = ROT.RNG.getWeightedValue(this._features);
	feature = ROT.Map.Feature[feature].createRandomAt(x, y, dx, dy, this._options);
	
	if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
//		console.log("not valid");
//		feature.debug();
		return false;
	}
	
	feature.create(this._digCallback);
//	feature.debug();

	if (feature instanceof ROT.Map.Feature.Room) { this._rooms.push(feature); }
	if (feature instanceof ROT.Map.Feature.Corridor) { 
		feature.createPriorityWalls(this._priorityWallCallback);
		this._corridors.push(feature); 
	}
	
	return true;
}

ROT.Map.Digger.prototype._removeSurroundingWalls = function(cx, cy) {
	var deltas = ROT.DIRS[4];

	for (var i=0;i<deltas.length;i++) {
		var delta = deltas[i];
		var x = cx + delta[0];
		var y = cy + delta[1];
		delete this._walls[x+","+y];
		var x = cx + 2*delta[0];
		var y = cy + 2*delta[1];
		delete this._walls[x+","+y];
	}
}

/**
 * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
 */
ROT.Map.Digger.prototype._getDiggingDirection = function(cx, cy) {
	var result = null;
	var deltas = ROT.DIRS[4];
	
	for (var i=0;i<deltas.length;i++) {
		var delta = deltas[i];
		var x = cx + delta[0];
		var y = cy + delta[1];
		
		if (x < 0 || y < 0 || x >= this._width || y >= this._width) { return null; }
		
		if (!this._map[x][y]) { /* there already is another empty neighbor! */
			if (result) { return null; }
			result = delta;
		}
	}
	
	/* no empty neighbor */
	if (!result) { return null; }
	
	return [-result[0], -result[1]];
}

/**
 * Find empty spaces surrounding rooms, and apply doors.
 */
ROT.Map.Digger.prototype._addDoors = function() {
	var data = this._map;
	var isWallCallback = function(x, y) {
		return (data[x][y] == 1);
	}
	for (var i = 0; i < this._rooms.length; i++ ) {
		var room = this._rooms[i];
		room.clearDoors();
		room.addDoors(isWallCallback);
	}
}
/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map.Dungeon
 */
ROT.Map.Uniform = function(width, height, options) {
	ROT.Map.Dungeon.call(this, width, height);

	this._options = {
		roomWidth: [3, 9], /* room minimum and maximum width */
		roomHeight: [3, 5], /* room minimum and maximum height */
		roomDugPercentage: 0.1, /* we stop after this percentage of level area has been dug out by rooms */
		timeLimit: 1000 /* we stop after this much time has passed (msec) */
	}
	for (var p in options) { this._options[p] = options[p]; }

	this._roomAttempts = 20; /* new room is created N-times until is considered as impossible to generate */
	this._corridorAttempts = 20; /* corridors are tried N-times until the level is considered as impossible to connect */

	this._connected = []; /* list of already connected rooms */
	this._unconnected = []; /* list of remaining unconnected rooms */
	
	this._digCallback = this._digCallback.bind(this);
	this._canBeDugCallback = this._canBeDugCallback.bind(this);
	this._isWallCallback = this._isWallCallback.bind(this);
}
ROT.Map.Uniform.extend(ROT.Map.Dungeon);

/**
 * Create a map. If the time limit has been hit, returns null.
 * @see ROT.Map#create
 */
ROT.Map.Uniform.prototype.create = function(callback) {
	var t1 = Date.now();
	while (1) {
		var t2 = Date.now();
		if (t2 - t1 > this._options.timeLimit) { return null; } /* time limit! */
	
		this._map = this._fillMap(1);
		this._dug = 0;
		this._rooms = [];
		this._unconnected = [];
		this._generateRooms();
		if (this._rooms.length < 2) { continue; }
		if (this._generateCorridors()) { break; }
	}
	
	if (callback) {
		for (var i=0;i<this._width;i++) {
			for (var j=0;j<this._height;j++) {
				callback(i, j, this._map[i][j]);
			}
		}
	}
	
	return this;
}

/**
 * Generates a suitable amount of rooms
 */
ROT.Map.Uniform.prototype._generateRooms = function() {
	var w = this._width-2;
	var h = this._height-2;

	do {
		var room = this._generateRoom();
		if (this._dug/(w*h) > this._options.roomDugPercentage) { break; } /* achieved requested amount of free space */
	} while (room);

	/* either enough rooms, or not able to generate more of them :) */
}

/**
 * Try to generate one room
 */
ROT.Map.Uniform.prototype._generateRoom = function() {
	var count = 0;
	while (count < this._roomAttempts) {
		count++;
		
		var room = ROT.Map.Feature.Room.createRandom(this._width, this._height, this._options);
		if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) { continue; }
		
		room.create(this._digCallback);
		this._rooms.push(room);
		return room;
	} 

	/* no room was generated in a given number of attempts */
	return null;
}

/**
 * Generates connectors beween rooms
 * @returns {bool} success Was this attempt successfull?
 */
ROT.Map.Uniform.prototype._generateCorridors = function() {
	var cnt = 0;
	while (cnt < this._corridorAttempts) {
		cnt++;
		this._corridors = [];

		/* dig rooms into a clear map */
		this._map = this._fillMap(1);
		for (var i=0;i<this._rooms.length;i++) { 
			var room = this._rooms[i];
			room.clearDoors();
			room.create(this._digCallback); 
		}

		this._unconnected = this._rooms.slice().randomize();
		this._connected = [];
		if (this._unconnected.length) { this._connected.push(this._unconnected.pop()); } /* first one is always connected */
		
		while (1) {
			/* 1. pick random connected room */
			var connected = this._connected.random();
			
			/* 2. find closest unconnected */
			var room1 = this._closestRoom(this._unconnected, connected);
			
			/* 3. connect it to closest connected */
			var room2 = this._closestRoom(this._connected, room1);
			
			var ok = this._connectRooms(room1, room2);
			if (!ok) { break; } /* stop connecting, re-shuffle */
			
			if (!this._unconnected.length) { return true; } /* done; no rooms remain */
		}
	}
	return false;
}

/**
 * For a given room, find the closest one from the list
 */
ROT.Map.Uniform.prototype._closestRoom = function(rooms, room) {
	var dist = Infinity;
	var center = room.getCenter();
	var result = null;
	
	for (var i=0;i<rooms.length;i++) {
		var r = rooms[i];
		var c = r.getCenter();
		var dx = c[0]-center[0];
		var dy = c[1]-center[1];
		var d = dx*dx+dy*dy;
		
		if (d < dist) {
			dist = d;
			result = r;
		}
	}
	
	return result;
}

ROT.Map.Uniform.prototype._connectRooms = function(room1, room2) {
	/*
		room1.debug();
		room2.debug();
	*/

	var center1 = room1.getCenter();
	var center2 = room2.getCenter();

	var diffX = center2[0] - center1[0];
	var diffY = center2[1] - center1[1];

	if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
		var dirIndex1 = (diffY > 0 ? 2 : 0);
		var dirIndex2 = (dirIndex1 + 2) % 4;
		var min = room2.getLeft();
		var max = room2.getRight();
		var index = 0;
	} else { /* first try connecting east-west walls */
		var dirIndex1 = (diffX > 0 ? 1 : 3);
		var dirIndex2 = (dirIndex1 + 2) % 4;
		var min = room2.getTop();
		var max = room2.getBottom();
		var index = 1;
	}

	var start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
	if (!start) { return false; }

	if (start[index] >= min && start[index] <= max) { /* possible to connect with straight line (I-like) */
		var end = start.slice();
		var value = null;
		switch (dirIndex2) {
			case 0: value = room2.getTop()-1; break;
			case 1: value = room2.getRight()+1; break;
			case 2: value = room2.getBottom()+1; break;
			case 3: value = room2.getLeft()-1; break;
		}
		end[(index+1)%2] = value;
		this._digLine([start, end]);
		
	} else if (start[index] < min-1 || start[index] > max+1) { /* need to switch target wall (L-like) */

		var diff = start[index] - center2[index];
		switch (dirIndex2) {
			case 0:
			case 1:	var rotation = (diff < 0 ? 3 : 1); break;
			case 2:
			case 3:	var rotation = (diff < 0 ? 1 : 3); break;
		}
		dirIndex2 = (dirIndex2 + rotation) % 4;
		
		var end = this._placeInWall(room2, dirIndex2);
		if (!end) { return false; }

		var mid = [0, 0];
		mid[index] = start[index];
		var index2 = (index+1)%2;
		mid[index2] = end[index2];
		this._digLine([start, mid, end]);
		
	} else { /* use current wall pair, but adjust the line in the middle (S-like) */
	
		var index2 = (index+1)%2;
		var end = this._placeInWall(room2, dirIndex2);
		if (!end) { return; }
		var mid = Math.round((end[index2] + start[index2])/2);

		var mid1 = [0, 0];
		var mid2 = [0, 0];
		mid1[index] = start[index];
		mid1[index2] = mid;
		mid2[index] = end[index];
		mid2[index2] = mid;
		this._digLine([start, mid1, mid2, end]);
	}

	room1.addDoor(start[0], start[1]);
	room2.addDoor(end[0], end[1]);
	
	var index = this._unconnected.indexOf(room1);
	if (index != -1) {
		this._unconnected.splice(index, 1);
		this._connected.push(room1);
	}

	var index = this._unconnected.indexOf(room2);
	if (index != -1) {
		this._unconnected.splice(index, 1);
		this._connected.push(room2);
	}
	
	return true;
}

ROT.Map.Uniform.prototype._placeInWall = function(room, dirIndex) {
	var start = [0, 0];
	var dir = [0, 0];
	var length = 0;
	
	switch (dirIndex) {
		case 0:
			dir = [1, 0];
			start = [room.getLeft(), room.getTop()-1];
			length = room.getRight()-room.getLeft()+1;
		break;
		case 1:
			dir = [0, 1];
			start = [room.getRight()+1, room.getTop()];
			length = room.getBottom()-room.getTop()+1;
		break;
		case 2:
			dir = [1, 0];
			start = [room.getLeft(), room.getBottom()+1];
			length = room.getRight()-room.getLeft()+1;
		break;
		case 3:
			dir = [0, 1];
			start = [room.getLeft()-1, room.getTop()];
			length = room.getBottom()-room.getTop()+1;
		break;
	}
	
	var avail = [];
	var lastBadIndex = -2;

	for (var i=0;i<length;i++) {
		var x = start[0] + i*dir[0];
		var y = start[1] + i*dir[1];
		avail.push(null);
		
		var isWall = (this._map[x][y] == 1);
		if (isWall) {
			if (lastBadIndex != i-1) { avail[i] = [x, y]; }
		} else {
			lastBadIndex = i;
			if (i) { avail[i-1] = null; }
		}
	}
	
	for (var i=avail.length-1; i>=0; i--) {
		if (!avail[i]) { avail.splice(i, 1); }
	}
	return (avail.length ? avail.random() : null);
}

/**
 * Dig a polyline.
 */
ROT.Map.Uniform.prototype._digLine = function(points) {
	for (var i=1;i<points.length;i++) {
		var start = points[i-1];
		var end = points[i];
		var corridor = new ROT.Map.Feature.Corridor(start[0], start[1], end[0], end[1]);
		corridor.create(this._digCallback);
		this._corridors.push(corridor);
	}
}

ROT.Map.Uniform.prototype._digCallback = function(x, y, value) {
	this._map[x][y] = value;
	if (value == 0) { this._dug++; }
}

ROT.Map.Uniform.prototype._isWallCallback = function(x, y) {
	if (x < 0 || y < 0 || x >= this._width || y >= this._height) { return false; }
	return (this._map[x][y] == 1);
}

ROT.Map.Uniform.prototype._canBeDugCallback = function(x, y) {
	if (x < 1 || y < 1 || x+1 >= this._width || y+1 >= this._height) { return false; }
	return (this._map[x][y] == 1);
}

/**
 * @author hyakugei
 * @class Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.cellWidth=3] Number of cells to create on the horizontal (number of rooms horizontally)
 * @param {int[]} [options.cellHeight=3] Number of cells to create on the vertical (number of rooms vertically) 
 * @param {int} [options.roomWidth] Room min and max width - normally set auto-magically via the constructor.
 * @param {int} [options.roomHeight] Room min and max height - normally set auto-magically via the constructor. 
 */
ROT.Map.Rogue = function(width, height, options) {
	ROT.Map.call(this, width, height);
	
	this._options = {
		cellWidth: 3,  // NOTE to self, these could probably work the same as the roomWidth/room Height values
		cellHeight: 3  //     ie. as an array with min-max values for each direction....
	}
	
	for (var p in options) { this._options[p] = options[p]; }
	
	/*
	Set the room sizes according to the over-all width of the map, 
	and the cell sizes. 
	*/
	
	if (!this._options.hasOwnProperty("roomWidth")) {
		this._options["roomWidth"] = this._calculateRoomSize(width, this._options["cellWidth"]);
	}
	if (!this._options.hasOwnProperty["roomHeight"]) {
		this._options["roomHeight"] = this._calculateRoomSize(height, this._options["cellHeight"]);
	}
	
}

ROT.Map.Rogue.extend(ROT.Map); 

/**
 * @see ROT.Map#create
 */
ROT.Map.Rogue.prototype.create = function(callback) {
	this.map = this._fillMap(1);
	this.rooms = [];
	this.connectedCells = [];
	
	this._initRooms();
	this._connectRooms();
	this._connectUnconnectedRooms();
	this._createRandomRoomConnections();
	this._createRooms();
	this._createCorridors();
	
	if (callback) {
		for (var i = 0; i < this._width; i++) {
			for (var j = 0; j < this._height; j++) {
				callback(i, j, this.map[i][j]);   
			}
		}
	}
	
	return this;
}

ROT.Map.Rogue.prototype._getRandomInt = function(min, max) {
	return Math.floor(ROT.RNG.getUniform() * (max - min + 1)) + min;
}

ROT.Map.Rogue.prototype._calculateRoomSize = function(size, cell) {
	var max = Math.floor((size/cell) * 0.8);
	var min = Math.floor((size/cell) * 0.25);
	if (min < 2) min = 2;
	if (max < 2) max = 2;
	return [min, max];
}

ROT.Map.Rogue.prototype._initRooms = function () { 
	// create rooms array. This is the "grid" list from the algo.  
	for (var i = 0; i < this._options.cellWidth; i++) {  
		this.rooms.push([]);
		for(var j = 0; j < this._options.cellHeight; j++) {
			this.rooms[i].push({"x":0, "y":0, "width":0, "height":0, "connections":[], "cellx":i, "celly":j});
		}
	}
}

ROT.Map.Rogue.prototype._connectRooms = function() {
	//pick random starting grid
	var cgx = this._getRandomInt(0, this._options.cellWidth-1);
	var cgy = this._getRandomInt(0, this._options.cellHeight-1);
	
	var idx;
	var ncgx;
	var ncgy;
	
	var found = false;
	var room;
	var otherRoom;
	
	// find  unconnected neighbour cells
	do {
	
		//var dirToCheck = [0,1,2,3,4,5,6,7];
		var dirToCheck = [0,2,4,6];
		dirToCheck = dirToCheck.randomize();
		
		do {
			found = false;
			idx = dirToCheck.pop();
			
			
			ncgx = cgx + ROT.DIRS[8][idx][0];
			ncgy = cgy + ROT.DIRS[8][idx][1];
			
			if(ncgx < 0 || ncgx >= this._options.cellWidth) continue;
			if(ncgy < 0 || ncgy >= this._options.cellHeight) continue;
			
			room = this.rooms[cgx][cgy];
			
			if(room["connections"].length > 0)
			{
				// as long as this room doesn't already coonect to me, we are ok with it. 
				if(room["connections"][0][0] == ncgx &&
				room["connections"][0][1] == ncgy)
				{
					break;
				}
			}
			
			otherRoom = this.rooms[ncgx][ncgy];
			
			if (otherRoom["connections"].length == 0) { 
				otherRoom["connections"].push([cgx,cgy]);
				
				this.connectedCells.push([ncgx, ncgy]);
				cgx = ncgx;
				cgy = ncgy;
				found = true;
			}
					
		} while (dirToCheck.length > 0 && found == false)
		
	} while (dirToCheck.length > 0)

}

ROT.Map.Rogue.prototype._connectUnconnectedRooms = function() {
	//While there are unconnected rooms, try to connect them to a random connected neighbor 
	//(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
	var cw = this._options.cellWidth;
	var ch = this._options.cellHeight;
	
	var randomConnectedCell;
	this.connectedCells = this.connectedCells.randomize();
	var room;
	var otherRoom;
	var validRoom;
	
	for (var i = 0; i < this._options.cellWidth; i++) {
		for (var j = 0; j < this._options.cellHeight; j++)  {
				
			room = this.rooms[i][j];
			
			if (room["connections"].length == 0) {
				var directions = [0,2,4,6];
				directions = directions.randomize();
				
				var validRoom = false;
				
				do {
					
					var dirIdx = directions.pop();
					var newI = i + ROT.DIRS[8][dirIdx][0];
					var newJ = j + ROT.DIRS[8][dirIdx][1];
					
					if (newI < 0 || newI >= cw || 
					newJ < 0 || newJ >= ch) {
						continue;
					}
					
					otherRoom = this.rooms[newI][newJ];
					
					validRoom = true;
					
					if (otherRoom["connections"].length == 0) {
						break;
					}
					
					for (var k = 0; k < otherRoom["connections"].length; k++) {
						if(otherRoom["connections"][k][0] == i && 
						otherRoom["connections"][k][1] == j) {
							validRoom = false;
							break;
						}
					}
					
					if (validRoom) break;
					
				} while (directions.length)
				
				if(validRoom) { 
					room["connections"].push( [otherRoom["cellx"], otherRoom["celly"]] );  
				} else {
					console.log("-- Unable to connect room.");
				}
			}
		}
	}
}

ROT.Map.Rogue.prototype._createRandomRoomConnections = function(connections) {
	// Empty for now. 
}


ROT.Map.Rogue.prototype._createRooms = function() {
	// Create Rooms 
	
	var w = this._width;
	var h = this._height;
	
	var cw = this._options.cellWidth;
	var ch = this._options.cellHeight;
	
	var cwp = Math.floor(this._width / cw);
	var chp = Math.floor(this._height / ch);
	
	var roomw;
	var roomh;
	var roomWidth = this._options["roomWidth"];
	var roomHeight = this._options["roomHeight"];
	var sx;
	var sy;
	var tx;
	var ty;
	var otherRoom;
	
	for (var i = 0; i < cw; i++) {
		for (var j = 0; j < ch; j++) {
			sx = cwp * i;
			sy = chp * j;
			
			if (sx == 0) sx = 1;
			if (sy == 0) sy = 1;
			
			roomw = this._getRandomInt(roomWidth[0], roomWidth[1]);
			roomh = this._getRandomInt(roomHeight[0], roomHeight[1]);
			
			if (j > 0) {
				otherRoom = this.rooms[i][j-1];
				while (sy - (otherRoom["y"] + otherRoom["height"] ) < 3) {
					sy++;
				}
			}
			
			if (i > 0) {
				otherRoom = this.rooms[i-1][j];
				while(sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
					sx++;
				}
			}
						
			var sxOffset = Math.round(this._getRandomInt(0, cwp-roomw)/2);
			var syOffset = Math.round(this._getRandomInt(0, chp-roomh)/2);
			
			while (sx + sxOffset + roomw >= w) {
				if(sxOffset) {
					sxOffset--;
				} else {
					roomw--; 
				}
			}
			
			while (sy + syOffset + roomh >= h) { 
				if(syOffset) {
					syOffset--;
				} else {
					roomh--; 
				}
			}
			
			sx = sx + sxOffset;
			sy = sy + syOffset;
			
			this.rooms[i][j]["x"] = sx;
			this.rooms[i][j]["y"] = sy;
			this.rooms[i][j]["width"] = roomw;
			this.rooms[i][j]["height"] = roomh;  
			
			for (var ii = sx; ii < sx + roomw; ii++) {
				for (var jj = sy; jj < sy + roomh; jj++) {
					this.map[ii][jj] = 0;
				}
			}  
		}
	}
}

ROT.Map.Rogue.prototype._getWallPosition = function(aRoom, aDirection) {
	var rx;
	var ry;
	var door;
	
	if (aDirection == 1 || aDirection == 3) {
		rx = this._getRandomInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);
		if (aDirection == 1) {
			ry = aRoom["y"] - 2;
			door = ry + 1;
		} else {
			ry = aRoom["y"] + aRoom["height"] + 1;
			door = ry -1;
		}
		
		this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space. 
		
	} else if (aDirection == 2 || aDirection == 4) {
		ry = this._getRandomInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);
		if(aDirection == 2) {
			rx = aRoom["x"] + aRoom["width"] + 1;
			door = rx - 1;
		} else {
			rx = aRoom["x"] - 2;
			door = rx + 1;
		}
		
		this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space. 
		
	}
	return [rx, ry];
}

/***
* @param startPosition a 2 element array
* @param endPosition a 2 element array
*/
ROT.Map.Rogue.prototype._drawCorridore = function (startPosition, endPosition) {
	var xOffset = endPosition[0] - startPosition[0];
	var yOffset = endPosition[1] - startPosition[1];
	
	var xpos = startPosition[0];
	var ypos = startPosition[1];
	
	var tempDist;
	var xDir;
	var yDir;
	
	var move; // 2 element array, element 0 is the direction, element 1 is the total value to move. 
	var moves = []; // a list of 2 element arrays
	
	var xAbs = Math.abs(xOffset);
	var yAbs = Math.abs(yOffset);
	
	var percent = ROT.RNG.getUniform(); // used to split the move at different places along the long axis
	var firstHalf = percent;
	var secondHalf = 1 - percent;
	
	xDir = xOffset > 0 ? 2 : 6;
	yDir = yOffset > 0 ? 4 : 0;
	
	if (xAbs < yAbs) {
		// move firstHalf of the y offset
		tempDist = Math.ceil(yAbs * firstHalf);
		moves.push([yDir, tempDist]);
		// move all the x offset
		moves.push([xDir, xAbs]);
		// move sendHalf of the  y offset
		tempDist = Math.floor(yAbs * secondHalf);
		moves.push([yDir, tempDist]);
	} else {
		//  move firstHalf of the x offset
		tempDist = Math.ceil(xAbs * firstHalf);
		moves.push([xDir, tempDist]);
		// move all the y offset
		moves.push([yDir, yAbs]);
		// move secondHalf of the x offset.
		tempDist = Math.floor(xAbs * secondHalf);
		moves.push([xDir, tempDist]);  
	}
	
	this.map[xpos][ypos] = 0;
	
	while (moves.length > 0) {
		move = moves.pop();
		while (move[1] > 0) {
			xpos += ROT.DIRS[8][move[0]][0];
			ypos += ROT.DIRS[8][move[0]][1];
			this.map[xpos][ypos] = 0;
			move[1] = move[1] - 1;
		}
	}
}

ROT.Map.Rogue.prototype._createCorridors = function () {
	// Draw Corridors between connected rooms
	
	var cw = this._options.cellWidth;
	var ch = this._options.cellHeight;
	var room;
	var connection;
	var otherRoom;
	var wall;
	var otherWall;
	
	for (var i = 0; i < cw; i++) {
		for (var j = 0; j < ch; j++) {
			room = this.rooms[i][j];
			
			for (var k = 0; k < room["connections"].length; k++) {
					
				connection = room["connections"][k]; 
				
				otherRoom = this.rooms[connection[0]][connection[1]];
				
				// figure out what wall our corridor will start one.
				// figure out what wall our corridor will end on. 
				if (otherRoom["cellx"] > room["cellx"] ) {
					wall = 2;
					otherWall = 4;
				} else if (otherRoom["cellx"] < room["cellx"] ) {
					wall = 4;
					otherWall = 2;
				} else if(otherRoom["celly"] > room["celly"]) {
					wall = 3;
					otherWall = 1;
				} else if(otherRoom["celly"] < room["celly"]) {
					wall = 1;
					otherWall = 3;
				}
				
				this._drawCorridore(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
			}
		}
	}
}
/**
 * @class Dungeon feature; has own .create() method
 */
ROT.Map.Feature = function() {}
ROT.Map.Feature.prototype.isValid = function(canBeDugCallback) {}
ROT.Map.Feature.prototype.create = function(digCallback) {}
ROT.Map.Feature.prototype.debug = function() {}
ROT.Map.Feature.createRandomAt = function(x, y, dx, dy, options) {}

/**
 * @class Room
 * @augments ROT.Map.Feature
 * @param {int} x1
 * @param {int} y1
 * @param {int} x2
 * @param {int} y2
 * @param {int} [doorX]
 * @param {int} [doorY]
 */
ROT.Map.Feature.Room = function(x1, y1, x2, y2, doorX, doorY) {
	this._x1 = x1;
	this._y1 = y1;
	this._x2 = x2;
	this._y2 = y2;
	this._doors = {};
	if (arguments.length > 4) { this.addDoor(doorX, doorY); }
}
ROT.Map.Feature.Room.extend(ROT.Map.Feature);

/**
 * Room of random size, with a given doors and direction
 */
ROT.Map.Feature.Room.createRandomAt = function(x, y, dx, dy, options) {
	var min = options.roomWidth[0];
	var max = options.roomWidth[1];
	var width = min + Math.floor(ROT.RNG.getUniform()*(max-min+1));
	
	var min = options.roomHeight[0];
	var max = options.roomHeight[1];
	var height = min + Math.floor(ROT.RNG.getUniform()*(max-min+1));
	
	if (dx == 1) { /* to the right */
		var y2 = y - Math.floor(ROT.RNG.getUniform() * height);
		return new this(x+1, y2, x+width, y2+height-1, x, y);
	}
	
	if (dx == -1) { /* to the left */
		var y2 = y - Math.floor(ROT.RNG.getUniform() * height);
		return new this(x-width, y2, x-1, y2+height-1, x, y);
	}

	if (dy == 1) { /* to the bottom */
		var x2 = x - Math.floor(ROT.RNG.getUniform() * width);
		return new this(x2, y+1, x2+width-1, y+height, x, y);
	}

	if (dy == -1) { /* to the top */
		var x2 = x - Math.floor(ROT.RNG.getUniform() * width);
		return new this(x2, y-height, x2+width-1, y-1, x, y);
	}
}

/**
 * Room of random size, positioned around center coords
 */
ROT.Map.Feature.Room.createRandomCenter = function(cx, cy, options) {
	var min = options.roomWidth[0];
	var max = options.roomWidth[1];
	var width = min + Math.floor(ROT.RNG.getUniform()*(max-min+1));
	
	var min = options.roomHeight[0];
	var max = options.roomHeight[1];
	var height = min + Math.floor(ROT.RNG.getUniform()*(max-min+1));

	var x1 = cx - Math.floor(ROT.RNG.getUniform()*width);
	var y1 = cy - Math.floor(ROT.RNG.getUniform()*height);
	var x2 = x1 + width - 1;
	var y2 = y1 + height - 1;

	return new this(x1, y1, x2, y2);
}

/**
 * Room of random size within a given dimensions
 */
ROT.Map.Feature.Room.createRandom = function(availWidth, availHeight, options) {
	var min = options.roomWidth[0];
	var max = options.roomWidth[1];
	var width = min + Math.floor(ROT.RNG.getUniform()*(max-min+1));
	
	var min = options.roomHeight[0];
	var max = options.roomHeight[1];
	var height = min + Math.floor(ROT.RNG.getUniform()*(max-min+1));
	
	var left = availWidth - width - 1;
	var top = availHeight - height - 1;

	var x1 = 1 + Math.floor(ROT.RNG.getUniform()*left);
	var y1 = 1 + Math.floor(ROT.RNG.getUniform()*top);
	var x2 = x1 + width - 1;
	var y2 = y1 + height - 1;

	return new this(x1, y1, x2, y2);
}

ROT.Map.Feature.Room.prototype.addDoor = function(x, y) {
	this._doors[x+","+y] = 1;
	return this;
}

/**
 * @param {function}
 */
ROT.Map.Feature.Room.prototype.getDoors = function(callback) {
	for (var key in this._doors) {
		var parts = key.split(",");
		callback(parseInt(parts[0]), parseInt(parts[1]));
	}
	return this;
}

ROT.Map.Feature.Room.prototype.clearDoors = function() {
	this._doors = {};
	return this;
}

ROT.Map.Feature.Room.prototype.addDoors = function(isWallCallback) {
	var left = this._x1-1;
	var right = this._x2+1;
	var top = this._y1-1;
	var bottom = this._y2+1;

	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (x != left && x != right && y != top && y != bottom) { continue; }
			if (isWallCallback(x, y)) { continue; }

			this.addDoor(x, y);
		}
	}

	return this;
}

ROT.Map.Feature.Room.prototype.debug = function() {
	console.log("room", this._x1, this._y1, this._x2, this._y2);
}

ROT.Map.Feature.Room.prototype.isValid = function(isWallCallback, canBeDugCallback) { 
	var left = this._x1-1;
	var right = this._x2+1;
	var top = this._y1-1;
	var bottom = this._y2+1;
	
	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (x == left || x == right || y == top || y == bottom) {
				if (!isWallCallback(x, y)) { return false; }
			} else {
				if (!canBeDugCallback(x, y)) { return false; }
			}
		}
	}

	return true;
}

/**
 * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
 */
ROT.Map.Feature.Room.prototype.create = function(digCallback) { 
	var left = this._x1-1;
	var right = this._x2+1;
	var top = this._y1-1;
	var bottom = this._y2+1;
	
	var value = 0;
	for (var x=left; x<=right; x++) {
		for (var y=top; y<=bottom; y++) {
			if (x+","+y in this._doors) {
				value = 2;
			} else if (x == left || x == right || y == top || y == bottom) {
				value = 1;
			} else {
				value = 0;
			}
			digCallback(x, y, value);
		}
	}
}

ROT.Map.Feature.Room.prototype.getCenter = function() {
	return [Math.round((this._x1 + this._x2)/2), Math.round((this._y1 + this._y2)/2)];
}

ROT.Map.Feature.Room.prototype.getLeft = function() {
	return this._x1;
}

ROT.Map.Feature.Room.prototype.getRight = function() {
	return this._x2;
}

ROT.Map.Feature.Room.prototype.getTop = function() {
	return this._y1;
}

ROT.Map.Feature.Room.prototype.getBottom = function() {
	return this._y2;
}

/**
 * @class Corridor
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 */
ROT.Map.Feature.Corridor = function(startX, startY, endX, endY) {
	this._startX = startX;
	this._startY = startY;
	this._endX = endX; 
	this._endY = endY;
	this._endsWithAWall = true;
}
ROT.Map.Feature.Corridor.extend(ROT.Map.Feature);

ROT.Map.Feature.Corridor.createRandomAt = function(x, y, dx, dy, options) {
	var min = options.corridorLength[0];
	var max = options.corridorLength[1];
	var length = min + Math.floor(ROT.RNG.getUniform()*(max-min+1));
	
	return new this(x, y, x + dx*length, y + dy*length);
}

ROT.Map.Feature.Corridor.prototype.debug = function() {
	console.log("corridor", this._startX, this._startY, this._endX, this._endY);
}

ROT.Map.Feature.Corridor.prototype.isValid = function(isWallCallback, canBeDugCallback){ 
	var sx = this._startX;
	var sy = this._startY;
	var dx = this._endX-sx;
	var dy = this._endY-sy;
	var length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
	
	if (dx) { dx = dx/Math.abs(dx); }
	if (dy) { dy = dy/Math.abs(dy); }
	var nx = dy;
	var ny = -dx;
	
	var ok = true;
	for (var i=0; i<length; i++) {
		var x = sx + i*dx;
		var y = sy + i*dy;

		if (!canBeDugCallback(     x,      y)) { ok = false; }
		if (!isWallCallback  (x + nx, y + ny)) { ok = false; }
		if (!isWallCallback  (x - nx, y - ny)) { ok = false; }
		
		if (!ok) {
			length = i;
			this._endX = x-dx;
			this._endY = y-dy;
			break;
		}
	}
	
	/**
	 * If the length degenerated, this corridor might be invalid
	 */
	 
	/* not supported */
	if (length == 0) { return false; } 
	
	 /* length 1 allowed only if the next space is empty */
	if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) { return false; }
	
	/**
	 * We do not want the corridor to crash into a corner of a room;
	 * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
	 * 
	 * Situation:
	 * #######1
	 * .......?
	 * #######2
	 * 
	 * The corridor was dug from left to right.
	 * 1, 2 - problematic corners, ? = N+1th cell (not dug)
	 */
	var firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
	var secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
	this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
	if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) { return false; }

	return true;
}

/**
 * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
 */
ROT.Map.Feature.Corridor.prototype.create = function(digCallback) { 
	var sx = this._startX;
	var sy = this._startY;
	var dx = this._endX-sx;
	var dy = this._endY-sy;
	var length = 1+Math.max(Math.abs(dx), Math.abs(dy));
	
	if (dx) { dx = dx/Math.abs(dx); }
	if (dy) { dy = dy/Math.abs(dy); }
	var nx = dy;
	var ny = -dx;
	
	for (var i=0; i<length; i++) {
		var x = sx + i*dx;
		var y = sy + i*dy;
		digCallback(x, y, 0);
	}
	
	return true;
}

ROT.Map.Feature.Corridor.prototype.createPriorityWalls = function(priorityWallCallback) {
	if (!this._endsWithAWall) { return; }

	var sx = this._startX;
	var sy = this._startY;

	var dx = this._endX-sx;
	var dy = this._endY-sy;
	if (dx) { dx = dx/Math.abs(dx); }
	if (dy) { dy = dy/Math.abs(dy); }
	var nx = dy;
	var ny = -dx;

	priorityWallCallback(this._endX + dx, this._endY + dy);
	priorityWallCallback(this._endX + nx, this._endY + ny);
	priorityWallCallback(this._endX - nx, this._endY - ny);
}/**
 * @class Base noise generator
 */
ROT.Noise = function() {
};

ROT.Noise.prototype.get = function(x, y) {}
/**
 * A simple 2d implementation of simplex noise by Ondrej Zara
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 */

/**
 * @class 2D simplex noise generator
 * @param {int} [gradients=256] Random gradients
 */
ROT.Noise.Simplex = function(gradients) {
	ROT.Noise.call(this);

	this._F2 = 0.5 * (Math.sqrt(3) - 1);
    this._G2 = (3 - Math.sqrt(3)) / 6;

	this._gradients = [
		[ 0, -1],
		[ 1, -1],
		[ 1,  0],
		[ 1,  1],
		[ 0,  1],
		[-1,  1],
		[-1,  0],
		[-1, -1]
	];

	var permutations = [];
	var count = gradients || 256;
	for (var i=0;i<count;i++) { permutations.push(i); }
	permutations = permutations.randomize();

	this._perms = [];
	this._indexes = [];

	for (var i=0;i<2*count;i++) {
		this._perms.push(permutations[i % count]);
		this._indexes.push(this._perms[i] % this._gradients.length);
	}

};
ROT.Noise.Simplex.extend(ROT.Noise);

ROT.Noise.Simplex.prototype.get = function(xin, yin) {
	var perms = this._perms;
	var indexes = this._indexes;
	var count = perms.length/2;
	var G2 = this._G2;

	var n0 =0, n1 = 0, n2 = 0, gi; // Noise contributions from the three corners

	// Skew the input space to determine which simplex cell we're in
	var s = (xin + yin) * this._F2; // Hairy factor for 2D
	var i = Math.floor(xin + s);
	var j = Math.floor(yin + s);
	var t = (i + j) * G2;
	var X0 = i - t; // Unskew the cell origin back to (x,y) space
	var Y0 = j - t;
	var x0 = xin - X0; // The x,y distances from the cell origin
	var y0 = yin - Y0;

	// For the 2D case, the simplex shape is an equilateral triangle.
	// Determine which simplex we are in.
	var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
	if (x0 > y0) {
		i1 = 1;
		j1 = 0;
	} else { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
		i1 = 0;
		j1 = 1;
	} // upper triangle, YX order: (0,0)->(0,1)->(1,1)

	// A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
	// a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
	// c = (3-sqrt(3))/6
	var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
	var y1 = y0 - j1 + G2;
	var x2 = x0 - 1 + 2*G2; // Offsets for last corner in (x,y) unskewed coords
	var y2 = y0 - 1 + 2*G2;

	// Work out the hashed gradient indices of the three simplex corners
	var ii = i.mod(count);
	var jj = j.mod(count);

	// Calculate the contribution from the three corners
	var t0 = 0.5 - x0*x0 - y0*y0;
	if (t0 >= 0) {
		t0 *= t0;
		gi = indexes[ii+perms[jj]];
		var grad = this._gradients[gi];
		n0 = t0 * t0 * (grad[0] * x0 + grad[1] * y0);
	}
	
	var t1 = 0.5 - x1*x1 - y1*y1;
	if (t1 >= 0) {
		t1 *= t1;
		gi = indexes[ii+i1+perms[jj+j1]];
		var grad = this._gradients[gi];
		n1 = t1 * t1 * (grad[0] * x1 + grad[1] * y1);
	}
	
	var t2 = 0.5 - x2*x2 - y2*y2;
	if (t2 >= 0) {
		t2 *= t2;
		gi = indexes[ii+1+perms[jj+1]];
		var grad = this._gradients[gi];
		n2 = t2 * t2 * (grad[0] * x2 + grad[1] * y2);
	}

	// Add contributions from each corner to get the final noise value.
	// The result is scaled to return values in the interval [-1,1].
	return 70 * (n0 + n1 + n2);
}
/**
 * @class Abstract FOV algorithm
 * @param {function} lightPassesCallback Does the light pass through x,y?
 * @param {object} [options]
 * @param {int} [options.topology=8] 4/6/8
 */
ROT.FOV = function(lightPassesCallback, options) {
	this._lightPasses = lightPassesCallback;
	this._options = {
		topology: 8
	}
	for (var p in options) { this._options[p] = options[p]; }
};

/**
 * Compute visibility for a 360-degree circle
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.prototype.compute = function(x, y, R, callback) {}

/**
 * Return all neighbors in a concentric ring
 * @param {int} cx center-x
 * @param {int} cy center-y
 * @param {int} r range
 */
ROT.FOV.prototype._getCircle = function(cx, cy, r) {
	var result = [];
	var dirs, countFactor, startOffset;

	switch (this._options.topology) {
		case 4:
			countFactor = 1;
			startOffset = [0, 1];
			dirs = [
				ROT.DIRS[8][7],
				ROT.DIRS[8][1],
				ROT.DIRS[8][3],
				ROT.DIRS[8][5]
			]
		break;

		case 6:
			dirs = ROT.DIRS[6];
			countFactor = 1;
			startOffset = [-1, 1];
		break;

		case 8:
			dirs = ROT.DIRS[4];
			countFactor = 2;
			startOffset = [-1, 1];
		break;
	}

	/* starting neighbor */
	var x = cx + startOffset[0]*r;
	var y = cy + startOffset[1]*r;

	/* circle */
	for (var i=0;i<dirs.length;i++) {
		for (var j=0;j<r*countFactor;j++) {
			result.push([x, y]);
			x += dirs[i][0];
			y += dirs[i][1];

		}
	}

	return result;
}
/**
 * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
 * @augments ROT.FOV
 */
ROT.FOV.DiscreteShadowcasting = function(lightPassesCallback, options) {
	ROT.FOV.call(this, lightPassesCallback, options);
}
ROT.FOV.DiscreteShadowcasting.extend(ROT.FOV);

/**
 * @see ROT.FOV#compute
 */
ROT.FOV.DiscreteShadowcasting.prototype.compute = function(x, y, R, callback) {
	var center = this._coords;
	var map = this._map;

	/* this place is always visible */
	callback(x, y, 0);

	/* standing in a dark place. FIXME is this a good idea?  */
	if (!this._lightPasses(x, y)) { return; }
	
	/* start and end angles */
	var DATA = [];
	
	var A, B, cx, cy, blocks;

	/* analyze surrounding cells in concentric rings, starting from the center */
	for (var r=1; r<=R; r++) {
		var neighbors = this._getCircle(x, y, r);
		var angle = 360 / neighbors.length;

		for (var i=0;i<neighbors.length;i++) {
			cx = neighbors[i][0];
			cy = neighbors[i][1];
			A = angle * (i - 0.5);
			B = A + angle;
			
			blocks = !this._lightPasses(cx, cy);
			if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) { callback(cx, cy, r, 1); }
			
			if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) { return; } /* cutoff? */

		} /* for all cells in this ring */
	} /* for all rings */
}

/**
 * @param {int} A start angle
 * @param {int} B end angle
 * @param {bool} blocks Does current cell block visibility?
 * @param {int[][]} DATA shadowed angle pairs
 */
ROT.FOV.DiscreteShadowcasting.prototype._visibleCoords = function(A, B, blocks, DATA) {
	if (A < 0) { 
		var v1 = arguments.callee(0, B, blocks, DATA);
		var v2 = arguments.callee(360+A, 360, blocks, DATA);
		return v1 || v2;
	}
	
	var index = 0;
	while (index < DATA.length && DATA[index] < A) { index++; }
	
	if (index == DATA.length) { /* completely new shadow */
		if (blocks) { DATA.push(A, B); } 
		return true;
	}
	
	var count = 0;
	
	if (index % 2) { /* this shadow starts in an existing shadow, or within its ending boundary */
		while (index < DATA.length && DATA[index] < B) {
			index++;
			count++;
		}
		
		if (count == 0) { return false; }
		
		if (blocks) { 
			if (count % 2) {
				DATA.splice(index-count, count, B);
			} else {
				DATA.splice(index-count, count);
			}
		}
		
		return true;

	} else { /* this shadow starts outside an existing shadow, or within a starting boundary */
		while (index < DATA.length && DATA[index] < B) {
			index++;
			count++;
		}
		
		/* visible when outside an existing shadow, or when overlapping */
		if (A == DATA[index-count] && count == 1) { return false; }
		
		if (blocks) { 
			if (count % 2) {
				DATA.splice(index-count, count, A);
			} else {
				DATA.splice(index-count, count, A, B);
			}
		}
			
		return true;
	}
}
/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
ROT.FOV.PreciseShadowcasting = function(lightPassesCallback, options) {
	ROT.FOV.call(this, lightPassesCallback, options);
}
ROT.FOV.PreciseShadowcasting.extend(ROT.FOV);

/**
 * @see ROT.FOV#compute
 */
ROT.FOV.PreciseShadowcasting.prototype.compute = function(x, y, R, callback) {
	/* this place is always visible */
	callback(x, y, 0, 1);

	/* standing in a dark place. FIXME is this a good idea?  */
	if (!this._lightPasses(x, y)) { return; }
	
	/* list of all shadows */
	var SHADOWS = [];
	
	var cx, cy, blocks, A1, A2, visibility;

	/* analyze surrounding cells in concentric rings, starting from the center */
	for (var r=1; r<=R; r++) {
		var neighbors = this._getCircle(x, y, r);
		var neighborCount = neighbors.length;

		for (var i=0;i<neighborCount;i++) {
			cx = neighbors[i][0];
			cy = neighbors[i][1];
			/* shift half-an-angle backwards to maintain consistency of 0-th cells */
			A1 = [i ? 2*i-1 : 2*neighborCount-1, 2*neighborCount];
			A2 = [2*i+1, 2*neighborCount]; 
			
			blocks = !this._lightPasses(cx, cy);
			visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);
			if (visibility) { callback(cx, cy, r, visibility); }

			if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) { return; } /* cutoff? */

		} /* for all cells in this ring */
	} /* for all rings */
}

/**
 * @param {int[2]} A1 arc start
 * @param {int[2]} A2 arc end
 * @param {bool} blocks Does current arc block visibility?
 * @param {int[][]} SHADOWS list of active shadows
 */
ROT.FOV.PreciseShadowcasting.prototype._checkVisibility = function(A1, A2, blocks, SHADOWS) {
	if (A1[0] > A2[0]) { /* split into two sub-arcs */
		var v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
		var v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);
		return (v1+v2)/2;
	}

	/* index1: first shadow >= A1 */
	var index1 = 0, edge1 = false;
	while (index1 < SHADOWS.length) {
		var old = SHADOWS[index1];
		var diff = old[0]*A1[1] - A1[0]*old[1];
		if (diff >= 0) { /* old >= A1 */
			if (diff == 0 && !(index1 % 2)) { edge1 = true; }
			break;
		}
		index1++;
	}

	/* index2: last shadow <= A2 */
	var index2 = SHADOWS.length, edge2 = false;
	while (index2--) {
		var old = SHADOWS[index2];
		var diff = A2[0]*old[1] - old[0]*A2[1];
		if (diff >= 0) { /* old <= A2 */
			if (diff == 0 && (index2 % 2)) { edge2 = true; }
			break;
		}
	}

	var visible = true;
	if (index1 == index2 && (edge1 || edge2)) {  /* subset of existing shadow, one of the edges match */
		visible = false; 
	} else if (edge1 && edge2 && index1+1==index2 && (index2 % 2)) { /* completely equivalent with existing shadow */
		visible = false;
	} else if (index1 > index2 && (index1 % 2)) { /* subset of existing shadow, not touching */
		visible = false;
	}
	
	if (!visible) { return 0; } /* fast case: not visible */
	
	var visibleLength, P;

	/* compute the length of visible arc, adjust list of shadows (if blocking) */
	var remove = index2-index1+1;
	if (remove % 2) {
		if (index1 % 2) { /* first edge within existing shadow, second outside */
			var P = SHADOWS[index1];
			visibleLength = (A2[0]*P[1] - P[0]*A2[1]) / (P[1] * A2[1]);
			if (blocks) { SHADOWS.splice(index1, remove, A2); }
		} else { /* second edge within existing shadow, first outside */
			var P = SHADOWS[index2];
			visibleLength = (P[0]*A1[1] - A1[0]*P[1]) / (A1[1] * P[1]);
			if (blocks) { SHADOWS.splice(index1, remove, A1); }
		}
	} else {
		if (index1 % 2) { /* both edges within existing shadows */
			var P1 = SHADOWS[index1];
			var P2 = SHADOWS[index2];
			visibleLength = (P2[0]*P1[1] - P1[0]*P2[1]) / (P1[1] * P2[1]);
			if (blocks) { SHADOWS.splice(index1, remove); }
		} else { /* both edges outside existing shadows */
			if (blocks) { SHADOWS.splice(index1, remove, A1, A2); }
			return 1; /* whole arc visible! */
		}
	}

	var arcLength = (A2[0]*A1[1] - A1[0]*A2[1]) / (A1[1] * A2[1]);

	return visibleLength/arcLength;
}
/**
 * @class Recursive shadowcasting algorithm
 * Currently only supports 4/8 topologies, not hexagonal.
 * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 * @augments ROT.FOV
 */
ROT.FOV.RecursiveShadowcasting = function(lightPassesCallback, options) {
	ROT.FOV.call(this, lightPassesCallback, options);
}
ROT.FOV.RecursiveShadowcasting.extend(ROT.FOV);

/** Octants used for translating recursive shadowcasting offsets */
ROT.FOV.RecursiveShadowcasting.OCTANTS = [
	[-1,  0,  0,  1],
	[ 0, -1,  1,  0],
	[ 0, -1, -1,  0],
	[-1,  0,  0, -1],
	[ 1,  0,  0, -1],
	[ 0,  1, -1,  0],
	[ 0,  1,  1,  0],
	[ 1,  0,  0,  1]
];

/**
 * Compute visibility for a 360-degree circle
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype.compute = function(x, y, R, callback) {
	//You can always see your own tile
	callback(x, y, 0, true);
	for(var i = 0; i < ROT.FOV.RecursiveShadowcasting.OCTANTS.length; i++) {
		this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[i], R, callback);
	}
}

/**
 * Compute visibility for a 180-degree arc
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {int} dir Direction to look in (expressed in a ROT.DIR value);
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype.compute180 = function(x, y, R, dir, callback) {
	//You can always see your own tile
	callback(x, y, 0, true);
	var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees
	var nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees
	var nextOctant = (dir+ 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[nextPreviousOctant], R, callback);
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[previousOctant], R, callback);
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[dir], R, callback);
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[nextOctant], R, callback);
}

/**
 * Compute visibility for a 90-degree arc
 * @param {int} x
 * @param {int} y
 * @param {int} R Maximum visibility radius
 * @param {int} dir Direction to look in (expressed in a ROT.DIR value);
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype.compute90 = function(x, y, R, dir, callback) {
	//You can always see your own tile
	callback(x, y, 0, true);
	var previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[dir], R, callback);
	this._renderOctant(x, y, ROT.FOV.RecursiveShadowcasting.OCTANTS[previousOctant], R, callback);
}

/**
 * Render one octant (45-degree arc) of the viewshed
 * @param {int} x
 * @param {int} y
 * @param {int} octant Octant to be rendered
 * @param {int} R Maximum visibility radius
 * @param {function} callback
 */
ROT.FOV.RecursiveShadowcasting.prototype._renderOctant = function(x, y, octant, R, callback) {
	//Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
	this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
}

/**
 * Actually calculates the visibility
 * @param {int} startX The starting X coordinate
 * @param {int} startY The starting Y coordinate
 * @param {int} row The row to render
 * @param {float} visSlopeStart The slope to start at
 * @param {float} visSlopeEnd The slope to end at
 * @param {int} radius The radius to reach out to
 * @param {int} xx 
 * @param {int} xy 
 * @param {int} yx 
 * @param {int} yy 
 * @param {function} callback The callback to use when we hit a block that is visible
 */
ROT.FOV.RecursiveShadowcasting.prototype._castVisibility = function(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
	if(visSlopeStart < visSlopeEnd) { return; }
	for(var i = row; i <= radius; i++) {
		var dx = -i - 1;
		var dy = -i;
		var blocked = false;
		var newStart = 0;

		//'Row' could be column, names here assume octant 0 and would be flipped for half the octants
		while(dx <= 0) {
			dx += 1;

			//Translate from relative coordinates to map coordinates
			var mapX = startX + dx * xx + dy * xy;
			var mapY = startY + dx * yx + dy * yy;

			//Range of the row
			var slopeStart = (dx - 0.5) / (dy + 0.5);
			var slopeEnd = (dx + 0.5) / (dy - 0.5);
		
			//Ignore if not yet at left edge of Octant
			if(slopeEnd > visSlopeStart) { continue; }
			
			//Done if past right edge
			if(slopeStart < visSlopeEnd) { break; }
				
			//If it's in range, it's visible
			if((dx * dx + dy * dy) < (radius * radius)) {
				callback(mapX, mapY, i, true);
			}
	
			if(!blocked) {
				//If tile is a blocking tile, cast around it
				if(!this._lightPasses(mapX, mapY) && i < radius) {
					blocked = true;
					this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);
					newStart = slopeEnd;
				}
			} else {
				//Keep narrowing if scanning across a block
				if(!this._lightPasses(mapX, mapY)) {
					newStart = slopeEnd;
					continue;
				}
			
				//Block has ended
				blocked = false;
				visSlopeStart = newStart;
			}
		}
		if(blocked) { break; }
	}
}
/**
 * @namespace Color operations
 */
ROT.Color = {
	fromString: function(str) {
		var cached, r;
		if (str in this._cache) {
			cached = this._cache[str];
		} else {
			if (str.charAt(0) == "#") { /* hex rgb */

				var values = str.match(/[0-9a-f]/gi).map(function(x) { return parseInt(x, 16); });
				if (values.length == 3) {
					cached = values.map(function(x) { return x*17; });
				} else {
					for (var i=0;i<3;i++) {
						values[i+1] += 16*values[i];
						values.splice(i, 1);
					}
					cached = values;
				}

			} else if (r = str.match(/rgb\(([0-9, ]+)\)/i)) { /* decimal rgb */
				cached = r[1].split(/\s*,\s*/).map(function(x) { return parseInt(x); });
			} else { /* html name */
				cached = [0, 0, 0];
			}

			this._cache[str] = cached;
		}

		return cached.slice();
	},

	/**
	 * Add two or more colors
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @returns {number[]}
	 */
	add: function(color1, color2) {
		var result = color1.slice();
		for (var i=0;i<3;i++) {
			for (var j=1;j<arguments.length;j++) {
				result[i] += arguments[j][i];
			}
		}
		return result;
	},

	/**
	 * Add two or more colors, MODIFIES FIRST ARGUMENT
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @returns {number[]}
	 */
	add_: function(color1, color2) {
		for (var i=0;i<3;i++) {
			for (var j=1;j<arguments.length;j++) {
				color1[i] += arguments[j][i];
			}
		}
		return color1;
	},

	/**
	 * Multiply (mix) two or more colors
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @returns {number[]}
	 */
	multiply: function(color1, color2) {
		var result = color1.slice();
		for (var i=0;i<3;i++) {
			for (var j=1;j<arguments.length;j++) {
				result[i] *= arguments[j][i] / 255;
			}
			result[i] = Math.round(result[i]);
		}
		return result;
	},

	/**
	 * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @returns {number[]}
	 */
	multiply_: function(color1, color2) {
		for (var i=0;i<3;i++) {
			for (var j=1;j<arguments.length;j++) {
				color1[i] *= arguments[j][i] / 255;
			}
			color1[i] = Math.round(color1[i]);
		}
		return color1;
	},

	/**
	 * Interpolate (blend) two colors with a given factor
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @param {float} [factor=0.5] 0..1
	 * @returns {number[]}
	 */
	interpolate: function(color1, color2, factor) {
		if (arguments.length < 3) { factor = 0.5; }
		var result = color1.slice();
		for (var i=0;i<3;i++) {
			result[i] = Math.round(result[i] + factor*(color2[i]-color1[i]));
		}
		return result;
	},

	/**
	 * Interpolate (blend) two colors with a given factor in HSL mode
	 * @param {number[]} color1
	 * @param {number[]} color2
	 * @param {float} [factor=0.5] 0..1
	 * @returns {number[]}
	 */
	interpolateHSL: function(color1, color2, factor) {
		if (arguments.length < 3) { factor = 0.5; }
		var hsl1 = this.rgb2hsl(color1);
		var hsl2 = this.rgb2hsl(color2);
		for (var i=0;i<3;i++) {
			hsl1[i] += factor*(hsl2[i]-hsl1[i]);
		}
		return this.hsl2rgb(hsl1);
	},

	/**
	 * Create a new random color based on this one
	 * @param {number[]} color
	 * @param {number[]} diff Set of standard deviations
	 * @returns {number[]}
	 */
	randomize: function(color, diff) {
		if (!(diff instanceof Array)) { diff = ROT.RNG.getNormal(0, diff); }
		var result = color.slice();
		for (var i=0;i<3;i++) {
			result[i] += (diff instanceof Array ? Math.round(ROT.RNG.getNormal(0, diff[i])) : diff);
		}
		return result;
	},

	/**
	 * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
	 * @param {number[]} color
	 * @returns {number[]}
	 */
	rgb2hsl: function(color) {
		var r = color[0]/255;
		var g = color[1]/255;
		var b = color[2]/255;

		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h /= 6;
		}

		return [h, s, l];
	},

	/**
	 * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
	 * @param {number[]} color
	 * @returns {number[]}
	 */
	hsl2rgb: function(color) {
		var l = color[2];

		if (color[1] == 0) {
			l = Math.round(l*255);
			return [l, l, l];
		} else {
			function hue2rgb(p, q, t) {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1/6) return p + (q - p) * 6 * t;
				if (t < 1/2) return q;
				if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			var s = color[1];
			var q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
			var p = 2 * l - q;
			var r = hue2rgb(p, q, color[0] + 1/3);
			var g = hue2rgb(p, q, color[0]);
			var b = hue2rgb(p, q, color[0] - 1/3);
			return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
		}
	},

	toRGB: function(color) {
		return "rgb(" + this._clamp(color[0]) + "," + this._clamp(color[1]) + "," + this._clamp(color[2]) + ")";
	},

	toHex: function(color) {
		var parts = [];
		for (var i=0;i<3;i++) {
			parts.push(this._clamp(color[i]).toString(16).lpad("0", 2));
		}
		return "#" + parts.join("");
	},

	_clamp: function(num) {
		if (num < 0) {
			return 0;
		} else if (num > 255) {
			return 255;
		} else {
			return num;
		}
	},

	_cache: {
		"black": [0,0,0],
		"navy": [0,0,128],
		"darkblue": [0,0,139],
		"mediumblue": [0,0,205],
		"blue": [0,0,255],
		"darkgreen": [0,100,0],
		"green": [0,128,0],
		"teal": [0,128,128],
		"darkcyan": [0,139,139],
		"deepskyblue": [0,191,255],
		"darkturquoise": [0,206,209],
		"mediumspringgreen": [0,250,154],
		"lime": [0,255,0],
		"springgreen": [0,255,127],
		"aqua": [0,255,255],
		"cyan": [0,255,255],
		"midnightblue": [25,25,112],
		"dodgerblue": [30,144,255],
		"forestgreen": [34,139,34],
		"seagreen": [46,139,87],
		"darkslategray": [47,79,79],
		"darkslategrey": [47,79,79],
		"limegreen": [50,205,50],
		"mediumseagreen": [60,179,113],
		"turquoise": [64,224,208],
		"royalblue": [65,105,225],
		"steelblue": [70,130,180],
		"darkslateblue": [72,61,139],
		"mediumturquoise": [72,209,204],
		"indigo": [75,0,130],
		"darkolivegreen": [85,107,47],
		"cadetblue": [95,158,160],
		"cornflowerblue": [100,149,237],
		"mediumaquamarine": [102,205,170],
		"dimgray": [105,105,105],
		"dimgrey": [105,105,105],
		"slateblue": [106,90,205],
		"olivedrab": [107,142,35],
		"slategray": [112,128,144],
		"slategrey": [112,128,144],
		"lightslategray": [119,136,153],
		"lightslategrey": [119,136,153],
		"mediumslateblue": [123,104,238],
		"lawngreen": [124,252,0],
		"chartreuse": [127,255,0],
		"aquamarine": [127,255,212],
		"maroon": [128,0,0],
		"purple": [128,0,128],
		"olive": [128,128,0],
		"gray": [128,128,128],
		"grey": [128,128,128],
		"skyblue": [135,206,235],
		"lightskyblue": [135,206,250],
		"blueviolet": [138,43,226],
		"darkred": [139,0,0],
		"darkmagenta": [139,0,139],
		"saddlebrown": [139,69,19],
		"darkseagreen": [143,188,143],
		"lightgreen": [144,238,144],
		"mediumpurple": [147,112,216],
		"darkviolet": [148,0,211],
		"palegreen": [152,251,152],
		"darkorchid": [153,50,204],
		"yellowgreen": [154,205,50],
		"sienna": [160,82,45],
		"brown": [165,42,42],
		"darkgray": [169,169,169],
		"darkgrey": [169,169,169],
		"lightblue": [173,216,230],
		"greenyellow": [173,255,47],
		"paleturquoise": [175,238,238],
		"lightsteelblue": [176,196,222],
		"powderblue": [176,224,230],
		"firebrick": [178,34,34],
		"darkgoldenrod": [184,134,11],
		"mediumorchid": [186,85,211],
		"rosybrown": [188,143,143],
		"darkkhaki": [189,183,107],
		"silver": [192,192,192],
		"mediumvioletred": [199,21,133],
		"indianred": [205,92,92],
		"peru": [205,133,63],
		"chocolate": [210,105,30],
		"tan": [210,180,140],
		"lightgray": [211,211,211],
		"lightgrey": [211,211,211],
		"palevioletred": [216,112,147],
		"thistle": [216,191,216],
		"orchid": [218,112,214],
		"goldenrod": [218,165,32],
		"crimson": [220,20,60],
		"gainsboro": [220,220,220],
		"plum": [221,160,221],
		"burlywood": [222,184,135],
		"lightcyan": [224,255,255],
		"lavender": [230,230,250],
		"darksalmon": [233,150,122],
		"violet": [238,130,238],
		"palegoldenrod": [238,232,170],
		"lightcoral": [240,128,128],
		"khaki": [240,230,140],
		"aliceblue": [240,248,255],
		"honeydew": [240,255,240],
		"azure": [240,255,255],
		"sandybrown": [244,164,96],
		"wheat": [245,222,179],
		"beige": [245,245,220],
		"whitesmoke": [245,245,245],
		"mintcream": [245,255,250],
		"ghostwhite": [248,248,255],
		"salmon": [250,128,114],
		"antiquewhite": [250,235,215],
		"linen": [250,240,230],
		"lightgoldenrodyellow": [250,250,210],
		"oldlace": [253,245,230],
		"red": [255,0,0],
		"fuchsia": [255,0,255],
		"magenta": [255,0,255],
		"deeppink": [255,20,147],
		"orangered": [255,69,0],
		"tomato": [255,99,71],
		"hotpink": [255,105,180],
		"coral": [255,127,80],
		"darkorange": [255,140,0],
		"lightsalmon": [255,160,122],
		"orange": [255,165,0],
		"lightpink": [255,182,193],
		"pink": [255,192,203],
		"gold": [255,215,0],
		"peachpuff": [255,218,185],
		"navajowhite": [255,222,173],
		"moccasin": [255,228,181],
		"bisque": [255,228,196],
		"mistyrose": [255,228,225],
		"blanchedalmond": [255,235,205],
		"papayawhip": [255,239,213],
		"lavenderblush": [255,240,245],
		"seashell": [255,245,238],
		"cornsilk": [255,248,220],
		"lemonchiffon": [255,250,205],
		"floralwhite": [255,250,240],
		"snow": [255,250,250],
		"yellow": [255,255,0],
		"lightyellow": [255,255,224],
		"ivory": [255,255,240],
		"white": [255,255,255]
	}
}
/**
 * @class Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 * @param {function} reflectivityCallback Callback to retrieve cell reflectivity (0..1)
 * @param {object} [options]
 * @param {int} [options.passes=1] Number of passes. 1 equals to simple FOV of all light sources, >1 means a *highly simplified* radiosity-like algorithm.
 * @param {int} [options.emissionThreshold=100] Cells with emissivity > threshold will be treated as light source in the next pass.
 * @param {int} [options.range=10] Max light range
 */
ROT.Lighting = function(reflectivityCallback, options) {
	this._reflectivityCallback = reflectivityCallback;
	this._options = {
		passes: 1,
		emissionThreshold: 100,
		range: 10
	};
	this._fov = null;

	this._lights = {};
	this._reflectivityCache = {};
	this._fovCache = {};

	this.setOptions(options);
}

/**
 * Adjust options at runtime
 * @see ROT.Lighting
 * @param {object} [options]
 */
ROT.Lighting.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
	if (options.range) { this.reset(); }
	return this;
}

/**
 * Set the used Field-Of-View algo
 * @param {ROT.FOV} fov
 */
ROT.Lighting.prototype.setFOV = function(fov) {
	this._fov = fov;
	this._fovCache = {};
	return this;
}

/**
 * Set (or remove) a light source
 * @param {int} x
 * @param {int} y
 * @param {null || string || number[3]} color
 */
ROT.Lighting.prototype.setLight = function(x, y, color) {
	var key = x+","+y;

	if (color) {
		this._lights[key] = (typeof(color) == "string" ? ROT.Color.fromString(color) : color);
	} else {
		delete this._lights[key];
	}
	return this;
}

/**
 * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
 */
ROT.Lighting.prototype.reset = function() {
	this._reflectivityCache = {};
	this._fovCache = {};

	return this;
}

/**
 * Compute the lighting
 * @param {function} lightingCallback Will be called with (x, y, color) for every lit cell
 */
ROT.Lighting.prototype.compute = function(lightingCallback) {
	var doneCells = {};
	var emittingCells = {};
	var litCells = {};

	for (var key in this._lights) { /* prepare emitters for first pass */
		var light = this._lights[key];
		if (!(key in emittingCells)) { emittingCells[key] = [0, 0, 0]; }

		ROT.Color.add_(emittingCells[key], light);
	}

	for (var i=0;i<this._options.passes;i++) { /* main loop */
		this._emitLight(emittingCells, litCells, doneCells);
		if (i+1 == this._options.passes) { continue; } /* not for the last pass */
		emittingCells = this._computeEmitters(litCells, doneCells);
	}

	for (var litKey in litCells) { /* let the user know what and how is lit */
		var parts = litKey.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		lightingCallback(x, y, litCells[litKey]);
	}

	return this;
}

/**
 * Compute one iteration from all emitting cells
 * @param {object} emittingCells These emit light
 * @param {object} litCells Add projected light to these
 * @param {object} doneCells These already emitted, forbid them from further calculations
 */
ROT.Lighting.prototype._emitLight = function(emittingCells, litCells, doneCells) {
	for (var key in emittingCells) {
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		this._emitLightFromCell(x, y, emittingCells[key], litCells);
		doneCells[key] = 1;
	}
	return this;
}

/**
 * Prepare a list of emitters for next pass
 * @param {object} litCells
 * @param {object} doneCells
 * @returns {object}
 */
ROT.Lighting.prototype._computeEmitters = function(litCells, doneCells) {
	var result = {};

	for (var key in litCells) {
		if (key in doneCells) { continue; } /* already emitted */

		var color = litCells[key];

		if (key in this._reflectivityCache) {
			var reflectivity = this._reflectivityCache[key];
		} else {
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			var reflectivity = this._reflectivityCallback(x, y);
			this._reflectivityCache[key] = reflectivity;
		}

		if (reflectivity == 0) { continue; } /* will not reflect at all */

		/* compute emission color */
		var emission = [];
		var intensity = 0;
		for (var i=0;i<3;i++) {
			var part = Math.round(color[i]*reflectivity);
			emission[i] = part;
			intensity += part;
		}
		if (intensity > this._options.emissionThreshold) { result[key] = emission; }
	}

	return result;
}

/**
 * Compute one iteration from one cell
 * @param {int} x
 * @param {int} y
 * @param {number[]} color
 * @param {object} litCells Cell data to by updated
 */
ROT.Lighting.prototype._emitLightFromCell = function(x, y, color, litCells) {
	var key = x+","+y;
	if (key in this._fovCache) {
		var fov = this._fovCache[key];
	} else {
		var fov = this._updateFOV(x, y);
	}

	for (var fovKey in fov) {
		var formFactor = fov[fovKey];

		if (fovKey in litCells) { /* already lit */
			var result = litCells[fovKey];
		} else { /* newly lit */
			var result = [0, 0, 0];
			litCells[fovKey] = result;
		}

		for (var i=0;i<3;i++) { result[i] += Math.round(color[i]*formFactor); } /* add light color */
	}

	return this;
}

/**
 * Compute FOV ("form factor") for a potential light source at [x,y]
 * @param {int} x
 * @param {int} y
 * @returns {object}
 */
ROT.Lighting.prototype._updateFOV = function(x, y) {
	var key1 = x+","+y;
	var cache = {};
	this._fovCache[key1] = cache;
	var range = this._options.range;
	var cb = function(x, y, r, vis) {
		var key2 = x+","+y;
		var formFactor = vis * (1-r/range);
		if (formFactor == 0) { return; }
		cache[key2] = formFactor;
	}
	this._fov.compute(x, y, range, cb.bind(this));

	return cache;
}
/**
 * @class Abstract pathfinder
 * @param {int} toX Target X coord
 * @param {int} toY Target Y coord
 * @param {function} passableCallback Callback to determine map passability
 * @param {object} [options]
 * @param {int} [options.topology=8]
 */
ROT.Path = function(toX, toY, passableCallback, options) {
	this._toX = toX;
	this._toY = toY;
	this._fromX = null;
	this._fromY = null;
	this._passableCallback = passableCallback;
	this._options = {
		topology: 8
	}
	for (var p in options) { this._options[p] = options[p]; }

	this._dirs = ROT.DIRS[this._options.topology];
	if (this._options.topology == 8) { /* reorder dirs for more aesthetic result (vertical/horizontal first) */
		this._dirs = [
			this._dirs[0],
			this._dirs[2],
			this._dirs[4],
			this._dirs[6],
			this._dirs[1],
			this._dirs[3],
			this._dirs[5],
			this._dirs[7]
		]
	}
}

/**
 * Compute a path from a given point
 * @param {int} fromX
 * @param {int} fromY
 * @param {function} callback Will be called for every path item with arguments "x" and "y"
 */
ROT.Path.prototype.compute = function(fromX, fromY, callback) {
}

ROT.Path.prototype._getNeighbors = function(cx, cy) {
	var result = [];
	for (var i=0;i<this._dirs.length;i++) {
		var dir = this._dirs[i];
		var x = cx + dir[0];
		var y = cy + dir[1];
		
		if (!this._passableCallback(x, y)) { continue; }
		result.push([x, y]);
	}
	
	return result;
}
/**
 * @class Simplified Dijkstra's algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
ROT.Path.Dijkstra = function(toX, toY, passableCallback, options) {
	ROT.Path.call(this, toX, toY, passableCallback, options);

	this._computed = {};
	this._todo = [];
	this._add(toX, toY, null);
}
ROT.Path.Dijkstra.extend(ROT.Path);

/**
 * Compute a path from a given point
 * @see ROT.Path#compute
 */
ROT.Path.Dijkstra.prototype.compute = function(fromX, fromY, callback) {
	var key = fromX+","+fromY;
	if (!(key in this._computed)) { this._compute(fromX, fromY); }
	if (!(key in this._computed)) { return; }
	
	var item = this._computed[key];
	while (item) {
		callback(item.x, item.y);
		item = item.prev;
	}
}

/**
 * Compute a non-cached value
 */
ROT.Path.Dijkstra.prototype._compute = function(fromX, fromY) {
	while (this._todo.length) {
		var item = this._todo.shift();
		if (item.x == fromX && item.y == fromY) { return; }
		
		var neighbors = this._getNeighbors(item.x, item.y);
		
		for (var i=0;i<neighbors.length;i++) {
			var neighbor = neighbors[i];
			var x = neighbor[0];
			var y = neighbor[1];
			var id = x+","+y;
			if (id in this._computed) { continue; } /* already done */	
			this._add(x, y, item); 
		}
	}
}

ROT.Path.Dijkstra.prototype._add = function(x, y, prev) {
	var obj = {
		x: x,
		y: y,
		prev: prev
	}
	this._computed[x+","+y] = obj;
	this._todo.push(obj);
}
/**
 * @class Simplified A* algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
ROT.Path.AStar = function(toX, toY, passableCallback, options) {
	ROT.Path.call(this, toX, toY, passableCallback, options);

	this._todo = [];
	this._done = {};
	this._fromX = null;
	this._fromY = null;
}
ROT.Path.AStar.extend(ROT.Path);

/**
 * Compute a path from a given point
 * @see ROT.Path#compute
 */
ROT.Path.AStar.prototype.compute = function(fromX, fromY, callback) {
	this._todo = [];
	this._done = {};
	this._fromX = fromX;
	this._fromY = fromY;
	this._add(this._toX, this._toY, null);

	while (this._todo.length) {
		var item = this._todo.shift();
		if (item.x == fromX && item.y == fromY) { break; }
		var neighbors = this._getNeighbors(item.x, item.y);

		for (var i=0;i<neighbors.length;i++) {
			var neighbor = neighbors[i];
			var x = neighbor[0];
			var y = neighbor[1];
			var id = x+","+y;
			if (id in this._done) { continue; }
			this._add(x, y, item); 
		}
	}
	
	var item = this._done[fromX+","+fromY];
	if (!item) { return; }
	
	while (item) {
		callback(item.x, item.y);
		item = item.prev;
	}
}

ROT.Path.AStar.prototype._add = function(x, y, prev) {
	var obj = {
		x: x,
		y: y,
		prev: prev,
		g: (prev ? prev.g+1 : 0),
		h: this._distance(x, y)
	}
	this._done[x+","+y] = obj;
	
	/* insert into priority queue */
	
	var f = obj.g + obj.h;
	for (var i=0;i<this._todo.length;i++) {
		var item = this._todo[i];
		if (f < item.g + item.h) {
			this._todo.splice(i, 0, obj);
			return;
		}
	}
	
	this._todo.push(obj);
}

ROT.Path.AStar.prototype._distance = function(x, y) {
	switch (this._options.topology) {
		case 4:
			return (Math.abs(x-this._fromX) + Math.abs(y-this._fromY));
		break;

		case 6:
			var dx = Math.abs(x - this._fromX);
			var dy = Math.abs(y - this._fromY);
			return dy + Math.max(0, (dx-dy)/2);
		break;

		case 8: 
			return Math.max(Math.abs(x-this._fromX), Math.abs(y-this._fromY));
		break;
	}
}
/**
 * @namespace Export to Node.js module
 */
exports.ROT = ROT;

},{"__browserify_process":8}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zaGFkZG9ja2gvRGV2ZWxvcG1lbnQvd2ViYXBwcy9yb2d1ZWxpa2VfdHV0XzIwMTQvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9zaGFkZG9ja2gvRGV2ZWxvcG1lbnQvd2ViYXBwcy9yb2d1ZWxpa2VfdHV0XzIwMTQvY2xpZW50L2FwcC5qcyIsIi9Vc2Vycy9zaGFkZG9ja2gvRGV2ZWxvcG1lbnQvd2ViYXBwcy9yb2d1ZWxpa2VfdHV0XzIwMTQvY2xpZW50L2Fzc2V0cy9nYW1lLmpzIiwiL1VzZXJzL3NoYWRkb2NraC9EZXZlbG9wbWVudC93ZWJhcHBzL3JvZ3VlbGlrZV90dXRfMjAxNC9jbGllbnQvYXNzZXRzL2dhbWVjb25maWcuanMiLCIvVXNlcnMvc2hhZGRvY2toL0RldmVsb3BtZW50L3dlYmFwcHMvcm9ndWVsaWtlX3R1dF8yMDE0L2NsaWVudC9hc3NldHMvc2NyZWVucy9sb3NlU2NyZWVuLmpzIiwiL1VzZXJzL3NoYWRkb2NraC9EZXZlbG9wbWVudC93ZWJhcHBzL3JvZ3VlbGlrZV90dXRfMjAxNC9jbGllbnQvYXNzZXRzL3NjcmVlbnMvcGxheVNjcmVlbi5qcyIsIi9Vc2Vycy9zaGFkZG9ja2gvRGV2ZWxvcG1lbnQvd2ViYXBwcy9yb2d1ZWxpa2VfdHV0XzIwMTQvY2xpZW50L2Fzc2V0cy9zY3JlZW5zL3N0YXJ0U2NyZWVuLmpzIiwiL1VzZXJzL3NoYWRkb2NraC9EZXZlbG9wbWVudC93ZWJhcHBzL3JvZ3VlbGlrZV90dXRfMjAxNC9jbGllbnQvYXNzZXRzL3NjcmVlbnMvd2luU2NyZWVuLmpzIiwiL1VzZXJzL3NoYWRkb2NraC9EZXZlbG9wbWVudC93ZWJhcHBzL3JvZ3VlbGlrZV90dXRfMjAxNC9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvc2hhZGRvY2toL0RldmVsb3BtZW50L3dlYmFwcHMvcm9ndWVsaWtlX3R1dF8yMDE0L25vZGVfbW9kdWxlcy9qcXVlcnkvZGlzdC9qcXVlcnkubWluLmpzIiwiL1VzZXJzL3NoYWRkb2NraC9EZXZlbG9wbWVudC93ZWJhcHBzL3JvZ3VlbGlrZV90dXRfMjAxNC9ub2RlX21vZHVsZXMvcm90LWpzL2luZGV4LmpzIiwiL1VzZXJzL3NoYWRkb2NraC9EZXZlbG9wbWVudC93ZWJhcHBzL3JvZ3VlbGlrZV90dXRfMjAxNC9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9yb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uICgkKSB7XG4gIHdpbmRvdy4kID0gJDtcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHZhciBHYW1lID0gcmVxdWlyZSgnLi9hc3NldHMvZ2FtZScpO1xuICAgIGlmIChHYW1lLmNhblJ1bigpKSB7XG4gICAgICBHYW1lLmluaXQoKTtcbiAgICAgIC8vIEFkZCB0aGUgY29udGFpbmVyIHRvIG91ciBIVE1MIHBhZ2VcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoR2FtZS5nZXREaXNwbGF5KCkuZ2V0Q29udGFpbmVyKCkpO1xuICAgICAgLy8gTG9hZCB0aGUgc3RhcnQgc2NyZWVuXG4gICAgICBHYW1lLnN3aXRjaFNjcmVlbihyZXF1aXJlKCcuL2Fzc2V0cy9zY3JlZW5zL3N0YXJ0U2NyZWVuJykpO1xuICAgIH1cbiAgfSk7XG59KShyZXF1aXJlKCdqcXVlcnkvZGlzdC9qcXVlcnkubWluJykpO1xuIiwiLypnbG9iYWwgJCovXG5cbi8vTk9URTogVGhpcyBpcyBhIHNpbmdsZXRvblxuXG52YXIgUk9UID0gcmVxdWlyZSgncm90LWpzJykuUk9UO1xudmFyIF9kaXNwbGF5ID0gbnVsbCxcbiAgX2N1cnJlbnRTY3JlZW4gPSBudWxsO1xuXG52YXIgR2FtZSA9IHt9O1xuR2FtZS5jb25maWcgPSByZXF1aXJlKCcuL2dhbWVjb25maWcnKTtcblxuZnVuY3Rpb24gYmluZEV2ZW50VG9TY3JlZW4oZXZlbnQpIHtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgLy8gV2hlbiBhbiBldmVudCBpcyByZWNlaXZlZCwgc2VuZCBpdCB0byB0aGVcbiAgICAvLyBzY3JlZW4gaWYgdGhlcmUgaXMgb25lXG4gICAgaWYgKF9jdXJyZW50U2NyZWVuICE9PSBudWxsKSB7XG4gICAgICAvLyBTZW5kIHRoZSBldmVudCB0eXBlIGFuZCBkYXRhIHRvIHRoZSBzY3JlZW5cbiAgICAgIF9jdXJyZW50U2NyZWVuLmhhbmRsZUlucHV0KGV2ZW50LCBlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5HYW1lLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIF9kaXNwbGF5ID0gbmV3IFJPVC5EaXNwbGF5KHtcbiAgICB3aWR0aDogR2FtZS5jb25maWcuZGltZW5zaW9ucy53aWR0aCxcbiAgICBoZWlnaHQ6IEdhbWUuY29uZmlnLmRpbWVuc2lvbnMuaGVpZ2h0XG4gIH0pO1xuICAvLyBCaW5kIGtleWJvYXJkIGlucHV0IGV2ZW50c1xuICBiaW5kRXZlbnRUb1NjcmVlbigna2V5ZG93bicpO1xuICBiaW5kRXZlbnRUb1NjcmVlbigna2V5dXAnKTtcbiAgYmluZEV2ZW50VG9TY3JlZW4oJ2tleXByZXNzJyk7XG59O1xuXG5HYW1lLmdldERpc3BsYXkgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBfZGlzcGxheTtcbn07XG5cbkdhbWUuY2FuUnVuID0gZnVuY3Rpb24gKCkge1xuICAvLyBDaGVjayBpZiByb3QuanMgY2FuIHdvcmsgb24gdGhpcyBicm93c2VyXG4gIGlmICghUk9ULmlzU3VwcG9ydGVkKCkpIHtcbiAgICBhbGVydChcIlRoZSByb3QuanMgbGlicmFyeSBpc24ndCBzdXBwb3J0ZWQgYnkgeW91ciBicm93c2VyLlwiKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5HYW1lLnN3aXRjaFNjcmVlbiA9IGZ1bmN0aW9uIChzY3JlZW4pIHtcblxuICBpZiAodHlwZW9mKHNjcmVlbikgPT0gJ3N0cmluZycpIHtcbiAgICBzY3JlZW4gPSByZXF1aXJlKHNjcmVlbik7XG4gIH1cblxuICAvLyBJZiB3ZSBoYWQgYSBzY3JlZW4gYmVmb3JlLCBub3RpZnkgaXQgdGhhdCB3ZSBleGl0ZWRcbiAgaWYgKF9jdXJyZW50U2NyZWVuICE9PSBudWxsKSB7XG4gICAgX2N1cnJlbnRTY3JlZW4uZXhpdCgpO1xuICB9XG4gIC8vIENsZWFyIHRoZSBkaXNwbGF5XG4gIEdhbWUuZ2V0RGlzcGxheSgpLmNsZWFyKCk7XG4gIC8vIFVwZGF0ZSBvdXIgY3VycmVudCBzY3JlZW4sIG5vdGlmeSBpdCB3ZSBlbnRlcmVkXG4gIC8vIGFuZCB0aGVuIHJlbmRlciBpdFxuICBfY3VycmVudFNjcmVlbiA9IHNjcmVlbjtcbiAgaWYgKF9jdXJyZW50U2NyZWVuICE9PSBudWxsKSB7XG4gICAgX2N1cnJlbnRTY3JlZW4uZW50ZXIoKTtcbiAgICBfY3VycmVudFNjcmVlbi5yZW5kZXIoX2Rpc3BsYXkpO1xuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gZGltZW5zaW9ucyA6IHtcbiAgICB3aWR0aDogODAsXG4gICAgaGVpZ2h0OiAyNFxuIH1cbn07IiwidmFyIFJPVCA9IHJlcXVpcmUoJ3JvdC1qcycpLlJPVDtcblxuLy8gRGVmaW5lIG91ciB3aW5uaW5nIHNjcmVlblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVudGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJFbnRlcmVkIGxvc2Ugc2NyZWVuLlwiKTtcbiAgfSxcbiAgZXhpdDogZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKFwiRXhpdGVkIGxvc2Ugc2NyZWVuLlwiKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoZGlzcGxheSkge1xuICAgIC8vIFJlbmRlciBvdXIgcHJvbXB0IHRvIHRoZSBzY3JlZW5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDIyOyBpKyspIHtcbiAgICAgIGRpc3BsYXkuZHJhd1RleHQoMiwgaSArIDEsIFwiJWJ7cmVkfVlvdSBsb3NlISA6KFwiKTtcbiAgICB9XG4gIH0sXG4gIGhhbmRsZUlucHV0OiBmdW5jdGlvbiAoaW5wdXRUeXBlLCBpbnB1dERhdGEpIHtcbiAgICAvLyBOb3RoaW5nIHRvIGRvIGhlcmVcbiAgfVxufTtcbiIsInZhciBHYW1lID0gcmVxdWlyZSgnLi4vZ2FtZScpO1xudmFyIFJPVCA9IHJlcXVpcmUoJ3JvdC1qcycpLlJPVDtcblxuLy8gRGVmaW5lIG91ciBwbGF5aW5nIHNjcmVlblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVudGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJFbnRlcmVkIHBsYXkgc2NyZWVuLlwiKTtcbiAgfSxcbiAgZXhpdDogZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKFwiRXhpdGVkIHBsYXkgc2NyZWVuLlwiKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoZGlzcGxheSkge1xuICAgIGRpc3BsYXkuZHJhd1RleHQoMywgNSwgXCIlY3tyZWR9JWJ7d2hpdGV9VGhpcyBnYW1lIGlzIHNvIG11Y2ggZnVuIVwiKTtcbiAgICBkaXNwbGF5LmRyYXdUZXh0KDQsIDYsIFwiUHJlc3MgW0VudGVyXSB0byB3aW4sIG9yIFtFc2NdIHRvIGxvc2UhXCIpO1xuICB9LFxuICBoYW5kbGVJbnB1dDogZnVuY3Rpb24gKGlucHV0VHlwZSwgaW5wdXREYXRhKSB7XG4gICAgaWYgKGlucHV0VHlwZSA9PT0gJ2tleWRvd24nKSB7XG4gICAgICAvLyBJZiBlbnRlciBpcyBwcmVzc2VkLCBnbyB0byB0aGUgd2luIHNjcmVlblxuICAgICAgLy8gSWYgZXNjYXBlIGlzIHByZXNzZWQsIGdvIHRvIGxvc2Ugc2NyZWVuXG4gICAgICBpZiAoaW5wdXREYXRhLmtleUNvZGUgPT09IFJPVC5WS19SRVRVUk4pIHtcbiAgICAgICAgR2FtZS5zd2l0Y2hTY3JlZW4ocmVxdWlyZSgnLi93aW5TY3JlZW4nKSk7XG4gICAgICB9IGVsc2UgaWYgKGlucHV0RGF0YS5rZXlDb2RlID09PSBST1QuVktfRVNDQVBFKSB7XG4gICAgICAgIEdhbWUuc3dpdGNoU2NyZWVuKHJlcXVpcmUoJy4vbG9zZVNjcmVlbicpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCJ2YXIgR2FtZSA9IHJlcXVpcmUoJy4uL2dhbWUnKTtcbnZhciBST1QgPSByZXF1aXJlKCdyb3QtanMnKS5ST1Q7XG52YXIgZ2FtZWNvbmZpZyA9IHJlcXVpcmUoJy4uL2dhbWVjb25maWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVudGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJFbnRlcmVkIHN0YXJ0IHNjcmVlbi5cIik7XG4gIH0sXG4gIGV4aXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcIkV4aXRlZCBzdGFydCBzY3JlZW4uXCIpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uIChkaXNwbGF5KSB7XG4gICAgLy8gUmVuZGVyIG91ciBwcm9tcHQgdG8gdGhlIHNjcmVlblxuICAgIGRpc3BsYXkuZHJhd1RleHQoMSwgMSwgXCIlY3t5ZWxsb3d9SmF2YXNjcmlwdCBSb2d1ZWxpa2VcIik7XG4gICAgZGlzcGxheS5kcmF3VGV4dCgxLCAyLCBcIlByZXNzIFtFbnRlcl0gdG8gc3RhcnQhXCIpO1xuICB9LFxuICBoYW5kbGVJbnB1dDogZnVuY3Rpb24gKGlucHV0VHlwZSwgaW5wdXREYXRhKSB7XG4gICAgLy8gV2hlbiBbRW50ZXJdIGlzIHByZXNzZWQsIGdvIHRvIHRoZSBwbGF5IHNjcmVlblxuICAgIGlmIChpbnB1dFR5cGUgPT09ICdrZXlkb3duJykge1xuICAgICAgaWYgKGlucHV0RGF0YS5rZXlDb2RlID09PSBST1QuVktfUkVUVVJOKSB7XG4gICAgICAgIEdhbWUuc3dpdGNoU2NyZWVuKHJlcXVpcmUoJy4vcGxheVNjcmVlbicpKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4iLCJ2YXIgUk9UID0gcmVxdWlyZSgncm90LWpzJykuUk9UO1xuXG4vLyBEZWZpbmUgb3VyIHdpbm5pbmcgc2NyZWVuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZW50ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcIkVudGVyZWQgd2luIHNjcmVlbi5cIik7XG4gIH0sXG4gIGV4aXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZyhcIkV4aXRlZCB3aW4gc2NyZWVuLlwiKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoZGlzcGxheSkge1xuICAgIC8vIFJlbmRlciBvdXIgcHJvbXB0IHRvIHRoZSBzY3JlZW5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IDIyOyBpKyspIHtcbiAgICAgIC8vIEdlbmVyYXRlIHJhbmRvbSBiYWNrZ3JvdW5kIGNvbG9yc1xuICAgICAgdmFyIHIgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAyNTUpO1xuICAgICAgdmFyIGcgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAyNTUpO1xuICAgICAgdmFyIGIgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAyNTUpO1xuICAgICAgdmFyIGJhY2tncm91bmQgPSBST1QuQ29sb3IudG9SR0IoW3IsIGcsIGJdKTtcbiAgICAgIGRpc3BsYXkuZHJhd1RleHQoMiwgaSArIDEsIFwiJWJ7XCIgKyBiYWNrZ3JvdW5kICsgXCJ9WW91IHdpbiFcIik7XG4gICAgfVxuICB9LFxuICBoYW5kbGVJbnB1dDogZnVuY3Rpb24gKGlucHV0VHlwZSwgaW5wdXREYXRhKSB7XG4gICAgLy8gTm90aGluZyB0byBkbyBoZXJlXG4gIH1cbn07XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIvKiEgalF1ZXJ5IHYyLjEuMSB8IChjKSAyMDA1LCAyMDE0IGpRdWVyeSBGb3VuZGF0aW9uLCBJbmMuIHwganF1ZXJ5Lm9yZy9saWNlbnNlICovXG4hZnVuY3Rpb24oYSxiKXtcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlJiZcIm9iamVjdFwiPT10eXBlb2YgbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9YS5kb2N1bWVudD9iKGEsITApOmZ1bmN0aW9uKGEpe2lmKCFhLmRvY3VtZW50KXRocm93IG5ldyBFcnJvcihcImpRdWVyeSByZXF1aXJlcyBhIHdpbmRvdyB3aXRoIGEgZG9jdW1lbnRcIik7cmV0dXJuIGIoYSl9OmIoYSl9KFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OnRoaXMsZnVuY3Rpb24oYSxiKXt2YXIgYz1bXSxkPWMuc2xpY2UsZT1jLmNvbmNhdCxmPWMucHVzaCxnPWMuaW5kZXhPZixoPXt9LGk9aC50b1N0cmluZyxqPWguaGFzT3duUHJvcGVydHksaz17fSxsPWEuZG9jdW1lbnQsbT1cIjIuMS4xXCIsbj1mdW5jdGlvbihhLGIpe3JldHVybiBuZXcgbi5mbi5pbml0KGEsYil9LG89L15bXFxzXFx1RkVGRlxceEEwXSt8W1xcc1xcdUZFRkZcXHhBMF0rJC9nLHA9L14tbXMtLyxxPS8tKFtcXGRhLXpdKS9naSxyPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGIudG9VcHBlckNhc2UoKX07bi5mbj1uLnByb3RvdHlwZT17anF1ZXJ5Om0sY29uc3RydWN0b3I6bixzZWxlY3RvcjpcIlwiLGxlbmd0aDowLHRvQXJyYXk6ZnVuY3Rpb24oKXtyZXR1cm4gZC5jYWxsKHRoaXMpfSxnZXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGwhPWE/MD5hP3RoaXNbYSt0aGlzLmxlbmd0aF06dGhpc1thXTpkLmNhbGwodGhpcyl9LHB1c2hTdGFjazpmdW5jdGlvbihhKXt2YXIgYj1uLm1lcmdlKHRoaXMuY29uc3RydWN0b3IoKSxhKTtyZXR1cm4gYi5wcmV2T2JqZWN0PXRoaXMsYi5jb250ZXh0PXRoaXMuY29udGV4dCxifSxlYWNoOmZ1bmN0aW9uKGEsYil7cmV0dXJuIG4uZWFjaCh0aGlzLGEsYil9LG1hcDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5wdXNoU3RhY2sobi5tYXAodGhpcyxmdW5jdGlvbihiLGMpe3JldHVybiBhLmNhbGwoYixjLGIpfSkpfSxzbGljZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnB1c2hTdGFjayhkLmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9LGZpcnN0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZXEoMCl9LGxhc3Q6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lcSgtMSl9LGVxOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMubGVuZ3RoLGM9K2ErKDA+YT9iOjApO3JldHVybiB0aGlzLnB1c2hTdGFjayhjPj0wJiZiPmM/W3RoaXNbY11dOltdKX0sZW5kOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJldk9iamVjdHx8dGhpcy5jb25zdHJ1Y3RvcihudWxsKX0scHVzaDpmLHNvcnQ6Yy5zb3J0LHNwbGljZTpjLnNwbGljZX0sbi5leHRlbmQ9bi5mbi5leHRlbmQ9ZnVuY3Rpb24oKXt2YXIgYSxiLGMsZCxlLGYsZz1hcmd1bWVudHNbMF18fHt9LGg9MSxpPWFyZ3VtZW50cy5sZW5ndGgsaj0hMTtmb3IoXCJib29sZWFuXCI9PXR5cGVvZiBnJiYoaj1nLGc9YXJndW1lbnRzW2hdfHx7fSxoKyspLFwib2JqZWN0XCI9PXR5cGVvZiBnfHxuLmlzRnVuY3Rpb24oZyl8fChnPXt9KSxoPT09aSYmKGc9dGhpcyxoLS0pO2k+aDtoKyspaWYobnVsbCE9KGE9YXJndW1lbnRzW2hdKSlmb3IoYiBpbiBhKWM9Z1tiXSxkPWFbYl0sZyE9PWQmJihqJiZkJiYobi5pc1BsYWluT2JqZWN0KGQpfHwoZT1uLmlzQXJyYXkoZCkpKT8oZT8oZT0hMSxmPWMmJm4uaXNBcnJheShjKT9jOltdKTpmPWMmJm4uaXNQbGFpbk9iamVjdChjKT9jOnt9LGdbYl09bi5leHRlbmQoaixmLGQpKTp2b2lkIDAhPT1kJiYoZ1tiXT1kKSk7cmV0dXJuIGd9LG4uZXh0ZW5kKHtleHBhbmRvOlwialF1ZXJ5XCIrKG0rTWF0aC5yYW5kb20oKSkucmVwbGFjZSgvXFxEL2csXCJcIiksaXNSZWFkeTohMCxlcnJvcjpmdW5jdGlvbihhKXt0aHJvdyBuZXcgRXJyb3IoYSl9LG5vb3A6ZnVuY3Rpb24oKXt9LGlzRnVuY3Rpb246ZnVuY3Rpb24oYSl7cmV0dXJuXCJmdW5jdGlvblwiPT09bi50eXBlKGEpfSxpc0FycmF5OkFycmF5LmlzQXJyYXksaXNXaW5kb3c6ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGwhPWEmJmE9PT1hLndpbmRvd30saXNOdW1lcmljOmZ1bmN0aW9uKGEpe3JldHVybiFuLmlzQXJyYXkoYSkmJmEtcGFyc2VGbG9hdChhKT49MH0saXNQbGFpbk9iamVjdDpmdW5jdGlvbihhKXtyZXR1cm5cIm9iamVjdFwiIT09bi50eXBlKGEpfHxhLm5vZGVUeXBlfHxuLmlzV2luZG93KGEpPyExOmEuY29uc3RydWN0b3ImJiFqLmNhbGwoYS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsXCJpc1Byb3RvdHlwZU9mXCIpPyExOiEwfSxpc0VtcHR5T2JqZWN0OmZ1bmN0aW9uKGEpe3ZhciBiO2ZvcihiIGluIGEpcmV0dXJuITE7cmV0dXJuITB9LHR5cGU6ZnVuY3Rpb24oYSl7cmV0dXJuIG51bGw9PWE/YStcIlwiOlwib2JqZWN0XCI9PXR5cGVvZiBhfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBhP2hbaS5jYWxsKGEpXXx8XCJvYmplY3RcIjp0eXBlb2YgYX0sZ2xvYmFsRXZhbDpmdW5jdGlvbihhKXt2YXIgYixjPWV2YWw7YT1uLnRyaW0oYSksYSYmKDE9PT1hLmluZGV4T2YoXCJ1c2Ugc3RyaWN0XCIpPyhiPWwuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxiLnRleHQ9YSxsLmhlYWQuYXBwZW5kQ2hpbGQoYikucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChiKSk6YyhhKSl9LGNhbWVsQ2FzZTpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKHAsXCJtcy1cIikucmVwbGFjZShxLHIpfSxub2RlTmFtZTpmdW5jdGlvbihhLGIpe3JldHVybiBhLm5vZGVOYW1lJiZhLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1iLnRvTG93ZXJDYXNlKCl9LGVhY2g6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGU9MCxmPWEubGVuZ3RoLGc9cyhhKTtpZihjKXtpZihnKXtmb3IoO2Y+ZTtlKyspaWYoZD1iLmFwcGx5KGFbZV0sYyksZD09PSExKWJyZWFrfWVsc2UgZm9yKGUgaW4gYSlpZihkPWIuYXBwbHkoYVtlXSxjKSxkPT09ITEpYnJlYWt9ZWxzZSBpZihnKXtmb3IoO2Y+ZTtlKyspaWYoZD1iLmNhbGwoYVtlXSxlLGFbZV0pLGQ9PT0hMSlicmVha31lbHNlIGZvcihlIGluIGEpaWYoZD1iLmNhbGwoYVtlXSxlLGFbZV0pLGQ9PT0hMSlicmVhaztyZXR1cm4gYX0sdHJpbTpmdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09YT9cIlwiOihhK1wiXCIpLnJlcGxhY2UobyxcIlwiKX0sbWFrZUFycmF5OmZ1bmN0aW9uKGEsYil7dmFyIGM9Ynx8W107cmV0dXJuIG51bGwhPWEmJihzKE9iamVjdChhKSk/bi5tZXJnZShjLFwic3RyaW5nXCI9PXR5cGVvZiBhP1thXTphKTpmLmNhbGwoYyxhKSksY30saW5BcnJheTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIG51bGw9PWI/LTE6Zy5jYWxsKGIsYSxjKX0sbWVyZ2U6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9K2IubGVuZ3RoLGQ9MCxlPWEubGVuZ3RoO2M+ZDtkKyspYVtlKytdPWJbZF07cmV0dXJuIGEubGVuZ3RoPWUsYX0sZ3JlcDpmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkLGU9W10sZj0wLGc9YS5sZW5ndGgsaD0hYztnPmY7ZisrKWQ9IWIoYVtmXSxmKSxkIT09aCYmZS5wdXNoKGFbZl0pO3JldHVybiBlfSxtYXA6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGY9MCxnPWEubGVuZ3RoLGg9cyhhKSxpPVtdO2lmKGgpZm9yKDtnPmY7ZisrKWQ9YihhW2ZdLGYsYyksbnVsbCE9ZCYmaS5wdXNoKGQpO2Vsc2UgZm9yKGYgaW4gYSlkPWIoYVtmXSxmLGMpLG51bGwhPWQmJmkucHVzaChkKTtyZXR1cm4gZS5hcHBseShbXSxpKX0sZ3VpZDoxLHByb3h5OmZ1bmN0aW9uKGEsYil7dmFyIGMsZSxmO3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBiJiYoYz1hW2JdLGI9YSxhPWMpLG4uaXNGdW5jdGlvbihhKT8oZT1kLmNhbGwoYXJndW1lbnRzLDIpLGY9ZnVuY3Rpb24oKXtyZXR1cm4gYS5hcHBseShifHx0aGlzLGUuY29uY2F0KGQuY2FsbChhcmd1bWVudHMpKSl9LGYuZ3VpZD1hLmd1aWQ9YS5ndWlkfHxuLmd1aWQrKyxmKTp2b2lkIDB9LG5vdzpEYXRlLm5vdyxzdXBwb3J0Omt9KSxuLmVhY2goXCJCb29sZWFuIE51bWJlciBTdHJpbmcgRnVuY3Rpb24gQXJyYXkgRGF0ZSBSZWdFeHAgT2JqZWN0IEVycm9yXCIuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGEsYil7aFtcIltvYmplY3QgXCIrYitcIl1cIl09Yi50b0xvd2VyQ2FzZSgpfSk7ZnVuY3Rpb24gcyhhKXt2YXIgYj1hLmxlbmd0aCxjPW4udHlwZShhKTtyZXR1cm5cImZ1bmN0aW9uXCI9PT1jfHxuLmlzV2luZG93KGEpPyExOjE9PT1hLm5vZGVUeXBlJiZiPyEwOlwiYXJyYXlcIj09PWN8fDA9PT1ifHxcIm51bWJlclwiPT10eXBlb2YgYiYmYj4wJiZiLTEgaW4gYX12YXIgdD1mdW5jdGlvbihhKXt2YXIgYixjLGQsZSxmLGcsaCxpLGosayxsLG0sbixvLHAscSxyLHMsdCx1PVwic2l6emxlXCIrLW5ldyBEYXRlLHY9YS5kb2N1bWVudCx3PTAseD0wLHk9Z2IoKSx6PWdiKCksQT1nYigpLEI9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYT09PWImJihsPSEwKSwwfSxDPVwidW5kZWZpbmVkXCIsRD0xPDwzMSxFPXt9Lmhhc093blByb3BlcnR5LEY9W10sRz1GLnBvcCxIPUYucHVzaCxJPUYucHVzaCxKPUYuc2xpY2UsSz1GLmluZGV4T2Z8fGZ1bmN0aW9uKGEpe2Zvcih2YXIgYj0wLGM9dGhpcy5sZW5ndGg7Yz5iO2IrKylpZih0aGlzW2JdPT09YSlyZXR1cm4gYjtyZXR1cm4tMX0sTD1cImNoZWNrZWR8c2VsZWN0ZWR8YXN5bmN8YXV0b2ZvY3VzfGF1dG9wbGF5fGNvbnRyb2xzfGRlZmVyfGRpc2FibGVkfGhpZGRlbnxpc21hcHxsb29wfG11bHRpcGxlfG9wZW58cmVhZG9ubHl8cmVxdWlyZWR8c2NvcGVkXCIsTT1cIltcXFxceDIwXFxcXHRcXFxcclxcXFxuXFxcXGZdXCIsTj1cIig/OlxcXFxcXFxcLnxbXFxcXHctXXxbXlxcXFx4MDAtXFxcXHhhMF0pK1wiLE89Ti5yZXBsYWNlKFwid1wiLFwidyNcIiksUD1cIlxcXFxbXCIrTStcIiooXCIrTitcIikoPzpcIitNK1wiKihbKl4kfCF+XT89KVwiK00rXCIqKD86JygoPzpcXFxcXFxcXC58W15cXFxcXFxcXCddKSopJ3xcXFwiKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcXFxcIl0pKilcXFwifChcIitPK1wiKSl8KVwiK00rXCIqXFxcXF1cIixRPVwiOihcIitOK1wiKSg/OlxcXFwoKCgnKCg/OlxcXFxcXFxcLnxbXlxcXFxcXFxcJ10pKiknfFxcXCIoKD86XFxcXFxcXFwufFteXFxcXFxcXFxcXFwiXSkqKVxcXCIpfCgoPzpcXFxcXFxcXC58W15cXFxcXFxcXCgpW1xcXFxdXXxcIitQK1wiKSopfC4qKVxcXFwpfClcIixSPW5ldyBSZWdFeHAoXCJeXCIrTStcIit8KCg/Ol58W15cXFxcXFxcXF0pKD86XFxcXFxcXFwuKSopXCIrTStcIiskXCIsXCJnXCIpLFM9bmV3IFJlZ0V4cChcIl5cIitNK1wiKixcIitNK1wiKlwiKSxUPW5ldyBSZWdFeHAoXCJeXCIrTStcIiooWz4rfl18XCIrTStcIilcIitNK1wiKlwiKSxVPW5ldyBSZWdFeHAoXCI9XCIrTStcIiooW15cXFxcXSdcXFwiXSo/KVwiK00rXCIqXFxcXF1cIixcImdcIiksVj1uZXcgUmVnRXhwKFEpLFc9bmV3IFJlZ0V4cChcIl5cIitPK1wiJFwiKSxYPXtJRDpuZXcgUmVnRXhwKFwiXiMoXCIrTitcIilcIiksQ0xBU1M6bmV3IFJlZ0V4cChcIl5cXFxcLihcIitOK1wiKVwiKSxUQUc6bmV3IFJlZ0V4cChcIl4oXCIrTi5yZXBsYWNlKFwid1wiLFwidypcIikrXCIpXCIpLEFUVFI6bmV3IFJlZ0V4cChcIl5cIitQKSxQU0VVRE86bmV3IFJlZ0V4cChcIl5cIitRKSxDSElMRDpuZXcgUmVnRXhwKFwiXjoob25seXxmaXJzdHxsYXN0fG50aHxudGgtbGFzdCktKGNoaWxkfG9mLXR5cGUpKD86XFxcXChcIitNK1wiKihldmVufG9kZHwoKFsrLV18KShcXFxcZCopbnwpXCIrTStcIiooPzooWystXXwpXCIrTStcIiooXFxcXGQrKXwpKVwiK00rXCIqXFxcXCl8KVwiLFwiaVwiKSxib29sOm5ldyBSZWdFeHAoXCJeKD86XCIrTCtcIikkXCIsXCJpXCIpLG5lZWRzQ29udGV4dDpuZXcgUmVnRXhwKFwiXlwiK00rXCIqWz4rfl18OihldmVufG9kZHxlcXxndHxsdHxudGh8Zmlyc3R8bGFzdCkoPzpcXFxcKFwiK00rXCIqKCg/Oi1cXFxcZCk/XFxcXGQqKVwiK00rXCIqXFxcXCl8KSg/PVteLV18JClcIixcImlcIil9LFk9L14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9uKSQvaSxaPS9eaFxcZCQvaSwkPS9eW157XStcXHtcXHMqXFxbbmF0aXZlIFxcdy8sXz0vXig/OiMoW1xcdy1dKyl8KFxcdyspfFxcLihbXFx3LV0rKSkkLyxhYj0vWyt+XS8sYmI9Lyd8XFxcXC9nLGNiPW5ldyBSZWdFeHAoXCJcXFxcXFxcXChbXFxcXGRhLWZdezEsNn1cIitNK1wiP3woXCIrTStcIil8LilcIixcImlnXCIpLGRiPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1cIjB4XCIrYi02NTUzNjtyZXR1cm4gZCE9PWR8fGM/YjowPmQ/U3RyaW5nLmZyb21DaGFyQ29kZShkKzY1NTM2KTpTdHJpbmcuZnJvbUNoYXJDb2RlKGQ+PjEwfDU1Mjk2LDEwMjMmZHw1NjMyMCl9O3RyeXtJLmFwcGx5KEY9Si5jYWxsKHYuY2hpbGROb2Rlcyksdi5jaGlsZE5vZGVzKSxGW3YuY2hpbGROb2Rlcy5sZW5ndGhdLm5vZGVUeXBlfWNhdGNoKGViKXtJPXthcHBseTpGLmxlbmd0aD9mdW5jdGlvbihhLGIpe0guYXBwbHkoYSxKLmNhbGwoYikpfTpmdW5jdGlvbihhLGIpe3ZhciBjPWEubGVuZ3RoLGQ9MDt3aGlsZShhW2MrK109YltkKytdKTthLmxlbmd0aD1jLTF9fX1mdW5jdGlvbiBmYihhLGIsZCxlKXt2YXIgZixoLGosayxsLG8scixzLHcseDtpZigoYj9iLm93bmVyRG9jdW1lbnR8fGI6dikhPT1uJiZtKGIpLGI9Ynx8bixkPWR8fFtdLCFhfHxcInN0cmluZ1wiIT10eXBlb2YgYSlyZXR1cm4gZDtpZigxIT09KGs9Yi5ub2RlVHlwZSkmJjkhPT1rKXJldHVybltdO2lmKHAmJiFlKXtpZihmPV8uZXhlYyhhKSlpZihqPWZbMV0pe2lmKDk9PT1rKXtpZihoPWIuZ2V0RWxlbWVudEJ5SWQoaiksIWh8fCFoLnBhcmVudE5vZGUpcmV0dXJuIGQ7aWYoaC5pZD09PWopcmV0dXJuIGQucHVzaChoKSxkfWVsc2UgaWYoYi5vd25lckRvY3VtZW50JiYoaD1iLm93bmVyRG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaikpJiZ0KGIsaCkmJmguaWQ9PT1qKXJldHVybiBkLnB1c2goaCksZH1lbHNle2lmKGZbMl0pcmV0dXJuIEkuYXBwbHkoZCxiLmdldEVsZW1lbnRzQnlUYWdOYW1lKGEpKSxkO2lmKChqPWZbM10pJiZjLmdldEVsZW1lbnRzQnlDbGFzc05hbWUmJmIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSlyZXR1cm4gSS5hcHBseShkLGIuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShqKSksZH1pZihjLnFzYSYmKCFxfHwhcS50ZXN0KGEpKSl7aWYocz1yPXUsdz1iLHg9OT09PWsmJmEsMT09PWsmJlwib2JqZWN0XCIhPT1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkpe289ZyhhKSwocj1iLmdldEF0dHJpYnV0ZShcImlkXCIpKT9zPXIucmVwbGFjZShiYixcIlxcXFwkJlwiKTpiLnNldEF0dHJpYnV0ZShcImlkXCIscykscz1cIltpZD0nXCIrcytcIiddIFwiLGw9by5sZW5ndGg7d2hpbGUobC0tKW9bbF09cytxYihvW2xdKTt3PWFiLnRlc3QoYSkmJm9iKGIucGFyZW50Tm9kZSl8fGIseD1vLmpvaW4oXCIsXCIpfWlmKHgpdHJ5e3JldHVybiBJLmFwcGx5KGQsdy5xdWVyeVNlbGVjdG9yQWxsKHgpKSxkfWNhdGNoKHkpe31maW5hbGx5e3J8fGIucmVtb3ZlQXR0cmlidXRlKFwiaWRcIil9fX1yZXR1cm4gaShhLnJlcGxhY2UoUixcIiQxXCIpLGIsZCxlKX1mdW5jdGlvbiBnYigpe3ZhciBhPVtdO2Z1bmN0aW9uIGIoYyxlKXtyZXR1cm4gYS5wdXNoKGMrXCIgXCIpPmQuY2FjaGVMZW5ndGgmJmRlbGV0ZSBiW2Euc2hpZnQoKV0sYltjK1wiIFwiXT1lfXJldHVybiBifWZ1bmN0aW9uIGhiKGEpe3JldHVybiBhW3VdPSEwLGF9ZnVuY3Rpb24gaWIoYSl7dmFyIGI9bi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RyeXtyZXR1cm4hIWEoYil9Y2F0Y2goYyl7cmV0dXJuITF9ZmluYWxseXtiLnBhcmVudE5vZGUmJmIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChiKSxiPW51bGx9fWZ1bmN0aW9uIGpiKGEsYil7dmFyIGM9YS5zcGxpdChcInxcIiksZT1hLmxlbmd0aDt3aGlsZShlLS0pZC5hdHRySGFuZGxlW2NbZV1dPWJ9ZnVuY3Rpb24ga2IoYSxiKXt2YXIgYz1iJiZhLGQ9YyYmMT09PWEubm9kZVR5cGUmJjE9PT1iLm5vZGVUeXBlJiYofmIuc291cmNlSW5kZXh8fEQpLSh+YS5zb3VyY2VJbmRleHx8RCk7aWYoZClyZXR1cm4gZDtpZihjKXdoaWxlKGM9Yy5uZXh0U2libGluZylpZihjPT09YilyZXR1cm4tMTtyZXR1cm4gYT8xOi0xfWZ1bmN0aW9uIGxiKGEpe3JldHVybiBmdW5jdGlvbihiKXt2YXIgYz1iLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCJpbnB1dFwiPT09YyYmYi50eXBlPT09YX19ZnVuY3Rpb24gbWIoYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3ZhciBjPWIubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm4oXCJpbnB1dFwiPT09Y3x8XCJidXR0b25cIj09PWMpJiZiLnR5cGU9PT1hfX1mdW5jdGlvbiBuYihhKXtyZXR1cm4gaGIoZnVuY3Rpb24oYil7cmV0dXJuIGI9K2IsaGIoZnVuY3Rpb24oYyxkKXt2YXIgZSxmPWEoW10sYy5sZW5ndGgsYiksZz1mLmxlbmd0aDt3aGlsZShnLS0pY1tlPWZbZ11dJiYoY1tlXT0hKGRbZV09Y1tlXSkpfSl9KX1mdW5jdGlvbiBvYihhKXtyZXR1cm4gYSYmdHlwZW9mIGEuZ2V0RWxlbWVudHNCeVRhZ05hbWUhPT1DJiZhfWM9ZmIuc3VwcG9ydD17fSxmPWZiLmlzWE1MPWZ1bmN0aW9uKGEpe3ZhciBiPWEmJihhLm93bmVyRG9jdW1lbnR8fGEpLmRvY3VtZW50RWxlbWVudDtyZXR1cm4gYj9cIkhUTUxcIiE9PWIubm9kZU5hbWU6ITF9LG09ZmIuc2V0RG9jdW1lbnQ9ZnVuY3Rpb24oYSl7dmFyIGIsZT1hP2Eub3duZXJEb2N1bWVudHx8YTp2LGc9ZS5kZWZhdWx0VmlldztyZXR1cm4gZSE9PW4mJjk9PT1lLm5vZGVUeXBlJiZlLmRvY3VtZW50RWxlbWVudD8obj1lLG89ZS5kb2N1bWVudEVsZW1lbnQscD0hZihlKSxnJiZnIT09Zy50b3AmJihnLmFkZEV2ZW50TGlzdGVuZXI/Zy5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsZnVuY3Rpb24oKXttKCl9LCExKTpnLmF0dGFjaEV2ZW50JiZnLmF0dGFjaEV2ZW50KFwib251bmxvYWRcIixmdW5jdGlvbigpe20oKX0pKSxjLmF0dHJpYnV0ZXM9aWIoZnVuY3Rpb24oYSl7cmV0dXJuIGEuY2xhc3NOYW1lPVwiaVwiLCFhLmdldEF0dHJpYnV0ZShcImNsYXNzTmFtZVwiKX0pLGMuZ2V0RWxlbWVudHNCeVRhZ05hbWU9aWIoZnVuY3Rpb24oYSl7cmV0dXJuIGEuYXBwZW5kQ2hpbGQoZS5jcmVhdGVDb21tZW50KFwiXCIpKSwhYS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikubGVuZ3RofSksYy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lPSQudGVzdChlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUpJiZpYihmdW5jdGlvbihhKXtyZXR1cm4gYS5pbm5lckhUTUw9XCI8ZGl2IGNsYXNzPSdhJz48L2Rpdj48ZGl2IGNsYXNzPSdhIGknPjwvZGl2PlwiLGEuZmlyc3RDaGlsZC5jbGFzc05hbWU9XCJpXCIsMj09PWEuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImlcIikubGVuZ3RofSksYy5nZXRCeUlkPWliKGZ1bmN0aW9uKGEpe3JldHVybiBvLmFwcGVuZENoaWxkKGEpLmlkPXUsIWUuZ2V0RWxlbWVudHNCeU5hbWV8fCFlLmdldEVsZW1lbnRzQnlOYW1lKHUpLmxlbmd0aH0pLGMuZ2V0QnlJZD8oZC5maW5kLklEPWZ1bmN0aW9uKGEsYil7aWYodHlwZW9mIGIuZ2V0RWxlbWVudEJ5SWQhPT1DJiZwKXt2YXIgYz1iLmdldEVsZW1lbnRCeUlkKGEpO3JldHVybiBjJiZjLnBhcmVudE5vZGU/W2NdOltdfX0sZC5maWx0ZXIuSUQ9ZnVuY3Rpb24oYSl7dmFyIGI9YS5yZXBsYWNlKGNiLGRiKTtyZXR1cm4gZnVuY3Rpb24oYSl7cmV0dXJuIGEuZ2V0QXR0cmlidXRlKFwiaWRcIik9PT1ifX0pOihkZWxldGUgZC5maW5kLklELGQuZmlsdGVyLklEPWZ1bmN0aW9uKGEpe3ZhciBiPWEucmVwbGFjZShjYixkYik7cmV0dXJuIGZ1bmN0aW9uKGEpe3ZhciBjPXR5cGVvZiBhLmdldEF0dHJpYnV0ZU5vZGUhPT1DJiZhLmdldEF0dHJpYnV0ZU5vZGUoXCJpZFwiKTtyZXR1cm4gYyYmYy52YWx1ZT09PWJ9fSksZC5maW5kLlRBRz1jLmdldEVsZW1lbnRzQnlUYWdOYW1lP2Z1bmN0aW9uKGEsYil7cmV0dXJuIHR5cGVvZiBiLmdldEVsZW1lbnRzQnlUYWdOYW1lIT09Qz9iLmdldEVsZW1lbnRzQnlUYWdOYW1lKGEpOnZvaWQgMH06ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPVtdLGU9MCxmPWIuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYSk7aWYoXCIqXCI9PT1hKXt3aGlsZShjPWZbZSsrXSkxPT09Yy5ub2RlVHlwZSYmZC5wdXNoKGMpO3JldHVybiBkfXJldHVybiBmfSxkLmZpbmQuQ0xBU1M9Yy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lJiZmdW5jdGlvbihhLGIpe3JldHVybiB0eXBlb2YgYi5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lIT09QyYmcD9iLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYSk6dm9pZCAwfSxyPVtdLHE9W10sKGMucXNhPSQudGVzdChlLnF1ZXJ5U2VsZWN0b3JBbGwpKSYmKGliKGZ1bmN0aW9uKGEpe2EuaW5uZXJIVE1MPVwiPHNlbGVjdCBtc2FsbG93Y2xpcD0nJz48b3B0aW9uIHNlbGVjdGVkPScnPjwvb3B0aW9uPjwvc2VsZWN0PlwiLGEucXVlcnlTZWxlY3RvckFsbChcIlttc2FsbG93Y2xpcF49JyddXCIpLmxlbmd0aCYmcS5wdXNoKFwiWypeJF09XCIrTStcIiooPzonJ3xcXFwiXFxcIilcIiksYS5xdWVyeVNlbGVjdG9yQWxsKFwiW3NlbGVjdGVkXVwiKS5sZW5ndGh8fHEucHVzaChcIlxcXFxbXCIrTStcIiooPzp2YWx1ZXxcIitMK1wiKVwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCI6Y2hlY2tlZFwiKS5sZW5ndGh8fHEucHVzaChcIjpjaGVja2VkXCIpfSksaWIoZnVuY3Rpb24oYSl7dmFyIGI9ZS5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7Yi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsXCJoaWRkZW5cIiksYS5hcHBlbmRDaGlsZChiKS5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsXCJEXCIpLGEucXVlcnlTZWxlY3RvckFsbChcIltuYW1lPWRdXCIpLmxlbmd0aCYmcS5wdXNoKFwibmFtZVwiK00rXCIqWypeJHwhfl0/PVwiKSxhLnF1ZXJ5U2VsZWN0b3JBbGwoXCI6ZW5hYmxlZFwiKS5sZW5ndGh8fHEucHVzaChcIjplbmFibGVkXCIsXCI6ZGlzYWJsZWRcIiksYS5xdWVyeVNlbGVjdG9yQWxsKFwiKiw6eFwiKSxxLnB1c2goXCIsLio6XCIpfSkpLChjLm1hdGNoZXNTZWxlY3Rvcj0kLnRlc3Qocz1vLm1hdGNoZXN8fG8ud2Via2l0TWF0Y2hlc1NlbGVjdG9yfHxvLm1vek1hdGNoZXNTZWxlY3Rvcnx8by5vTWF0Y2hlc1NlbGVjdG9yfHxvLm1zTWF0Y2hlc1NlbGVjdG9yKSkmJmliKGZ1bmN0aW9uKGEpe2MuZGlzY29ubmVjdGVkTWF0Y2g9cy5jYWxsKGEsXCJkaXZcIikscy5jYWxsKGEsXCJbcyE9JyddOnhcIiksci5wdXNoKFwiIT1cIixRKX0pLHE9cS5sZW5ndGgmJm5ldyBSZWdFeHAocS5qb2luKFwifFwiKSkscj1yLmxlbmd0aCYmbmV3IFJlZ0V4cChyLmpvaW4oXCJ8XCIpKSxiPSQudGVzdChvLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKSx0PWJ8fCQudGVzdChvLmNvbnRhaW5zKT9mdW5jdGlvbihhLGIpe3ZhciBjPTk9PT1hLm5vZGVUeXBlP2EuZG9jdW1lbnRFbGVtZW50OmEsZD1iJiZiLnBhcmVudE5vZGU7cmV0dXJuIGE9PT1kfHwhKCFkfHwxIT09ZC5ub2RlVHlwZXx8IShjLmNvbnRhaW5zP2MuY29udGFpbnMoZCk6YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiYmMTYmYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihkKSkpfTpmdW5jdGlvbihhLGIpe2lmKGIpd2hpbGUoYj1iLnBhcmVudE5vZGUpaWYoYj09PWEpcmV0dXJuITA7cmV0dXJuITF9LEI9Yj9mdW5jdGlvbihhLGIpe2lmKGE9PT1iKXJldHVybiBsPSEwLDA7dmFyIGQ9IWEuY29tcGFyZURvY3VtZW50UG9zaXRpb24tIWIuY29tcGFyZURvY3VtZW50UG9zaXRpb247cmV0dXJuIGQ/ZDooZD0oYS5vd25lckRvY3VtZW50fHxhKT09PShiLm93bmVyRG9jdW1lbnR8fGIpP2EuY29tcGFyZURvY3VtZW50UG9zaXRpb24oYik6MSwxJmR8fCFjLnNvcnREZXRhY2hlZCYmYi5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihhKT09PWQ/YT09PWV8fGEub3duZXJEb2N1bWVudD09PXYmJnQodixhKT8tMTpiPT09ZXx8Yi5vd25lckRvY3VtZW50PT09diYmdCh2LGIpPzE6az9LLmNhbGwoayxhKS1LLmNhbGwoayxiKTowOjQmZD8tMToxKX06ZnVuY3Rpb24oYSxiKXtpZihhPT09YilyZXR1cm4gbD0hMCwwO3ZhciBjLGQ9MCxmPWEucGFyZW50Tm9kZSxnPWIucGFyZW50Tm9kZSxoPVthXSxpPVtiXTtpZighZnx8IWcpcmV0dXJuIGE9PT1lPy0xOmI9PT1lPzE6Zj8tMTpnPzE6az9LLmNhbGwoayxhKS1LLmNhbGwoayxiKTowO2lmKGY9PT1nKXJldHVybiBrYihhLGIpO2M9YTt3aGlsZShjPWMucGFyZW50Tm9kZSloLnVuc2hpZnQoYyk7Yz1iO3doaWxlKGM9Yy5wYXJlbnROb2RlKWkudW5zaGlmdChjKTt3aGlsZShoW2RdPT09aVtkXSlkKys7cmV0dXJuIGQ/a2IoaFtkXSxpW2RdKTpoW2RdPT09dj8tMTppW2RdPT09dj8xOjB9LGUpOm59LGZiLm1hdGNoZXM9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gZmIoYSxudWxsLG51bGwsYil9LGZiLm1hdGNoZXNTZWxlY3Rvcj1mdW5jdGlvbihhLGIpe2lmKChhLm93bmVyRG9jdW1lbnR8fGEpIT09biYmbShhKSxiPWIucmVwbGFjZShVLFwiPSckMSddXCIpLCEoIWMubWF0Y2hlc1NlbGVjdG9yfHwhcHx8ciYmci50ZXN0KGIpfHxxJiZxLnRlc3QoYikpKXRyeXt2YXIgZD1zLmNhbGwoYSxiKTtpZihkfHxjLmRpc2Nvbm5lY3RlZE1hdGNofHxhLmRvY3VtZW50JiYxMSE9PWEuZG9jdW1lbnQubm9kZVR5cGUpcmV0dXJuIGR9Y2F0Y2goZSl7fXJldHVybiBmYihiLG4sbnVsbCxbYV0pLmxlbmd0aD4wfSxmYi5jb250YWlucz1mdW5jdGlvbihhLGIpe3JldHVybihhLm93bmVyRG9jdW1lbnR8fGEpIT09biYmbShhKSx0KGEsYil9LGZiLmF0dHI9ZnVuY3Rpb24oYSxiKXsoYS5vd25lckRvY3VtZW50fHxhKSE9PW4mJm0oYSk7dmFyIGU9ZC5hdHRySGFuZGxlW2IudG9Mb3dlckNhc2UoKV0sZj1lJiZFLmNhbGwoZC5hdHRySGFuZGxlLGIudG9Mb3dlckNhc2UoKSk/ZShhLGIsIXApOnZvaWQgMDtyZXR1cm4gdm9pZCAwIT09Zj9mOmMuYXR0cmlidXRlc3x8IXA/YS5nZXRBdHRyaWJ1dGUoYik6KGY9YS5nZXRBdHRyaWJ1dGVOb2RlKGIpKSYmZi5zcGVjaWZpZWQ/Zi52YWx1ZTpudWxsfSxmYi5lcnJvcj1mdW5jdGlvbihhKXt0aHJvdyBuZXcgRXJyb3IoXCJTeW50YXggZXJyb3IsIHVucmVjb2duaXplZCBleHByZXNzaW9uOiBcIithKX0sZmIudW5pcXVlU29ydD1mdW5jdGlvbihhKXt2YXIgYixkPVtdLGU9MCxmPTA7aWYobD0hYy5kZXRlY3REdXBsaWNhdGVzLGs9IWMuc29ydFN0YWJsZSYmYS5zbGljZSgwKSxhLnNvcnQoQiksbCl7d2hpbGUoYj1hW2YrK10pYj09PWFbZl0mJihlPWQucHVzaChmKSk7d2hpbGUoZS0tKWEuc3BsaWNlKGRbZV0sMSl9cmV0dXJuIGs9bnVsbCxhfSxlPWZiLmdldFRleHQ9ZnVuY3Rpb24oYSl7dmFyIGIsYz1cIlwiLGQ9MCxmPWEubm9kZVR5cGU7aWYoZil7aWYoMT09PWZ8fDk9PT1mfHwxMT09PWYpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBhLnRleHRDb250ZW50KXJldHVybiBhLnRleHRDb250ZW50O2ZvcihhPWEuZmlyc3RDaGlsZDthO2E9YS5uZXh0U2libGluZyljKz1lKGEpfWVsc2UgaWYoMz09PWZ8fDQ9PT1mKXJldHVybiBhLm5vZGVWYWx1ZX1lbHNlIHdoaWxlKGI9YVtkKytdKWMrPWUoYik7cmV0dXJuIGN9LGQ9ZmIuc2VsZWN0b3JzPXtjYWNoZUxlbmd0aDo1MCxjcmVhdGVQc2V1ZG86aGIsbWF0Y2g6WCxhdHRySGFuZGxlOnt9LGZpbmQ6e30scmVsYXRpdmU6e1wiPlwiOntkaXI6XCJwYXJlbnROb2RlXCIsZmlyc3Q6ITB9LFwiIFwiOntkaXI6XCJwYXJlbnROb2RlXCJ9LFwiK1wiOntkaXI6XCJwcmV2aW91c1NpYmxpbmdcIixmaXJzdDohMH0sXCJ+XCI6e2RpcjpcInByZXZpb3VzU2libGluZ1wifX0scHJlRmlsdGVyOntBVFRSOmZ1bmN0aW9uKGEpe3JldHVybiBhWzFdPWFbMV0ucmVwbGFjZShjYixkYiksYVszXT0oYVszXXx8YVs0XXx8YVs1XXx8XCJcIikucmVwbGFjZShjYixkYiksXCJ+PVwiPT09YVsyXSYmKGFbM109XCIgXCIrYVszXStcIiBcIiksYS5zbGljZSgwLDQpfSxDSElMRDpmdW5jdGlvbihhKXtyZXR1cm4gYVsxXT1hWzFdLnRvTG93ZXJDYXNlKCksXCJudGhcIj09PWFbMV0uc2xpY2UoMCwzKT8oYVszXXx8ZmIuZXJyb3IoYVswXSksYVs0XT0rKGFbNF0/YVs1XSsoYVs2XXx8MSk6MiooXCJldmVuXCI9PT1hWzNdfHxcIm9kZFwiPT09YVszXSkpLGFbNV09KyhhWzddK2FbOF18fFwib2RkXCI9PT1hWzNdKSk6YVszXSYmZmIuZXJyb3IoYVswXSksYX0sUFNFVURPOmZ1bmN0aW9uKGEpe3ZhciBiLGM9IWFbNl0mJmFbMl07cmV0dXJuIFguQ0hJTEQudGVzdChhWzBdKT9udWxsOihhWzNdP2FbMl09YVs0XXx8YVs1XXx8XCJcIjpjJiZWLnRlc3QoYykmJihiPWcoYywhMCkpJiYoYj1jLmluZGV4T2YoXCIpXCIsYy5sZW5ndGgtYiktYy5sZW5ndGgpJiYoYVswXT1hWzBdLnNsaWNlKDAsYiksYVsyXT1jLnNsaWNlKDAsYikpLGEuc2xpY2UoMCwzKSl9fSxmaWx0ZXI6e1RBRzpmdW5jdGlvbihhKXt2YXIgYj1hLnJlcGxhY2UoY2IsZGIpLnRvTG93ZXJDYXNlKCk7cmV0dXJuXCIqXCI9PT1hP2Z1bmN0aW9uKCl7cmV0dXJuITB9OmZ1bmN0aW9uKGEpe3JldHVybiBhLm5vZGVOYW1lJiZhLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1ifX0sQ0xBU1M6ZnVuY3Rpb24oYSl7dmFyIGI9eVthK1wiIFwiXTtyZXR1cm4gYnx8KGI9bmV3IFJlZ0V4cChcIihefFwiK00rXCIpXCIrYStcIihcIitNK1wifCQpXCIpKSYmeShhLGZ1bmN0aW9uKGEpe3JldHVybiBiLnRlc3QoXCJzdHJpbmdcIj09dHlwZW9mIGEuY2xhc3NOYW1lJiZhLmNsYXNzTmFtZXx8dHlwZW9mIGEuZ2V0QXR0cmlidXRlIT09QyYmYS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKXx8XCJcIil9KX0sQVRUUjpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIGZ1bmN0aW9uKGQpe3ZhciBlPWZiLmF0dHIoZCxhKTtyZXR1cm4gbnVsbD09ZT9cIiE9XCI9PT1iOmI/KGUrPVwiXCIsXCI9XCI9PT1iP2U9PT1jOlwiIT1cIj09PWI/ZSE9PWM6XCJePVwiPT09Yj9jJiYwPT09ZS5pbmRleE9mKGMpOlwiKj1cIj09PWI/YyYmZS5pbmRleE9mKGMpPi0xOlwiJD1cIj09PWI/YyYmZS5zbGljZSgtYy5sZW5ndGgpPT09YzpcIn49XCI9PT1iPyhcIiBcIitlK1wiIFwiKS5pbmRleE9mKGMpPi0xOlwifD1cIj09PWI/ZT09PWN8fGUuc2xpY2UoMCxjLmxlbmd0aCsxKT09PWMrXCItXCI6ITEpOiEwfX0sQ0hJTEQ6ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZj1cIm50aFwiIT09YS5zbGljZSgwLDMpLGc9XCJsYXN0XCIhPT1hLnNsaWNlKC00KSxoPVwib2YtdHlwZVwiPT09YjtyZXR1cm4gMT09PWQmJjA9PT1lP2Z1bmN0aW9uKGEpe3JldHVybiEhYS5wYXJlbnROb2RlfTpmdW5jdGlvbihiLGMsaSl7dmFyIGosayxsLG0sbixvLHA9ZiE9PWc/XCJuZXh0U2libGluZ1wiOlwicHJldmlvdXNTaWJsaW5nXCIscT1iLnBhcmVudE5vZGUscj1oJiZiLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkscz0haSYmIWg7aWYocSl7aWYoZil7d2hpbGUocCl7bD1iO3doaWxlKGw9bFtwXSlpZihoP2wubm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PXI6MT09PWwubm9kZVR5cGUpcmV0dXJuITE7bz1wPVwib25seVwiPT09YSYmIW8mJlwibmV4dFNpYmxpbmdcIn1yZXR1cm4hMH1pZihvPVtnP3EuZmlyc3RDaGlsZDpxLmxhc3RDaGlsZF0sZyYmcyl7az1xW3VdfHwocVt1XT17fSksaj1rW2FdfHxbXSxuPWpbMF09PT13JiZqWzFdLG09alswXT09PXcmJmpbMl0sbD1uJiZxLmNoaWxkTm9kZXNbbl07d2hpbGUobD0rK24mJmwmJmxbcF18fChtPW49MCl8fG8ucG9wKCkpaWYoMT09PWwubm9kZVR5cGUmJisrbSYmbD09PWIpe2tbYV09W3csbixtXTticmVha319ZWxzZSBpZihzJiYoaj0oYlt1XXx8KGJbdV09e30pKVthXSkmJmpbMF09PT13KW09alsxXTtlbHNlIHdoaWxlKGw9KytuJiZsJiZsW3BdfHwobT1uPTApfHxvLnBvcCgpKWlmKChoP2wubm9kZU5hbWUudG9Mb3dlckNhc2UoKT09PXI6MT09PWwubm9kZVR5cGUpJiYrK20mJihzJiYoKGxbdV18fChsW3VdPXt9KSlbYV09W3csbV0pLGw9PT1iKSlicmVhaztyZXR1cm4gbS09ZSxtPT09ZHx8bSVkPT09MCYmbS9kPj0wfX19LFBTRVVETzpmdW5jdGlvbihhLGIpe3ZhciBjLGU9ZC5wc2V1ZG9zW2FdfHxkLnNldEZpbHRlcnNbYS50b0xvd2VyQ2FzZSgpXXx8ZmIuZXJyb3IoXCJ1bnN1cHBvcnRlZCBwc2V1ZG86IFwiK2EpO3JldHVybiBlW3VdP2UoYik6ZS5sZW5ndGg+MT8oYz1bYSxhLFwiXCIsYl0sZC5zZXRGaWx0ZXJzLmhhc093blByb3BlcnR5KGEudG9Mb3dlckNhc2UoKSk/aGIoZnVuY3Rpb24oYSxjKXt2YXIgZCxmPWUoYSxiKSxnPWYubGVuZ3RoO3doaWxlKGctLSlkPUsuY2FsbChhLGZbZ10pLGFbZF09IShjW2RdPWZbZ10pfSk6ZnVuY3Rpb24oYSl7cmV0dXJuIGUoYSwwLGMpfSk6ZX19LHBzZXVkb3M6e25vdDpoYihmdW5jdGlvbihhKXt2YXIgYj1bXSxjPVtdLGQ9aChhLnJlcGxhY2UoUixcIiQxXCIpKTtyZXR1cm4gZFt1XT9oYihmdW5jdGlvbihhLGIsYyxlKXt2YXIgZixnPWQoYSxudWxsLGUsW10pLGg9YS5sZW5ndGg7d2hpbGUoaC0tKShmPWdbaF0pJiYoYVtoXT0hKGJbaF09ZikpfSk6ZnVuY3Rpb24oYSxlLGYpe3JldHVybiBiWzBdPWEsZChiLG51bGwsZixjKSwhYy5wb3AoKX19KSxoYXM6aGIoZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiBmYihhLGIpLmxlbmd0aD4wfX0pLGNvbnRhaW5zOmhiKGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiKXtyZXR1cm4oYi50ZXh0Q29udGVudHx8Yi5pbm5lclRleHR8fGUoYikpLmluZGV4T2YoYSk+LTF9fSksbGFuZzpoYihmdW5jdGlvbihhKXtyZXR1cm4gVy50ZXN0KGF8fFwiXCIpfHxmYi5lcnJvcihcInVuc3VwcG9ydGVkIGxhbmc6IFwiK2EpLGE9YS5yZXBsYWNlKGNiLGRiKS50b0xvd2VyQ2FzZSgpLGZ1bmN0aW9uKGIpe3ZhciBjO2RvIGlmKGM9cD9iLmxhbmc6Yi5nZXRBdHRyaWJ1dGUoXCJ4bWw6bGFuZ1wiKXx8Yi5nZXRBdHRyaWJ1dGUoXCJsYW5nXCIpKXJldHVybiBjPWMudG9Mb3dlckNhc2UoKSxjPT09YXx8MD09PWMuaW5kZXhPZihhK1wiLVwiKTt3aGlsZSgoYj1iLnBhcmVudE5vZGUpJiYxPT09Yi5ub2RlVHlwZSk7cmV0dXJuITF9fSksdGFyZ2V0OmZ1bmN0aW9uKGIpe3ZhciBjPWEubG9jYXRpb24mJmEubG9jYXRpb24uaGFzaDtyZXR1cm4gYyYmYy5zbGljZSgxKT09PWIuaWR9LHJvb3Q6ZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1vfSxmb2N1czpmdW5jdGlvbihhKXtyZXR1cm4gYT09PW4uYWN0aXZlRWxlbWVudCYmKCFuLmhhc0ZvY3VzfHxuLmhhc0ZvY3VzKCkpJiYhIShhLnR5cGV8fGEuaHJlZnx8fmEudGFiSW5kZXgpfSxlbmFibGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhLmRpc2FibGVkPT09ITF9LGRpc2FibGVkOmZ1bmN0aW9uKGEpe3JldHVybiBhLmRpc2FibGVkPT09ITB9LGNoZWNrZWQ6ZnVuY3Rpb24oYSl7dmFyIGI9YS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO3JldHVyblwiaW5wdXRcIj09PWImJiEhYS5jaGVja2VkfHxcIm9wdGlvblwiPT09YiYmISFhLnNlbGVjdGVkfSxzZWxlY3RlZDpmdW5jdGlvbihhKXtyZXR1cm4gYS5wYXJlbnROb2RlJiZhLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCxhLnNlbGVjdGVkPT09ITB9LGVtcHR5OmZ1bmN0aW9uKGEpe2ZvcihhPWEuZmlyc3RDaGlsZDthO2E9YS5uZXh0U2libGluZylpZihhLm5vZGVUeXBlPDYpcmV0dXJuITE7cmV0dXJuITB9LHBhcmVudDpmdW5jdGlvbihhKXtyZXR1cm4hZC5wc2V1ZG9zLmVtcHR5KGEpfSxoZWFkZXI6ZnVuY3Rpb24oYSl7cmV0dXJuIFoudGVzdChhLm5vZGVOYW1lKX0saW5wdXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIFkudGVzdChhLm5vZGVOYW1lKX0sYnV0dG9uOmZ1bmN0aW9uKGEpe3ZhciBiPWEubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtyZXR1cm5cImlucHV0XCI9PT1iJiZcImJ1dHRvblwiPT09YS50eXBlfHxcImJ1dHRvblwiPT09Yn0sdGV4dDpmdW5jdGlvbihhKXt2YXIgYjtyZXR1cm5cImlucHV0XCI9PT1hLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkmJlwidGV4dFwiPT09YS50eXBlJiYobnVsbD09KGI9YS5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpKXx8XCJ0ZXh0XCI9PT1iLnRvTG93ZXJDYXNlKCkpfSxmaXJzdDpuYihmdW5jdGlvbigpe3JldHVyblswXX0pLGxhc3Q6bmIoZnVuY3Rpb24oYSxiKXtyZXR1cm5bYi0xXX0pLGVxOm5iKGZ1bmN0aW9uKGEsYixjKXtyZXR1cm5bMD5jP2MrYjpjXX0pLGV2ZW46bmIoZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MDtiPmM7Yys9MilhLnB1c2goYyk7cmV0dXJuIGF9KSxvZGQ6bmIoZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9MTtiPmM7Yys9MilhLnB1c2goYyk7cmV0dXJuIGF9KSxsdDpuYihmdW5jdGlvbihhLGIsYyl7Zm9yKHZhciBkPTA+Yz9jK2I6YzstLWQ+PTA7KWEucHVzaChkKTtyZXR1cm4gYX0pLGd0Om5iKGZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGQ9MD5jP2MrYjpjOysrZDxiOylhLnB1c2goZCk7cmV0dXJuIGF9KX19LGQucHNldWRvcy5udGg9ZC5wc2V1ZG9zLmVxO2ZvcihiIGlue3JhZGlvOiEwLGNoZWNrYm94OiEwLGZpbGU6ITAscGFzc3dvcmQ6ITAsaW1hZ2U6ITB9KWQucHNldWRvc1tiXT1sYihiKTtmb3IoYiBpbntzdWJtaXQ6ITAscmVzZXQ6ITB9KWQucHNldWRvc1tiXT1tYihiKTtmdW5jdGlvbiBwYigpe31wYi5wcm90b3R5cGU9ZC5maWx0ZXJzPWQucHNldWRvcyxkLnNldEZpbHRlcnM9bmV3IHBiLGc9ZmIudG9rZW5pemU9ZnVuY3Rpb24oYSxiKXt2YXIgYyxlLGYsZyxoLGksaixrPXpbYStcIiBcIl07aWYoaylyZXR1cm4gYj8wOmsuc2xpY2UoMCk7aD1hLGk9W10saj1kLnByZUZpbHRlcjt3aGlsZShoKXsoIWN8fChlPVMuZXhlYyhoKSkpJiYoZSYmKGg9aC5zbGljZShlWzBdLmxlbmd0aCl8fGgpLGkucHVzaChmPVtdKSksYz0hMSwoZT1ULmV4ZWMoaCkpJiYoYz1lLnNoaWZ0KCksZi5wdXNoKHt2YWx1ZTpjLHR5cGU6ZVswXS5yZXBsYWNlKFIsXCIgXCIpfSksaD1oLnNsaWNlKGMubGVuZ3RoKSk7Zm9yKGcgaW4gZC5maWx0ZXIpIShlPVhbZ10uZXhlYyhoKSl8fGpbZ10mJiEoZT1qW2ddKGUpKXx8KGM9ZS5zaGlmdCgpLGYucHVzaCh7dmFsdWU6Yyx0eXBlOmcsbWF0Y2hlczplfSksaD1oLnNsaWNlKGMubGVuZ3RoKSk7aWYoIWMpYnJlYWt9cmV0dXJuIGI/aC5sZW5ndGg6aD9mYi5lcnJvcihhKTp6KGEsaSkuc2xpY2UoMCl9O2Z1bmN0aW9uIHFiKGEpe2Zvcih2YXIgYj0wLGM9YS5sZW5ndGgsZD1cIlwiO2M+YjtiKyspZCs9YVtiXS52YWx1ZTtyZXR1cm4gZH1mdW5jdGlvbiByYihhLGIsYyl7dmFyIGQ9Yi5kaXIsZT1jJiZcInBhcmVudE5vZGVcIj09PWQsZj14Kys7cmV0dXJuIGIuZmlyc3Q/ZnVuY3Rpb24oYixjLGYpe3doaWxlKGI9YltkXSlpZigxPT09Yi5ub2RlVHlwZXx8ZSlyZXR1cm4gYShiLGMsZil9OmZ1bmN0aW9uKGIsYyxnKXt2YXIgaCxpLGo9W3csZl07aWYoZyl7d2hpbGUoYj1iW2RdKWlmKCgxPT09Yi5ub2RlVHlwZXx8ZSkmJmEoYixjLGcpKXJldHVybiEwfWVsc2Ugd2hpbGUoYj1iW2RdKWlmKDE9PT1iLm5vZGVUeXBlfHxlKXtpZihpPWJbdV18fChiW3VdPXt9KSwoaD1pW2RdKSYmaFswXT09PXcmJmhbMV09PT1mKXJldHVybiBqWzJdPWhbMl07aWYoaVtkXT1qLGpbMl09YShiLGMsZykpcmV0dXJuITB9fX1mdW5jdGlvbiBzYihhKXtyZXR1cm4gYS5sZW5ndGg+MT9mdW5jdGlvbihiLGMsZCl7dmFyIGU9YS5sZW5ndGg7d2hpbGUoZS0tKWlmKCFhW2VdKGIsYyxkKSlyZXR1cm4hMTtyZXR1cm4hMH06YVswXX1mdW5jdGlvbiB0YihhLGIsYyl7Zm9yKHZhciBkPTAsZT1iLmxlbmd0aDtlPmQ7ZCsrKWZiKGEsYltkXSxjKTtyZXR1cm4gY31mdW5jdGlvbiB1YihhLGIsYyxkLGUpe2Zvcih2YXIgZixnPVtdLGg9MCxpPWEubGVuZ3RoLGo9bnVsbCE9YjtpPmg7aCsrKShmPWFbaF0pJiYoIWN8fGMoZixkLGUpKSYmKGcucHVzaChmKSxqJiZiLnB1c2goaCkpO3JldHVybiBnfWZ1bmN0aW9uIHZiKGEsYixjLGQsZSxmKXtyZXR1cm4gZCYmIWRbdV0mJihkPXZiKGQpKSxlJiYhZVt1XSYmKGU9dmIoZSxmKSksaGIoZnVuY3Rpb24oZixnLGgsaSl7dmFyIGosayxsLG09W10sbj1bXSxvPWcubGVuZ3RoLHA9Znx8dGIoYnx8XCIqXCIsaC5ub2RlVHlwZT9baF06aCxbXSkscT0hYXx8IWYmJmI/cDp1YihwLG0sYSxoLGkpLHI9Yz9lfHwoZj9hOm98fGQpP1tdOmc6cTtpZihjJiZjKHEscixoLGkpLGQpe2o9dWIocixuKSxkKGosW10saCxpKSxrPWoubGVuZ3RoO3doaWxlKGstLSkobD1qW2tdKSYmKHJbbltrXV09IShxW25ba11dPWwpKX1pZihmKXtpZihlfHxhKXtpZihlKXtqPVtdLGs9ci5sZW5ndGg7d2hpbGUoay0tKShsPXJba10pJiZqLnB1c2gocVtrXT1sKTtlKG51bGwscj1bXSxqLGkpfWs9ci5sZW5ndGg7d2hpbGUoay0tKShsPXJba10pJiYoaj1lP0suY2FsbChmLGwpOm1ba10pPi0xJiYoZltqXT0hKGdbal09bCkpfX1lbHNlIHI9dWIocj09PWc/ci5zcGxpY2UobyxyLmxlbmd0aCk6ciksZT9lKG51bGwsZyxyLGkpOkkuYXBwbHkoZyxyKX0pfWZ1bmN0aW9uIHdiKGEpe2Zvcih2YXIgYixjLGUsZj1hLmxlbmd0aCxnPWQucmVsYXRpdmVbYVswXS50eXBlXSxoPWd8fGQucmVsYXRpdmVbXCIgXCJdLGk9Zz8xOjAsaz1yYihmdW5jdGlvbihhKXtyZXR1cm4gYT09PWJ9LGgsITApLGw9cmIoZnVuY3Rpb24oYSl7cmV0dXJuIEsuY2FsbChiLGEpPi0xfSxoLCEwKSxtPVtmdW5jdGlvbihhLGMsZCl7cmV0dXJuIWcmJihkfHxjIT09ail8fCgoYj1jKS5ub2RlVHlwZT9rKGEsYyxkKTpsKGEsYyxkKSl9XTtmPmk7aSsrKWlmKGM9ZC5yZWxhdGl2ZVthW2ldLnR5cGVdKW09W3JiKHNiKG0pLGMpXTtlbHNle2lmKGM9ZC5maWx0ZXJbYVtpXS50eXBlXS5hcHBseShudWxsLGFbaV0ubWF0Y2hlcyksY1t1XSl7Zm9yKGU9KytpO2Y+ZTtlKyspaWYoZC5yZWxhdGl2ZVthW2VdLnR5cGVdKWJyZWFrO3JldHVybiB2YihpPjEmJnNiKG0pLGk+MSYmcWIoYS5zbGljZSgwLGktMSkuY29uY2F0KHt2YWx1ZTpcIiBcIj09PWFbaS0yXS50eXBlP1wiKlwiOlwiXCJ9KSkucmVwbGFjZShSLFwiJDFcIiksYyxlPmkmJndiKGEuc2xpY2UoaSxlKSksZj5lJiZ3YihhPWEuc2xpY2UoZSkpLGY+ZSYmcWIoYSkpfW0ucHVzaChjKX1yZXR1cm4gc2IobSl9ZnVuY3Rpb24geGIoYSxiKXt2YXIgYz1iLmxlbmd0aD4wLGU9YS5sZW5ndGg+MCxmPWZ1bmN0aW9uKGYsZyxoLGksayl7dmFyIGwsbSxvLHA9MCxxPVwiMFwiLHI9ZiYmW10scz1bXSx0PWosdT1mfHxlJiZkLmZpbmQuVEFHKFwiKlwiLGspLHY9dys9bnVsbD09dD8xOk1hdGgucmFuZG9tKCl8fC4xLHg9dS5sZW5ndGg7Zm9yKGsmJihqPWchPT1uJiZnKTtxIT09eCYmbnVsbCE9KGw9dVtxXSk7cSsrKXtpZihlJiZsKXttPTA7d2hpbGUobz1hW20rK10paWYobyhsLGcsaCkpe2kucHVzaChsKTticmVha31rJiYodz12KX1jJiYoKGw9IW8mJmwpJiZwLS0sZiYmci5wdXNoKGwpKX1pZihwKz1xLGMmJnEhPT1wKXttPTA7d2hpbGUobz1iW20rK10pbyhyLHMsZyxoKTtpZihmKXtpZihwPjApd2hpbGUocS0tKXJbcV18fHNbcV18fChzW3FdPUcuY2FsbChpKSk7cz11YihzKX1JLmFwcGx5KGkscyksayYmIWYmJnMubGVuZ3RoPjAmJnArYi5sZW5ndGg+MSYmZmIudW5pcXVlU29ydChpKX1yZXR1cm4gayYmKHc9dixqPXQpLHJ9O3JldHVybiBjP2hiKGYpOmZ9cmV0dXJuIGg9ZmIuY29tcGlsZT1mdW5jdGlvbihhLGIpe3ZhciBjLGQ9W10sZT1bXSxmPUFbYStcIiBcIl07aWYoIWYpe2J8fChiPWcoYSkpLGM9Yi5sZW5ndGg7d2hpbGUoYy0tKWY9d2IoYltjXSksZlt1XT9kLnB1c2goZik6ZS5wdXNoKGYpO2Y9QShhLHhiKGUsZCkpLGYuc2VsZWN0b3I9YX1yZXR1cm4gZn0saT1mYi5zZWxlY3Q9ZnVuY3Rpb24oYSxiLGUsZil7dmFyIGksaixrLGwsbSxuPVwiZnVuY3Rpb25cIj09dHlwZW9mIGEmJmEsbz0hZiYmZyhhPW4uc2VsZWN0b3J8fGEpO2lmKGU9ZXx8W10sMT09PW8ubGVuZ3RoKXtpZihqPW9bMF09b1swXS5zbGljZSgwKSxqLmxlbmd0aD4yJiZcIklEXCI9PT0oaz1qWzBdKS50eXBlJiZjLmdldEJ5SWQmJjk9PT1iLm5vZGVUeXBlJiZwJiZkLnJlbGF0aXZlW2pbMV0udHlwZV0pe2lmKGI9KGQuZmluZC5JRChrLm1hdGNoZXNbMF0ucmVwbGFjZShjYixkYiksYil8fFtdKVswXSwhYilyZXR1cm4gZTtuJiYoYj1iLnBhcmVudE5vZGUpLGE9YS5zbGljZShqLnNoaWZ0KCkudmFsdWUubGVuZ3RoKX1pPVgubmVlZHNDb250ZXh0LnRlc3QoYSk/MDpqLmxlbmd0aDt3aGlsZShpLS0pe2lmKGs9altpXSxkLnJlbGF0aXZlW2w9ay50eXBlXSlicmVhaztpZigobT1kLmZpbmRbbF0pJiYoZj1tKGsubWF0Y2hlc1swXS5yZXBsYWNlKGNiLGRiKSxhYi50ZXN0KGpbMF0udHlwZSkmJm9iKGIucGFyZW50Tm9kZSl8fGIpKSl7aWYoai5zcGxpY2UoaSwxKSxhPWYubGVuZ3RoJiZxYihqKSwhYSlyZXR1cm4gSS5hcHBseShlLGYpLGU7YnJlYWt9fX1yZXR1cm4obnx8aChhLG8pKShmLGIsIXAsZSxhYi50ZXN0KGEpJiZvYihiLnBhcmVudE5vZGUpfHxiKSxlfSxjLnNvcnRTdGFibGU9dS5zcGxpdChcIlwiKS5zb3J0KEIpLmpvaW4oXCJcIik9PT11LGMuZGV0ZWN0RHVwbGljYXRlcz0hIWwsbSgpLGMuc29ydERldGFjaGVkPWliKGZ1bmN0aW9uKGEpe3JldHVybiAxJmEuY29tcGFyZURvY3VtZW50UG9zaXRpb24obi5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKX0pLGliKGZ1bmN0aW9uKGEpe3JldHVybiBhLmlubmVySFRNTD1cIjxhIGhyZWY9JyMnPjwvYT5cIixcIiNcIj09PWEuZmlyc3RDaGlsZC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpfSl8fGpiKFwidHlwZXxocmVmfGhlaWdodHx3aWR0aFwiLGZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gYz92b2lkIDA6YS5nZXRBdHRyaWJ1dGUoYixcInR5cGVcIj09PWIudG9Mb3dlckNhc2UoKT8xOjIpfSksYy5hdHRyaWJ1dGVzJiZpYihmdW5jdGlvbihhKXtyZXR1cm4gYS5pbm5lckhUTUw9XCI8aW5wdXQvPlwiLGEuZmlyc3RDaGlsZC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLFwiXCIpLFwiXCI9PT1hLmZpcnN0Q2hpbGQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIil9KXx8amIoXCJ2YWx1ZVwiLGZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gY3x8XCJpbnB1dFwiIT09YS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpP3ZvaWQgMDphLmRlZmF1bHRWYWx1ZX0pLGliKGZ1bmN0aW9uKGEpe3JldHVybiBudWxsPT1hLmdldEF0dHJpYnV0ZShcImRpc2FibGVkXCIpfSl8fGpiKEwsZnVuY3Rpb24oYSxiLGMpe3ZhciBkO3JldHVybiBjP3ZvaWQgMDphW2JdPT09ITA/Yi50b0xvd2VyQ2FzZSgpOihkPWEuZ2V0QXR0cmlidXRlTm9kZShiKSkmJmQuc3BlY2lmaWVkP2QudmFsdWU6bnVsbH0pLGZifShhKTtuLmZpbmQ9dCxuLmV4cHI9dC5zZWxlY3RvcnMsbi5leHByW1wiOlwiXT1uLmV4cHIucHNldWRvcyxuLnVuaXF1ZT10LnVuaXF1ZVNvcnQsbi50ZXh0PXQuZ2V0VGV4dCxuLmlzWE1MRG9jPXQuaXNYTUwsbi5jb250YWlucz10LmNvbnRhaW5zO3ZhciB1PW4uZXhwci5tYXRjaC5uZWVkc0NvbnRleHQsdj0vXjwoXFx3KylcXHMqXFwvPz4oPzo8XFwvXFwxPnwpJC8sdz0vXi5bXjojXFxbXFwuLF0qJC87ZnVuY3Rpb24geChhLGIsYyl7aWYobi5pc0Z1bmN0aW9uKGIpKXJldHVybiBuLmdyZXAoYSxmdW5jdGlvbihhLGQpe3JldHVybiEhYi5jYWxsKGEsZCxhKSE9PWN9KTtpZihiLm5vZGVUeXBlKXJldHVybiBuLmdyZXAoYSxmdW5jdGlvbihhKXtyZXR1cm4gYT09PWIhPT1jfSk7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGIpe2lmKHcudGVzdChiKSlyZXR1cm4gbi5maWx0ZXIoYixhLGMpO2I9bi5maWx0ZXIoYixhKX1yZXR1cm4gbi5ncmVwKGEsZnVuY3Rpb24oYSl7cmV0dXJuIGcuY2FsbChiLGEpPj0wIT09Y30pfW4uZmlsdGVyPWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1iWzBdO3JldHVybiBjJiYoYT1cIjpub3QoXCIrYStcIilcIiksMT09PWIubGVuZ3RoJiYxPT09ZC5ub2RlVHlwZT9uLmZpbmQubWF0Y2hlc1NlbGVjdG9yKGQsYSk/W2RdOltdOm4uZmluZC5tYXRjaGVzKGEsbi5ncmVwKGIsZnVuY3Rpb24oYSl7cmV0dXJuIDE9PT1hLm5vZGVUeXBlfSkpfSxuLmZuLmV4dGVuZCh7ZmluZDpmdW5jdGlvbihhKXt2YXIgYixjPXRoaXMubGVuZ3RoLGQ9W10sZT10aGlzO2lmKFwic3RyaW5nXCIhPXR5cGVvZiBhKXJldHVybiB0aGlzLnB1c2hTdGFjayhuKGEpLmZpbHRlcihmdW5jdGlvbigpe2ZvcihiPTA7Yz5iO2IrKylpZihuLmNvbnRhaW5zKGVbYl0sdGhpcykpcmV0dXJuITB9KSk7Zm9yKGI9MDtjPmI7YisrKW4uZmluZChhLGVbYl0sZCk7cmV0dXJuIGQ9dGhpcy5wdXNoU3RhY2soYz4xP24udW5pcXVlKGQpOmQpLGQuc2VsZWN0b3I9dGhpcy5zZWxlY3Rvcj90aGlzLnNlbGVjdG9yK1wiIFwiK2E6YSxkfSxmaWx0ZXI6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKHgodGhpcyxhfHxbXSwhMSkpfSxub3Q6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMucHVzaFN0YWNrKHgodGhpcyxhfHxbXSwhMCkpfSxpczpmdW5jdGlvbihhKXtyZXR1cm4hIXgodGhpcyxcInN0cmluZ1wiPT10eXBlb2YgYSYmdS50ZXN0KGEpP24oYSk6YXx8W10sITEpLmxlbmd0aH19KTt2YXIgeSx6PS9eKD86XFxzKig8W1xcd1xcV10rPilbXj5dKnwjKFtcXHctXSopKSQvLEE9bi5mbi5pbml0PWZ1bmN0aW9uKGEsYil7dmFyIGMsZDtpZighYSlyZXR1cm4gdGhpcztpZihcInN0cmluZ1wiPT10eXBlb2YgYSl7aWYoYz1cIjxcIj09PWFbMF0mJlwiPlwiPT09YVthLmxlbmd0aC0xXSYmYS5sZW5ndGg+PTM/W251bGwsYSxudWxsXTp6LmV4ZWMoYSksIWN8fCFjWzFdJiZiKXJldHVybiFifHxiLmpxdWVyeT8oYnx8eSkuZmluZChhKTp0aGlzLmNvbnN0cnVjdG9yKGIpLmZpbmQoYSk7aWYoY1sxXSl7aWYoYj1iIGluc3RhbmNlb2Ygbj9iWzBdOmIsbi5tZXJnZSh0aGlzLG4ucGFyc2VIVE1MKGNbMV0sYiYmYi5ub2RlVHlwZT9iLm93bmVyRG9jdW1lbnR8fGI6bCwhMCkpLHYudGVzdChjWzFdKSYmbi5pc1BsYWluT2JqZWN0KGIpKWZvcihjIGluIGIpbi5pc0Z1bmN0aW9uKHRoaXNbY10pP3RoaXNbY10oYltjXSk6dGhpcy5hdHRyKGMsYltjXSk7cmV0dXJuIHRoaXN9cmV0dXJuIGQ9bC5nZXRFbGVtZW50QnlJZChjWzJdKSxkJiZkLnBhcmVudE5vZGUmJih0aGlzLmxlbmd0aD0xLHRoaXNbMF09ZCksdGhpcy5jb250ZXh0PWwsdGhpcy5zZWxlY3Rvcj1hLHRoaXN9cmV0dXJuIGEubm9kZVR5cGU/KHRoaXMuY29udGV4dD10aGlzWzBdPWEsdGhpcy5sZW5ndGg9MSx0aGlzKTpuLmlzRnVuY3Rpb24oYSk/XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHkucmVhZHk/eS5yZWFkeShhKTphKG4pOih2b2lkIDAhPT1hLnNlbGVjdG9yJiYodGhpcy5zZWxlY3Rvcj1hLnNlbGVjdG9yLHRoaXMuY29udGV4dD1hLmNvbnRleHQpLG4ubWFrZUFycmF5KGEsdGhpcykpfTtBLnByb3RvdHlwZT1uLmZuLHk9bihsKTt2YXIgQj0vXig/OnBhcmVudHN8cHJldig/OlVudGlsfEFsbCkpLyxDPXtjaGlsZHJlbjohMCxjb250ZW50czohMCxuZXh0OiEwLHByZXY6ITB9O24uZXh0ZW5kKHtkaXI6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPVtdLGU9dm9pZCAwIT09Yzt3aGlsZSgoYT1hW2JdKSYmOSE9PWEubm9kZVR5cGUpaWYoMT09PWEubm9kZVR5cGUpe2lmKGUmJm4oYSkuaXMoYykpYnJlYWs7ZC5wdXNoKGEpfXJldHVybiBkfSxzaWJsaW5nOmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPVtdO2E7YT1hLm5leHRTaWJsaW5nKTE9PT1hLm5vZGVUeXBlJiZhIT09YiYmYy5wdXNoKGEpO3JldHVybiBjfX0pLG4uZm4uZXh0ZW5kKHtoYXM6ZnVuY3Rpb24oYSl7dmFyIGI9bihhLHRoaXMpLGM9Yi5sZW5ndGg7cmV0dXJuIHRoaXMuZmlsdGVyKGZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7Yz5hO2ErKylpZihuLmNvbnRhaW5zKHRoaXMsYlthXSkpcmV0dXJuITB9KX0sY2xvc2VzdDpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYyxkPTAsZT10aGlzLmxlbmd0aCxmPVtdLGc9dS50ZXN0KGEpfHxcInN0cmluZ1wiIT10eXBlb2YgYT9uKGEsYnx8dGhpcy5jb250ZXh0KTowO2U+ZDtkKyspZm9yKGM9dGhpc1tkXTtjJiZjIT09YjtjPWMucGFyZW50Tm9kZSlpZihjLm5vZGVUeXBlPDExJiYoZz9nLmluZGV4KGMpPi0xOjE9PT1jLm5vZGVUeXBlJiZuLmZpbmQubWF0Y2hlc1NlbGVjdG9yKGMsYSkpKXtmLnB1c2goYyk7YnJlYWt9cmV0dXJuIHRoaXMucHVzaFN0YWNrKGYubGVuZ3RoPjE/bi51bmlxdWUoZik6Zil9LGluZGV4OmZ1bmN0aW9uKGEpe3JldHVybiBhP1wic3RyaW5nXCI9PXR5cGVvZiBhP2cuY2FsbChuKGEpLHRoaXNbMF0pOmcuY2FsbCh0aGlzLGEuanF1ZXJ5P2FbMF06YSk6dGhpc1swXSYmdGhpc1swXS5wYXJlbnROb2RlP3RoaXMuZmlyc3QoKS5wcmV2QWxsKCkubGVuZ3RoOi0xfSxhZGQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5wdXNoU3RhY2sobi51bmlxdWUobi5tZXJnZSh0aGlzLmdldCgpLG4oYSxiKSkpKX0sYWRkQmFjazpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5hZGQobnVsbD09YT90aGlzLnByZXZPYmplY3Q6dGhpcy5wcmV2T2JqZWN0LmZpbHRlcihhKSl9fSk7ZnVuY3Rpb24gRChhLGIpe3doaWxlKChhPWFbYl0pJiYxIT09YS5ub2RlVHlwZSk7cmV0dXJuIGF9bi5lYWNoKHtwYXJlbnQ6ZnVuY3Rpb24oYSl7dmFyIGI9YS5wYXJlbnROb2RlO3JldHVybiBiJiYxMSE9PWIubm9kZVR5cGU/YjpudWxsfSxwYXJlbnRzOmZ1bmN0aW9uKGEpe3JldHVybiBuLmRpcihhLFwicGFyZW50Tm9kZVwiKX0scGFyZW50c1VudGlsOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbi5kaXIoYSxcInBhcmVudE5vZGVcIixjKX0sbmV4dDpmdW5jdGlvbihhKXtyZXR1cm4gRChhLFwibmV4dFNpYmxpbmdcIil9LHByZXY6ZnVuY3Rpb24oYSl7cmV0dXJuIEQoYSxcInByZXZpb3VzU2libGluZ1wiKX0sbmV4dEFsbDpmdW5jdGlvbihhKXtyZXR1cm4gbi5kaXIoYSxcIm5leHRTaWJsaW5nXCIpfSxwcmV2QWxsOmZ1bmN0aW9uKGEpe3JldHVybiBuLmRpcihhLFwicHJldmlvdXNTaWJsaW5nXCIpfSxuZXh0VW50aWw6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBuLmRpcihhLFwibmV4dFNpYmxpbmdcIixjKX0scHJldlVudGlsOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbi5kaXIoYSxcInByZXZpb3VzU2libGluZ1wiLGMpfSxzaWJsaW5nczpmdW5jdGlvbihhKXtyZXR1cm4gbi5zaWJsaW5nKChhLnBhcmVudE5vZGV8fHt9KS5maXJzdENoaWxkLGEpfSxjaGlsZHJlbjpmdW5jdGlvbihhKXtyZXR1cm4gbi5zaWJsaW5nKGEuZmlyc3RDaGlsZCl9LGNvbnRlbnRzOmZ1bmN0aW9uKGEpe3JldHVybiBhLmNvbnRlbnREb2N1bWVudHx8bi5tZXJnZShbXSxhLmNoaWxkTm9kZXMpfX0sZnVuY3Rpb24oYSxiKXtuLmZuW2FdPWZ1bmN0aW9uKGMsZCl7dmFyIGU9bi5tYXAodGhpcyxiLGMpO3JldHVyblwiVW50aWxcIiE9PWEuc2xpY2UoLTUpJiYoZD1jKSxkJiZcInN0cmluZ1wiPT10eXBlb2YgZCYmKGU9bi5maWx0ZXIoZCxlKSksdGhpcy5sZW5ndGg+MSYmKENbYV18fG4udW5pcXVlKGUpLEIudGVzdChhKSYmZS5yZXZlcnNlKCkpLHRoaXMucHVzaFN0YWNrKGUpfX0pO3ZhciBFPS9cXFMrL2csRj17fTtmdW5jdGlvbiBHKGEpe3ZhciBiPUZbYV09e307cmV0dXJuIG4uZWFjaChhLm1hdGNoKEUpfHxbXSxmdW5jdGlvbihhLGMpe2JbY109ITB9KSxifW4uQ2FsbGJhY2tzPWZ1bmN0aW9uKGEpe2E9XCJzdHJpbmdcIj09dHlwZW9mIGE/RlthXXx8RyhhKTpuLmV4dGVuZCh7fSxhKTt2YXIgYixjLGQsZSxmLGcsaD1bXSxpPSFhLm9uY2UmJltdLGo9ZnVuY3Rpb24obCl7Zm9yKGI9YS5tZW1vcnkmJmwsYz0hMCxnPWV8fDAsZT0wLGY9aC5sZW5ndGgsZD0hMDtoJiZmPmc7ZysrKWlmKGhbZ10uYXBwbHkobFswXSxsWzFdKT09PSExJiZhLnN0b3BPbkZhbHNlKXtiPSExO2JyZWFrfWQ9ITEsaCYmKGk/aS5sZW5ndGgmJmooaS5zaGlmdCgpKTpiP2g9W106ay5kaXNhYmxlKCkpfSxrPXthZGQ6ZnVuY3Rpb24oKXtpZihoKXt2YXIgYz1oLmxlbmd0aDshZnVuY3Rpb24gZyhiKXtuLmVhY2goYixmdW5jdGlvbihiLGMpe3ZhciBkPW4udHlwZShjKTtcImZ1bmN0aW9uXCI9PT1kP2EudW5pcXVlJiZrLmhhcyhjKXx8aC5wdXNoKGMpOmMmJmMubGVuZ3RoJiZcInN0cmluZ1wiIT09ZCYmZyhjKX0pfShhcmd1bWVudHMpLGQ/Zj1oLmxlbmd0aDpiJiYoZT1jLGooYikpfXJldHVybiB0aGlzfSxyZW1vdmU6ZnVuY3Rpb24oKXtyZXR1cm4gaCYmbi5lYWNoKGFyZ3VtZW50cyxmdW5jdGlvbihhLGIpe3ZhciBjO3doaWxlKChjPW4uaW5BcnJheShiLGgsYykpPi0xKWguc3BsaWNlKGMsMSksZCYmKGY+PWMmJmYtLSxnPj1jJiZnLS0pfSksdGhpc30saGFzOmZ1bmN0aW9uKGEpe3JldHVybiBhP24uaW5BcnJheShhLGgpPi0xOiEoIWh8fCFoLmxlbmd0aCl9LGVtcHR5OmZ1bmN0aW9uKCl7cmV0dXJuIGg9W10sZj0wLHRoaXN9LGRpc2FibGU6ZnVuY3Rpb24oKXtyZXR1cm4gaD1pPWI9dm9pZCAwLHRoaXN9LGRpc2FibGVkOmZ1bmN0aW9uKCl7cmV0dXJuIWh9LGxvY2s6ZnVuY3Rpb24oKXtyZXR1cm4gaT12b2lkIDAsYnx8ay5kaXNhYmxlKCksdGhpc30sbG9ja2VkOmZ1bmN0aW9uKCl7cmV0dXJuIWl9LGZpcmVXaXRoOmZ1bmN0aW9uKGEsYil7cmV0dXJuIWh8fGMmJiFpfHwoYj1ifHxbXSxiPVthLGIuc2xpY2U/Yi5zbGljZSgpOmJdLGQ/aS5wdXNoKGIpOmooYikpLHRoaXN9LGZpcmU6ZnVuY3Rpb24oKXtyZXR1cm4gay5maXJlV2l0aCh0aGlzLGFyZ3VtZW50cyksdGhpc30sZmlyZWQ6ZnVuY3Rpb24oKXtyZXR1cm4hIWN9fTtyZXR1cm4ga30sbi5leHRlbmQoe0RlZmVycmVkOmZ1bmN0aW9uKGEpe3ZhciBiPVtbXCJyZXNvbHZlXCIsXCJkb25lXCIsbi5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSxcInJlc29sdmVkXCJdLFtcInJlamVjdFwiLFwiZmFpbFwiLG4uQ2FsbGJhY2tzKFwib25jZSBtZW1vcnlcIiksXCJyZWplY3RlZFwiXSxbXCJub3RpZnlcIixcInByb2dyZXNzXCIsbi5DYWxsYmFja3MoXCJtZW1vcnlcIildXSxjPVwicGVuZGluZ1wiLGQ9e3N0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuIGN9LGFsd2F5czpmdW5jdGlvbigpe3JldHVybiBlLmRvbmUoYXJndW1lbnRzKS5mYWlsKGFyZ3VtZW50cyksdGhpc30sdGhlbjpmdW5jdGlvbigpe3ZhciBhPWFyZ3VtZW50cztyZXR1cm4gbi5EZWZlcnJlZChmdW5jdGlvbihjKXtuLmVhY2goYixmdW5jdGlvbihiLGYpe3ZhciBnPW4uaXNGdW5jdGlvbihhW2JdKSYmYVtiXTtlW2ZbMV1dKGZ1bmN0aW9uKCl7dmFyIGE9ZyYmZy5hcHBseSh0aGlzLGFyZ3VtZW50cyk7YSYmbi5pc0Z1bmN0aW9uKGEucHJvbWlzZSk/YS5wcm9taXNlKCkuZG9uZShjLnJlc29sdmUpLmZhaWwoYy5yZWplY3QpLnByb2dyZXNzKGMubm90aWZ5KTpjW2ZbMF0rXCJXaXRoXCJdKHRoaXM9PT1kP2MucHJvbWlzZSgpOnRoaXMsZz9bYV06YXJndW1lbnRzKX0pfSksYT1udWxsfSkucHJvbWlzZSgpfSxwcm9taXNlOmZ1bmN0aW9uKGEpe3JldHVybiBudWxsIT1hP24uZXh0ZW5kKGEsZCk6ZH19LGU9e307cmV0dXJuIGQucGlwZT1kLnRoZW4sbi5lYWNoKGIsZnVuY3Rpb24oYSxmKXt2YXIgZz1mWzJdLGg9ZlszXTtkW2ZbMV1dPWcuYWRkLGgmJmcuYWRkKGZ1bmN0aW9uKCl7Yz1ofSxiWzFeYV1bMl0uZGlzYWJsZSxiWzJdWzJdLmxvY2spLGVbZlswXV09ZnVuY3Rpb24oKXtyZXR1cm4gZVtmWzBdK1wiV2l0aFwiXSh0aGlzPT09ZT9kOnRoaXMsYXJndW1lbnRzKSx0aGlzfSxlW2ZbMF0rXCJXaXRoXCJdPWcuZmlyZVdpdGh9KSxkLnByb21pc2UoZSksYSYmYS5jYWxsKGUsZSksZX0sd2hlbjpmdW5jdGlvbihhKXt2YXIgYj0wLGM9ZC5jYWxsKGFyZ3VtZW50cyksZT1jLmxlbmd0aCxmPTEhPT1lfHxhJiZuLmlzRnVuY3Rpb24oYS5wcm9taXNlKT9lOjAsZz0xPT09Zj9hOm4uRGVmZXJyZWQoKSxoPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gZnVuY3Rpb24oZSl7YlthXT10aGlzLGNbYV09YXJndW1lbnRzLmxlbmd0aD4xP2QuY2FsbChhcmd1bWVudHMpOmUsYz09PWk/Zy5ub3RpZnlXaXRoKGIsYyk6LS1mfHxnLnJlc29sdmVXaXRoKGIsYyl9fSxpLGosaztpZihlPjEpZm9yKGk9bmV3IEFycmF5KGUpLGo9bmV3IEFycmF5KGUpLGs9bmV3IEFycmF5KGUpO2U+YjtiKyspY1tiXSYmbi5pc0Z1bmN0aW9uKGNbYl0ucHJvbWlzZSk/Y1tiXS5wcm9taXNlKCkuZG9uZShoKGIsayxjKSkuZmFpbChnLnJlamVjdCkucHJvZ3Jlc3MoaChiLGosaSkpOi0tZjtyZXR1cm4gZnx8Zy5yZXNvbHZlV2l0aChrLGMpLGcucHJvbWlzZSgpfX0pO3ZhciBIO24uZm4ucmVhZHk9ZnVuY3Rpb24oYSl7cmV0dXJuIG4ucmVhZHkucHJvbWlzZSgpLmRvbmUoYSksdGhpc30sbi5leHRlbmQoe2lzUmVhZHk6ITEscmVhZHlXYWl0OjEsaG9sZFJlYWR5OmZ1bmN0aW9uKGEpe2E/bi5yZWFkeVdhaXQrKzpuLnJlYWR5KCEwKX0scmVhZHk6ZnVuY3Rpb24oYSl7KGE9PT0hMD8tLW4ucmVhZHlXYWl0Om4uaXNSZWFkeSl8fChuLmlzUmVhZHk9ITAsYSE9PSEwJiYtLW4ucmVhZHlXYWl0PjB8fChILnJlc29sdmVXaXRoKGwsW25dKSxuLmZuLnRyaWdnZXJIYW5kbGVyJiYobihsKS50cmlnZ2VySGFuZGxlcihcInJlYWR5XCIpLG4obCkub2ZmKFwicmVhZHlcIikpKSl9fSk7ZnVuY3Rpb24gSSgpe2wucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixJLCExKSxhLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsSSwhMSksbi5yZWFkeSgpfW4ucmVhZHkucHJvbWlzZT1mdW5jdGlvbihiKXtyZXR1cm4gSHx8KEg9bi5EZWZlcnJlZCgpLFwiY29tcGxldGVcIj09PWwucmVhZHlTdGF0ZT9zZXRUaW1lb3V0KG4ucmVhZHkpOihsLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsSSwhMSksYS5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLEksITEpKSksSC5wcm9taXNlKGIpfSxuLnJlYWR5LnByb21pc2UoKTt2YXIgSj1uLmFjY2Vzcz1mdW5jdGlvbihhLGIsYyxkLGUsZixnKXt2YXIgaD0wLGk9YS5sZW5ndGgsaj1udWxsPT1jO2lmKFwib2JqZWN0XCI9PT1uLnR5cGUoYykpe2U9ITA7Zm9yKGggaW4gYyluLmFjY2VzcyhhLGIsaCxjW2hdLCEwLGYsZyl9ZWxzZSBpZih2b2lkIDAhPT1kJiYoZT0hMCxuLmlzRnVuY3Rpb24oZCl8fChnPSEwKSxqJiYoZz8oYi5jYWxsKGEsZCksYj1udWxsKTooaj1iLGI9ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBqLmNhbGwobihhKSxjKX0pKSxiKSlmb3IoO2k+aDtoKyspYihhW2hdLGMsZz9kOmQuY2FsbChhW2hdLGgsYihhW2hdLGMpKSk7cmV0dXJuIGU/YTpqP2IuY2FsbChhKTppP2IoYVswXSxjKTpmfTtuLmFjY2VwdERhdGE9ZnVuY3Rpb24oYSl7cmV0dXJuIDE9PT1hLm5vZGVUeXBlfHw5PT09YS5ub2RlVHlwZXx8ISthLm5vZGVUeXBlfTtmdW5jdGlvbiBLKCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuY2FjaGU9e30sMCx7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJue319fSksdGhpcy5leHBhbmRvPW4uZXhwYW5kbytNYXRoLnJhbmRvbSgpfUsudWlkPTEsSy5hY2NlcHRzPW4uYWNjZXB0RGF0YSxLLnByb3RvdHlwZT17a2V5OmZ1bmN0aW9uKGEpe2lmKCFLLmFjY2VwdHMoYSkpcmV0dXJuIDA7dmFyIGI9e30sYz1hW3RoaXMuZXhwYW5kb107aWYoIWMpe2M9Sy51aWQrKzt0cnl7Ylt0aGlzLmV4cGFuZG9dPXt2YWx1ZTpjfSxPYmplY3QuZGVmaW5lUHJvcGVydGllcyhhLGIpfWNhdGNoKGQpe2JbdGhpcy5leHBhbmRvXT1jLG4uZXh0ZW5kKGEsYil9fXJldHVybiB0aGlzLmNhY2hlW2NdfHwodGhpcy5jYWNoZVtjXT17fSksY30sc2V0OmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlPXRoaXMua2V5KGEpLGY9dGhpcy5jYWNoZVtlXTtpZihcInN0cmluZ1wiPT10eXBlb2YgYilmW2JdPWM7ZWxzZSBpZihuLmlzRW1wdHlPYmplY3QoZikpbi5leHRlbmQodGhpcy5jYWNoZVtlXSxiKTtlbHNlIGZvcihkIGluIGIpZltkXT1iW2RdO3JldHVybiBmfSxnZXQ6ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLmNhY2hlW3RoaXMua2V5KGEpXTtyZXR1cm4gdm9pZCAwPT09Yj9jOmNbYl19LGFjY2VzczpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7cmV0dXJuIHZvaWQgMD09PWJ8fGImJlwic3RyaW5nXCI9PXR5cGVvZiBiJiZ2b2lkIDA9PT1jPyhkPXRoaXMuZ2V0KGEsYiksdm9pZCAwIT09ZD9kOnRoaXMuZ2V0KGEsbi5jYW1lbENhc2UoYikpKToodGhpcy5zZXQoYSxiLGMpLHZvaWQgMCE9PWM/YzpiKX0scmVtb3ZlOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGY9dGhpcy5rZXkoYSksZz10aGlzLmNhY2hlW2ZdO2lmKHZvaWQgMD09PWIpdGhpcy5jYWNoZVtmXT17fTtlbHNle24uaXNBcnJheShiKT9kPWIuY29uY2F0KGIubWFwKG4uY2FtZWxDYXNlKSk6KGU9bi5jYW1lbENhc2UoYiksYiBpbiBnP2Q9W2IsZV06KGQ9ZSxkPWQgaW4gZz9bZF06ZC5tYXRjaChFKXx8W10pKSxjPWQubGVuZ3RoO3doaWxlKGMtLSlkZWxldGUgZ1tkW2NdXX19LGhhc0RhdGE6ZnVuY3Rpb24oYSl7cmV0dXJuIW4uaXNFbXB0eU9iamVjdCh0aGlzLmNhY2hlW2FbdGhpcy5leHBhbmRvXV18fHt9KX0sZGlzY2FyZDpmdW5jdGlvbihhKXthW3RoaXMuZXhwYW5kb10mJmRlbGV0ZSB0aGlzLmNhY2hlW2FbdGhpcy5leHBhbmRvXV19fTt2YXIgTD1uZXcgSyxNPW5ldyBLLE49L14oPzpcXHtbXFx3XFxXXSpcXH18XFxbW1xcd1xcV10qXFxdKSQvLE89LyhbQS1aXSkvZztmdW5jdGlvbiBQKGEsYixjKXt2YXIgZDtpZih2b2lkIDA9PT1jJiYxPT09YS5ub2RlVHlwZSlpZihkPVwiZGF0YS1cIitiLnJlcGxhY2UoTyxcIi0kMVwiKS50b0xvd2VyQ2FzZSgpLGM9YS5nZXRBdHRyaWJ1dGUoZCksXCJzdHJpbmdcIj09dHlwZW9mIGMpe3RyeXtjPVwidHJ1ZVwiPT09Yz8hMDpcImZhbHNlXCI9PT1jPyExOlwibnVsbFwiPT09Yz9udWxsOitjK1wiXCI9PT1jPytjOk4udGVzdChjKT9uLnBhcnNlSlNPTihjKTpjfWNhdGNoKGUpe31NLnNldChhLGIsYyl9ZWxzZSBjPXZvaWQgMDtyZXR1cm4gY31uLmV4dGVuZCh7aGFzRGF0YTpmdW5jdGlvbihhKXtyZXR1cm4gTS5oYXNEYXRhKGEpfHxMLmhhc0RhdGEoYSl9LGRhdGE6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiBNLmFjY2VzcyhhLGIsYyl9LHJlbW92ZURhdGE6ZnVuY3Rpb24oYSxiKXtNLnJlbW92ZShhLGIpXG59LF9kYXRhOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gTC5hY2Nlc3MoYSxiLGMpfSxfcmVtb3ZlRGF0YTpmdW5jdGlvbihhLGIpe0wucmVtb3ZlKGEsYil9fSksbi5mbi5leHRlbmQoe2RhdGE6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZj10aGlzWzBdLGc9ZiYmZi5hdHRyaWJ1dGVzO2lmKHZvaWQgMD09PWEpe2lmKHRoaXMubGVuZ3RoJiYoZT1NLmdldChmKSwxPT09Zi5ub2RlVHlwZSYmIUwuZ2V0KGYsXCJoYXNEYXRhQXR0cnNcIikpKXtjPWcubGVuZ3RoO3doaWxlKGMtLSlnW2NdJiYoZD1nW2NdLm5hbWUsMD09PWQuaW5kZXhPZihcImRhdGEtXCIpJiYoZD1uLmNhbWVsQ2FzZShkLnNsaWNlKDUpKSxQKGYsZCxlW2RdKSkpO0wuc2V0KGYsXCJoYXNEYXRhQXR0cnNcIiwhMCl9cmV0dXJuIGV9cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGE/dGhpcy5lYWNoKGZ1bmN0aW9uKCl7TS5zZXQodGhpcyxhKX0pOkoodGhpcyxmdW5jdGlvbihiKXt2YXIgYyxkPW4uY2FtZWxDYXNlKGEpO2lmKGYmJnZvaWQgMD09PWIpe2lmKGM9TS5nZXQoZixhKSx2b2lkIDAhPT1jKXJldHVybiBjO2lmKGM9TS5nZXQoZixkKSx2b2lkIDAhPT1jKXJldHVybiBjO2lmKGM9UChmLGQsdm9pZCAwKSx2b2lkIDAhPT1jKXJldHVybiBjfWVsc2UgdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGM9TS5nZXQodGhpcyxkKTtNLnNldCh0aGlzLGQsYiksLTEhPT1hLmluZGV4T2YoXCItXCIpJiZ2b2lkIDAhPT1jJiZNLnNldCh0aGlzLGEsYil9KX0sbnVsbCxiLGFyZ3VtZW50cy5sZW5ndGg+MSxudWxsLCEwKX0scmVtb3ZlRGF0YTpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7TS5yZW1vdmUodGhpcyxhKX0pfX0pLG4uZXh0ZW5kKHtxdWV1ZTpmdW5jdGlvbihhLGIsYyl7dmFyIGQ7cmV0dXJuIGE/KGI9KGJ8fFwiZnhcIikrXCJxdWV1ZVwiLGQ9TC5nZXQoYSxiKSxjJiYoIWR8fG4uaXNBcnJheShjKT9kPUwuYWNjZXNzKGEsYixuLm1ha2VBcnJheShjKSk6ZC5wdXNoKGMpKSxkfHxbXSk6dm9pZCAwfSxkZXF1ZXVlOmZ1bmN0aW9uKGEsYil7Yj1ifHxcImZ4XCI7dmFyIGM9bi5xdWV1ZShhLGIpLGQ9Yy5sZW5ndGgsZT1jLnNoaWZ0KCksZj1uLl9xdWV1ZUhvb2tzKGEsYiksZz1mdW5jdGlvbigpe24uZGVxdWV1ZShhLGIpfTtcImlucHJvZ3Jlc3NcIj09PWUmJihlPWMuc2hpZnQoKSxkLS0pLGUmJihcImZ4XCI9PT1iJiZjLnVuc2hpZnQoXCJpbnByb2dyZXNzXCIpLGRlbGV0ZSBmLnN0b3AsZS5jYWxsKGEsZyxmKSksIWQmJmYmJmYuZW1wdHkuZmlyZSgpfSxfcXVldWVIb29rczpmdW5jdGlvbihhLGIpe3ZhciBjPWIrXCJxdWV1ZUhvb2tzXCI7cmV0dXJuIEwuZ2V0KGEsYyl8fEwuYWNjZXNzKGEsYyx7ZW1wdHk6bi5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKS5hZGQoZnVuY3Rpb24oKXtMLnJlbW92ZShhLFtiK1wicXVldWVcIixjXSl9KX0pfX0pLG4uZm4uZXh0ZW5kKHtxdWV1ZTpmdW5jdGlvbihhLGIpe3ZhciBjPTI7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIGEmJihiPWEsYT1cImZ4XCIsYy0tKSxhcmd1bWVudHMubGVuZ3RoPGM/bi5xdWV1ZSh0aGlzWzBdLGEpOnZvaWQgMD09PWI/dGhpczp0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgYz1uLnF1ZXVlKHRoaXMsYSxiKTtuLl9xdWV1ZUhvb2tzKHRoaXMsYSksXCJmeFwiPT09YSYmXCJpbnByb2dyZXNzXCIhPT1jWzBdJiZuLmRlcXVldWUodGhpcyxhKX0pfSxkZXF1ZXVlOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtuLmRlcXVldWUodGhpcyxhKX0pfSxjbGVhclF1ZXVlOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnF1ZXVlKGF8fFwiZnhcIixbXSl9LHByb21pc2U6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPTEsZT1uLkRlZmVycmVkKCksZj10aGlzLGc9dGhpcy5sZW5ndGgsaD1mdW5jdGlvbigpey0tZHx8ZS5yZXNvbHZlV2l0aChmLFtmXSl9O1wic3RyaW5nXCIhPXR5cGVvZiBhJiYoYj1hLGE9dm9pZCAwKSxhPWF8fFwiZnhcIjt3aGlsZShnLS0pYz1MLmdldChmW2ddLGErXCJxdWV1ZUhvb2tzXCIpLGMmJmMuZW1wdHkmJihkKyssYy5lbXB0eS5hZGQoaCkpO3JldHVybiBoKCksZS5wcm9taXNlKGIpfX0pO3ZhciBRPS9bKy1dPyg/OlxcZCpcXC58KVxcZCsoPzpbZUVdWystXT9cXGQrfCkvLnNvdXJjZSxSPVtcIlRvcFwiLFwiUmlnaHRcIixcIkJvdHRvbVwiLFwiTGVmdFwiXSxTPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9Ynx8YSxcIm5vbmVcIj09PW4uY3NzKGEsXCJkaXNwbGF5XCIpfHwhbi5jb250YWlucyhhLm93bmVyRG9jdW1lbnQsYSl9LFQ9L14oPzpjaGVja2JveHxyYWRpbykkL2k7IWZ1bmN0aW9uKCl7dmFyIGE9bC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksYj1hLmFwcGVuZENoaWxkKGwuY3JlYXRlRWxlbWVudChcImRpdlwiKSksYz1sLmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtjLnNldEF0dHJpYnV0ZShcInR5cGVcIixcInJhZGlvXCIpLGMuc2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiLFwiY2hlY2tlZFwiKSxjLnNldEF0dHJpYnV0ZShcIm5hbWVcIixcInRcIiksYi5hcHBlbmRDaGlsZChjKSxrLmNoZWNrQ2xvbmU9Yi5jbG9uZU5vZGUoITApLmNsb25lTm9kZSghMCkubGFzdENoaWxkLmNoZWNrZWQsYi5pbm5lckhUTUw9XCI8dGV4dGFyZWE+eDwvdGV4dGFyZWE+XCIsay5ub0Nsb25lQ2hlY2tlZD0hIWIuY2xvbmVOb2RlKCEwKS5sYXN0Q2hpbGQuZGVmYXVsdFZhbHVlfSgpO3ZhciBVPVwidW5kZWZpbmVkXCI7ay5mb2N1c2luQnViYmxlcz1cIm9uZm9jdXNpblwiaW4gYTt2YXIgVj0vXmtleS8sVz0vXig/Om1vdXNlfHBvaW50ZXJ8Y29udGV4dG1lbnUpfGNsaWNrLyxYPS9eKD86Zm9jdXNpbmZvY3VzfGZvY3Vzb3V0Ymx1cikkLyxZPS9eKFteLl0qKSg/OlxcLiguKyl8KSQvO2Z1bmN0aW9uIFooKXtyZXR1cm4hMH1mdW5jdGlvbiAkKCl7cmV0dXJuITF9ZnVuY3Rpb24gXygpe3RyeXtyZXR1cm4gbC5hY3RpdmVFbGVtZW50fWNhdGNoKGEpe319bi5ldmVudD17Z2xvYmFsOnt9LGFkZDpmdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmLGcsaCxpLGosayxsLG0sbyxwLHEscj1MLmdldChhKTtpZihyKXtjLmhhbmRsZXImJihmPWMsYz1mLmhhbmRsZXIsZT1mLnNlbGVjdG9yKSxjLmd1aWR8fChjLmd1aWQ9bi5ndWlkKyspLChpPXIuZXZlbnRzKXx8KGk9ci5ldmVudHM9e30pLChnPXIuaGFuZGxlKXx8KGc9ci5oYW5kbGU9ZnVuY3Rpb24oYil7cmV0dXJuIHR5cGVvZiBuIT09VSYmbi5ldmVudC50cmlnZ2VyZWQhPT1iLnR5cGU/bi5ldmVudC5kaXNwYXRjaC5hcHBseShhLGFyZ3VtZW50cyk6dm9pZCAwfSksYj0oYnx8XCJcIikubWF0Y2goRSl8fFtcIlwiXSxqPWIubGVuZ3RoO3doaWxlKGotLSloPVkuZXhlYyhiW2pdKXx8W10sbz1xPWhbMV0scD0oaFsyXXx8XCJcIikuc3BsaXQoXCIuXCIpLnNvcnQoKSxvJiYobD1uLmV2ZW50LnNwZWNpYWxbb118fHt9LG89KGU/bC5kZWxlZ2F0ZVR5cGU6bC5iaW5kVHlwZSl8fG8sbD1uLmV2ZW50LnNwZWNpYWxbb118fHt9LGs9bi5leHRlbmQoe3R5cGU6byxvcmlnVHlwZTpxLGRhdGE6ZCxoYW5kbGVyOmMsZ3VpZDpjLmd1aWQsc2VsZWN0b3I6ZSxuZWVkc0NvbnRleHQ6ZSYmbi5leHByLm1hdGNoLm5lZWRzQ29udGV4dC50ZXN0KGUpLG5hbWVzcGFjZTpwLmpvaW4oXCIuXCIpfSxmKSwobT1pW29dKXx8KG09aVtvXT1bXSxtLmRlbGVnYXRlQ291bnQ9MCxsLnNldHVwJiZsLnNldHVwLmNhbGwoYSxkLHAsZykhPT0hMXx8YS5hZGRFdmVudExpc3RlbmVyJiZhLmFkZEV2ZW50TGlzdGVuZXIobyxnLCExKSksbC5hZGQmJihsLmFkZC5jYWxsKGEsayksay5oYW5kbGVyLmd1aWR8fChrLmhhbmRsZXIuZ3VpZD1jLmd1aWQpKSxlP20uc3BsaWNlKG0uZGVsZWdhdGVDb3VudCsrLDAsayk6bS5wdXNoKGspLG4uZXZlbnQuZ2xvYmFsW29dPSEwKX19LHJlbW92ZTpmdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmLGcsaCxpLGosayxsLG0sbyxwLHEscj1MLmhhc0RhdGEoYSkmJkwuZ2V0KGEpO2lmKHImJihpPXIuZXZlbnRzKSl7Yj0oYnx8XCJcIikubWF0Y2goRSl8fFtcIlwiXSxqPWIubGVuZ3RoO3doaWxlKGotLSlpZihoPVkuZXhlYyhiW2pdKXx8W10sbz1xPWhbMV0scD0oaFsyXXx8XCJcIikuc3BsaXQoXCIuXCIpLnNvcnQoKSxvKXtsPW4uZXZlbnQuc3BlY2lhbFtvXXx8e30sbz0oZD9sLmRlbGVnYXRlVHlwZTpsLmJpbmRUeXBlKXx8byxtPWlbb118fFtdLGg9aFsyXSYmbmV3IFJlZ0V4cChcIihefFxcXFwuKVwiK3Auam9pbihcIlxcXFwuKD86LipcXFxcLnwpXCIpK1wiKFxcXFwufCQpXCIpLGc9Zj1tLmxlbmd0aDt3aGlsZShmLS0paz1tW2ZdLCFlJiZxIT09ay5vcmlnVHlwZXx8YyYmYy5ndWlkIT09ay5ndWlkfHxoJiYhaC50ZXN0KGsubmFtZXNwYWNlKXx8ZCYmZCE9PWsuc2VsZWN0b3ImJihcIioqXCIhPT1kfHwhay5zZWxlY3Rvcil8fChtLnNwbGljZShmLDEpLGsuc2VsZWN0b3ImJm0uZGVsZWdhdGVDb3VudC0tLGwucmVtb3ZlJiZsLnJlbW92ZS5jYWxsKGEsaykpO2cmJiFtLmxlbmd0aCYmKGwudGVhcmRvd24mJmwudGVhcmRvd24uY2FsbChhLHAsci5oYW5kbGUpIT09ITF8fG4ucmVtb3ZlRXZlbnQoYSxvLHIuaGFuZGxlKSxkZWxldGUgaVtvXSl9ZWxzZSBmb3IobyBpbiBpKW4uZXZlbnQucmVtb3ZlKGEsbytiW2pdLGMsZCwhMCk7bi5pc0VtcHR5T2JqZWN0KGkpJiYoZGVsZXRlIHIuaGFuZGxlLEwucmVtb3ZlKGEsXCJldmVudHNcIikpfX0sdHJpZ2dlcjpmdW5jdGlvbihiLGMsZCxlKXt2YXIgZixnLGgsaSxrLG0sbyxwPVtkfHxsXSxxPWouY2FsbChiLFwidHlwZVwiKT9iLnR5cGU6YixyPWouY2FsbChiLFwibmFtZXNwYWNlXCIpP2IubmFtZXNwYWNlLnNwbGl0KFwiLlwiKTpbXTtpZihnPWg9ZD1kfHxsLDMhPT1kLm5vZGVUeXBlJiY4IT09ZC5ub2RlVHlwZSYmIVgudGVzdChxK24uZXZlbnQudHJpZ2dlcmVkKSYmKHEuaW5kZXhPZihcIi5cIik+PTAmJihyPXEuc3BsaXQoXCIuXCIpLHE9ci5zaGlmdCgpLHIuc29ydCgpKSxrPXEuaW5kZXhPZihcIjpcIik8MCYmXCJvblwiK3EsYj1iW24uZXhwYW5kb10/YjpuZXcgbi5FdmVudChxLFwib2JqZWN0XCI9PXR5cGVvZiBiJiZiKSxiLmlzVHJpZ2dlcj1lPzI6MyxiLm5hbWVzcGFjZT1yLmpvaW4oXCIuXCIpLGIubmFtZXNwYWNlX3JlPWIubmFtZXNwYWNlP25ldyBSZWdFeHAoXCIoXnxcXFxcLilcIityLmpvaW4oXCJcXFxcLig/Oi4qXFxcXC58KVwiKStcIihcXFxcLnwkKVwiKTpudWxsLGIucmVzdWx0PXZvaWQgMCxiLnRhcmdldHx8KGIudGFyZ2V0PWQpLGM9bnVsbD09Yz9bYl06bi5tYWtlQXJyYXkoYyxbYl0pLG89bi5ldmVudC5zcGVjaWFsW3FdfHx7fSxlfHwhby50cmlnZ2VyfHxvLnRyaWdnZXIuYXBwbHkoZCxjKSE9PSExKSl7aWYoIWUmJiFvLm5vQnViYmxlJiYhbi5pc1dpbmRvdyhkKSl7Zm9yKGk9by5kZWxlZ2F0ZVR5cGV8fHEsWC50ZXN0KGkrcSl8fChnPWcucGFyZW50Tm9kZSk7ZztnPWcucGFyZW50Tm9kZSlwLnB1c2goZyksaD1nO2g9PT0oZC5vd25lckRvY3VtZW50fHxsKSYmcC5wdXNoKGguZGVmYXVsdFZpZXd8fGgucGFyZW50V2luZG93fHxhKX1mPTA7d2hpbGUoKGc9cFtmKytdKSYmIWIuaXNQcm9wYWdhdGlvblN0b3BwZWQoKSliLnR5cGU9Zj4xP2k6by5iaW5kVHlwZXx8cSxtPShMLmdldChnLFwiZXZlbnRzXCIpfHx7fSlbYi50eXBlXSYmTC5nZXQoZyxcImhhbmRsZVwiKSxtJiZtLmFwcGx5KGcsYyksbT1rJiZnW2tdLG0mJm0uYXBwbHkmJm4uYWNjZXB0RGF0YShnKSYmKGIucmVzdWx0PW0uYXBwbHkoZyxjKSxiLnJlc3VsdD09PSExJiZiLnByZXZlbnREZWZhdWx0KCkpO3JldHVybiBiLnR5cGU9cSxlfHxiLmlzRGVmYXVsdFByZXZlbnRlZCgpfHxvLl9kZWZhdWx0JiZvLl9kZWZhdWx0LmFwcGx5KHAucG9wKCksYykhPT0hMXx8IW4uYWNjZXB0RGF0YShkKXx8ayYmbi5pc0Z1bmN0aW9uKGRbcV0pJiYhbi5pc1dpbmRvdyhkKSYmKGg9ZFtrXSxoJiYoZFtrXT1udWxsKSxuLmV2ZW50LnRyaWdnZXJlZD1xLGRbcV0oKSxuLmV2ZW50LnRyaWdnZXJlZD12b2lkIDAsaCYmKGRba109aCkpLGIucmVzdWx0fX0sZGlzcGF0Y2g6ZnVuY3Rpb24oYSl7YT1uLmV2ZW50LmZpeChhKTt2YXIgYixjLGUsZixnLGg9W10saT1kLmNhbGwoYXJndW1lbnRzKSxqPShMLmdldCh0aGlzLFwiZXZlbnRzXCIpfHx7fSlbYS50eXBlXXx8W10saz1uLmV2ZW50LnNwZWNpYWxbYS50eXBlXXx8e307aWYoaVswXT1hLGEuZGVsZWdhdGVUYXJnZXQ9dGhpcywhay5wcmVEaXNwYXRjaHx8ay5wcmVEaXNwYXRjaC5jYWxsKHRoaXMsYSkhPT0hMSl7aD1uLmV2ZW50LmhhbmRsZXJzLmNhbGwodGhpcyxhLGopLGI9MDt3aGlsZSgoZj1oW2IrK10pJiYhYS5pc1Byb3BhZ2F0aW9uU3RvcHBlZCgpKXthLmN1cnJlbnRUYXJnZXQ9Zi5lbGVtLGM9MDt3aGlsZSgoZz1mLmhhbmRsZXJzW2MrK10pJiYhYS5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpKSghYS5uYW1lc3BhY2VfcmV8fGEubmFtZXNwYWNlX3JlLnRlc3QoZy5uYW1lc3BhY2UpKSYmKGEuaGFuZGxlT2JqPWcsYS5kYXRhPWcuZGF0YSxlPSgobi5ldmVudC5zcGVjaWFsW2cub3JpZ1R5cGVdfHx7fSkuaGFuZGxlfHxnLmhhbmRsZXIpLmFwcGx5KGYuZWxlbSxpKSx2b2lkIDAhPT1lJiYoYS5yZXN1bHQ9ZSk9PT0hMSYmKGEucHJldmVudERlZmF1bHQoKSxhLnN0b3BQcm9wYWdhdGlvbigpKSl9cmV0dXJuIGsucG9zdERpc3BhdGNoJiZrLnBvc3REaXNwYXRjaC5jYWxsKHRoaXMsYSksYS5yZXN1bHR9fSxoYW5kbGVyczpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZSxmLGc9W10saD1iLmRlbGVnYXRlQ291bnQsaT1hLnRhcmdldDtpZihoJiZpLm5vZGVUeXBlJiYoIWEuYnV0dG9ufHxcImNsaWNrXCIhPT1hLnR5cGUpKWZvcig7aSE9PXRoaXM7aT1pLnBhcmVudE5vZGV8fHRoaXMpaWYoaS5kaXNhYmxlZCE9PSEwfHxcImNsaWNrXCIhPT1hLnR5cGUpe2ZvcihkPVtdLGM9MDtoPmM7YysrKWY9YltjXSxlPWYuc2VsZWN0b3IrXCIgXCIsdm9pZCAwPT09ZFtlXSYmKGRbZV09Zi5uZWVkc0NvbnRleHQ/bihlLHRoaXMpLmluZGV4KGkpPj0wOm4uZmluZChlLHRoaXMsbnVsbCxbaV0pLmxlbmd0aCksZFtlXSYmZC5wdXNoKGYpO2QubGVuZ3RoJiZnLnB1c2goe2VsZW06aSxoYW5kbGVyczpkfSl9cmV0dXJuIGg8Yi5sZW5ndGgmJmcucHVzaCh7ZWxlbTp0aGlzLGhhbmRsZXJzOmIuc2xpY2UoaCl9KSxnfSxwcm9wczpcImFsdEtleSBidWJibGVzIGNhbmNlbGFibGUgY3RybEtleSBjdXJyZW50VGFyZ2V0IGV2ZW50UGhhc2UgbWV0YUtleSByZWxhdGVkVGFyZ2V0IHNoaWZ0S2V5IHRhcmdldCB0aW1lU3RhbXAgdmlldyB3aGljaFwiLnNwbGl0KFwiIFwiKSxmaXhIb29rczp7fSxrZXlIb29rczp7cHJvcHM6XCJjaGFyIGNoYXJDb2RlIGtleSBrZXlDb2RlXCIuc3BsaXQoXCIgXCIpLGZpbHRlcjpmdW5jdGlvbihhLGIpe3JldHVybiBudWxsPT1hLndoaWNoJiYoYS53aGljaD1udWxsIT1iLmNoYXJDb2RlP2IuY2hhckNvZGU6Yi5rZXlDb2RlKSxhfX0sbW91c2VIb29rczp7cHJvcHM6XCJidXR0b24gYnV0dG9ucyBjbGllbnRYIGNsaWVudFkgb2Zmc2V0WCBvZmZzZXRZIHBhZ2VYIHBhZ2VZIHNjcmVlblggc2NyZWVuWSB0b0VsZW1lbnRcIi5zcGxpdChcIiBcIiksZmlsdGVyOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlLGY9Yi5idXR0b247cmV0dXJuIG51bGw9PWEucGFnZVgmJm51bGwhPWIuY2xpZW50WCYmKGM9YS50YXJnZXQub3duZXJEb2N1bWVudHx8bCxkPWMuZG9jdW1lbnRFbGVtZW50LGU9Yy5ib2R5LGEucGFnZVg9Yi5jbGllbnRYKyhkJiZkLnNjcm9sbExlZnR8fGUmJmUuc2Nyb2xsTGVmdHx8MCktKGQmJmQuY2xpZW50TGVmdHx8ZSYmZS5jbGllbnRMZWZ0fHwwKSxhLnBhZ2VZPWIuY2xpZW50WSsoZCYmZC5zY3JvbGxUb3B8fGUmJmUuc2Nyb2xsVG9wfHwwKS0oZCYmZC5jbGllbnRUb3B8fGUmJmUuY2xpZW50VG9wfHwwKSksYS53aGljaHx8dm9pZCAwPT09Znx8KGEud2hpY2g9MSZmPzE6MiZmPzM6NCZmPzI6MCksYX19LGZpeDpmdW5jdGlvbihhKXtpZihhW24uZXhwYW5kb10pcmV0dXJuIGE7dmFyIGIsYyxkLGU9YS50eXBlLGY9YSxnPXRoaXMuZml4SG9va3NbZV07Z3x8KHRoaXMuZml4SG9va3NbZV09Zz1XLnRlc3QoZSk/dGhpcy5tb3VzZUhvb2tzOlYudGVzdChlKT90aGlzLmtleUhvb2tzOnt9KSxkPWcucHJvcHM/dGhpcy5wcm9wcy5jb25jYXQoZy5wcm9wcyk6dGhpcy5wcm9wcyxhPW5ldyBuLkV2ZW50KGYpLGI9ZC5sZW5ndGg7d2hpbGUoYi0tKWM9ZFtiXSxhW2NdPWZbY107cmV0dXJuIGEudGFyZ2V0fHwoYS50YXJnZXQ9bCksMz09PWEudGFyZ2V0Lm5vZGVUeXBlJiYoYS50YXJnZXQ9YS50YXJnZXQucGFyZW50Tm9kZSksZy5maWx0ZXI/Zy5maWx0ZXIoYSxmKTphfSxzcGVjaWFsOntsb2FkOntub0J1YmJsZTohMH0sZm9jdXM6e3RyaWdnZXI6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcyE9PV8oKSYmdGhpcy5mb2N1cz8odGhpcy5mb2N1cygpLCExKTp2b2lkIDB9LGRlbGVnYXRlVHlwZTpcImZvY3VzaW5cIn0sYmx1cjp7dHJpZ2dlcjpmdW5jdGlvbigpe3JldHVybiB0aGlzPT09XygpJiZ0aGlzLmJsdXI/KHRoaXMuYmx1cigpLCExKTp2b2lkIDB9LGRlbGVnYXRlVHlwZTpcImZvY3Vzb3V0XCJ9LGNsaWNrOnt0cmlnZ2VyOmZ1bmN0aW9uKCl7cmV0dXJuXCJjaGVja2JveFwiPT09dGhpcy50eXBlJiZ0aGlzLmNsaWNrJiZuLm5vZGVOYW1lKHRoaXMsXCJpbnB1dFwiKT8odGhpcy5jbGljaygpLCExKTp2b2lkIDB9LF9kZWZhdWx0OmZ1bmN0aW9uKGEpe3JldHVybiBuLm5vZGVOYW1lKGEudGFyZ2V0LFwiYVwiKX19LGJlZm9yZXVubG9hZDp7cG9zdERpc3BhdGNoOmZ1bmN0aW9uKGEpe3ZvaWQgMCE9PWEucmVzdWx0JiZhLm9yaWdpbmFsRXZlbnQmJihhLm9yaWdpbmFsRXZlbnQucmV0dXJuVmFsdWU9YS5yZXN1bHQpfX19LHNpbXVsYXRlOmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPW4uZXh0ZW5kKG5ldyBuLkV2ZW50LGMse3R5cGU6YSxpc1NpbXVsYXRlZDohMCxvcmlnaW5hbEV2ZW50Ont9fSk7ZD9uLmV2ZW50LnRyaWdnZXIoZSxudWxsLGIpOm4uZXZlbnQuZGlzcGF0Y2guY2FsbChiLGUpLGUuaXNEZWZhdWx0UHJldmVudGVkKCkmJmMucHJldmVudERlZmF1bHQoKX19LG4ucmVtb3ZlRXZlbnQ9ZnVuY3Rpb24oYSxiLGMpe2EucmVtb3ZlRXZlbnRMaXN0ZW5lciYmYS5yZW1vdmVFdmVudExpc3RlbmVyKGIsYywhMSl9LG4uRXZlbnQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcyBpbnN0YW5jZW9mIG4uRXZlbnQ/KGEmJmEudHlwZT8odGhpcy5vcmlnaW5hbEV2ZW50PWEsdGhpcy50eXBlPWEudHlwZSx0aGlzLmlzRGVmYXVsdFByZXZlbnRlZD1hLmRlZmF1bHRQcmV2ZW50ZWR8fHZvaWQgMD09PWEuZGVmYXVsdFByZXZlbnRlZCYmYS5yZXR1cm5WYWx1ZT09PSExP1o6JCk6dGhpcy50eXBlPWEsYiYmbi5leHRlbmQodGhpcyxiKSx0aGlzLnRpbWVTdGFtcD1hJiZhLnRpbWVTdGFtcHx8bi5ub3coKSx2b2lkKHRoaXNbbi5leHBhbmRvXT0hMCkpOm5ldyBuLkV2ZW50KGEsYil9LG4uRXZlbnQucHJvdG90eXBlPXtpc0RlZmF1bHRQcmV2ZW50ZWQ6JCxpc1Byb3BhZ2F0aW9uU3RvcHBlZDokLGlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkOiQscHJldmVudERlZmF1bHQ6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLm9yaWdpbmFsRXZlbnQ7dGhpcy5pc0RlZmF1bHRQcmV2ZW50ZWQ9WixhJiZhLnByZXZlbnREZWZhdWx0JiZhLnByZXZlbnREZWZhdWx0KCl9LHN0b3BQcm9wYWdhdGlvbjpmdW5jdGlvbigpe3ZhciBhPXRoaXMub3JpZ2luYWxFdmVudDt0aGlzLmlzUHJvcGFnYXRpb25TdG9wcGVkPVosYSYmYS5zdG9wUHJvcGFnYXRpb24mJmEuc3RvcFByb3BhZ2F0aW9uKCl9LHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbjpmdW5jdGlvbigpe3ZhciBhPXRoaXMub3JpZ2luYWxFdmVudDt0aGlzLmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkPVosYSYmYS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24mJmEuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksdGhpcy5zdG9wUHJvcGFnYXRpb24oKX19LG4uZWFjaCh7bW91c2VlbnRlcjpcIm1vdXNlb3ZlclwiLG1vdXNlbGVhdmU6XCJtb3VzZW91dFwiLHBvaW50ZXJlbnRlcjpcInBvaW50ZXJvdmVyXCIscG9pbnRlcmxlYXZlOlwicG9pbnRlcm91dFwifSxmdW5jdGlvbihhLGIpe24uZXZlbnQuc3BlY2lhbFthXT17ZGVsZWdhdGVUeXBlOmIsYmluZFR5cGU6YixoYW5kbGU6ZnVuY3Rpb24oYSl7dmFyIGMsZD10aGlzLGU9YS5yZWxhdGVkVGFyZ2V0LGY9YS5oYW5kbGVPYmo7cmV0dXJuKCFlfHxlIT09ZCYmIW4uY29udGFpbnMoZCxlKSkmJihhLnR5cGU9Zi5vcmlnVHlwZSxjPWYuaGFuZGxlci5hcHBseSh0aGlzLGFyZ3VtZW50cyksYS50eXBlPWIpLGN9fX0pLGsuZm9jdXNpbkJ1YmJsZXN8fG4uZWFjaCh7Zm9jdXM6XCJmb2N1c2luXCIsYmx1cjpcImZvY3Vzb3V0XCJ9LGZ1bmN0aW9uKGEsYil7dmFyIGM9ZnVuY3Rpb24oYSl7bi5ldmVudC5zaW11bGF0ZShiLGEudGFyZ2V0LG4uZXZlbnQuZml4KGEpLCEwKX07bi5ldmVudC5zcGVjaWFsW2JdPXtzZXR1cDpmdW5jdGlvbigpe3ZhciBkPXRoaXMub3duZXJEb2N1bWVudHx8dGhpcyxlPUwuYWNjZXNzKGQsYik7ZXx8ZC5hZGRFdmVudExpc3RlbmVyKGEsYywhMCksTC5hY2Nlc3MoZCxiLChlfHwwKSsxKX0sdGVhcmRvd246ZnVuY3Rpb24oKXt2YXIgZD10aGlzLm93bmVyRG9jdW1lbnR8fHRoaXMsZT1MLmFjY2VzcyhkLGIpLTE7ZT9MLmFjY2VzcyhkLGIsZSk6KGQucmVtb3ZlRXZlbnRMaXN0ZW5lcihhLGMsITApLEwucmVtb3ZlKGQsYikpfX19KSxuLmZuLmV4dGVuZCh7b246ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZixnO2lmKFwib2JqZWN0XCI9PXR5cGVvZiBhKXtcInN0cmluZ1wiIT10eXBlb2YgYiYmKGM9Y3x8YixiPXZvaWQgMCk7Zm9yKGcgaW4gYSl0aGlzLm9uKGcsYixjLGFbZ10sZSk7cmV0dXJuIHRoaXN9aWYobnVsbD09YyYmbnVsbD09ZD8oZD1iLGM9Yj12b2lkIDApOm51bGw9PWQmJihcInN0cmluZ1wiPT10eXBlb2YgYj8oZD1jLGM9dm9pZCAwKTooZD1jLGM9YixiPXZvaWQgMCkpLGQ9PT0hMSlkPSQ7ZWxzZSBpZighZClyZXR1cm4gdGhpcztyZXR1cm4gMT09PWUmJihmPWQsZD1mdW5jdGlvbihhKXtyZXR1cm4gbigpLm9mZihhKSxmLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0sZC5ndWlkPWYuZ3VpZHx8KGYuZ3VpZD1uLmd1aWQrKykpLHRoaXMuZWFjaChmdW5jdGlvbigpe24uZXZlbnQuYWRkKHRoaXMsYSxkLGMsYil9KX0sb25lOmZ1bmN0aW9uKGEsYixjLGQpe3JldHVybiB0aGlzLm9uKGEsYixjLGQsMSl9LG9mZjpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZTtpZihhJiZhLnByZXZlbnREZWZhdWx0JiZhLmhhbmRsZU9iailyZXR1cm4gZD1hLmhhbmRsZU9iaixuKGEuZGVsZWdhdGVUYXJnZXQpLm9mZihkLm5hbWVzcGFjZT9kLm9yaWdUeXBlK1wiLlwiK2QubmFtZXNwYWNlOmQub3JpZ1R5cGUsZC5zZWxlY3RvcixkLmhhbmRsZXIpLHRoaXM7aWYoXCJvYmplY3RcIj09dHlwZW9mIGEpe2ZvcihlIGluIGEpdGhpcy5vZmYoZSxiLGFbZV0pO3JldHVybiB0aGlzfXJldHVybihiPT09ITF8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGIpJiYoYz1iLGI9dm9pZCAwKSxjPT09ITEmJihjPSQpLHRoaXMuZWFjaChmdW5jdGlvbigpe24uZXZlbnQucmVtb3ZlKHRoaXMsYSxjLGIpfSl9LHRyaWdnZXI6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7bi5ldmVudC50cmlnZ2VyKGEsYix0aGlzKX0pfSx0cmlnZ2VySGFuZGxlcjpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXNbMF07cmV0dXJuIGM/bi5ldmVudC50cmlnZ2VyKGEsYixjLCEwKTp2b2lkIDB9fSk7dmFyIGFiPS88KD8hYXJlYXxicnxjb2x8ZW1iZWR8aHJ8aW1nfGlucHV0fGxpbmt8bWV0YXxwYXJhbSkoKFtcXHc6XSspW14+XSopXFwvPi9naSxiYj0vPChbXFx3Ol0rKS8sY2I9Lzx8JiM/XFx3KzsvLGRiPS88KD86c2NyaXB0fHN0eWxlfGxpbmspL2ksZWI9L2NoZWNrZWRcXHMqKD86W149XXw9XFxzKi5jaGVja2VkLikvaSxmYj0vXiR8XFwvKD86amF2YXxlY21hKXNjcmlwdC9pLGdiPS9edHJ1ZVxcLyguKikvLGhiPS9eXFxzKjwhKD86XFxbQ0RBVEFcXFt8LS0pfCg/OlxcXVxcXXwtLSk+XFxzKiQvZyxpYj17b3B0aW9uOlsxLFwiPHNlbGVjdCBtdWx0aXBsZT0nbXVsdGlwbGUnPlwiLFwiPC9zZWxlY3Q+XCJdLHRoZWFkOlsxLFwiPHRhYmxlPlwiLFwiPC90YWJsZT5cIl0sY29sOlsyLFwiPHRhYmxlPjxjb2xncm91cD5cIixcIjwvY29sZ3JvdXA+PC90YWJsZT5cIl0sdHI6WzIsXCI8dGFibGU+PHRib2R5PlwiLFwiPC90Ym9keT48L3RhYmxlPlwiXSx0ZDpbMyxcIjx0YWJsZT48dGJvZHk+PHRyPlwiLFwiPC90cj48L3Rib2R5PjwvdGFibGU+XCJdLF9kZWZhdWx0OlswLFwiXCIsXCJcIl19O2liLm9wdGdyb3VwPWliLm9wdGlvbixpYi50Ym9keT1pYi50Zm9vdD1pYi5jb2xncm91cD1pYi5jYXB0aW9uPWliLnRoZWFkLGliLnRoPWliLnRkO2Z1bmN0aW9uIGpiKGEsYil7cmV0dXJuIG4ubm9kZU5hbWUoYSxcInRhYmxlXCIpJiZuLm5vZGVOYW1lKDExIT09Yi5ub2RlVHlwZT9iOmIuZmlyc3RDaGlsZCxcInRyXCIpP2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0Ym9keVwiKVswXXx8YS5hcHBlbmRDaGlsZChhLm93bmVyRG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRib2R5XCIpKTphfWZ1bmN0aW9uIGtiKGEpe3JldHVybiBhLnR5cGU9KG51bGwhPT1hLmdldEF0dHJpYnV0ZShcInR5cGVcIikpK1wiL1wiK2EudHlwZSxhfWZ1bmN0aW9uIGxiKGEpe3ZhciBiPWdiLmV4ZWMoYS50eXBlKTtyZXR1cm4gYj9hLnR5cGU9YlsxXTphLnJlbW92ZUF0dHJpYnV0ZShcInR5cGVcIiksYX1mdW5jdGlvbiBtYihhLGIpe2Zvcih2YXIgYz0wLGQ9YS5sZW5ndGg7ZD5jO2MrKylMLnNldChhW2NdLFwiZ2xvYmFsRXZhbFwiLCFifHxMLmdldChiW2NdLFwiZ2xvYmFsRXZhbFwiKSl9ZnVuY3Rpb24gbmIoYSxiKXt2YXIgYyxkLGUsZixnLGgsaSxqO2lmKDE9PT1iLm5vZGVUeXBlKXtpZihMLmhhc0RhdGEoYSkmJihmPUwuYWNjZXNzKGEpLGc9TC5zZXQoYixmKSxqPWYuZXZlbnRzKSl7ZGVsZXRlIGcuaGFuZGxlLGcuZXZlbnRzPXt9O2ZvcihlIGluIGopZm9yKGM9MCxkPWpbZV0ubGVuZ3RoO2Q+YztjKyspbi5ldmVudC5hZGQoYixlLGpbZV1bY10pfU0uaGFzRGF0YShhKSYmKGg9TS5hY2Nlc3MoYSksaT1uLmV4dGVuZCh7fSxoKSxNLnNldChiLGkpKX19ZnVuY3Rpb24gb2IoYSxiKXt2YXIgYz1hLmdldEVsZW1lbnRzQnlUYWdOYW1lP2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYnx8XCIqXCIpOmEucXVlcnlTZWxlY3RvckFsbD9hLnF1ZXJ5U2VsZWN0b3JBbGwoYnx8XCIqXCIpOltdO3JldHVybiB2b2lkIDA9PT1ifHxiJiZuLm5vZGVOYW1lKGEsYik/bi5tZXJnZShbYV0sYyk6Y31mdW5jdGlvbiBwYihhLGIpe3ZhciBjPWIubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcImlucHV0XCI9PT1jJiZULnRlc3QoYS50eXBlKT9iLmNoZWNrZWQ9YS5jaGVja2VkOihcImlucHV0XCI9PT1jfHxcInRleHRhcmVhXCI9PT1jKSYmKGIuZGVmYXVsdFZhbHVlPWEuZGVmYXVsdFZhbHVlKX1uLmV4dGVuZCh7Y2xvbmU6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkLGUsZixnLGg9YS5jbG9uZU5vZGUoITApLGk9bi5jb250YWlucyhhLm93bmVyRG9jdW1lbnQsYSk7aWYoIShrLm5vQ2xvbmVDaGVja2VkfHwxIT09YS5ub2RlVHlwZSYmMTEhPT1hLm5vZGVUeXBlfHxuLmlzWE1MRG9jKGEpKSlmb3IoZz1vYihoKSxmPW9iKGEpLGQ9MCxlPWYubGVuZ3RoO2U+ZDtkKyspcGIoZltkXSxnW2RdKTtpZihiKWlmKGMpZm9yKGY9Znx8b2IoYSksZz1nfHxvYihoKSxkPTAsZT1mLmxlbmd0aDtlPmQ7ZCsrKW5iKGZbZF0sZ1tkXSk7ZWxzZSBuYihhLGgpO3JldHVybiBnPW9iKGgsXCJzY3JpcHRcIiksZy5sZW5ndGg+MCYmbWIoZywhaSYmb2IoYSxcInNjcmlwdFwiKSksaH0sYnVpbGRGcmFnbWVudDpmdW5jdGlvbihhLGIsYyxkKXtmb3IodmFyIGUsZixnLGgsaSxqLGs9Yi5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksbD1bXSxtPTAsbz1hLmxlbmd0aDtvPm07bSsrKWlmKGU9YVttXSxlfHwwPT09ZSlpZihcIm9iamVjdFwiPT09bi50eXBlKGUpKW4ubWVyZ2UobCxlLm5vZGVUeXBlP1tlXTplKTtlbHNlIGlmKGNiLnRlc3QoZSkpe2Y9Znx8ay5hcHBlbmRDaGlsZChiLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpLGc9KGJiLmV4ZWMoZSl8fFtcIlwiLFwiXCJdKVsxXS50b0xvd2VyQ2FzZSgpLGg9aWJbZ118fGliLl9kZWZhdWx0LGYuaW5uZXJIVE1MPWhbMV0rZS5yZXBsYWNlKGFiLFwiPCQxPjwvJDI+XCIpK2hbMl0saj1oWzBdO3doaWxlKGotLSlmPWYubGFzdENoaWxkO24ubWVyZ2UobCxmLmNoaWxkTm9kZXMpLGY9ay5maXJzdENoaWxkLGYudGV4dENvbnRlbnQ9XCJcIn1lbHNlIGwucHVzaChiLmNyZWF0ZVRleHROb2RlKGUpKTtrLnRleHRDb250ZW50PVwiXCIsbT0wO3doaWxlKGU9bFttKytdKWlmKCghZHx8LTE9PT1uLmluQXJyYXkoZSxkKSkmJihpPW4uY29udGFpbnMoZS5vd25lckRvY3VtZW50LGUpLGY9b2Ioay5hcHBlbmRDaGlsZChlKSxcInNjcmlwdFwiKSxpJiZtYihmKSxjKSl7aj0wO3doaWxlKGU9ZltqKytdKWZiLnRlc3QoZS50eXBlfHxcIlwiKSYmYy5wdXNoKGUpfXJldHVybiBrfSxjbGVhbkRhdGE6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiLGMsZCxlLGY9bi5ldmVudC5zcGVjaWFsLGc9MDt2b2lkIDAhPT0oYz1hW2ddKTtnKyspe2lmKG4uYWNjZXB0RGF0YShjKSYmKGU9Y1tMLmV4cGFuZG9dLGUmJihiPUwuY2FjaGVbZV0pKSl7aWYoYi5ldmVudHMpZm9yKGQgaW4gYi5ldmVudHMpZltkXT9uLmV2ZW50LnJlbW92ZShjLGQpOm4ucmVtb3ZlRXZlbnQoYyxkLGIuaGFuZGxlKTtMLmNhY2hlW2VdJiZkZWxldGUgTC5jYWNoZVtlXX1kZWxldGUgTS5jYWNoZVtjW00uZXhwYW5kb11dfX19KSxuLmZuLmV4dGVuZCh7dGV4dDpmdW5jdGlvbihhKXtyZXR1cm4gSih0aGlzLGZ1bmN0aW9uKGEpe3JldHVybiB2b2lkIDA9PT1hP24udGV4dCh0aGlzKTp0aGlzLmVtcHR5KCkuZWFjaChmdW5jdGlvbigpeygxPT09dGhpcy5ub2RlVHlwZXx8MTE9PT10aGlzLm5vZGVUeXBlfHw5PT09dGhpcy5ub2RlVHlwZSkmJih0aGlzLnRleHRDb250ZW50PWEpfSl9LG51bGwsYSxhcmd1bWVudHMubGVuZ3RoKX0sYXBwZW5kOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZG9tTWFuaXAoYXJndW1lbnRzLGZ1bmN0aW9uKGEpe2lmKDE9PT10aGlzLm5vZGVUeXBlfHwxMT09PXRoaXMubm9kZVR5cGV8fDk9PT10aGlzLm5vZGVUeXBlKXt2YXIgYj1qYih0aGlzLGEpO2IuYXBwZW5kQ2hpbGQoYSl9fSl9LHByZXBlbmQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsZnVuY3Rpb24oYSl7aWYoMT09PXRoaXMubm9kZVR5cGV8fDExPT09dGhpcy5ub2RlVHlwZXx8OT09PXRoaXMubm9kZVR5cGUpe3ZhciBiPWpiKHRoaXMsYSk7Yi5pbnNlcnRCZWZvcmUoYSxiLmZpcnN0Q2hpbGQpfX0pfSxiZWZvcmU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsZnVuY3Rpb24oYSl7dGhpcy5wYXJlbnROb2RlJiZ0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsdGhpcyl9KX0sYWZ0ZXI6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsZnVuY3Rpb24oYSl7dGhpcy5wYXJlbnROb2RlJiZ0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGEsdGhpcy5uZXh0U2libGluZyl9KX0scmVtb3ZlOmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjLGQ9YT9uLmZpbHRlcihhLHRoaXMpOnRoaXMsZT0wO251bGwhPShjPWRbZV0pO2UrKylifHwxIT09Yy5ub2RlVHlwZXx8bi5jbGVhbkRhdGEob2IoYykpLGMucGFyZW50Tm9kZSYmKGImJm4uY29udGFpbnMoYy5vd25lckRvY3VtZW50LGMpJiZtYihvYihjLFwic2NyaXB0XCIpKSxjLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoYykpO3JldHVybiB0aGlzfSxlbXB0eTpmdW5jdGlvbigpe2Zvcih2YXIgYSxiPTA7bnVsbCE9KGE9dGhpc1tiXSk7YisrKTE9PT1hLm5vZGVUeXBlJiYobi5jbGVhbkRhdGEob2IoYSwhMSkpLGEudGV4dENvbnRlbnQ9XCJcIik7cmV0dXJuIHRoaXN9LGNsb25lOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9bnVsbD09YT8hMTphLGI9bnVsbD09Yj9hOmIsdGhpcy5tYXAoZnVuY3Rpb24oKXtyZXR1cm4gbi5jbG9uZSh0aGlzLGEsYil9KX0saHRtbDpmdW5jdGlvbihhKXtyZXR1cm4gSih0aGlzLGZ1bmN0aW9uKGEpe3ZhciBiPXRoaXNbMF18fHt9LGM9MCxkPXRoaXMubGVuZ3RoO2lmKHZvaWQgMD09PWEmJjE9PT1iLm5vZGVUeXBlKXJldHVybiBiLmlubmVySFRNTDtpZihcInN0cmluZ1wiPT10eXBlb2YgYSYmIWRiLnRlc3QoYSkmJiFpYlsoYmIuZXhlYyhhKXx8W1wiXCIsXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCldKXthPWEucmVwbGFjZShhYixcIjwkMT48LyQyPlwiKTt0cnl7Zm9yKDtkPmM7YysrKWI9dGhpc1tjXXx8e30sMT09PWIubm9kZVR5cGUmJihuLmNsZWFuRGF0YShvYihiLCExKSksYi5pbm5lckhUTUw9YSk7Yj0wfWNhdGNoKGUpe319YiYmdGhpcy5lbXB0eSgpLmFwcGVuZChhKX0sbnVsbCxhLGFyZ3VtZW50cy5sZW5ndGgpfSxyZXBsYWNlV2l0aDpmdW5jdGlvbigpe3ZhciBhPWFyZ3VtZW50c1swXTtyZXR1cm4gdGhpcy5kb21NYW5pcChhcmd1bWVudHMsZnVuY3Rpb24oYil7YT10aGlzLnBhcmVudE5vZGUsbi5jbGVhbkRhdGEob2IodGhpcykpLGEmJmEucmVwbGFjZUNoaWxkKGIsdGhpcyl9KSxhJiYoYS5sZW5ndGh8fGEubm9kZVR5cGUpP3RoaXM6dGhpcy5yZW1vdmUoKX0sZGV0YWNoOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnJlbW92ZShhLCEwKX0sZG9tTWFuaXA6ZnVuY3Rpb24oYSxiKXthPWUuYXBwbHkoW10sYSk7dmFyIGMsZCxmLGcsaCxpLGo9MCxsPXRoaXMubGVuZ3RoLG09dGhpcyxvPWwtMSxwPWFbMF0scT1uLmlzRnVuY3Rpb24ocCk7aWYocXx8bD4xJiZcInN0cmluZ1wiPT10eXBlb2YgcCYmIWsuY2hlY2tDbG9uZSYmZWIudGVzdChwKSlyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKGMpe3ZhciBkPW0uZXEoYyk7cSYmKGFbMF09cC5jYWxsKHRoaXMsYyxkLmh0bWwoKSkpLGQuZG9tTWFuaXAoYSxiKX0pO2lmKGwmJihjPW4uYnVpbGRGcmFnbWVudChhLHRoaXNbMF0ub3duZXJEb2N1bWVudCwhMSx0aGlzKSxkPWMuZmlyc3RDaGlsZCwxPT09Yy5jaGlsZE5vZGVzLmxlbmd0aCYmKGM9ZCksZCkpe2ZvcihmPW4ubWFwKG9iKGMsXCJzY3JpcHRcIiksa2IpLGc9Zi5sZW5ndGg7bD5qO2orKyloPWMsaiE9PW8mJihoPW4uY2xvbmUoaCwhMCwhMCksZyYmbi5tZXJnZShmLG9iKGgsXCJzY3JpcHRcIikpKSxiLmNhbGwodGhpc1tqXSxoLGopO2lmKGcpZm9yKGk9ZltmLmxlbmd0aC0xXS5vd25lckRvY3VtZW50LG4ubWFwKGYsbGIpLGo9MDtnPmo7aisrKWg9ZltqXSxmYi50ZXN0KGgudHlwZXx8XCJcIikmJiFMLmFjY2VzcyhoLFwiZ2xvYmFsRXZhbFwiKSYmbi5jb250YWlucyhpLGgpJiYoaC5zcmM/bi5fZXZhbFVybCYmbi5fZXZhbFVybChoLnNyYyk6bi5nbG9iYWxFdmFsKGgudGV4dENvbnRlbnQucmVwbGFjZShoYixcIlwiKSkpfXJldHVybiB0aGlzfX0pLG4uZWFjaCh7YXBwZW5kVG86XCJhcHBlbmRcIixwcmVwZW5kVG86XCJwcmVwZW5kXCIsaW5zZXJ0QmVmb3JlOlwiYmVmb3JlXCIsaW5zZXJ0QWZ0ZXI6XCJhZnRlclwiLHJlcGxhY2VBbGw6XCJyZXBsYWNlV2l0aFwifSxmdW5jdGlvbihhLGIpe24uZm5bYV09ZnVuY3Rpb24oYSl7Zm9yKHZhciBjLGQ9W10sZT1uKGEpLGc9ZS5sZW5ndGgtMSxoPTA7Zz49aDtoKyspYz1oPT09Zz90aGlzOnRoaXMuY2xvbmUoITApLG4oZVtoXSlbYl0oYyksZi5hcHBseShkLGMuZ2V0KCkpO3JldHVybiB0aGlzLnB1c2hTdGFjayhkKX19KTt2YXIgcWIscmI9e307ZnVuY3Rpb24gc2IoYixjKXt2YXIgZCxlPW4oYy5jcmVhdGVFbGVtZW50KGIpKS5hcHBlbmRUbyhjLmJvZHkpLGY9YS5nZXREZWZhdWx0Q29tcHV0ZWRTdHlsZSYmKGQ9YS5nZXREZWZhdWx0Q29tcHV0ZWRTdHlsZShlWzBdKSk/ZC5kaXNwbGF5Om4uY3NzKGVbMF0sXCJkaXNwbGF5XCIpO3JldHVybiBlLmRldGFjaCgpLGZ9ZnVuY3Rpb24gdGIoYSl7dmFyIGI9bCxjPXJiW2FdO3JldHVybiBjfHwoYz1zYihhLGIpLFwibm9uZVwiIT09YyYmY3x8KHFiPShxYnx8bihcIjxpZnJhbWUgZnJhbWVib3JkZXI9JzAnIHdpZHRoPScwJyBoZWlnaHQ9JzAnLz5cIikpLmFwcGVuZFRvKGIuZG9jdW1lbnRFbGVtZW50KSxiPXFiWzBdLmNvbnRlbnREb2N1bWVudCxiLndyaXRlKCksYi5jbG9zZSgpLGM9c2IoYSxiKSxxYi5kZXRhY2goKSkscmJbYV09YyksY312YXIgdWI9L15tYXJnaW4vLHZiPW5ldyBSZWdFeHAoXCJeKFwiK1ErXCIpKD8hcHgpW2EteiVdKyRcIixcImlcIiksd2I9ZnVuY3Rpb24oYSl7cmV0dXJuIGEub3duZXJEb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGEsbnVsbCl9O2Z1bmN0aW9uIHhiKGEsYixjKXt2YXIgZCxlLGYsZyxoPWEuc3R5bGU7cmV0dXJuIGM9Y3x8d2IoYSksYyYmKGc9Yy5nZXRQcm9wZXJ0eVZhbHVlKGIpfHxjW2JdKSxjJiYoXCJcIiE9PWd8fG4uY29udGFpbnMoYS5vd25lckRvY3VtZW50LGEpfHwoZz1uLnN0eWxlKGEsYikpLHZiLnRlc3QoZykmJnViLnRlc3QoYikmJihkPWgud2lkdGgsZT1oLm1pbldpZHRoLGY9aC5tYXhXaWR0aCxoLm1pbldpZHRoPWgubWF4V2lkdGg9aC53aWR0aD1nLGc9Yy53aWR0aCxoLndpZHRoPWQsaC5taW5XaWR0aD1lLGgubWF4V2lkdGg9ZikpLHZvaWQgMCE9PWc/ZytcIlwiOmd9ZnVuY3Rpb24geWIoYSxiKXtyZXR1cm57Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGEoKT92b2lkIGRlbGV0ZSB0aGlzLmdldDoodGhpcy5nZXQ9YikuYXBwbHkodGhpcyxhcmd1bWVudHMpfX19IWZ1bmN0aW9uKCl7dmFyIGIsYyxkPWwuZG9jdW1lbnRFbGVtZW50LGU9bC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLGY9bC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2lmKGYuc3R5bGUpe2Yuc3R5bGUuYmFja2dyb3VuZENsaXA9XCJjb250ZW50LWJveFwiLGYuY2xvbmVOb2RlKCEwKS5zdHlsZS5iYWNrZ3JvdW5kQ2xpcD1cIlwiLGsuY2xlYXJDbG9uZVN0eWxlPVwiY29udGVudC1ib3hcIj09PWYuc3R5bGUuYmFja2dyb3VuZENsaXAsZS5zdHlsZS5jc3NUZXh0PVwiYm9yZGVyOjA7d2lkdGg6MDtoZWlnaHQ6MDt0b3A6MDtsZWZ0Oi05OTk5cHg7bWFyZ2luLXRvcDoxcHg7cG9zaXRpb246YWJzb2x1dGVcIixlLmFwcGVuZENoaWxkKGYpO2Z1bmN0aW9uIGcoKXtmLnN0eWxlLmNzc1RleHQ9XCItd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDstbW96LWJveC1zaXppbmc6Ym9yZGVyLWJveDtib3gtc2l6aW5nOmJvcmRlci1ib3g7ZGlzcGxheTpibG9jazttYXJnaW4tdG9wOjElO3RvcDoxJTtib3JkZXI6MXB4O3BhZGRpbmc6MXB4O3dpZHRoOjRweDtwb3NpdGlvbjphYnNvbHV0ZVwiLGYuaW5uZXJIVE1MPVwiXCIsZC5hcHBlbmRDaGlsZChlKTt2YXIgZz1hLmdldENvbXB1dGVkU3R5bGUoZixudWxsKTtiPVwiMSVcIiE9PWcudG9wLGM9XCI0cHhcIj09PWcud2lkdGgsZC5yZW1vdmVDaGlsZChlKX1hLmdldENvbXB1dGVkU3R5bGUmJm4uZXh0ZW5kKGsse3BpeGVsUG9zaXRpb246ZnVuY3Rpb24oKXtyZXR1cm4gZygpLGJ9LGJveFNpemluZ1JlbGlhYmxlOmZ1bmN0aW9uKCl7cmV0dXJuIG51bGw9PWMmJmcoKSxjfSxyZWxpYWJsZU1hcmdpblJpZ2h0OmZ1bmN0aW9uKCl7dmFyIGIsYz1mLmFwcGVuZENoaWxkKGwuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7cmV0dXJuIGMuc3R5bGUuY3NzVGV4dD1mLnN0eWxlLmNzc1RleHQ9XCItd2Via2l0LWJveC1zaXppbmc6Y29udGVudC1ib3g7LW1vei1ib3gtc2l6aW5nOmNvbnRlbnQtYm94O2JveC1zaXppbmc6Y29udGVudC1ib3g7ZGlzcGxheTpibG9jazttYXJnaW46MDtib3JkZXI6MDtwYWRkaW5nOjBcIixjLnN0eWxlLm1hcmdpblJpZ2h0PWMuc3R5bGUud2lkdGg9XCIwXCIsZi5zdHlsZS53aWR0aD1cIjFweFwiLGQuYXBwZW5kQ2hpbGQoZSksYj0hcGFyc2VGbG9hdChhLmdldENvbXB1dGVkU3R5bGUoYyxudWxsKS5tYXJnaW5SaWdodCksZC5yZW1vdmVDaGlsZChlKSxifX0pfX0oKSxuLnN3YXA9ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGUsZixnPXt9O2ZvcihmIGluIGIpZ1tmXT1hLnN0eWxlW2ZdLGEuc3R5bGVbZl09YltmXTtlPWMuYXBwbHkoYSxkfHxbXSk7Zm9yKGYgaW4gYilhLnN0eWxlW2ZdPWdbZl07cmV0dXJuIGV9O3ZhciB6Yj0vXihub25lfHRhYmxlKD8hLWNbZWFdKS4rKS8sQWI9bmV3IFJlZ0V4cChcIl4oXCIrUStcIikoLiopJFwiLFwiaVwiKSxCYj1uZXcgUmVnRXhwKFwiXihbKy1dKT0oXCIrUStcIilcIixcImlcIiksQ2I9e3Bvc2l0aW9uOlwiYWJzb2x1dGVcIix2aXNpYmlsaXR5OlwiaGlkZGVuXCIsZGlzcGxheTpcImJsb2NrXCJ9LERiPXtsZXR0ZXJTcGFjaW5nOlwiMFwiLGZvbnRXZWlnaHQ6XCI0MDBcIn0sRWI9W1wiV2Via2l0XCIsXCJPXCIsXCJNb3pcIixcIm1zXCJdO2Z1bmN0aW9uIEZiKGEsYil7aWYoYiBpbiBhKXJldHVybiBiO3ZhciBjPWJbMF0udG9VcHBlckNhc2UoKStiLnNsaWNlKDEpLGQ9YixlPUViLmxlbmd0aDt3aGlsZShlLS0paWYoYj1FYltlXStjLGIgaW4gYSlyZXR1cm4gYjtyZXR1cm4gZH1mdW5jdGlvbiBHYihhLGIsYyl7dmFyIGQ9QWIuZXhlYyhiKTtyZXR1cm4gZD9NYXRoLm1heCgwLGRbMV0tKGN8fDApKSsoZFsyXXx8XCJweFwiKTpifWZ1bmN0aW9uIEhiKGEsYixjLGQsZSl7Zm9yKHZhciBmPWM9PT0oZD9cImJvcmRlclwiOlwiY29udGVudFwiKT80Olwid2lkdGhcIj09PWI/MTowLGc9MDs0PmY7Zis9MilcIm1hcmdpblwiPT09YyYmKGcrPW4uY3NzKGEsYytSW2ZdLCEwLGUpKSxkPyhcImNvbnRlbnRcIj09PWMmJihnLT1uLmNzcyhhLFwicGFkZGluZ1wiK1JbZl0sITAsZSkpLFwibWFyZ2luXCIhPT1jJiYoZy09bi5jc3MoYSxcImJvcmRlclwiK1JbZl0rXCJXaWR0aFwiLCEwLGUpKSk6KGcrPW4uY3NzKGEsXCJwYWRkaW5nXCIrUltmXSwhMCxlKSxcInBhZGRpbmdcIiE9PWMmJihnKz1uLmNzcyhhLFwiYm9yZGVyXCIrUltmXStcIldpZHRoXCIsITAsZSkpKTtyZXR1cm4gZ31mdW5jdGlvbiBJYihhLGIsYyl7dmFyIGQ9ITAsZT1cIndpZHRoXCI9PT1iP2Eub2Zmc2V0V2lkdGg6YS5vZmZzZXRIZWlnaHQsZj13YihhKSxnPVwiYm9yZGVyLWJveFwiPT09bi5jc3MoYSxcImJveFNpemluZ1wiLCExLGYpO2lmKDA+PWV8fG51bGw9PWUpe2lmKGU9eGIoYSxiLGYpLCgwPmV8fG51bGw9PWUpJiYoZT1hLnN0eWxlW2JdKSx2Yi50ZXN0KGUpKXJldHVybiBlO2Q9ZyYmKGsuYm94U2l6aW5nUmVsaWFibGUoKXx8ZT09PWEuc3R5bGVbYl0pLGU9cGFyc2VGbG9hdChlKXx8MH1yZXR1cm4gZStIYihhLGIsY3x8KGc/XCJib3JkZXJcIjpcImNvbnRlbnRcIiksZCxmKStcInB4XCJ9ZnVuY3Rpb24gSmIoYSxiKXtmb3IodmFyIGMsZCxlLGY9W10sZz0wLGg9YS5sZW5ndGg7aD5nO2crKylkPWFbZ10sZC5zdHlsZSYmKGZbZ109TC5nZXQoZCxcIm9sZGRpc3BsYXlcIiksYz1kLnN0eWxlLmRpc3BsYXksYj8oZltnXXx8XCJub25lXCIhPT1jfHwoZC5zdHlsZS5kaXNwbGF5PVwiXCIpLFwiXCI9PT1kLnN0eWxlLmRpc3BsYXkmJlMoZCkmJihmW2ddPUwuYWNjZXNzKGQsXCJvbGRkaXNwbGF5XCIsdGIoZC5ub2RlTmFtZSkpKSk6KGU9UyhkKSxcIm5vbmVcIj09PWMmJmV8fEwuc2V0KGQsXCJvbGRkaXNwbGF5XCIsZT9jOm4uY3NzKGQsXCJkaXNwbGF5XCIpKSkpO2ZvcihnPTA7aD5nO2crKylkPWFbZ10sZC5zdHlsZSYmKGImJlwibm9uZVwiIT09ZC5zdHlsZS5kaXNwbGF5JiZcIlwiIT09ZC5zdHlsZS5kaXNwbGF5fHwoZC5zdHlsZS5kaXNwbGF5PWI/ZltnXXx8XCJcIjpcIm5vbmVcIikpO3JldHVybiBhfW4uZXh0ZW5kKHtjc3NIb29rczp7b3BhY2l0eTp7Z2V0OmZ1bmN0aW9uKGEsYil7aWYoYil7dmFyIGM9eGIoYSxcIm9wYWNpdHlcIik7cmV0dXJuXCJcIj09PWM/XCIxXCI6Y319fX0sY3NzTnVtYmVyOntjb2x1bW5Db3VudDohMCxmaWxsT3BhY2l0eTohMCxmbGV4R3JvdzohMCxmbGV4U2hyaW5rOiEwLGZvbnRXZWlnaHQ6ITAsbGluZUhlaWdodDohMCxvcGFjaXR5OiEwLG9yZGVyOiEwLG9ycGhhbnM6ITAsd2lkb3dzOiEwLHpJbmRleDohMCx6b29tOiEwfSxjc3NQcm9wczp7XCJmbG9hdFwiOlwiY3NzRmxvYXRcIn0sc3R5bGU6ZnVuY3Rpb24oYSxiLGMsZCl7aWYoYSYmMyE9PWEubm9kZVR5cGUmJjghPT1hLm5vZGVUeXBlJiZhLnN0eWxlKXt2YXIgZSxmLGcsaD1uLmNhbWVsQ2FzZShiKSxpPWEuc3R5bGU7cmV0dXJuIGI9bi5jc3NQcm9wc1toXXx8KG4uY3NzUHJvcHNbaF09RmIoaSxoKSksZz1uLmNzc0hvb2tzW2JdfHxuLmNzc0hvb2tzW2hdLHZvaWQgMD09PWM/ZyYmXCJnZXRcImluIGcmJnZvaWQgMCE9PShlPWcuZ2V0KGEsITEsZCkpP2U6aVtiXTooZj10eXBlb2YgYyxcInN0cmluZ1wiPT09ZiYmKGU9QmIuZXhlYyhjKSkmJihjPShlWzFdKzEpKmVbMl0rcGFyc2VGbG9hdChuLmNzcyhhLGIpKSxmPVwibnVtYmVyXCIpLG51bGwhPWMmJmM9PT1jJiYoXCJudW1iZXJcIiE9PWZ8fG4uY3NzTnVtYmVyW2hdfHwoYys9XCJweFwiKSxrLmNsZWFyQ2xvbmVTdHlsZXx8XCJcIiE9PWN8fDAhPT1iLmluZGV4T2YoXCJiYWNrZ3JvdW5kXCIpfHwoaVtiXT1cImluaGVyaXRcIiksZyYmXCJzZXRcImluIGcmJnZvaWQgMD09PShjPWcuc2V0KGEsYyxkKSl8fChpW2JdPWMpKSx2b2lkIDApfX0sY3NzOmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlLGYsZyxoPW4uY2FtZWxDYXNlKGIpO3JldHVybiBiPW4uY3NzUHJvcHNbaF18fChuLmNzc1Byb3BzW2hdPUZiKGEuc3R5bGUsaCkpLGc9bi5jc3NIb29rc1tiXXx8bi5jc3NIb29rc1toXSxnJiZcImdldFwiaW4gZyYmKGU9Zy5nZXQoYSwhMCxjKSksdm9pZCAwPT09ZSYmKGU9eGIoYSxiLGQpKSxcIm5vcm1hbFwiPT09ZSYmYiBpbiBEYiYmKGU9RGJbYl0pLFwiXCI9PT1jfHxjPyhmPXBhcnNlRmxvYXQoZSksYz09PSEwfHxuLmlzTnVtZXJpYyhmKT9mfHwwOmUpOmV9fSksbi5lYWNoKFtcImhlaWdodFwiLFwid2lkdGhcIl0sZnVuY3Rpb24oYSxiKXtuLmNzc0hvb2tzW2JdPXtnZXQ6ZnVuY3Rpb24oYSxjLGQpe3JldHVybiBjP3piLnRlc3Qobi5jc3MoYSxcImRpc3BsYXlcIikpJiYwPT09YS5vZmZzZXRXaWR0aD9uLnN3YXAoYSxDYixmdW5jdGlvbigpe3JldHVybiBJYihhLGIsZCl9KTpJYihhLGIsZCk6dm9pZCAwfSxzZXQ6ZnVuY3Rpb24oYSxjLGQpe3ZhciBlPWQmJndiKGEpO3JldHVybiBHYihhLGMsZD9IYihhLGIsZCxcImJvcmRlci1ib3hcIj09PW4uY3NzKGEsXCJib3hTaXppbmdcIiwhMSxlKSxlKTowKX19fSksbi5jc3NIb29rcy5tYXJnaW5SaWdodD15YihrLnJlbGlhYmxlTWFyZ2luUmlnaHQsZnVuY3Rpb24oYSxiKXtyZXR1cm4gYj9uLnN3YXAoYSx7ZGlzcGxheTpcImlubGluZS1ibG9ja1wifSx4YixbYSxcIm1hcmdpblJpZ2h0XCJdKTp2b2lkIDB9KSxuLmVhY2goe21hcmdpbjpcIlwiLHBhZGRpbmc6XCJcIixib3JkZXI6XCJXaWR0aFwifSxmdW5jdGlvbihhLGIpe24uY3NzSG9va3NbYStiXT17ZXhwYW5kOmZ1bmN0aW9uKGMpe2Zvcih2YXIgZD0wLGU9e30sZj1cInN0cmluZ1wiPT10eXBlb2YgYz9jLnNwbGl0KFwiIFwiKTpbY107ND5kO2QrKyllW2ErUltkXStiXT1mW2RdfHxmW2QtMl18fGZbMF07cmV0dXJuIGV9fSx1Yi50ZXN0KGEpfHwobi5jc3NIb29rc1thK2JdLnNldD1HYil9KSxuLmZuLmV4dGVuZCh7Y3NzOmZ1bmN0aW9uKGEsYil7cmV0dXJuIEoodGhpcyxmdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxmPXt9LGc9MDtpZihuLmlzQXJyYXkoYikpe2ZvcihkPXdiKGEpLGU9Yi5sZW5ndGg7ZT5nO2crKylmW2JbZ11dPW4uY3NzKGEsYltnXSwhMSxkKTtyZXR1cm4gZn1yZXR1cm4gdm9pZCAwIT09Yz9uLnN0eWxlKGEsYixjKTpuLmNzcyhhLGIpfSxhLGIsYXJndW1lbnRzLmxlbmd0aD4xKX0sc2hvdzpmdW5jdGlvbigpe3JldHVybiBKYih0aGlzLCEwKX0saGlkZTpmdW5jdGlvbigpe3JldHVybiBKYih0aGlzKX0sdG9nZ2xlOmZ1bmN0aW9uKGEpe3JldHVyblwiYm9vbGVhblwiPT10eXBlb2YgYT9hP3RoaXMuc2hvdygpOnRoaXMuaGlkZSgpOnRoaXMuZWFjaChmdW5jdGlvbigpe1ModGhpcyk/bih0aGlzKS5zaG93KCk6bih0aGlzKS5oaWRlKCl9KX19KTtmdW5jdGlvbiBLYihhLGIsYyxkLGUpe3JldHVybiBuZXcgS2IucHJvdG90eXBlLmluaXQoYSxiLGMsZCxlKX1uLlR3ZWVuPUtiLEtiLnByb3RvdHlwZT17Y29uc3RydWN0b3I6S2IsaW5pdDpmdW5jdGlvbihhLGIsYyxkLGUsZil7dGhpcy5lbGVtPWEsdGhpcy5wcm9wPWMsdGhpcy5lYXNpbmc9ZXx8XCJzd2luZ1wiLHRoaXMub3B0aW9ucz1iLHRoaXMuc3RhcnQ9dGhpcy5ub3c9dGhpcy5jdXIoKSx0aGlzLmVuZD1kLHRoaXMudW5pdD1mfHwobi5jc3NOdW1iZXJbY10/XCJcIjpcInB4XCIpfSxjdXI6ZnVuY3Rpb24oKXt2YXIgYT1LYi5wcm9wSG9va3NbdGhpcy5wcm9wXTtyZXR1cm4gYSYmYS5nZXQ/YS5nZXQodGhpcyk6S2IucHJvcEhvb2tzLl9kZWZhdWx0LmdldCh0aGlzKX0scnVuOmZ1bmN0aW9uKGEpe3ZhciBiLGM9S2IucHJvcEhvb2tzW3RoaXMucHJvcF07cmV0dXJuIHRoaXMucG9zPWI9dGhpcy5vcHRpb25zLmR1cmF0aW9uP24uZWFzaW5nW3RoaXMuZWFzaW5nXShhLHRoaXMub3B0aW9ucy5kdXJhdGlvbiphLDAsMSx0aGlzLm9wdGlvbnMuZHVyYXRpb24pOmEsdGhpcy5ub3c9KHRoaXMuZW5kLXRoaXMuc3RhcnQpKmIrdGhpcy5zdGFydCx0aGlzLm9wdGlvbnMuc3RlcCYmdGhpcy5vcHRpb25zLnN0ZXAuY2FsbCh0aGlzLmVsZW0sdGhpcy5ub3csdGhpcyksYyYmYy5zZXQ/Yy5zZXQodGhpcyk6S2IucHJvcEhvb2tzLl9kZWZhdWx0LnNldCh0aGlzKSx0aGlzfX0sS2IucHJvdG90eXBlLmluaXQucHJvdG90eXBlPUtiLnByb3RvdHlwZSxLYi5wcm9wSG9va3M9e19kZWZhdWx0OntnZXQ6ZnVuY3Rpb24oYSl7dmFyIGI7cmV0dXJuIG51bGw9PWEuZWxlbVthLnByb3BdfHxhLmVsZW0uc3R5bGUmJm51bGwhPWEuZWxlbS5zdHlsZVthLnByb3BdPyhiPW4uY3NzKGEuZWxlbSxhLnByb3AsXCJcIiksYiYmXCJhdXRvXCIhPT1iP2I6MCk6YS5lbGVtW2EucHJvcF19LHNldDpmdW5jdGlvbihhKXtuLmZ4LnN0ZXBbYS5wcm9wXT9uLmZ4LnN0ZXBbYS5wcm9wXShhKTphLmVsZW0uc3R5bGUmJihudWxsIT1hLmVsZW0uc3R5bGVbbi5jc3NQcm9wc1thLnByb3BdXXx8bi5jc3NIb29rc1thLnByb3BdKT9uLnN0eWxlKGEuZWxlbSxhLnByb3AsYS5ub3crYS51bml0KTphLmVsZW1bYS5wcm9wXT1hLm5vd319fSxLYi5wcm9wSG9va3Muc2Nyb2xsVG9wPUtiLnByb3BIb29rcy5zY3JvbGxMZWZ0PXtzZXQ6ZnVuY3Rpb24oYSl7YS5lbGVtLm5vZGVUeXBlJiZhLmVsZW0ucGFyZW50Tm9kZSYmKGEuZWxlbVthLnByb3BdPWEubm93KX19LG4uZWFzaW5nPXtsaW5lYXI6ZnVuY3Rpb24oYSl7cmV0dXJuIGF9LHN3aW5nOmZ1bmN0aW9uKGEpe3JldHVybi41LU1hdGguY29zKGEqTWF0aC5QSSkvMn19LG4uZng9S2IucHJvdG90eXBlLmluaXQsbi5meC5zdGVwPXt9O3ZhciBMYixNYixOYj0vXig/OnRvZ2dsZXxzaG93fGhpZGUpJC8sT2I9bmV3IFJlZ0V4cChcIl4oPzooWystXSk9fCkoXCIrUStcIikoW2EteiVdKikkXCIsXCJpXCIpLFBiPS9xdWV1ZUhvb2tzJC8sUWI9W1ZiXSxSYj17XCIqXCI6W2Z1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy5jcmVhdGVUd2VlbihhLGIpLGQ9Yy5jdXIoKSxlPU9iLmV4ZWMoYiksZj1lJiZlWzNdfHwobi5jc3NOdW1iZXJbYV0/XCJcIjpcInB4XCIpLGc9KG4uY3NzTnVtYmVyW2FdfHxcInB4XCIhPT1mJiYrZCkmJk9iLmV4ZWMobi5jc3MoYy5lbGVtLGEpKSxoPTEsaT0yMDtpZihnJiZnWzNdIT09Zil7Zj1mfHxnWzNdLGU9ZXx8W10sZz0rZHx8MTtkbyBoPWh8fFwiLjVcIixnLz1oLG4uc3R5bGUoYy5lbGVtLGEsZytmKTt3aGlsZShoIT09KGg9Yy5jdXIoKS9kKSYmMSE9PWgmJi0taSl9cmV0dXJuIGUmJihnPWMuc3RhcnQ9K2d8fCtkfHwwLGMudW5pdD1mLGMuZW5kPWVbMV0/ZysoZVsxXSsxKSplWzJdOitlWzJdKSxjfV19O2Z1bmN0aW9uIFNiKCl7cmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtMYj12b2lkIDB9KSxMYj1uLm5vdygpfWZ1bmN0aW9uIFRiKGEsYil7dmFyIGMsZD0wLGU9e2hlaWdodDphfTtmb3IoYj1iPzE6MDs0PmQ7ZCs9Mi1iKWM9UltkXSxlW1wibWFyZ2luXCIrY109ZVtcInBhZGRpbmdcIitjXT1hO3JldHVybiBiJiYoZS5vcGFjaXR5PWUud2lkdGg9YSksZX1mdW5jdGlvbiBVYihhLGIsYyl7Zm9yKHZhciBkLGU9KFJiW2JdfHxbXSkuY29uY2F0KFJiW1wiKlwiXSksZj0wLGc9ZS5sZW5ndGg7Zz5mO2YrKylpZihkPWVbZl0uY2FsbChjLGIsYSkpcmV0dXJuIGR9ZnVuY3Rpb24gVmIoYSxiLGMpe3ZhciBkLGUsZixnLGgsaSxqLGssbD10aGlzLG09e30sbz1hLnN0eWxlLHA9YS5ub2RlVHlwZSYmUyhhKSxxPUwuZ2V0KGEsXCJmeHNob3dcIik7Yy5xdWV1ZXx8KGg9bi5fcXVldWVIb29rcyhhLFwiZnhcIiksbnVsbD09aC51bnF1ZXVlZCYmKGgudW5xdWV1ZWQ9MCxpPWguZW1wdHkuZmlyZSxoLmVtcHR5LmZpcmU9ZnVuY3Rpb24oKXtoLnVucXVldWVkfHxpKCl9KSxoLnVucXVldWVkKyssbC5hbHdheXMoZnVuY3Rpb24oKXtsLmFsd2F5cyhmdW5jdGlvbigpe2gudW5xdWV1ZWQtLSxuLnF1ZXVlKGEsXCJmeFwiKS5sZW5ndGh8fGguZW1wdHkuZmlyZSgpfSl9KSksMT09PWEubm9kZVR5cGUmJihcImhlaWdodFwiaW4gYnx8XCJ3aWR0aFwiaW4gYikmJihjLm92ZXJmbG93PVtvLm92ZXJmbG93LG8ub3ZlcmZsb3dYLG8ub3ZlcmZsb3dZXSxqPW4uY3NzKGEsXCJkaXNwbGF5XCIpLGs9XCJub25lXCI9PT1qP0wuZ2V0KGEsXCJvbGRkaXNwbGF5XCIpfHx0YihhLm5vZGVOYW1lKTpqLFwiaW5saW5lXCI9PT1rJiZcIm5vbmVcIj09PW4uY3NzKGEsXCJmbG9hdFwiKSYmKG8uZGlzcGxheT1cImlubGluZS1ibG9ja1wiKSksYy5vdmVyZmxvdyYmKG8ub3ZlcmZsb3c9XCJoaWRkZW5cIixsLmFsd2F5cyhmdW5jdGlvbigpe28ub3ZlcmZsb3c9Yy5vdmVyZmxvd1swXSxvLm92ZXJmbG93WD1jLm92ZXJmbG93WzFdLG8ub3ZlcmZsb3dZPWMub3ZlcmZsb3dbMl19KSk7Zm9yKGQgaW4gYilpZihlPWJbZF0sTmIuZXhlYyhlKSl7aWYoZGVsZXRlIGJbZF0sZj1mfHxcInRvZ2dsZVwiPT09ZSxlPT09KHA/XCJoaWRlXCI6XCJzaG93XCIpKXtpZihcInNob3dcIiE9PWV8fCFxfHx2b2lkIDA9PT1xW2RdKWNvbnRpbnVlO3A9ITB9bVtkXT1xJiZxW2RdfHxuLnN0eWxlKGEsZCl9ZWxzZSBqPXZvaWQgMDtpZihuLmlzRW1wdHlPYmplY3QobSkpXCJpbmxpbmVcIj09PShcIm5vbmVcIj09PWo/dGIoYS5ub2RlTmFtZSk6aikmJihvLmRpc3BsYXk9aik7ZWxzZXtxP1wiaGlkZGVuXCJpbiBxJiYocD1xLmhpZGRlbik6cT1MLmFjY2VzcyhhLFwiZnhzaG93XCIse30pLGYmJihxLmhpZGRlbj0hcCkscD9uKGEpLnNob3coKTpsLmRvbmUoZnVuY3Rpb24oKXtuKGEpLmhpZGUoKX0pLGwuZG9uZShmdW5jdGlvbigpe3ZhciBiO0wucmVtb3ZlKGEsXCJmeHNob3dcIik7Zm9yKGIgaW4gbSluLnN0eWxlKGEsYixtW2JdKX0pO2ZvcihkIGluIG0pZz1VYihwP3FbZF06MCxkLGwpLGQgaW4gcXx8KHFbZF09Zy5zdGFydCxwJiYoZy5lbmQ9Zy5zdGFydCxnLnN0YXJ0PVwid2lkdGhcIj09PWR8fFwiaGVpZ2h0XCI9PT1kPzE6MCkpfX1mdW5jdGlvbiBXYihhLGIpe3ZhciBjLGQsZSxmLGc7Zm9yKGMgaW4gYSlpZihkPW4uY2FtZWxDYXNlKGMpLGU9YltkXSxmPWFbY10sbi5pc0FycmF5KGYpJiYoZT1mWzFdLGY9YVtjXT1mWzBdKSxjIT09ZCYmKGFbZF09ZixkZWxldGUgYVtjXSksZz1uLmNzc0hvb2tzW2RdLGcmJlwiZXhwYW5kXCJpbiBnKXtmPWcuZXhwYW5kKGYpLGRlbGV0ZSBhW2RdO2ZvcihjIGluIGYpYyBpbiBhfHwoYVtjXT1mW2NdLGJbY109ZSl9ZWxzZSBiW2RdPWV9ZnVuY3Rpb24gWGIoYSxiLGMpe3ZhciBkLGUsZj0wLGc9UWIubGVuZ3RoLGg9bi5EZWZlcnJlZCgpLmFsd2F5cyhmdW5jdGlvbigpe2RlbGV0ZSBpLmVsZW19KSxpPWZ1bmN0aW9uKCl7aWYoZSlyZXR1cm4hMTtmb3IodmFyIGI9TGJ8fFNiKCksYz1NYXRoLm1heCgwLGouc3RhcnRUaW1lK2ouZHVyYXRpb24tYiksZD1jL2ouZHVyYXRpb258fDAsZj0xLWQsZz0wLGk9ai50d2VlbnMubGVuZ3RoO2k+ZztnKyspai50d2VlbnNbZ10ucnVuKGYpO3JldHVybiBoLm5vdGlmeVdpdGgoYSxbaixmLGNdKSwxPmYmJmk/YzooaC5yZXNvbHZlV2l0aChhLFtqXSksITEpfSxqPWgucHJvbWlzZSh7ZWxlbTphLHByb3BzOm4uZXh0ZW5kKHt9LGIpLG9wdHM6bi5leHRlbmQoITAse3NwZWNpYWxFYXNpbmc6e319LGMpLG9yaWdpbmFsUHJvcGVydGllczpiLG9yaWdpbmFsT3B0aW9uczpjLHN0YXJ0VGltZTpMYnx8U2IoKSxkdXJhdGlvbjpjLmR1cmF0aW9uLHR3ZWVuczpbXSxjcmVhdGVUd2VlbjpmdW5jdGlvbihiLGMpe3ZhciBkPW4uVHdlZW4oYSxqLm9wdHMsYixjLGoub3B0cy5zcGVjaWFsRWFzaW5nW2JdfHxqLm9wdHMuZWFzaW5nKTtyZXR1cm4gai50d2VlbnMucHVzaChkKSxkfSxzdG9wOmZ1bmN0aW9uKGIpe3ZhciBjPTAsZD1iP2oudHdlZW5zLmxlbmd0aDowO2lmKGUpcmV0dXJuIHRoaXM7Zm9yKGU9ITA7ZD5jO2MrKylqLnR3ZWVuc1tjXS5ydW4oMSk7cmV0dXJuIGI/aC5yZXNvbHZlV2l0aChhLFtqLGJdKTpoLnJlamVjdFdpdGgoYSxbaixiXSksdGhpc319KSxrPWoucHJvcHM7Zm9yKFdiKGssai5vcHRzLnNwZWNpYWxFYXNpbmcpO2c+ZjtmKyspaWYoZD1RYltmXS5jYWxsKGosYSxrLGoub3B0cykpcmV0dXJuIGQ7cmV0dXJuIG4ubWFwKGssVWIsaiksbi5pc0Z1bmN0aW9uKGoub3B0cy5zdGFydCkmJmoub3B0cy5zdGFydC5jYWxsKGEsaiksbi5meC50aW1lcihuLmV4dGVuZChpLHtlbGVtOmEsYW5pbTpqLHF1ZXVlOmoub3B0cy5xdWV1ZX0pKSxqLnByb2dyZXNzKGoub3B0cy5wcm9ncmVzcykuZG9uZShqLm9wdHMuZG9uZSxqLm9wdHMuY29tcGxldGUpLmZhaWwoai5vcHRzLmZhaWwpLmFsd2F5cyhqLm9wdHMuYWx3YXlzKX1uLkFuaW1hdGlvbj1uLmV4dGVuZChYYix7dHdlZW5lcjpmdW5jdGlvbihhLGIpe24uaXNGdW5jdGlvbihhKT8oYj1hLGE9W1wiKlwiXSk6YT1hLnNwbGl0KFwiIFwiKTtmb3IodmFyIGMsZD0wLGU9YS5sZW5ndGg7ZT5kO2QrKyljPWFbZF0sUmJbY109UmJbY118fFtdLFJiW2NdLnVuc2hpZnQoYil9LHByZWZpbHRlcjpmdW5jdGlvbihhLGIpe2I/UWIudW5zaGlmdChhKTpRYi5wdXNoKGEpfX0pLG4uc3BlZWQ9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWEmJlwib2JqZWN0XCI9PXR5cGVvZiBhP24uZXh0ZW5kKHt9LGEpOntjb21wbGV0ZTpjfHwhYyYmYnx8bi5pc0Z1bmN0aW9uKGEpJiZhLGR1cmF0aW9uOmEsZWFzaW5nOmMmJmJ8fGImJiFuLmlzRnVuY3Rpb24oYikmJmJ9O3JldHVybiBkLmR1cmF0aW9uPW4uZngub2ZmPzA6XCJudW1iZXJcIj09dHlwZW9mIGQuZHVyYXRpb24/ZC5kdXJhdGlvbjpkLmR1cmF0aW9uIGluIG4uZnguc3BlZWRzP24uZnguc3BlZWRzW2QuZHVyYXRpb25dOm4uZnguc3BlZWRzLl9kZWZhdWx0LChudWxsPT1kLnF1ZXVlfHxkLnF1ZXVlPT09ITApJiYoZC5xdWV1ZT1cImZ4XCIpLGQub2xkPWQuY29tcGxldGUsZC5jb21wbGV0ZT1mdW5jdGlvbigpe24uaXNGdW5jdGlvbihkLm9sZCkmJmQub2xkLmNhbGwodGhpcyksZC5xdWV1ZSYmbi5kZXF1ZXVlKHRoaXMsZC5xdWV1ZSl9LGR9LG4uZm4uZXh0ZW5kKHtmYWRlVG86ZnVuY3Rpb24oYSxiLGMsZCl7cmV0dXJuIHRoaXMuZmlsdGVyKFMpLmNzcyhcIm9wYWNpdHlcIiwwKS5zaG93KCkuZW5kKCkuYW5pbWF0ZSh7b3BhY2l0eTpifSxhLGMsZCl9LGFuaW1hdGU6ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9bi5pc0VtcHR5T2JqZWN0KGEpLGY9bi5zcGVlZChiLGMsZCksZz1mdW5jdGlvbigpe3ZhciBiPVhiKHRoaXMsbi5leHRlbmQoe30sYSksZik7KGV8fEwuZ2V0KHRoaXMsXCJmaW5pc2hcIikpJiZiLnN0b3AoITApfTtyZXR1cm4gZy5maW5pc2g9ZyxlfHxmLnF1ZXVlPT09ITE/dGhpcy5lYWNoKGcpOnRoaXMucXVldWUoZi5xdWV1ZSxnKX0sc3RvcDpmdW5jdGlvbihhLGIsYyl7dmFyIGQ9ZnVuY3Rpb24oYSl7dmFyIGI9YS5zdG9wO2RlbGV0ZSBhLnN0b3AsYihjKX07cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIGEmJihjPWIsYj1hLGE9dm9pZCAwKSxiJiZhIT09ITEmJnRoaXMucXVldWUoYXx8XCJmeFwiLFtdKSx0aGlzLmVhY2goZnVuY3Rpb24oKXt2YXIgYj0hMCxlPW51bGwhPWEmJmErXCJxdWV1ZUhvb2tzXCIsZj1uLnRpbWVycyxnPUwuZ2V0KHRoaXMpO2lmKGUpZ1tlXSYmZ1tlXS5zdG9wJiZkKGdbZV0pO2Vsc2UgZm9yKGUgaW4gZylnW2VdJiZnW2VdLnN0b3AmJlBiLnRlc3QoZSkmJmQoZ1tlXSk7Zm9yKGU9Zi5sZW5ndGg7ZS0tOylmW2VdLmVsZW0hPT10aGlzfHxudWxsIT1hJiZmW2VdLnF1ZXVlIT09YXx8KGZbZV0uYW5pbS5zdG9wKGMpLGI9ITEsZi5zcGxpY2UoZSwxKSk7KGJ8fCFjKSYmbi5kZXF1ZXVlKHRoaXMsYSl9KX0sZmluaXNoOmZ1bmN0aW9uKGEpe3JldHVybiBhIT09ITEmJihhPWF8fFwiZnhcIiksdGhpcy5lYWNoKGZ1bmN0aW9uKCl7dmFyIGIsYz1MLmdldCh0aGlzKSxkPWNbYStcInF1ZXVlXCJdLGU9Y1thK1wicXVldWVIb29rc1wiXSxmPW4udGltZXJzLGc9ZD9kLmxlbmd0aDowO2ZvcihjLmZpbmlzaD0hMCxuLnF1ZXVlKHRoaXMsYSxbXSksZSYmZS5zdG9wJiZlLnN0b3AuY2FsbCh0aGlzLCEwKSxiPWYubGVuZ3RoO2ItLTspZltiXS5lbGVtPT09dGhpcyYmZltiXS5xdWV1ZT09PWEmJihmW2JdLmFuaW0uc3RvcCghMCksZi5zcGxpY2UoYiwxKSk7Zm9yKGI9MDtnPmI7YisrKWRbYl0mJmRbYl0uZmluaXNoJiZkW2JdLmZpbmlzaC5jYWxsKHRoaXMpO2RlbGV0ZSBjLmZpbmlzaH0pfX0pLG4uZWFjaChbXCJ0b2dnbGVcIixcInNob3dcIixcImhpZGVcIl0sZnVuY3Rpb24oYSxiKXt2YXIgYz1uLmZuW2JdO24uZm5bYl09ZnVuY3Rpb24oYSxkLGUpe3JldHVybiBudWxsPT1hfHxcImJvb2xlYW5cIj09dHlwZW9mIGE/Yy5hcHBseSh0aGlzLGFyZ3VtZW50cyk6dGhpcy5hbmltYXRlKFRiKGIsITApLGEsZCxlKX19KSxuLmVhY2goe3NsaWRlRG93bjpUYihcInNob3dcIiksc2xpZGVVcDpUYihcImhpZGVcIiksc2xpZGVUb2dnbGU6VGIoXCJ0b2dnbGVcIiksZmFkZUluOntvcGFjaXR5Olwic2hvd1wifSxmYWRlT3V0OntvcGFjaXR5OlwiaGlkZVwifSxmYWRlVG9nZ2xlOntvcGFjaXR5OlwidG9nZ2xlXCJ9fSxmdW5jdGlvbihhLGIpe24uZm5bYV09ZnVuY3Rpb24oYSxjLGQpe3JldHVybiB0aGlzLmFuaW1hdGUoYixhLGMsZCl9fSksbi50aW1lcnM9W10sbi5meC50aWNrPWZ1bmN0aW9uKCl7dmFyIGEsYj0wLGM9bi50aW1lcnM7Zm9yKExiPW4ubm93KCk7YjxjLmxlbmd0aDtiKyspYT1jW2JdLGEoKXx8Y1tiXSE9PWF8fGMuc3BsaWNlKGItLSwxKTtjLmxlbmd0aHx8bi5meC5zdG9wKCksTGI9dm9pZCAwfSxuLmZ4LnRpbWVyPWZ1bmN0aW9uKGEpe24udGltZXJzLnB1c2goYSksYSgpP24uZnguc3RhcnQoKTpuLnRpbWVycy5wb3AoKX0sbi5meC5pbnRlcnZhbD0xMyxuLmZ4LnN0YXJ0PWZ1bmN0aW9uKCl7TWJ8fChNYj1zZXRJbnRlcnZhbChuLmZ4LnRpY2ssbi5meC5pbnRlcnZhbCkpfSxuLmZ4LnN0b3A9ZnVuY3Rpb24oKXtjbGVhckludGVydmFsKE1iKSxNYj1udWxsfSxuLmZ4LnNwZWVkcz17c2xvdzo2MDAsZmFzdDoyMDAsX2RlZmF1bHQ6NDAwfSxuLmZuLmRlbGF5PWZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9bi5meD9uLmZ4LnNwZWVkc1thXXx8YTphLGI9Ynx8XCJmeFwiLHRoaXMucXVldWUoYixmdW5jdGlvbihiLGMpe3ZhciBkPXNldFRpbWVvdXQoYixhKTtjLnN0b3A9ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQoZCl9fSl9LGZ1bmN0aW9uKCl7dmFyIGE9bC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksYj1sLmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIiksYz1iLmFwcGVuZENoaWxkKGwuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKSk7YS50eXBlPVwiY2hlY2tib3hcIixrLmNoZWNrT249XCJcIiE9PWEudmFsdWUsay5vcHRTZWxlY3RlZD1jLnNlbGVjdGVkLGIuZGlzYWJsZWQ9ITAsay5vcHREaXNhYmxlZD0hYy5kaXNhYmxlZCxhPWwuY3JlYXRlRWxlbWVudChcImlucHV0XCIpLGEudmFsdWU9XCJ0XCIsYS50eXBlPVwicmFkaW9cIixrLnJhZGlvVmFsdWU9XCJ0XCI9PT1hLnZhbHVlfSgpO3ZhciBZYixaYiwkYj1uLmV4cHIuYXR0ckhhbmRsZTtuLmZuLmV4dGVuZCh7YXR0cjpmdW5jdGlvbihhLGIpe3JldHVybiBKKHRoaXMsbi5hdHRyLGEsYixhcmd1bWVudHMubGVuZ3RoPjEpfSxyZW1vdmVBdHRyOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtuLnJlbW92ZUF0dHIodGhpcyxhKX0pfX0pLG4uZXh0ZW5kKHthdHRyOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGY9YS5ub2RlVHlwZTtpZihhJiYzIT09ZiYmOCE9PWYmJjIhPT1mKXJldHVybiB0eXBlb2YgYS5nZXRBdHRyaWJ1dGU9PT1VP24ucHJvcChhLGIsYyk6KDE9PT1mJiZuLmlzWE1MRG9jKGEpfHwoYj1iLnRvTG93ZXJDYXNlKCksZD1uLmF0dHJIb29rc1tiXXx8KG4uZXhwci5tYXRjaC5ib29sLnRlc3QoYik/WmI6WWIpKSx2b2lkIDA9PT1jP2QmJlwiZ2V0XCJpbiBkJiZudWxsIT09KGU9ZC5nZXQoYSxiKSk/ZTooZT1uLmZpbmQuYXR0cihhLGIpLG51bGw9PWU/dm9pZCAwOmUpOm51bGwhPT1jP2QmJlwic2V0XCJpbiBkJiZ2b2lkIDAhPT0oZT1kLnNldChhLGMsYikpP2U6KGEuc2V0QXR0cmlidXRlKGIsYytcIlwiKSxjKTp2b2lkIG4ucmVtb3ZlQXR0cihhLGIpKVxufSxyZW1vdmVBdHRyOmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlPTAsZj1iJiZiLm1hdGNoKEUpO2lmKGYmJjE9PT1hLm5vZGVUeXBlKXdoaWxlKGM9ZltlKytdKWQ9bi5wcm9wRml4W2NdfHxjLG4uZXhwci5tYXRjaC5ib29sLnRlc3QoYykmJihhW2RdPSExKSxhLnJlbW92ZUF0dHJpYnV0ZShjKX0sYXR0ckhvb2tzOnt0eXBlOntzZXQ6ZnVuY3Rpb24oYSxiKXtpZighay5yYWRpb1ZhbHVlJiZcInJhZGlvXCI9PT1iJiZuLm5vZGVOYW1lKGEsXCJpbnB1dFwiKSl7dmFyIGM9YS52YWx1ZTtyZXR1cm4gYS5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsYiksYyYmKGEudmFsdWU9YyksYn19fX19KSxaYj17c2V0OmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gYj09PSExP24ucmVtb3ZlQXR0cihhLGMpOmEuc2V0QXR0cmlidXRlKGMsYyksY319LG4uZWFjaChuLmV4cHIubWF0Y2guYm9vbC5zb3VyY2UubWF0Y2goL1xcdysvZyksZnVuY3Rpb24oYSxiKXt2YXIgYz0kYltiXXx8bi5maW5kLmF0dHI7JGJbYl09ZnVuY3Rpb24oYSxiLGQpe3ZhciBlLGY7cmV0dXJuIGR8fChmPSRiW2JdLCRiW2JdPWUsZT1udWxsIT1jKGEsYixkKT9iLnRvTG93ZXJDYXNlKCk6bnVsbCwkYltiXT1mKSxlfX0pO3ZhciBfYj0vXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b24pJC9pO24uZm4uZXh0ZW5kKHtwcm9wOmZ1bmN0aW9uKGEsYil7cmV0dXJuIEoodGhpcyxuLnByb3AsYSxiLGFyZ3VtZW50cy5sZW5ndGg+MSl9LHJlbW92ZVByb3A6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpe2RlbGV0ZSB0aGlzW24ucHJvcEZpeFthXXx8YV19KX19KSxuLmV4dGVuZCh7cHJvcEZpeDp7XCJmb3JcIjpcImh0bWxGb3JcIixcImNsYXNzXCI6XCJjbGFzc05hbWVcIn0scHJvcDpmdW5jdGlvbihhLGIsYyl7dmFyIGQsZSxmLGc9YS5ub2RlVHlwZTtpZihhJiYzIT09ZyYmOCE9PWcmJjIhPT1nKXJldHVybiBmPTEhPT1nfHwhbi5pc1hNTERvYyhhKSxmJiYoYj1uLnByb3BGaXhbYl18fGIsZT1uLnByb3BIb29rc1tiXSksdm9pZCAwIT09Yz9lJiZcInNldFwiaW4gZSYmdm9pZCAwIT09KGQ9ZS5zZXQoYSxjLGIpKT9kOmFbYl09YzplJiZcImdldFwiaW4gZSYmbnVsbCE9PShkPWUuZ2V0KGEsYikpP2Q6YVtiXX0scHJvcEhvb2tzOnt0YWJJbmRleDp7Z2V0OmZ1bmN0aW9uKGEpe3JldHVybiBhLmhhc0F0dHJpYnV0ZShcInRhYmluZGV4XCIpfHxfYi50ZXN0KGEubm9kZU5hbWUpfHxhLmhyZWY/YS50YWJJbmRleDotMX19fX0pLGsub3B0U2VsZWN0ZWR8fChuLnByb3BIb29rcy5zZWxlY3RlZD17Z2V0OmZ1bmN0aW9uKGEpe3ZhciBiPWEucGFyZW50Tm9kZTtyZXR1cm4gYiYmYi5wYXJlbnROb2RlJiZiLnBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCxudWxsfX0pLG4uZWFjaChbXCJ0YWJJbmRleFwiLFwicmVhZE9ubHlcIixcIm1heExlbmd0aFwiLFwiY2VsbFNwYWNpbmdcIixcImNlbGxQYWRkaW5nXCIsXCJyb3dTcGFuXCIsXCJjb2xTcGFuXCIsXCJ1c2VNYXBcIixcImZyYW1lQm9yZGVyXCIsXCJjb250ZW50RWRpdGFibGVcIl0sZnVuY3Rpb24oKXtuLnByb3BGaXhbdGhpcy50b0xvd2VyQ2FzZSgpXT10aGlzfSk7dmFyIGFjPS9bXFx0XFxyXFxuXFxmXS9nO24uZm4uZXh0ZW5kKHthZGRDbGFzczpmdW5jdGlvbihhKXt2YXIgYixjLGQsZSxmLGcsaD1cInN0cmluZ1wiPT10eXBlb2YgYSYmYSxpPTAsaj10aGlzLmxlbmd0aDtpZihuLmlzRnVuY3Rpb24oYSkpcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihiKXtuKHRoaXMpLmFkZENsYXNzKGEuY2FsbCh0aGlzLGIsdGhpcy5jbGFzc05hbWUpKX0pO2lmKGgpZm9yKGI9KGF8fFwiXCIpLm1hdGNoKEUpfHxbXTtqPmk7aSsrKWlmKGM9dGhpc1tpXSxkPTE9PT1jLm5vZGVUeXBlJiYoYy5jbGFzc05hbWU/KFwiIFwiK2MuY2xhc3NOYW1lK1wiIFwiKS5yZXBsYWNlKGFjLFwiIFwiKTpcIiBcIikpe2Y9MDt3aGlsZShlPWJbZisrXSlkLmluZGV4T2YoXCIgXCIrZStcIiBcIik8MCYmKGQrPWUrXCIgXCIpO2c9bi50cmltKGQpLGMuY2xhc3NOYW1lIT09ZyYmKGMuY2xhc3NOYW1lPWcpfXJldHVybiB0aGlzfSxyZW1vdmVDbGFzczpmdW5jdGlvbihhKXt2YXIgYixjLGQsZSxmLGcsaD0wPT09YXJndW1lbnRzLmxlbmd0aHx8XCJzdHJpbmdcIj09dHlwZW9mIGEmJmEsaT0wLGo9dGhpcy5sZW5ndGg7aWYobi5pc0Z1bmN0aW9uKGEpKXJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oYil7bih0aGlzKS5yZW1vdmVDbGFzcyhhLmNhbGwodGhpcyxiLHRoaXMuY2xhc3NOYW1lKSl9KTtpZihoKWZvcihiPShhfHxcIlwiKS5tYXRjaChFKXx8W107aj5pO2krKylpZihjPXRoaXNbaV0sZD0xPT09Yy5ub2RlVHlwZSYmKGMuY2xhc3NOYW1lPyhcIiBcIitjLmNsYXNzTmFtZStcIiBcIikucmVwbGFjZShhYyxcIiBcIik6XCJcIikpe2Y9MDt3aGlsZShlPWJbZisrXSl3aGlsZShkLmluZGV4T2YoXCIgXCIrZStcIiBcIik+PTApZD1kLnJlcGxhY2UoXCIgXCIrZStcIiBcIixcIiBcIik7Zz1hP24udHJpbShkKTpcIlwiLGMuY2xhc3NOYW1lIT09ZyYmKGMuY2xhc3NOYW1lPWcpfXJldHVybiB0aGlzfSx0b2dnbGVDbGFzczpmdW5jdGlvbihhLGIpe3ZhciBjPXR5cGVvZiBhO3JldHVyblwiYm9vbGVhblwiPT10eXBlb2YgYiYmXCJzdHJpbmdcIj09PWM/Yj90aGlzLmFkZENsYXNzKGEpOnRoaXMucmVtb3ZlQ2xhc3MoYSk6dGhpcy5lYWNoKG4uaXNGdW5jdGlvbihhKT9mdW5jdGlvbihjKXtuKHRoaXMpLnRvZ2dsZUNsYXNzKGEuY2FsbCh0aGlzLGMsdGhpcy5jbGFzc05hbWUsYiksYil9OmZ1bmN0aW9uKCl7aWYoXCJzdHJpbmdcIj09PWMpe3ZhciBiLGQ9MCxlPW4odGhpcyksZj1hLm1hdGNoKEUpfHxbXTt3aGlsZShiPWZbZCsrXSllLmhhc0NsYXNzKGIpP2UucmVtb3ZlQ2xhc3MoYik6ZS5hZGRDbGFzcyhiKX1lbHNlKGM9PT1VfHxcImJvb2xlYW5cIj09PWMpJiYodGhpcy5jbGFzc05hbWUmJkwuc2V0KHRoaXMsXCJfX2NsYXNzTmFtZV9fXCIsdGhpcy5jbGFzc05hbWUpLHRoaXMuY2xhc3NOYW1lPXRoaXMuY2xhc3NOYW1lfHxhPT09ITE/XCJcIjpMLmdldCh0aGlzLFwiX19jbGFzc05hbWVfX1wiKXx8XCJcIil9KX0saGFzQ2xhc3M6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPVwiIFwiK2ErXCIgXCIsYz0wLGQ9dGhpcy5sZW5ndGg7ZD5jO2MrKylpZigxPT09dGhpc1tjXS5ub2RlVHlwZSYmKFwiIFwiK3RoaXNbY10uY2xhc3NOYW1lK1wiIFwiKS5yZXBsYWNlKGFjLFwiIFwiKS5pbmRleE9mKGIpPj0wKXJldHVybiEwO3JldHVybiExfX0pO3ZhciBiYz0vXFxyL2c7bi5mbi5leHRlbmQoe3ZhbDpmdW5jdGlvbihhKXt2YXIgYixjLGQsZT10aGlzWzBdO3tpZihhcmd1bWVudHMubGVuZ3RoKXJldHVybiBkPW4uaXNGdW5jdGlvbihhKSx0aGlzLmVhY2goZnVuY3Rpb24oYyl7dmFyIGU7MT09PXRoaXMubm9kZVR5cGUmJihlPWQ/YS5jYWxsKHRoaXMsYyxuKHRoaXMpLnZhbCgpKTphLG51bGw9PWU/ZT1cIlwiOlwibnVtYmVyXCI9PXR5cGVvZiBlP2UrPVwiXCI6bi5pc0FycmF5KGUpJiYoZT1uLm1hcChlLGZ1bmN0aW9uKGEpe3JldHVybiBudWxsPT1hP1wiXCI6YStcIlwifSkpLGI9bi52YWxIb29rc1t0aGlzLnR5cGVdfHxuLnZhbEhvb2tzW3RoaXMubm9kZU5hbWUudG9Mb3dlckNhc2UoKV0sYiYmXCJzZXRcImluIGImJnZvaWQgMCE9PWIuc2V0KHRoaXMsZSxcInZhbHVlXCIpfHwodGhpcy52YWx1ZT1lKSl9KTtpZihlKXJldHVybiBiPW4udmFsSG9va3NbZS50eXBlXXx8bi52YWxIb29rc1tlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCldLGImJlwiZ2V0XCJpbiBiJiZ2b2lkIDAhPT0oYz1iLmdldChlLFwidmFsdWVcIikpP2M6KGM9ZS52YWx1ZSxcInN0cmluZ1wiPT10eXBlb2YgYz9jLnJlcGxhY2UoYmMsXCJcIik6bnVsbD09Yz9cIlwiOmMpfX19KSxuLmV4dGVuZCh7dmFsSG9va3M6e29wdGlvbjp7Z2V0OmZ1bmN0aW9uKGEpe3ZhciBiPW4uZmluZC5hdHRyKGEsXCJ2YWx1ZVwiKTtyZXR1cm4gbnVsbCE9Yj9iOm4udHJpbShuLnRleHQoYSkpfX0sc2VsZWN0OntnZXQ6ZnVuY3Rpb24oYSl7Zm9yKHZhciBiLGMsZD1hLm9wdGlvbnMsZT1hLnNlbGVjdGVkSW5kZXgsZj1cInNlbGVjdC1vbmVcIj09PWEudHlwZXx8MD5lLGc9Zj9udWxsOltdLGg9Zj9lKzE6ZC5sZW5ndGgsaT0wPmU/aDpmP2U6MDtoPmk7aSsrKWlmKGM9ZFtpXSwhKCFjLnNlbGVjdGVkJiZpIT09ZXx8KGsub3B0RGlzYWJsZWQ/Yy5kaXNhYmxlZDpudWxsIT09Yy5nZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKSl8fGMucGFyZW50Tm9kZS5kaXNhYmxlZCYmbi5ub2RlTmFtZShjLnBhcmVudE5vZGUsXCJvcHRncm91cFwiKSkpe2lmKGI9bihjKS52YWwoKSxmKXJldHVybiBiO2cucHVzaChiKX1yZXR1cm4gZ30sc2V0OmZ1bmN0aW9uKGEsYil7dmFyIGMsZCxlPWEub3B0aW9ucyxmPW4ubWFrZUFycmF5KGIpLGc9ZS5sZW5ndGg7d2hpbGUoZy0tKWQ9ZVtnXSwoZC5zZWxlY3RlZD1uLmluQXJyYXkoZC52YWx1ZSxmKT49MCkmJihjPSEwKTtyZXR1cm4gY3x8KGEuc2VsZWN0ZWRJbmRleD0tMSksZn19fX0pLG4uZWFjaChbXCJyYWRpb1wiLFwiY2hlY2tib3hcIl0sZnVuY3Rpb24oKXtuLnZhbEhvb2tzW3RoaXNdPXtzZXQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbi5pc0FycmF5KGIpP2EuY2hlY2tlZD1uLmluQXJyYXkobihhKS52YWwoKSxiKT49MDp2b2lkIDB9fSxrLmNoZWNrT258fChuLnZhbEhvb2tzW3RoaXNdLmdldD1mdW5jdGlvbihhKXtyZXR1cm4gbnVsbD09PWEuZ2V0QXR0cmlidXRlKFwidmFsdWVcIik/XCJvblwiOmEudmFsdWV9KX0pLG4uZWFjaChcImJsdXIgZm9jdXMgZm9jdXNpbiBmb2N1c291dCBsb2FkIHJlc2l6ZSBzY3JvbGwgdW5sb2FkIGNsaWNrIGRibGNsaWNrIG1vdXNlZG93biBtb3VzZXVwIG1vdXNlbW92ZSBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2VlbnRlciBtb3VzZWxlYXZlIGNoYW5nZSBzZWxlY3Qgc3VibWl0IGtleWRvd24ga2V5cHJlc3Mga2V5dXAgZXJyb3IgY29udGV4dG1lbnVcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oYSxiKXtuLmZuW2JdPWZ1bmN0aW9uKGEsYyl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg+MD90aGlzLm9uKGIsbnVsbCxhLGMpOnRoaXMudHJpZ2dlcihiKX19KSxuLmZuLmV4dGVuZCh7aG92ZXI6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5tb3VzZWVudGVyKGEpLm1vdXNlbGVhdmUoYnx8YSl9LGJpbmQ6ZnVuY3Rpb24oYSxiLGMpe3JldHVybiB0aGlzLm9uKGEsbnVsbCxiLGMpfSx1bmJpbmQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gdGhpcy5vZmYoYSxudWxsLGIpfSxkZWxlZ2F0ZTpmdW5jdGlvbihhLGIsYyxkKXtyZXR1cm4gdGhpcy5vbihiLGEsYyxkKX0sdW5kZWxlZ2F0ZTpmdW5jdGlvbihhLGIsYyl7cmV0dXJuIDE9PT1hcmd1bWVudHMubGVuZ3RoP3RoaXMub2ZmKGEsXCIqKlwiKTp0aGlzLm9mZihiLGF8fFwiKipcIixjKX19KTt2YXIgY2M9bi5ub3coKSxkYz0vXFw/LztuLnBhcnNlSlNPTj1mdW5jdGlvbihhKXtyZXR1cm4gSlNPTi5wYXJzZShhK1wiXCIpfSxuLnBhcnNlWE1MPWZ1bmN0aW9uKGEpe3ZhciBiLGM7aWYoIWF8fFwic3RyaW5nXCIhPXR5cGVvZiBhKXJldHVybiBudWxsO3RyeXtjPW5ldyBET01QYXJzZXIsYj1jLnBhcnNlRnJvbVN0cmluZyhhLFwidGV4dC94bWxcIil9Y2F0Y2goZCl7Yj12b2lkIDB9cmV0dXJuKCFifHxiLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicGFyc2VyZXJyb3JcIikubGVuZ3RoKSYmbi5lcnJvcihcIkludmFsaWQgWE1MOiBcIithKSxifTt2YXIgZWMsZmMsZ2M9LyMuKiQvLGhjPS8oWz8mXSlfPVteJl0qLyxpYz0vXiguKj8pOlsgXFx0XSooW15cXHJcXG5dKikkL2dtLGpjPS9eKD86YWJvdXR8YXBwfGFwcC1zdG9yYWdlfC4rLWV4dGVuc2lvbnxmaWxlfHJlc3x3aWRnZXQpOiQvLGtjPS9eKD86R0VUfEhFQUQpJC8sbGM9L15cXC9cXC8vLG1jPS9eKFtcXHcuKy1dKzopKD86XFwvXFwvKD86W15cXC8/I10qQHwpKFteXFwvPyM6XSopKD86OihcXGQrKXwpfCkvLG5jPXt9LG9jPXt9LHBjPVwiKi9cIi5jb25jYXQoXCIqXCIpO3RyeXtmYz1sb2NhdGlvbi5ocmVmfWNhdGNoKHFjKXtmYz1sLmNyZWF0ZUVsZW1lbnQoXCJhXCIpLGZjLmhyZWY9XCJcIixmYz1mYy5ocmVmfWVjPW1jLmV4ZWMoZmMudG9Mb3dlckNhc2UoKSl8fFtdO2Z1bmN0aW9uIHJjKGEpe3JldHVybiBmdW5jdGlvbihiLGMpe1wic3RyaW5nXCIhPXR5cGVvZiBiJiYoYz1iLGI9XCIqXCIpO3ZhciBkLGU9MCxmPWIudG9Mb3dlckNhc2UoKS5tYXRjaChFKXx8W107aWYobi5pc0Z1bmN0aW9uKGMpKXdoaWxlKGQ9ZltlKytdKVwiK1wiPT09ZFswXT8oZD1kLnNsaWNlKDEpfHxcIipcIiwoYVtkXT1hW2RdfHxbXSkudW5zaGlmdChjKSk6KGFbZF09YVtkXXx8W10pLnB1c2goYyl9fWZ1bmN0aW9uIHNjKGEsYixjLGQpe3ZhciBlPXt9LGY9YT09PW9jO2Z1bmN0aW9uIGcoaCl7dmFyIGk7cmV0dXJuIGVbaF09ITAsbi5lYWNoKGFbaF18fFtdLGZ1bmN0aW9uKGEsaCl7dmFyIGo9aChiLGMsZCk7cmV0dXJuXCJzdHJpbmdcIiE9dHlwZW9mIGp8fGZ8fGVbal0/Zj8hKGk9aik6dm9pZCAwOihiLmRhdGFUeXBlcy51bnNoaWZ0KGopLGcoaiksITEpfSksaX1yZXR1cm4gZyhiLmRhdGFUeXBlc1swXSl8fCFlW1wiKlwiXSYmZyhcIipcIil9ZnVuY3Rpb24gdGMoYSxiKXt2YXIgYyxkLGU9bi5hamF4U2V0dGluZ3MuZmxhdE9wdGlvbnN8fHt9O2ZvcihjIGluIGIpdm9pZCAwIT09YltjXSYmKChlW2NdP2E6ZHx8KGQ9e30pKVtjXT1iW2NdKTtyZXR1cm4gZCYmbi5leHRlbmQoITAsYSxkKSxhfWZ1bmN0aW9uIHVjKGEsYixjKXt2YXIgZCxlLGYsZyxoPWEuY29udGVudHMsaT1hLmRhdGFUeXBlczt3aGlsZShcIipcIj09PWlbMF0paS5zaGlmdCgpLHZvaWQgMD09PWQmJihkPWEubWltZVR5cGV8fGIuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIikpO2lmKGQpZm9yKGUgaW4gaClpZihoW2VdJiZoW2VdLnRlc3QoZCkpe2kudW5zaGlmdChlKTticmVha31pZihpWzBdaW4gYylmPWlbMF07ZWxzZXtmb3IoZSBpbiBjKXtpZighaVswXXx8YS5jb252ZXJ0ZXJzW2UrXCIgXCIraVswXV0pe2Y9ZTticmVha31nfHwoZz1lKX1mPWZ8fGd9cmV0dXJuIGY/KGYhPT1pWzBdJiZpLnVuc2hpZnQoZiksY1tmXSk6dm9pZCAwfWZ1bmN0aW9uIHZjKGEsYixjLGQpe3ZhciBlLGYsZyxoLGksaj17fSxrPWEuZGF0YVR5cGVzLnNsaWNlKCk7aWYoa1sxXSlmb3IoZyBpbiBhLmNvbnZlcnRlcnMpaltnLnRvTG93ZXJDYXNlKCldPWEuY29udmVydGVyc1tnXTtmPWsuc2hpZnQoKTt3aGlsZShmKWlmKGEucmVzcG9uc2VGaWVsZHNbZl0mJihjW2EucmVzcG9uc2VGaWVsZHNbZl1dPWIpLCFpJiZkJiZhLmRhdGFGaWx0ZXImJihiPWEuZGF0YUZpbHRlcihiLGEuZGF0YVR5cGUpKSxpPWYsZj1rLnNoaWZ0KCkpaWYoXCIqXCI9PT1mKWY9aTtlbHNlIGlmKFwiKlwiIT09aSYmaSE9PWYpe2lmKGc9altpK1wiIFwiK2ZdfHxqW1wiKiBcIitmXSwhZylmb3IoZSBpbiBqKWlmKGg9ZS5zcGxpdChcIiBcIiksaFsxXT09PWYmJihnPWpbaStcIiBcIitoWzBdXXx8altcIiogXCIraFswXV0pKXtnPT09ITA/Zz1qW2VdOmpbZV0hPT0hMCYmKGY9aFswXSxrLnVuc2hpZnQoaFsxXSkpO2JyZWFrfWlmKGchPT0hMClpZihnJiZhW1widGhyb3dzXCJdKWI9ZyhiKTtlbHNlIHRyeXtiPWcoYil9Y2F0Y2gobCl7cmV0dXJue3N0YXRlOlwicGFyc2VyZXJyb3JcIixlcnJvcjpnP2w6XCJObyBjb252ZXJzaW9uIGZyb20gXCIraStcIiB0byBcIitmfX19cmV0dXJue3N0YXRlOlwic3VjY2Vzc1wiLGRhdGE6Yn19bi5leHRlbmQoe2FjdGl2ZTowLGxhc3RNb2RpZmllZDp7fSxldGFnOnt9LGFqYXhTZXR0aW5nczp7dXJsOmZjLHR5cGU6XCJHRVRcIixpc0xvY2FsOmpjLnRlc3QoZWNbMV0pLGdsb2JhbDohMCxwcm9jZXNzRGF0YTohMCxhc3luYzohMCxjb250ZW50VHlwZTpcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiLGFjY2VwdHM6e1wiKlwiOnBjLHRleHQ6XCJ0ZXh0L3BsYWluXCIsaHRtbDpcInRleHQvaHRtbFwiLHhtbDpcImFwcGxpY2F0aW9uL3htbCwgdGV4dC94bWxcIixqc29uOlwiYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0XCJ9LGNvbnRlbnRzOnt4bWw6L3htbC8saHRtbDovaHRtbC8sanNvbjovanNvbi99LHJlc3BvbnNlRmllbGRzOnt4bWw6XCJyZXNwb25zZVhNTFwiLHRleHQ6XCJyZXNwb25zZVRleHRcIixqc29uOlwicmVzcG9uc2VKU09OXCJ9LGNvbnZlcnRlcnM6e1wiKiB0ZXh0XCI6U3RyaW5nLFwidGV4dCBodG1sXCI6ITAsXCJ0ZXh0IGpzb25cIjpuLnBhcnNlSlNPTixcInRleHQgeG1sXCI6bi5wYXJzZVhNTH0sZmxhdE9wdGlvbnM6e3VybDohMCxjb250ZXh0OiEwfX0sYWpheFNldHVwOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGI/dGModGMoYSxuLmFqYXhTZXR0aW5ncyksYik6dGMobi5hamF4U2V0dGluZ3MsYSl9LGFqYXhQcmVmaWx0ZXI6cmMobmMpLGFqYXhUcmFuc3BvcnQ6cmMob2MpLGFqYXg6ZnVuY3Rpb24oYSxiKXtcIm9iamVjdFwiPT10eXBlb2YgYSYmKGI9YSxhPXZvaWQgMCksYj1ifHx7fTt2YXIgYyxkLGUsZixnLGgsaSxqLGs9bi5hamF4U2V0dXAoe30sYiksbD1rLmNvbnRleHR8fGssbT1rLmNvbnRleHQmJihsLm5vZGVUeXBlfHxsLmpxdWVyeSk/bihsKTpuLmV2ZW50LG89bi5EZWZlcnJlZCgpLHA9bi5DYWxsYmFja3MoXCJvbmNlIG1lbW9yeVwiKSxxPWsuc3RhdHVzQ29kZXx8e30scj17fSxzPXt9LHQ9MCx1PVwiY2FuY2VsZWRcIix2PXtyZWFkeVN0YXRlOjAsZ2V0UmVzcG9uc2VIZWFkZXI6ZnVuY3Rpb24oYSl7dmFyIGI7aWYoMj09PXQpe2lmKCFmKXtmPXt9O3doaWxlKGI9aWMuZXhlYyhlKSlmW2JbMV0udG9Mb3dlckNhc2UoKV09YlsyXX1iPWZbYS50b0xvd2VyQ2FzZSgpXX1yZXR1cm4gbnVsbD09Yj9udWxsOmJ9LGdldEFsbFJlc3BvbnNlSGVhZGVyczpmdW5jdGlvbigpe3JldHVybiAyPT09dD9lOm51bGx9LHNldFJlcXVlc3RIZWFkZXI6ZnVuY3Rpb24oYSxiKXt2YXIgYz1hLnRvTG93ZXJDYXNlKCk7cmV0dXJuIHR8fChhPXNbY109c1tjXXx8YSxyW2FdPWIpLHRoaXN9LG92ZXJyaWRlTWltZVR5cGU6ZnVuY3Rpb24oYSl7cmV0dXJuIHR8fChrLm1pbWVUeXBlPWEpLHRoaXN9LHN0YXR1c0NvZGU6ZnVuY3Rpb24oYSl7dmFyIGI7aWYoYSlpZigyPnQpZm9yKGIgaW4gYSlxW2JdPVtxW2JdLGFbYl1dO2Vsc2Ugdi5hbHdheXMoYVt2LnN0YXR1c10pO3JldHVybiB0aGlzfSxhYm9ydDpmdW5jdGlvbihhKXt2YXIgYj1hfHx1O3JldHVybiBjJiZjLmFib3J0KGIpLHgoMCxiKSx0aGlzfX07aWYoby5wcm9taXNlKHYpLmNvbXBsZXRlPXAuYWRkLHYuc3VjY2Vzcz12LmRvbmUsdi5lcnJvcj12LmZhaWwsay51cmw9KChhfHxrLnVybHx8ZmMpK1wiXCIpLnJlcGxhY2UoZ2MsXCJcIikucmVwbGFjZShsYyxlY1sxXStcIi8vXCIpLGsudHlwZT1iLm1ldGhvZHx8Yi50eXBlfHxrLm1ldGhvZHx8ay50eXBlLGsuZGF0YVR5cGVzPW4udHJpbShrLmRhdGFUeXBlfHxcIipcIikudG9Mb3dlckNhc2UoKS5tYXRjaChFKXx8W1wiXCJdLG51bGw9PWsuY3Jvc3NEb21haW4mJihoPW1jLmV4ZWMoay51cmwudG9Mb3dlckNhc2UoKSksay5jcm9zc0RvbWFpbj0hKCFofHxoWzFdPT09ZWNbMV0mJmhbMl09PT1lY1syXSYmKGhbM118fChcImh0dHA6XCI9PT1oWzFdP1wiODBcIjpcIjQ0M1wiKSk9PT0oZWNbM118fChcImh0dHA6XCI9PT1lY1sxXT9cIjgwXCI6XCI0NDNcIikpKSksay5kYXRhJiZrLnByb2Nlc3NEYXRhJiZcInN0cmluZ1wiIT10eXBlb2Ygay5kYXRhJiYoay5kYXRhPW4ucGFyYW0oay5kYXRhLGsudHJhZGl0aW9uYWwpKSxzYyhuYyxrLGIsdiksMj09PXQpcmV0dXJuIHY7aT1rLmdsb2JhbCxpJiYwPT09bi5hY3RpdmUrKyYmbi5ldmVudC50cmlnZ2VyKFwiYWpheFN0YXJ0XCIpLGsudHlwZT1rLnR5cGUudG9VcHBlckNhc2UoKSxrLmhhc0NvbnRlbnQ9IWtjLnRlc3Qoay50eXBlKSxkPWsudXJsLGsuaGFzQ29udGVudHx8KGsuZGF0YSYmKGQ9ay51cmwrPShkYy50ZXN0KGQpP1wiJlwiOlwiP1wiKStrLmRhdGEsZGVsZXRlIGsuZGF0YSksay5jYWNoZT09PSExJiYoay51cmw9aGMudGVzdChkKT9kLnJlcGxhY2UoaGMsXCIkMV89XCIrY2MrKyk6ZCsoZGMudGVzdChkKT9cIiZcIjpcIj9cIikrXCJfPVwiK2NjKyspKSxrLmlmTW9kaWZpZWQmJihuLmxhc3RNb2RpZmllZFtkXSYmdi5zZXRSZXF1ZXN0SGVhZGVyKFwiSWYtTW9kaWZpZWQtU2luY2VcIixuLmxhc3RNb2RpZmllZFtkXSksbi5ldGFnW2RdJiZ2LnNldFJlcXVlc3RIZWFkZXIoXCJJZi1Ob25lLU1hdGNoXCIsbi5ldGFnW2RdKSksKGsuZGF0YSYmay5oYXNDb250ZW50JiZrLmNvbnRlbnRUeXBlIT09ITF8fGIuY29udGVudFR5cGUpJiZ2LnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIixrLmNvbnRlbnRUeXBlKSx2LnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIixrLmRhdGFUeXBlc1swXSYmay5hY2NlcHRzW2suZGF0YVR5cGVzWzBdXT9rLmFjY2VwdHNbay5kYXRhVHlwZXNbMF1dKyhcIipcIiE9PWsuZGF0YVR5cGVzWzBdP1wiLCBcIitwYytcIjsgcT0wLjAxXCI6XCJcIik6ay5hY2NlcHRzW1wiKlwiXSk7Zm9yKGogaW4gay5oZWFkZXJzKXYuc2V0UmVxdWVzdEhlYWRlcihqLGsuaGVhZGVyc1tqXSk7aWYoay5iZWZvcmVTZW5kJiYoay5iZWZvcmVTZW5kLmNhbGwobCx2LGspPT09ITF8fDI9PT10KSlyZXR1cm4gdi5hYm9ydCgpO3U9XCJhYm9ydFwiO2ZvcihqIGlue3N1Y2Nlc3M6MSxlcnJvcjoxLGNvbXBsZXRlOjF9KXZbal0oa1tqXSk7aWYoYz1zYyhvYyxrLGIsdikpe3YucmVhZHlTdGF0ZT0xLGkmJm0udHJpZ2dlcihcImFqYXhTZW5kXCIsW3Ysa10pLGsuYXN5bmMmJmsudGltZW91dD4wJiYoZz1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7di5hYm9ydChcInRpbWVvdXRcIil9LGsudGltZW91dCkpO3RyeXt0PTEsYy5zZW5kKHIseCl9Y2F0Y2godyl7aWYoISgyPnQpKXRocm93IHc7eCgtMSx3KX19ZWxzZSB4KC0xLFwiTm8gVHJhbnNwb3J0XCIpO2Z1bmN0aW9uIHgoYSxiLGYsaCl7dmFyIGoscixzLHUsdyx4PWI7MiE9PXQmJih0PTIsZyYmY2xlYXJUaW1lb3V0KGcpLGM9dm9pZCAwLGU9aHx8XCJcIix2LnJlYWR5U3RhdGU9YT4wPzQ6MCxqPWE+PTIwMCYmMzAwPmF8fDMwND09PWEsZiYmKHU9dWMoayx2LGYpKSx1PXZjKGssdSx2LGopLGo/KGsuaWZNb2RpZmllZCYmKHc9di5nZXRSZXNwb25zZUhlYWRlcihcIkxhc3QtTW9kaWZpZWRcIiksdyYmKG4ubGFzdE1vZGlmaWVkW2RdPXcpLHc9di5nZXRSZXNwb25zZUhlYWRlcihcImV0YWdcIiksdyYmKG4uZXRhZ1tkXT13KSksMjA0PT09YXx8XCJIRUFEXCI9PT1rLnR5cGU/eD1cIm5vY29udGVudFwiOjMwND09PWE/eD1cIm5vdG1vZGlmaWVkXCI6KHg9dS5zdGF0ZSxyPXUuZGF0YSxzPXUuZXJyb3Isaj0hcykpOihzPXgsKGF8fCF4KSYmKHg9XCJlcnJvclwiLDA+YSYmKGE9MCkpKSx2LnN0YXR1cz1hLHYuc3RhdHVzVGV4dD0oYnx8eCkrXCJcIixqP28ucmVzb2x2ZVdpdGgobCxbcix4LHZdKTpvLnJlamVjdFdpdGgobCxbdix4LHNdKSx2LnN0YXR1c0NvZGUocSkscT12b2lkIDAsaSYmbS50cmlnZ2VyKGo/XCJhamF4U3VjY2Vzc1wiOlwiYWpheEVycm9yXCIsW3YsayxqP3I6c10pLHAuZmlyZVdpdGgobCxbdix4XSksaSYmKG0udHJpZ2dlcihcImFqYXhDb21wbGV0ZVwiLFt2LGtdKSwtLW4uYWN0aXZlfHxuLmV2ZW50LnRyaWdnZXIoXCJhamF4U3RvcFwiKSkpfXJldHVybiB2fSxnZXRKU09OOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gbi5nZXQoYSxiLGMsXCJqc29uXCIpfSxnZXRTY3JpcHQ6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gbi5nZXQoYSx2b2lkIDAsYixcInNjcmlwdFwiKX19KSxuLmVhY2goW1wiZ2V0XCIsXCJwb3N0XCJdLGZ1bmN0aW9uKGEsYil7bltiXT1mdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gbi5pc0Z1bmN0aW9uKGMpJiYoZT1lfHxkLGQ9YyxjPXZvaWQgMCksbi5hamF4KHt1cmw6YSx0eXBlOmIsZGF0YVR5cGU6ZSxkYXRhOmMsc3VjY2VzczpkfSl9fSksbi5lYWNoKFtcImFqYXhTdGFydFwiLFwiYWpheFN0b3BcIixcImFqYXhDb21wbGV0ZVwiLFwiYWpheEVycm9yXCIsXCJhamF4U3VjY2Vzc1wiLFwiYWpheFNlbmRcIl0sZnVuY3Rpb24oYSxiKXtuLmZuW2JdPWZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLm9uKGIsYSl9fSksbi5fZXZhbFVybD1mdW5jdGlvbihhKXtyZXR1cm4gbi5hamF4KHt1cmw6YSx0eXBlOlwiR0VUXCIsZGF0YVR5cGU6XCJzY3JpcHRcIixhc3luYzohMSxnbG9iYWw6ITEsXCJ0aHJvd3NcIjohMH0pfSxuLmZuLmV4dGVuZCh7d3JhcEFsbDpmdW5jdGlvbihhKXt2YXIgYjtyZXR1cm4gbi5pc0Z1bmN0aW9uKGEpP3RoaXMuZWFjaChmdW5jdGlvbihiKXtuKHRoaXMpLndyYXBBbGwoYS5jYWxsKHRoaXMsYikpfSk6KHRoaXNbMF0mJihiPW4oYSx0aGlzWzBdLm93bmVyRG9jdW1lbnQpLmVxKDApLmNsb25lKCEwKSx0aGlzWzBdLnBhcmVudE5vZGUmJmIuaW5zZXJ0QmVmb3JlKHRoaXNbMF0pLGIubWFwKGZ1bmN0aW9uKCl7dmFyIGE9dGhpczt3aGlsZShhLmZpcnN0RWxlbWVudENoaWxkKWE9YS5maXJzdEVsZW1lbnRDaGlsZDtyZXR1cm4gYX0pLmFwcGVuZCh0aGlzKSksdGhpcyl9LHdyYXBJbm5lcjpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5lYWNoKG4uaXNGdW5jdGlvbihhKT9mdW5jdGlvbihiKXtuKHRoaXMpLndyYXBJbm5lcihhLmNhbGwodGhpcyxiKSl9OmZ1bmN0aW9uKCl7dmFyIGI9bih0aGlzKSxjPWIuY29udGVudHMoKTtjLmxlbmd0aD9jLndyYXBBbGwoYSk6Yi5hcHBlbmQoYSl9KX0sd3JhcDpmdW5jdGlvbihhKXt2YXIgYj1uLmlzRnVuY3Rpb24oYSk7cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbihjKXtuKHRoaXMpLndyYXBBbGwoYj9hLmNhbGwodGhpcyxjKTphKX0pfSx1bndyYXA6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYXJlbnQoKS5lYWNoKGZ1bmN0aW9uKCl7bi5ub2RlTmFtZSh0aGlzLFwiYm9keVwiKXx8bih0aGlzKS5yZXBsYWNlV2l0aCh0aGlzLmNoaWxkTm9kZXMpfSkuZW5kKCl9fSksbi5leHByLmZpbHRlcnMuaGlkZGVuPWZ1bmN0aW9uKGEpe3JldHVybiBhLm9mZnNldFdpZHRoPD0wJiZhLm9mZnNldEhlaWdodDw9MH0sbi5leHByLmZpbHRlcnMudmlzaWJsZT1mdW5jdGlvbihhKXtyZXR1cm4hbi5leHByLmZpbHRlcnMuaGlkZGVuKGEpfTt2YXIgd2M9LyUyMC9nLHhjPS9cXFtcXF0kLyx5Yz0vXFxyP1xcbi9nLHpjPS9eKD86c3VibWl0fGJ1dHRvbnxpbWFnZXxyZXNldHxmaWxlKSQvaSxBYz0vXig/OmlucHV0fHNlbGVjdHx0ZXh0YXJlYXxrZXlnZW4pL2k7ZnVuY3Rpb24gQmMoYSxiLGMsZCl7dmFyIGU7aWYobi5pc0FycmF5KGIpKW4uZWFjaChiLGZ1bmN0aW9uKGIsZSl7Y3x8eGMudGVzdChhKT9kKGEsZSk6QmMoYStcIltcIisoXCJvYmplY3RcIj09dHlwZW9mIGU/YjpcIlwiKStcIl1cIixlLGMsZCl9KTtlbHNlIGlmKGN8fFwib2JqZWN0XCIhPT1uLnR5cGUoYikpZChhLGIpO2Vsc2UgZm9yKGUgaW4gYilCYyhhK1wiW1wiK2UrXCJdXCIsYltlXSxjLGQpfW4ucGFyYW09ZnVuY3Rpb24oYSxiKXt2YXIgYyxkPVtdLGU9ZnVuY3Rpb24oYSxiKXtiPW4uaXNGdW5jdGlvbihiKT9iKCk6bnVsbD09Yj9cIlwiOmIsZFtkLmxlbmd0aF09ZW5jb2RlVVJJQ29tcG9uZW50KGEpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudChiKX07aWYodm9pZCAwPT09YiYmKGI9bi5hamF4U2V0dGluZ3MmJm4uYWpheFNldHRpbmdzLnRyYWRpdGlvbmFsKSxuLmlzQXJyYXkoYSl8fGEuanF1ZXJ5JiYhbi5pc1BsYWluT2JqZWN0KGEpKW4uZWFjaChhLGZ1bmN0aW9uKCl7ZSh0aGlzLm5hbWUsdGhpcy52YWx1ZSl9KTtlbHNlIGZvcihjIGluIGEpQmMoYyxhW2NdLGIsZSk7cmV0dXJuIGQuam9pbihcIiZcIikucmVwbGFjZSh3YyxcIitcIil9LG4uZm4uZXh0ZW5kKHtzZXJpYWxpemU6ZnVuY3Rpb24oKXtyZXR1cm4gbi5wYXJhbSh0aGlzLnNlcmlhbGl6ZUFycmF5KCkpfSxzZXJpYWxpemVBcnJheTpmdW5jdGlvbigpe3JldHVybiB0aGlzLm1hcChmdW5jdGlvbigpe3ZhciBhPW4ucHJvcCh0aGlzLFwiZWxlbWVudHNcIik7cmV0dXJuIGE/bi5tYWtlQXJyYXkoYSk6dGhpc30pLmZpbHRlcihmdW5jdGlvbigpe3ZhciBhPXRoaXMudHlwZTtyZXR1cm4gdGhpcy5uYW1lJiYhbih0aGlzKS5pcyhcIjpkaXNhYmxlZFwiKSYmQWMudGVzdCh0aGlzLm5vZGVOYW1lKSYmIXpjLnRlc3QoYSkmJih0aGlzLmNoZWNrZWR8fCFULnRlc3QoYSkpfSkubWFwKGZ1bmN0aW9uKGEsYil7dmFyIGM9bih0aGlzKS52YWwoKTtyZXR1cm4gbnVsbD09Yz9udWxsOm4uaXNBcnJheShjKT9uLm1hcChjLGZ1bmN0aW9uKGEpe3JldHVybntuYW1lOmIubmFtZSx2YWx1ZTphLnJlcGxhY2UoeWMsXCJcXHJcXG5cIil9fSk6e25hbWU6Yi5uYW1lLHZhbHVlOmMucmVwbGFjZSh5YyxcIlxcclxcblwiKX19KS5nZXQoKX19KSxuLmFqYXhTZXR0aW5ncy54aHI9ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdH1jYXRjaChhKXt9fTt2YXIgQ2M9MCxEYz17fSxFYz17MDoyMDAsMTIyMzoyMDR9LEZjPW4uYWpheFNldHRpbmdzLnhocigpO2EuQWN0aXZlWE9iamVjdCYmbihhKS5vbihcInVubG9hZFwiLGZ1bmN0aW9uKCl7Zm9yKHZhciBhIGluIERjKURjW2FdKCl9KSxrLmNvcnM9ISFGYyYmXCJ3aXRoQ3JlZGVudGlhbHNcImluIEZjLGsuYWpheD1GYz0hIUZjLG4uYWpheFRyYW5zcG9ydChmdW5jdGlvbihhKXt2YXIgYjtyZXR1cm4gay5jb3JzfHxGYyYmIWEuY3Jvc3NEb21haW4/e3NlbmQ6ZnVuY3Rpb24oYyxkKXt2YXIgZSxmPWEueGhyKCksZz0rK0NjO2lmKGYub3BlbihhLnR5cGUsYS51cmwsYS5hc3luYyxhLnVzZXJuYW1lLGEucGFzc3dvcmQpLGEueGhyRmllbGRzKWZvcihlIGluIGEueGhyRmllbGRzKWZbZV09YS54aHJGaWVsZHNbZV07YS5taW1lVHlwZSYmZi5vdmVycmlkZU1pbWVUeXBlJiZmLm92ZXJyaWRlTWltZVR5cGUoYS5taW1lVHlwZSksYS5jcm9zc0RvbWFpbnx8Y1tcIlgtUmVxdWVzdGVkLVdpdGhcIl18fChjW1wiWC1SZXF1ZXN0ZWQtV2l0aFwiXT1cIlhNTEh0dHBSZXF1ZXN0XCIpO2ZvcihlIGluIGMpZi5zZXRSZXF1ZXN0SGVhZGVyKGUsY1tlXSk7Yj1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXtiJiYoZGVsZXRlIERjW2ddLGI9Zi5vbmxvYWQ9Zi5vbmVycm9yPW51bGwsXCJhYm9ydFwiPT09YT9mLmFib3J0KCk6XCJlcnJvclwiPT09YT9kKGYuc3RhdHVzLGYuc3RhdHVzVGV4dCk6ZChFY1tmLnN0YXR1c118fGYuc3RhdHVzLGYuc3RhdHVzVGV4dCxcInN0cmluZ1wiPT10eXBlb2YgZi5yZXNwb25zZVRleHQ/e3RleHQ6Zi5yZXNwb25zZVRleHR9OnZvaWQgMCxmLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKSl9fSxmLm9ubG9hZD1iKCksZi5vbmVycm9yPWIoXCJlcnJvclwiKSxiPURjW2ddPWIoXCJhYm9ydFwiKTt0cnl7Zi5zZW5kKGEuaGFzQ29udGVudCYmYS5kYXRhfHxudWxsKX1jYXRjaChoKXtpZihiKXRocm93IGh9fSxhYm9ydDpmdW5jdGlvbigpe2ImJmIoKX19OnZvaWQgMH0pLG4uYWpheFNldHVwKHthY2NlcHRzOntzY3JpcHQ6XCJ0ZXh0L2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2phdmFzY3JpcHQsIGFwcGxpY2F0aW9uL2VjbWFzY3JpcHQsIGFwcGxpY2F0aW9uL3gtZWNtYXNjcmlwdFwifSxjb250ZW50czp7c2NyaXB0Oi8oPzpqYXZhfGVjbWEpc2NyaXB0L30sY29udmVydGVyczp7XCJ0ZXh0IHNjcmlwdFwiOmZ1bmN0aW9uKGEpe3JldHVybiBuLmdsb2JhbEV2YWwoYSksYX19fSksbi5hamF4UHJlZmlsdGVyKFwic2NyaXB0XCIsZnVuY3Rpb24oYSl7dm9pZCAwPT09YS5jYWNoZSYmKGEuY2FjaGU9ITEpLGEuY3Jvc3NEb21haW4mJihhLnR5cGU9XCJHRVRcIil9KSxuLmFqYXhUcmFuc3BvcnQoXCJzY3JpcHRcIixmdW5jdGlvbihhKXtpZihhLmNyb3NzRG9tYWluKXt2YXIgYixjO3JldHVybntzZW5kOmZ1bmN0aW9uKGQsZSl7Yj1uKFwiPHNjcmlwdD5cIikucHJvcCh7YXN5bmM6ITAsY2hhcnNldDphLnNjcmlwdENoYXJzZXQsc3JjOmEudXJsfSkub24oXCJsb2FkIGVycm9yXCIsYz1mdW5jdGlvbihhKXtiLnJlbW92ZSgpLGM9bnVsbCxhJiZlKFwiZXJyb3JcIj09PWEudHlwZT80MDQ6MjAwLGEudHlwZSl9KSxsLmhlYWQuYXBwZW5kQ2hpbGQoYlswXSl9LGFib3J0OmZ1bmN0aW9uKCl7YyYmYygpfX19fSk7dmFyIEdjPVtdLEhjPS8oPSlcXD8oPz0mfCQpfFxcP1xcPy87bi5hamF4U2V0dXAoe2pzb25wOlwiY2FsbGJhY2tcIixqc29ucENhbGxiYWNrOmZ1bmN0aW9uKCl7dmFyIGE9R2MucG9wKCl8fG4uZXhwYW5kbytcIl9cIitjYysrO3JldHVybiB0aGlzW2FdPSEwLGF9fSksbi5hamF4UHJlZmlsdGVyKFwianNvbiBqc29ucFwiLGZ1bmN0aW9uKGIsYyxkKXt2YXIgZSxmLGcsaD1iLmpzb25wIT09ITEmJihIYy50ZXN0KGIudXJsKT9cInVybFwiOlwic3RyaW5nXCI9PXR5cGVvZiBiLmRhdGEmJiEoYi5jb250ZW50VHlwZXx8XCJcIikuaW5kZXhPZihcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKSYmSGMudGVzdChiLmRhdGEpJiZcImRhdGFcIik7cmV0dXJuIGh8fFwianNvbnBcIj09PWIuZGF0YVR5cGVzWzBdPyhlPWIuanNvbnBDYWxsYmFjaz1uLmlzRnVuY3Rpb24oYi5qc29ucENhbGxiYWNrKT9iLmpzb25wQ2FsbGJhY2soKTpiLmpzb25wQ2FsbGJhY2ssaD9iW2hdPWJbaF0ucmVwbGFjZShIYyxcIiQxXCIrZSk6Yi5qc29ucCE9PSExJiYoYi51cmwrPShkYy50ZXN0KGIudXJsKT9cIiZcIjpcIj9cIikrYi5qc29ucCtcIj1cIitlKSxiLmNvbnZlcnRlcnNbXCJzY3JpcHQganNvblwiXT1mdW5jdGlvbigpe3JldHVybiBnfHxuLmVycm9yKGUrXCIgd2FzIG5vdCBjYWxsZWRcIiksZ1swXX0sYi5kYXRhVHlwZXNbMF09XCJqc29uXCIsZj1hW2VdLGFbZV09ZnVuY3Rpb24oKXtnPWFyZ3VtZW50c30sZC5hbHdheXMoZnVuY3Rpb24oKXthW2VdPWYsYltlXSYmKGIuanNvbnBDYWxsYmFjaz1jLmpzb25wQ2FsbGJhY2ssR2MucHVzaChlKSksZyYmbi5pc0Z1bmN0aW9uKGYpJiZmKGdbMF0pLGc9Zj12b2lkIDB9KSxcInNjcmlwdFwiKTp2b2lkIDB9KSxuLnBhcnNlSFRNTD1mdW5jdGlvbihhLGIsYyl7aWYoIWF8fFwic3RyaW5nXCIhPXR5cGVvZiBhKXJldHVybiBudWxsO1wiYm9vbGVhblwiPT10eXBlb2YgYiYmKGM9YixiPSExKSxiPWJ8fGw7dmFyIGQ9di5leGVjKGEpLGU9IWMmJltdO3JldHVybiBkP1tiLmNyZWF0ZUVsZW1lbnQoZFsxXSldOihkPW4uYnVpbGRGcmFnbWVudChbYV0sYixlKSxlJiZlLmxlbmd0aCYmbihlKS5yZW1vdmUoKSxuLm1lcmdlKFtdLGQuY2hpbGROb2RlcykpfTt2YXIgSWM9bi5mbi5sb2FkO24uZm4ubG9hZD1mdW5jdGlvbihhLGIsYyl7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIGEmJkljKXJldHVybiBJYy5hcHBseSh0aGlzLGFyZ3VtZW50cyk7dmFyIGQsZSxmLGc9dGhpcyxoPWEuaW5kZXhPZihcIiBcIik7cmV0dXJuIGg+PTAmJihkPW4udHJpbShhLnNsaWNlKGgpKSxhPWEuc2xpY2UoMCxoKSksbi5pc0Z1bmN0aW9uKGIpPyhjPWIsYj12b2lkIDApOmImJlwib2JqZWN0XCI9PXR5cGVvZiBiJiYoZT1cIlBPU1RcIiksZy5sZW5ndGg+MCYmbi5hamF4KHt1cmw6YSx0eXBlOmUsZGF0YVR5cGU6XCJodG1sXCIsZGF0YTpifSkuZG9uZShmdW5jdGlvbihhKXtmPWFyZ3VtZW50cyxnLmh0bWwoZD9uKFwiPGRpdj5cIikuYXBwZW5kKG4ucGFyc2VIVE1MKGEpKS5maW5kKGQpOmEpfSkuY29tcGxldGUoYyYmZnVuY3Rpb24oYSxiKXtnLmVhY2goYyxmfHxbYS5yZXNwb25zZVRleHQsYixhXSl9KSx0aGlzfSxuLmV4cHIuZmlsdGVycy5hbmltYXRlZD1mdW5jdGlvbihhKXtyZXR1cm4gbi5ncmVwKG4udGltZXJzLGZ1bmN0aW9uKGIpe3JldHVybiBhPT09Yi5lbGVtfSkubGVuZ3RofTt2YXIgSmM9YS5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7ZnVuY3Rpb24gS2MoYSl7cmV0dXJuIG4uaXNXaW5kb3coYSk/YTo5PT09YS5ub2RlVHlwZSYmYS5kZWZhdWx0Vmlld31uLm9mZnNldD17c2V0T2Zmc2V0OmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlLGYsZyxoLGksaixrPW4uY3NzKGEsXCJwb3NpdGlvblwiKSxsPW4oYSksbT17fTtcInN0YXRpY1wiPT09ayYmKGEuc3R5bGUucG9zaXRpb249XCJyZWxhdGl2ZVwiKSxoPWwub2Zmc2V0KCksZj1uLmNzcyhhLFwidG9wXCIpLGk9bi5jc3MoYSxcImxlZnRcIiksaj0oXCJhYnNvbHV0ZVwiPT09a3x8XCJmaXhlZFwiPT09aykmJihmK2kpLmluZGV4T2YoXCJhdXRvXCIpPi0xLGo/KGQ9bC5wb3NpdGlvbigpLGc9ZC50b3AsZT1kLmxlZnQpOihnPXBhcnNlRmxvYXQoZil8fDAsZT1wYXJzZUZsb2F0KGkpfHwwKSxuLmlzRnVuY3Rpb24oYikmJihiPWIuY2FsbChhLGMsaCkpLG51bGwhPWIudG9wJiYobS50b3A9Yi50b3AtaC50b3ArZyksbnVsbCE9Yi5sZWZ0JiYobS5sZWZ0PWIubGVmdC1oLmxlZnQrZSksXCJ1c2luZ1wiaW4gYj9iLnVzaW5nLmNhbGwoYSxtKTpsLmNzcyhtKX19LG4uZm4uZXh0ZW5kKHtvZmZzZXQ6ZnVuY3Rpb24oYSl7aWYoYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdm9pZCAwPT09YT90aGlzOnRoaXMuZWFjaChmdW5jdGlvbihiKXtuLm9mZnNldC5zZXRPZmZzZXQodGhpcyxhLGIpfSk7dmFyIGIsYyxkPXRoaXNbMF0sZT17dG9wOjAsbGVmdDowfSxmPWQmJmQub3duZXJEb2N1bWVudDtpZihmKXJldHVybiBiPWYuZG9jdW1lbnRFbGVtZW50LG4uY29udGFpbnMoYixkKT8odHlwZW9mIGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0IT09VSYmKGU9ZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSksYz1LYyhmKSx7dG9wOmUudG9wK2MucGFnZVlPZmZzZXQtYi5jbGllbnRUb3AsbGVmdDplLmxlZnQrYy5wYWdlWE9mZnNldC1iLmNsaWVudExlZnR9KTplfSxwb3NpdGlvbjpmdW5jdGlvbigpe2lmKHRoaXNbMF0pe3ZhciBhLGIsYz10aGlzWzBdLGQ9e3RvcDowLGxlZnQ6MH07cmV0dXJuXCJmaXhlZFwiPT09bi5jc3MoYyxcInBvc2l0aW9uXCIpP2I9Yy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTooYT10aGlzLm9mZnNldFBhcmVudCgpLGI9dGhpcy5vZmZzZXQoKSxuLm5vZGVOYW1lKGFbMF0sXCJodG1sXCIpfHwoZD1hLm9mZnNldCgpKSxkLnRvcCs9bi5jc3MoYVswXSxcImJvcmRlclRvcFdpZHRoXCIsITApLGQubGVmdCs9bi5jc3MoYVswXSxcImJvcmRlckxlZnRXaWR0aFwiLCEwKSkse3RvcDpiLnRvcC1kLnRvcC1uLmNzcyhjLFwibWFyZ2luVG9wXCIsITApLGxlZnQ6Yi5sZWZ0LWQubGVmdC1uLmNzcyhjLFwibWFyZ2luTGVmdFwiLCEwKX19fSxvZmZzZXRQYXJlbnQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24oKXt2YXIgYT10aGlzLm9mZnNldFBhcmVudHx8SmM7d2hpbGUoYSYmIW4ubm9kZU5hbWUoYSxcImh0bWxcIikmJlwic3RhdGljXCI9PT1uLmNzcyhhLFwicG9zaXRpb25cIikpYT1hLm9mZnNldFBhcmVudDtyZXR1cm4gYXx8SmN9KX19KSxuLmVhY2goe3Njcm9sbExlZnQ6XCJwYWdlWE9mZnNldFwiLHNjcm9sbFRvcDpcInBhZ2VZT2Zmc2V0XCJ9LGZ1bmN0aW9uKGIsYyl7dmFyIGQ9XCJwYWdlWU9mZnNldFwiPT09YztuLmZuW2JdPWZ1bmN0aW9uKGUpe3JldHVybiBKKHRoaXMsZnVuY3Rpb24oYixlLGYpe3ZhciBnPUtjKGIpO3JldHVybiB2b2lkIDA9PT1mP2c/Z1tjXTpiW2VdOnZvaWQoZz9nLnNjcm9sbFRvKGQ/YS5wYWdlWE9mZnNldDpmLGQ/ZjphLnBhZ2VZT2Zmc2V0KTpiW2VdPWYpfSxiLGUsYXJndW1lbnRzLmxlbmd0aCxudWxsKX19KSxuLmVhY2goW1widG9wXCIsXCJsZWZ0XCJdLGZ1bmN0aW9uKGEsYil7bi5jc3NIb29rc1tiXT15YihrLnBpeGVsUG9zaXRpb24sZnVuY3Rpb24oYSxjKXtyZXR1cm4gYz8oYz14YihhLGIpLHZiLnRlc3QoYyk/bihhKS5wb3NpdGlvbigpW2JdK1wicHhcIjpjKTp2b2lkIDB9KX0pLG4uZWFjaCh7SGVpZ2h0OlwiaGVpZ2h0XCIsV2lkdGg6XCJ3aWR0aFwifSxmdW5jdGlvbihhLGIpe24uZWFjaCh7cGFkZGluZzpcImlubmVyXCIrYSxjb250ZW50OmIsXCJcIjpcIm91dGVyXCIrYX0sZnVuY3Rpb24oYyxkKXtuLmZuW2RdPWZ1bmN0aW9uKGQsZSl7dmFyIGY9YXJndW1lbnRzLmxlbmd0aCYmKGN8fFwiYm9vbGVhblwiIT10eXBlb2YgZCksZz1jfHwoZD09PSEwfHxlPT09ITA/XCJtYXJnaW5cIjpcImJvcmRlclwiKTtyZXR1cm4gSih0aGlzLGZ1bmN0aW9uKGIsYyxkKXt2YXIgZTtyZXR1cm4gbi5pc1dpbmRvdyhiKT9iLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudFtcImNsaWVudFwiK2FdOjk9PT1iLm5vZGVUeXBlPyhlPWIuZG9jdW1lbnRFbGVtZW50LE1hdGgubWF4KGIuYm9keVtcInNjcm9sbFwiK2FdLGVbXCJzY3JvbGxcIithXSxiLmJvZHlbXCJvZmZzZXRcIithXSxlW1wib2Zmc2V0XCIrYV0sZVtcImNsaWVudFwiK2FdKSk6dm9pZCAwPT09ZD9uLmNzcyhiLGMsZyk6bi5zdHlsZShiLGMsZCxnKX0sYixmP2Q6dm9pZCAwLGYsbnVsbCl9fSl9KSxuLmZuLnNpemU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5sZW5ndGh9LG4uZm4uYW5kU2VsZj1uLmZuLmFkZEJhY2ssXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kJiZkZWZpbmUoXCJqcXVlcnlcIixbXSxmdW5jdGlvbigpe3JldHVybiBufSk7dmFyIExjPWEualF1ZXJ5LE1jPWEuJDtyZXR1cm4gbi5ub0NvbmZsaWN0PWZ1bmN0aW9uKGIpe3JldHVybiBhLiQ9PT1uJiYoYS4kPU1jKSxiJiZhLmpRdWVyeT09PW4mJihhLmpRdWVyeT1MYyksbn0sdHlwZW9mIGI9PT1VJiYoYS5qUXVlcnk9YS4kPW4pLG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWpxdWVyeS5taW4ubWFwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi9yb3QnKTtcbiIsInZhciBwcm9jZXNzPXJlcXVpcmUoXCJfX2Jyb3dzZXJpZnlfcHJvY2Vzc1wiKSxnbG9iYWw9dHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9Oy8qXG5cdFRoaXMgaXMgcm90LmpzLCB0aGUgUk9ndWVsaWtlIFRvb2xraXQgaW4gSmF2YVNjcmlwdC5cblx0VmVyc2lvbiAwLjV+ZGV2LCBnZW5lcmF0ZWQgb24gV2VkIEp1bCAzMCAyMDE0IDIxOjMzOjE4IEdNVC0wNTAwIChDRFQpLlxuKi9cbi8qKlxuICogQG5hbWVzcGFjZSBBZGQgb2JqZWN0cyBmb3IgTm9kZS5qcyBlbnZpcm9tZW50XG4gKi9cbmlmICgodHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgcHJvY2VzcyAhPT0gbnVsbCA/IHByb2Nlc3MuZW52IDogdm9pZCAwKSAhPSBudWxsKSB7XG5cdHdpbmRvdyA9IGdsb2JhbDtcblx0ZG9jdW1lbnQgPSB7XG5cdFx0Ym9keToge1xuXHRcdFx0YXBwZW5kQ2hpbGQ6IGZ1bmN0aW9uKGNoaWxkKSB7fSxcblx0XHRcdHNjcm9sbExlZnQ6IDAsXG5cdFx0XHRzY3JvbGxUb3A6IDBcblx0XHR9LFxuXHRcdGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdHZhciBjYW52YXM7XG5cdFx0XHRyZXR1cm4gY2FudmFzID0ge1xuXHRcdFx0XHRnZXRCb3VuZGluZ0NsaWVudFJlY3Q6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHZhciByZWN0O1xuXHRcdFx0XHRcdHJldHVybiByZWN0ID0ge1xuXHRcdFx0XHRcdFx0bGVmdDogMCxcblx0XHRcdFx0XHRcdHRvcDogMFxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldENvbnRleHQ6IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRcdFx0XHR2YXIgY29udGV4dDtcblx0XHRcdFx0XHRyZXR1cm4gY29udGV4dCA9IHtcblx0XHRcdFx0XHRcdF90ZXJtY29sb3I6IG51bGwsXG5cdFx0XHRcdFx0XHRiZWdpblBhdGg6IGZ1bmN0aW9uKCkge30sXG5cdFx0XHRcdFx0XHRjYW52YXM6IGNhbnZhcyxcblx0XHRcdFx0XHRcdGRyYXdJbWFnZTogZnVuY3Rpb24oYSwgYiwgYywgZCwgZSwgZiwgZywgaCwgaSkge30sXG5cdFx0XHRcdFx0XHRmaWxsOiBmdW5jdGlvbigpIHt9LFxuXHRcdFx0XHRcdFx0ZmlsbFJlY3Q6IGZ1bmN0aW9uKHgsIHksIHcsIGgpIHtcblx0XHRcdFx0XHRcdFx0aWYodGhpcy5fdGVybWNvbG9yICE9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGNsZWFyQ21kID0gdGhpcy5fdGVybWNvbG9yLmNsZWFyVG9BbnNpKHRoaXMuZmlsbFN0eWxlKTtcblx0XHRcdFx0XHRcdFx0XHRwcm9jZXNzLnN0ZG91dC53cml0ZShjbGVhckNtZCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmaWxsU3R5bGU6IFwiIzAwMFwiLFxuXHRcdFx0XHRcdFx0ZmlsbFRleHQ6IGZ1bmN0aW9uKGNocywgeCwgeSkge30sXG5cdFx0XHRcdFx0XHRmb250OiBcIm1vbm9zcGFjZVwiLFxuXHRcdFx0XHRcdFx0bGluZVRvOiBmdW5jdGlvbih4LCB5KSB7fSxcblx0XHRcdFx0XHRcdG1lYXN1cmVUZXh0OiBmdW5jdGlvbihjaCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgcmVzdWx0O1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0ID0ge1xuXHRcdFx0XHRcdFx0XHRcdHdpZHRoOiAxMlxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG1vdmVUbzogZnVuY3Rpb24oeCwgeSkge30sXG5cdFx0XHRcdFx0XHR0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG5cdFx0XHRcdFx0XHR0ZXh0QmFzZWxpbmU6IFwibWlkZGxlXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRoZWlnaHQ6IDAsXG5cdFx0XHRcdHN0eWxlOiB7XG5cdFx0XHRcdFx0bGVmdDogXCIxMDBweFwiLFxuXHRcdFx0XHRcdHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG5cdFx0XHRcdFx0dG9wOiBcIjEwMHB4XCIsXG5cdFx0XHRcdFx0dmlzaWJpbGl0eTogXCJoaWRkZW5cIlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR3aWR0aDogMFxuXHRcdFx0fTtcblx0XHR9LFxuXHRcdGRvY3VtZW50RWxlbWVudDoge1xuXHRcdFx0c2Nyb2xsTGVmdDogMCxcblx0XHRcdHNjcm9sbFRvcDogMFxuXHRcdH1cblx0fTtcbn1cbi8qKlxuICogQG5hbWVzcGFjZSBUb3AtbGV2ZWwgUk9UIG5hbWVzcGFjZVxuICovXG52YXIgUk9UID0ge1xuXHQvKipcblx0ICogQHJldHVybnMge2Jvb2x9IElzIHJvdC5qcyBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyP1xuXHQgKi9cblx0aXNTdXBwb3J0ZWQ6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAhIShkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLmdldENvbnRleHQgJiYgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpO1xuXHR9LFxuXG5cdC8qKiBEZWZhdWx0IHdpdGggZm9yIGRpc3BsYXkgYW5kIG1hcCBnZW5lcmF0b3JzICovXG5cdERFRkFVTFRfV0lEVEg6IDgwLFxuXHQvKiogRGVmYXVsdCBoZWlnaHQgZm9yIGRpc3BsYXkgYW5kIG1hcCBnZW5lcmF0b3JzICovXG5cdERFRkFVTFRfSEVJR0hUOiAyNSxcblxuXHQvKiogRGlyZWN0aW9uYWwgY29uc3RhbnRzLiBPcmRlcmluZyBpcyBpbXBvcnRhbnQhICovXG5cdERJUlM6IHtcblx0XHRcIjRcIjogW1xuXHRcdFx0WyAwLCAtMV0sXG5cdFx0XHRbIDEsICAwXSxcblx0XHRcdFsgMCwgIDFdLFxuXHRcdFx0Wy0xLCAgMF1cblx0XHRdLFxuXHRcdFwiOFwiOiBbXG5cdFx0XHRbIDAsIC0xXSxcblx0XHRcdFsgMSwgLTFdLFxuXHRcdFx0WyAxLCAgMF0sXG5cdFx0XHRbIDEsICAxXSxcblx0XHRcdFsgMCwgIDFdLFxuXHRcdFx0Wy0xLCAgMV0sXG5cdFx0XHRbLTEsICAwXSxcblx0XHRcdFstMSwgLTFdXG5cdFx0XSxcblx0XHRcIjZcIjogW1xuXHRcdFx0Wy0xLCAtMV0sXG5cdFx0XHRbIDEsIC0xXSxcblx0XHRcdFsgMiwgIDBdLFxuXHRcdFx0WyAxLCAgMV0sXG5cdFx0XHRbLTEsICAxXSxcblx0XHRcdFstMiwgIDBdXG5cdFx0XVxuXHR9LFxuXG5cdC8qKiBDYW5jZWwga2V5LiAqL1xuXHRWS19DQU5DRUw6IDMsIFxuXHQvKiogSGVscCBrZXkuICovXG5cdFZLX0hFTFA6IDYsIFxuXHQvKiogQmFja3NwYWNlIGtleS4gKi9cblx0VktfQkFDS19TUEFDRTogOCwgXG5cdC8qKiBUYWIga2V5LiAqL1xuXHRWS19UQUI6IDksIFxuXHQvKiogNSBrZXkgb24gTnVtcGFkIHdoZW4gTnVtTG9jayBpcyB1bmxvY2tlZC4gT3Igb24gTWFjLCBjbGVhciBrZXkgd2hpY2ggaXMgcG9zaXRpb25lZCBhdCBOdW1Mb2NrIGtleS4gKi9cblx0VktfQ0xFQVI6IDEyLCBcblx0LyoqIFJldHVybi9lbnRlciBrZXkgb24gdGhlIG1haW4ga2V5Ym9hcmQuICovXG5cdFZLX1JFVFVSTjogMTMsIFxuXHQvKiogUmVzZXJ2ZWQsIGJ1dCBub3QgdXNlZC4gKi9cblx0VktfRU5URVI6IDE0LCBcblx0LyoqIFNoaWZ0IGtleS4gKi9cblx0VktfU0hJRlQ6IDE2LCBcblx0LyoqIENvbnRyb2wga2V5LiAqL1xuXHRWS19DT05UUk9MOiAxNywgXG5cdC8qKiBBbHQgKE9wdGlvbiBvbiBNYWMpIGtleS4gKi9cblx0VktfQUxUOiAxOCwgXG5cdC8qKiBQYXVzZSBrZXkuICovXG5cdFZLX1BBVVNFOiAxOSwgXG5cdC8qKiBDYXBzIGxvY2suICovXG5cdFZLX0NBUFNfTE9DSzogMjAsIFxuXHQvKiogRXNjYXBlIGtleS4gKi9cblx0VktfRVNDQVBFOiAyNywgXG5cdC8qKiBTcGFjZSBiYXIuICovXG5cdFZLX1NQQUNFOiAzMiwgXG5cdC8qKiBQYWdlIFVwIGtleS4gKi9cblx0VktfUEFHRV9VUDogMzMsIFxuXHQvKiogUGFnZSBEb3duIGtleS4gKi9cblx0VktfUEFHRV9ET1dOOiAzNCwgXG5cdC8qKiBFbmQga2V5LiAqL1xuXHRWS19FTkQ6IDM1LCBcblx0LyoqIEhvbWUga2V5LiAqL1xuXHRWS19IT01FOiAzNiwgXG5cdC8qKiBMZWZ0IGFycm93LiAqL1xuXHRWS19MRUZUOiAzNywgXG5cdC8qKiBVcCBhcnJvdy4gKi9cblx0VktfVVA6IDM4LCBcblx0LyoqIFJpZ2h0IGFycm93LiAqL1xuXHRWS19SSUdIVDogMzksIFxuXHQvKiogRG93biBhcnJvdy4gKi9cblx0VktfRE9XTjogNDAsIFxuXHQvKiogUHJpbnQgU2NyZWVuIGtleS4gKi9cblx0VktfUFJJTlRTQ1JFRU46IDQ0LCBcblx0LyoqIElucyhlcnQpIGtleS4gKi9cblx0VktfSU5TRVJUOiA0NSwgXG5cdC8qKiBEZWwoZXRlKSBrZXkuICovXG5cdFZLX0RFTEVURTogNDYsIFxuXHQvKioqL1xuXHRWS18wOiA0OCxcblx0LyoqKi9cblx0VktfMTogNDksXG5cdC8qKiovXG5cdFZLXzI6IDUwLFxuXHQvKioqL1xuXHRWS18zOiA1MSxcblx0LyoqKi9cblx0VktfNDogNTIsXG5cdC8qKiovXG5cdFZLXzU6IDUzLFxuXHQvKioqL1xuXHRWS182OiA1NCxcblx0LyoqKi9cblx0VktfNzogNTUsXG5cdC8qKiovXG5cdFZLXzg6IDU2LFxuXHQvKioqL1xuXHRWS185OiA1Nyxcblx0LyoqIENvbG9uICg6KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQ09MT046IDU4LCBcblx0LyoqIFNlbWljb2xvbiAoOykga2V5LiAqL1xuXHRWS19TRU1JQ09MT046IDU5LCBcblx0LyoqIExlc3MtdGhhbiAoPCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX0xFU1NfVEhBTjogNjAsIFxuXHQvKiogRXF1YWxzICg9KSBrZXkuICovXG5cdFZLX0VRVUFMUzogNjEsIFxuXHQvKiogR3JlYXRlci10aGFuICg+KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfR1JFQVRFUl9USEFOOiA2MiwgXG5cdC8qKiBRdWVzdGlvbiBtYXJrICg/KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfUVVFU1RJT05fTUFSSzogNjMsIFxuXHQvKiogQXRtYXJrIChAKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQVQ6IDY0LCBcblx0LyoqKi9cblx0VktfQTogNjUsXG5cdC8qKiovXG5cdFZLX0I6IDY2LFxuXHQvKioqL1xuXHRWS19DOiA2Nyxcblx0LyoqKi9cblx0VktfRDogNjgsXG5cdC8qKiovXG5cdFZLX0U6IDY5LFxuXHQvKioqL1xuXHRWS19GOiA3MCxcblx0LyoqKi9cblx0VktfRzogNzEsXG5cdC8qKiovXG5cdFZLX0g6IDcyLFxuXHQvKioqL1xuXHRWS19JOiA3Myxcblx0LyoqKi9cblx0VktfSjogNzQsXG5cdC8qKiovXG5cdFZLX0s6IDc1LFxuXHQvKioqL1xuXHRWS19MOiA3Nixcblx0LyoqKi9cblx0VktfTTogNzcsXG5cdC8qKiovXG5cdFZLX046IDc4LFxuXHQvKioqL1xuXHRWS19POiA3OSxcblx0LyoqKi9cblx0VktfUDogODAsXG5cdC8qKiovXG5cdFZLX1E6IDgxLFxuXHQvKioqL1xuXHRWS19SOiA4Mixcblx0LyoqKi9cblx0VktfUzogODMsXG5cdC8qKiovXG5cdFZLX1Q6IDg0LFxuXHQvKioqL1xuXHRWS19VOiA4NSxcblx0LyoqKi9cblx0VktfVjogODYsXG5cdC8qKiovXG5cdFZLX1c6IDg3LFxuXHQvKioqL1xuXHRWS19YOiA4OCxcblx0LyoqKi9cblx0VktfWTogODksXG5cdC8qKiovXG5cdFZLX1o6IDkwLFxuXHQvKioqL1xuXHRWS19DT05URVhUX01FTlU6IDkzLFxuXHQvKiogMCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX05VTVBBRDA6IDk2LCBcblx0LyoqIDEgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19OVU1QQUQxOiA5NywgXG5cdC8qKiAyIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfTlVNUEFEMjogOTgsIFxuXHQvKiogMyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX05VTVBBRDM6IDk5LCBcblx0LyoqIDQgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19OVU1QQUQ0OiAxMDAsIFxuXHQvKiogNSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX05VTVBBRDU6IDEwMSwgXG5cdC8qKiA2IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfTlVNUEFENjogMTAyLCBcblx0LyoqIDcgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19OVU1QQUQ3OiAxMDMsIFxuXHQvKiogOCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX05VTVBBRDg6IDEwNCwgXG5cdC8qKiA5IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfTlVNUEFEOTogMTA1LCBcblx0LyoqICogb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19NVUxUSVBMWTogMTA2LFxuXHQvKiogKyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG5cdFZLX0FERDogMTA3LCBcblx0LyoqKi9cblx0VktfU0VQQVJBVE9SOiAxMDgsXG5cdC8qKiAtIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfU1VCVFJBQ1Q6IDEwOSwgXG5cdC8qKiBEZWNpbWFsIHBvaW50IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cblx0VktfREVDSU1BTDogMTEwLCBcblx0LyoqIC8gb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuXHRWS19ESVZJREU6IDExMSwgXG5cdC8qKiBGMSBrZXkuICovXG5cdFZLX0YxOiAxMTIsIFxuXHQvKiogRjIga2V5LiAqL1xuXHRWS19GMjogMTEzLCBcblx0LyoqIEYzIGtleS4gKi9cblx0VktfRjM6IDExNCwgXG5cdC8qKiBGNCBrZXkuICovXG5cdFZLX0Y0OiAxMTUsIFxuXHQvKiogRjUga2V5LiAqL1xuXHRWS19GNTogMTE2LCBcblx0LyoqIEY2IGtleS4gKi9cblx0VktfRjY6IDExNywgXG5cdC8qKiBGNyBrZXkuICovXG5cdFZLX0Y3OiAxMTgsIFxuXHQvKiogRjgga2V5LiAqL1xuXHRWS19GODogMTE5LCBcblx0LyoqIEY5IGtleS4gKi9cblx0VktfRjk6IDEyMCwgXG5cdC8qKiBGMTAga2V5LiAqL1xuXHRWS19GMTA6IDEyMSwgXG5cdC8qKiBGMTEga2V5LiAqL1xuXHRWS19GMTE6IDEyMiwgXG5cdC8qKiBGMTIga2V5LiAqL1xuXHRWS19GMTI6IDEyMywgXG5cdC8qKiBGMTMga2V5LiAqL1xuXHRWS19GMTM6IDEyNCwgXG5cdC8qKiBGMTQga2V5LiAqL1xuXHRWS19GMTQ6IDEyNSwgXG5cdC8qKiBGMTUga2V5LiAqL1xuXHRWS19GMTU6IDEyNiwgXG5cdC8qKiBGMTYga2V5LiAqL1xuXHRWS19GMTY6IDEyNywgXG5cdC8qKiBGMTcga2V5LiAqL1xuXHRWS19GMTc6IDEyOCwgXG5cdC8qKiBGMTgga2V5LiAqL1xuXHRWS19GMTg6IDEyOSwgXG5cdC8qKiBGMTkga2V5LiAqL1xuXHRWS19GMTk6IDEzMCwgXG5cdC8qKiBGMjAga2V5LiAqL1xuXHRWS19GMjA6IDEzMSwgXG5cdC8qKiBGMjEga2V5LiAqL1xuXHRWS19GMjE6IDEzMiwgXG5cdC8qKiBGMjIga2V5LiAqL1xuXHRWS19GMjI6IDEzMywgXG5cdC8qKiBGMjMga2V5LiAqL1xuXHRWS19GMjM6IDEzNCwgXG5cdC8qKiBGMjQga2V5LiAqL1xuXHRWS19GMjQ6IDEzNSwgXG5cdC8qKiBOdW0gTG9jayBrZXkuICovXG5cdFZLX05VTV9MT0NLOiAxNDQsIFxuXHQvKiogU2Nyb2xsIExvY2sga2V5LiAqL1xuXHRWS19TQ1JPTExfTE9DSzogMTQ1LCBcblx0LyoqIENpcmN1bWZsZXggKF4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19DSVJDVU1GTEVYOiAxNjAsIFxuXHQvKiogRXhjbGFtYXRpb24gKCEpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19FWENMQU1BVElPTjogMTYxLCBcblx0LyoqIERvdWJsZSBxdW90ZSAoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfRE9VQkxFX1FVT1RFOiAxNjIsIFxuXHQvKiogSGFzaCAoIykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX0hBU0g6IDE2MywgXG5cdC8qKiBEb2xsYXIgc2lnbiAoJCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX0RPTExBUjogMTY0LCBcblx0LyoqIFBlcmNlbnQgKCUpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19QRVJDRU5UOiAxNjUsIFxuXHQvKiogQW1wZXJzYW5kICgmKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQU1QRVJTQU5EOiAxNjYsIFxuXHQvKiogVW5kZXJzY29yZSAoXykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX1VOREVSU0NPUkU6IDE2NywgXG5cdC8qKiBPcGVuIHBhcmVudGhlc2lzICgoKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfT1BFTl9QQVJFTjogMTY4LCBcblx0LyoqIENsb3NlIHBhcmVudGhlc2lzICgpKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQ0xPU0VfUEFSRU46IDE2OSwgXG5cdC8qIEFzdGVyaXNrICgqKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQVNURVJJU0s6IDE3MCxcblx0LyoqIFBsdXMgKCspIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19QTFVTOiAxNzEsIFxuXHQvKiogUGlwZSAofCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX1BJUEU6IDE3MiwgXG5cdC8qKiBIeXBoZW4tVVMvZG9jcy9NaW51cyAoLSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX0hZUEhFTl9NSU5VUzogMTczLCBcblx0LyoqIE9wZW4gY3VybHkgYnJhY2tldCAoeykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG5cdFZLX09QRU5fQ1VSTFlfQlJBQ0tFVDogMTc0LCBcblx0LyoqIENsb3NlIGN1cmx5IGJyYWNrZXQgKH0pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19DTE9TRV9DVVJMWV9CUkFDS0VUOiAxNzUsIFxuXHQvKiogVGlsZGUgKH4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19USUxERTogMTc2LCBcblx0LyoqIENvbW1hICgsKSBrZXkuICovXG5cdFZLX0NPTU1BOiAxODgsIFxuXHQvKiogUGVyaW9kICguKSBrZXkuICovXG5cdFZLX1BFUklPRDogMTkwLCBcblx0LyoqIFNsYXNoICgvKSBrZXkuICovXG5cdFZLX1NMQVNIOiAxOTEsIFxuXHQvKiogQmFjayB0aWNrIChgKSBrZXkuICovXG5cdFZLX0JBQ0tfUVVPVEU6IDE5MiwgXG5cdC8qKiBPcGVuIHNxdWFyZSBicmFja2V0IChbKSBrZXkuICovXG5cdFZLX09QRU5fQlJBQ0tFVDogMjE5LCBcblx0LyoqIEJhY2sgc2xhc2ggKFxcKSBrZXkuICovXG5cdFZLX0JBQ0tfU0xBU0g6IDIyMCwgXG5cdC8qKiBDbG9zZSBzcXVhcmUgYnJhY2tldCAoXSkga2V5LiAqL1xuXHRWS19DTE9TRV9CUkFDS0VUOiAyMjEsIFxuXHQvKiogUXVvdGUgKCcnJykga2V5LiAqL1xuXHRWS19RVU9URTogMjIyLCBcblx0LyoqIE1ldGEga2V5IG9uIExpbnV4LCBDb21tYW5kIGtleSBvbiBNYWMuICovXG5cdFZLX01FVEE6IDIyNCwgXG5cdC8qKiBBbHRHciBrZXkgb24gTGludXguIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cblx0VktfQUxUR1I6IDIyNSwgXG5cdC8qKiBXaW5kb3dzIGxvZ28ga2V5IG9uIFdpbmRvd3MuIE9yIFN1cGVyIG9yIEh5cGVyIGtleSBvbiBMaW51eC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19XSU46IDkxLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19LQU5BOiAyMSwgXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cblx0VktfSEFOR1VMOiAyMSwgXG5cdC8qKiDoi7HmlbAga2V5IG9uIEphcGFuZXNlIE1hYyBrZXlib2FyZC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuXHRWS19FSVNVOiAyMiwgXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cblx0VktfSlVOSkE6IDIzLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19GSU5BTDogMjQsIFxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG5cdFZLX0hBTkpBOiAyNSwgXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cblx0VktfS0FOSkk6IDI1LCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19DT05WRVJUOiAyOCwgXG5cdC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cblx0VktfTk9OQ09OVkVSVDogMjksIFxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG5cdFZLX0FDQ0VQVDogMzAsIFxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG5cdFZLX01PREVDSEFOR0U6IDMxLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19TRUxFQ1Q6IDQxLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuXHRWS19QUklOVDogNDIsIFxuXHQvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG5cdFZLX0VYRUNVVEU6IDQzLCBcblx0LyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLlx0ICovXG5cdFZLX1NMRUVQOiA5NSBcbn07XG4vKipcbiAqIEBuYW1lc3BhY2VcbiAqIENvbnRhaW5zIHRleHQgdG9rZW5pemF0aW9uIGFuZCBicmVha2luZyByb3V0aW5lc1xuICovXG5ST1QuVGV4dCA9IHtcblx0UkVfQ09MT1JTOiAvJShbYmNdKXsoW159XSopfS9nLFxuXG5cdC8qIHRva2VuIHR5cGVzICovXG5cdFRZUEVfVEVYVDpcdFx0MCxcblx0VFlQRV9ORVdMSU5FOlx0MSxcblx0VFlQRV9GRzpcdFx0Mixcblx0VFlQRV9CRzpcdFx0MyxcblxuXHQvKipcblx0ICogTWVhc3VyZSBzaXplIG9mIGEgcmVzdWx0aW5nIHRleHQgYmxvY2tcblx0ICovXG5cdG1lYXN1cmU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcblx0XHR2YXIgcmVzdWx0ID0ge3dpZHRoOjAsIGhlaWdodDoxfTtcblx0XHR2YXIgdG9rZW5zID0gdGhpcy50b2tlbml6ZShzdHIsIG1heFdpZHRoKTtcblx0XHR2YXIgbGluZVdpZHRoID0gMDtcblxuXHRcdGZvciAodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKSB7XG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XG5cdFx0XHRzd2l0Y2ggKHRva2VuLnR5cGUpIHtcblx0XHRcdFx0Y2FzZSB0aGlzLlRZUEVfVEVYVDpcblx0XHRcdFx0XHRsaW5lV2lkdGggKz0gdG9rZW4udmFsdWUubGVuZ3RoO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRjYXNlIHRoaXMuVFlQRV9ORVdMSU5FOlxuXHRcdFx0XHRcdHJlc3VsdC5oZWlnaHQrKztcblx0XHRcdFx0XHRyZXN1bHQud2lkdGggPSBNYXRoLm1heChyZXN1bHQud2lkdGgsIGxpbmVXaWR0aCk7XG5cdFx0XHRcdFx0bGluZVdpZHRoID0gMDtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJlc3VsdC53aWR0aCA9IE1hdGgubWF4KHJlc3VsdC53aWR0aCwgbGluZVdpZHRoKTtcblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENvbnZlcnQgc3RyaW5nIHRvIGEgc2VyaWVzIG9mIGEgZm9ybWF0dGluZyBjb21tYW5kc1xuXHQgKi9cblx0dG9rZW5pemU6IGZ1bmN0aW9uKHN0ciwgbWF4V2lkdGgpIHtcblx0XHR2YXIgcmVzdWx0ID0gW107XG5cblx0XHQvKiBmaXJzdCB0b2tlbml6YXRpb24gcGFzcyAtIHNwbGl0IHRleHRzIGFuZCBjb2xvciBmb3JtYXR0aW5nIGNvbW1hbmRzICovXG5cdFx0dmFyIG9mZnNldCA9IDA7XG5cdFx0c3RyLnJlcGxhY2UodGhpcy5SRV9DT0xPUlMsIGZ1bmN0aW9uKG1hdGNoLCB0eXBlLCBuYW1lLCBpbmRleCkge1xuXHRcdFx0Lyogc3RyaW5nIGJlZm9yZSAqL1xuXHRcdFx0dmFyIHBhcnQgPSBzdHIuc3Vic3RyaW5nKG9mZnNldCwgaW5kZXgpO1xuXHRcdFx0aWYgKHBhcnQubGVuZ3RoKSB7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKHtcblx0XHRcdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX1RFWFQsXG5cdFx0XHRcdFx0dmFsdWU6IHBhcnRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qIGNvbG9yIGNvbW1hbmQgKi9cblx0XHRcdHJlc3VsdC5wdXNoKHtcblx0XHRcdFx0dHlwZTogKHR5cGUgPT0gXCJjXCIgPyBST1QuVGV4dC5UWVBFX0ZHIDogUk9ULlRleHQuVFlQRV9CRyksXG5cdFx0XHRcdHZhbHVlOiBuYW1lLnRyaW0oKVxuXHRcdFx0fSk7XG5cblx0XHRcdG9mZnNldCA9IGluZGV4ICsgbWF0Y2gubGVuZ3RoO1xuXHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0fSk7XG5cblx0XHQvKiBsYXN0IHJlbWFpbmluZyBwYXJ0ICovXG5cdFx0dmFyIHBhcnQgPSBzdHIuc3Vic3RyaW5nKG9mZnNldCk7XG5cdFx0aWYgKHBhcnQubGVuZ3RoKSB7XG5cdFx0XHRyZXN1bHQucHVzaCh7XG5cdFx0XHRcdHR5cGU6IFJPVC5UZXh0LlRZUEVfVEVYVCxcblx0XHRcdFx0dmFsdWU6IHBhcnRcblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9icmVha0xpbmVzKHJlc3VsdCwgbWF4V2lkdGgpO1xuXHR9LFxuXG5cdC8qIGluc2VydCBsaW5lIGJyZWFrcyBpbnRvIGZpcnN0LXBhc3MgdG9rZW5pemVkIGRhdGEgKi9cblx0X2JyZWFrTGluZXM6IGZ1bmN0aW9uKHRva2VucywgbWF4V2lkdGgpIHtcblx0XHRpZiAoIW1heFdpZHRoKSB7IG1heFdpZHRoID0gSW5maW5pdHk7IH07XG5cblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIGxpbmVMZW5ndGggPSAwO1xuXHRcdHZhciBsYXN0VG9rZW5XaXRoU3BhY2UgPSAtMTtcblxuXHRcdHdoaWxlIChpIDwgdG9rZW5zLmxlbmd0aCkgeyAvKiB0YWtlIGFsbCB0ZXh0IHRva2VucywgcmVtb3ZlIHNwYWNlLCBhcHBseSBsaW5lYnJlYWtzICovXG5cdFx0XHR2YXIgdG9rZW4gPSB0b2tlbnNbaV07XG5cdFx0XHRpZiAodG9rZW4udHlwZSA9PSBST1QuVGV4dC5UWVBFX05FV0xJTkUpIHsgLyogcmVzZXQgKi9cblx0XHRcdFx0bGluZUxlbmd0aCA9IDA7IFxuXHRcdFx0XHRsYXN0VG9rZW5XaXRoU3BhY2UgPSAtMTtcblx0XHRcdH1cblx0XHRcdGlmICh0b2tlbi50eXBlICE9IFJPVC5UZXh0LlRZUEVfVEVYVCkgeyAvKiBza2lwIG5vbi10ZXh0IHRva2VucyAqL1xuXHRcdFx0XHRpKys7XG5cdFx0XHRcdGNvbnRpbnVlOyBcblx0XHRcdH1cblxuXHRcdFx0LyogcmVtb3ZlIHNwYWNlcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGxpbmUgKi9cblx0XHRcdHdoaWxlIChsaW5lTGVuZ3RoID09IDAgJiYgdG9rZW4udmFsdWUuY2hhckF0KDApID09IFwiIFwiKSB7IHRva2VuLnZhbHVlID0gdG9rZW4udmFsdWUuc3Vic3RyaW5nKDEpOyB9XG5cblx0XHRcdC8qIGZvcmNlZCBuZXdsaW5lPyBpbnNlcnQgdHdvIG5ldyB0b2tlbnMgYWZ0ZXIgdGhpcyBvbmUgKi9cblx0XHRcdHZhciBpbmRleCA9IHRva2VuLnZhbHVlLmluZGV4T2YoXCJcXG5cIik7XG5cdFx0XHRpZiAoaW5kZXggIT0gLTEpIHsgXG5cdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGksIGluZGV4LCB0cnVlKTsgXG5cblx0XHRcdFx0LyogaWYgdGhlcmUgYXJlIHNwYWNlcyBhdCB0aGUgZW5kLCB3ZSBtdXN0IHJlbW92ZSB0aGVtICh3ZSBkbyBub3Qgd2FudCB0aGUgbGluZSB0b28gbG9uZykgKi9cblx0XHRcdFx0dmFyIGFyciA9IHRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xuXHRcdFx0XHR3aGlsZSAoYXJyW2Fyci5sZW5ndGgtMV0gPT0gXCIgXCIpIHsgYXJyLnBvcCgpOyB9XG5cdFx0XHRcdHRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XG5cdFx0XHR9XG5cblx0XHRcdC8qIHRva2VuIGRlZ2VuZXJhdGVkPyAqL1xuXHRcdFx0aWYgKCF0b2tlbi52YWx1ZS5sZW5ndGgpIHtcblx0XHRcdFx0dG9rZW5zLnNwbGljZShpLCAxKTtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChsaW5lTGVuZ3RoICsgdG9rZW4udmFsdWUubGVuZ3RoID4gbWF4V2lkdGgpIHsgLyogbGluZSB0b28gbG9uZywgZmluZCBhIHN1aXRhYmxlIGJyZWFraW5nIHNwb3QgKi9cblxuXHRcdFx0XHQvKiBpcyBpdCBwb3NzaWJsZSB0byBicmVhayB3aXRoaW4gdGhpcyB0b2tlbj8gKi9cblx0XHRcdFx0dmFyIGluZGV4ID0gLTE7XG5cdFx0XHRcdHdoaWxlICgxKSB7XG5cdFx0XHRcdFx0dmFyIG5leHRJbmRleCA9IHRva2VuLnZhbHVlLmluZGV4T2YoXCIgXCIsIGluZGV4KzEpO1xuXHRcdFx0XHRcdGlmIChuZXh0SW5kZXggPT0gLTEpIHsgYnJlYWs7IH1cblx0XHRcdFx0XHRpZiAobGluZUxlbmd0aCArIG5leHRJbmRleCA+IG1heFdpZHRoKSB7IGJyZWFrOyB9XG5cdFx0XHRcdFx0aW5kZXggPSBuZXh0SW5kZXg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaW5kZXggIT0gLTEpIHsgLyogYnJlYWsgYXQgc3BhY2Ugd2l0aGluIHRoaXMgb25lICovXG5cdFx0XHRcdFx0dG9rZW4udmFsdWUgPSB0aGlzLl9icmVha0luc2lkZVRva2VuKHRva2VucywgaSwgaW5kZXgsIHRydWUpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKGxhc3RUb2tlbldpdGhTcGFjZSAhPSAtMSkgeyAvKiBpcyB0aGVyZSBhIHByZXZpb3VzIHRva2VuIHdoZXJlIGEgYnJlYWsgY2FuIG9jY3VyPyAqL1xuXHRcdFx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tsYXN0VG9rZW5XaXRoU3BhY2VdO1xuXHRcdFx0XHRcdHZhciBicmVha0luZGV4ID0gdG9rZW4udmFsdWUubGFzdEluZGV4T2YoXCIgXCIpO1xuXHRcdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGxhc3RUb2tlbldpdGhTcGFjZSwgYnJlYWtJbmRleCwgdHJ1ZSk7XG5cdFx0XHRcdFx0aSA9IGxhc3RUb2tlbldpdGhTcGFjZTtcblx0XHRcdFx0fSBlbHNlIHsgLyogZm9yY2UgYnJlYWsgaW4gdGhpcyB0b2tlbiAqL1xuXHRcdFx0XHRcdHRva2VuLnZhbHVlID0gdGhpcy5fYnJlYWtJbnNpZGVUb2tlbih0b2tlbnMsIGksIG1heFdpZHRoLWxpbmVMZW5ndGgsIGZhbHNlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgeyAvKiBsaW5lIG5vdCBsb25nLCBjb250aW51ZSAqL1xuXHRcdFx0XHRsaW5lTGVuZ3RoICs9IHRva2VuLnZhbHVlLmxlbmd0aDtcblx0XHRcdFx0aWYgKHRva2VuLnZhbHVlLmluZGV4T2YoXCIgXCIpICE9IC0xKSB7IGxhc3RUb2tlbldpdGhTcGFjZSA9IGk7IH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aSsrOyAvKiBhZHZhbmNlIHRvIG5leHQgdG9rZW4gKi9cblx0XHR9XG5cblxuXHRcdHRva2Vucy5wdXNoKHt0eXBlOiBST1QuVGV4dC5UWVBFX05FV0xJTkV9KTsgLyogaW5zZXJ0IGZha2UgbmV3bGluZSB0byBmaXggdGhlIGxhc3QgdGV4dCBsaW5lICovXG5cblx0XHQvKiByZW1vdmUgdHJhaWxpbmcgc3BhY2UgZnJvbSB0ZXh0IHRva2VucyBiZWZvcmUgbmV3bGluZXMgKi9cblx0XHR2YXIgbGFzdFRleHRUb2tlbiA9IG51bGw7XG5cdFx0Zm9yICh2YXIgaT0wO2k8dG9rZW5zLmxlbmd0aDtpKyspIHtcblx0XHRcdHZhciB0b2tlbiA9IHRva2Vuc1tpXTtcblx0XHRcdHN3aXRjaCAodG9rZW4udHlwZSkge1xuXHRcdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfVEVYVDogbGFzdFRleHRUb2tlbiA9IHRva2VuOyBicmVhaztcblx0XHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX05FV0xJTkU6IFxuXHRcdFx0XHRcdGlmIChsYXN0VGV4dFRva2VuKSB7IC8qIHJlbW92ZSB0cmFpbGluZyBzcGFjZSAqL1xuXHRcdFx0XHRcdFx0dmFyIGFyciA9IGxhc3RUZXh0VG9rZW4udmFsdWUuc3BsaXQoXCJcIik7XG5cdFx0XHRcdFx0XHR3aGlsZSAoYXJyW2Fyci5sZW5ndGgtMV0gPT0gXCIgXCIpIHsgYXJyLnBvcCgpOyB9XG5cdFx0XHRcdFx0XHRsYXN0VGV4dFRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGxhc3RUZXh0VG9rZW4gPSBudWxsO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0b2tlbnMucG9wKCk7IC8qIHJlbW92ZSBmYWtlIHRva2VuICovXG5cblx0XHRyZXR1cm4gdG9rZW5zO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgbmV3IHRva2VucyBhbmQgaW5zZXJ0IHRoZW0gaW50byB0aGUgc3RyZWFtXG5cdCAqIEBwYXJhbSB7b2JqZWN0W119IHRva2Vuc1xuXHQgKiBAcGFyYW0ge2ludH0gdG9rZW5JbmRleCBUb2tlbiBiZWluZyBwcm9jZXNzZWRcblx0ICogQHBhcmFtIHtpbnR9IGJyZWFrSW5kZXggSW5kZXggd2l0aGluIGN1cnJlbnQgdG9rZW4ncyB2YWx1ZVxuXHQgKiBAcGFyYW0ge2Jvb2x9IHJlbW92ZUJyZWFrQ2hhciBEbyB3ZSB3YW50IHRvIHJlbW92ZSB0aGUgYnJlYWtpbmcgY2hhcmFjdGVyP1xuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSByZW1haW5pbmcgdW5icm9rZW4gdG9rZW4gdmFsdWVcblx0ICovXG5cdF9icmVha0luc2lkZVRva2VuOiBmdW5jdGlvbih0b2tlbnMsIHRva2VuSW5kZXgsIGJyZWFrSW5kZXgsIHJlbW92ZUJyZWFrQ2hhcikge1xuXHRcdHZhciBuZXdCcmVha1Rva2VuID0ge1xuXHRcdFx0dHlwZTogUk9ULlRleHQuVFlQRV9ORVdMSU5FXG5cdFx0fVxuXHRcdHZhciBuZXdUZXh0VG9rZW4gPSB7XG5cdFx0XHR0eXBlOiBST1QuVGV4dC5UWVBFX1RFWFQsXG5cdFx0XHR2YWx1ZTogdG9rZW5zW3Rva2VuSW5kZXhdLnZhbHVlLnN1YnN0cmluZyhicmVha0luZGV4ICsgKHJlbW92ZUJyZWFrQ2hhciA/IDEgOiAwKSlcblx0XHR9XG5cdFx0dG9rZW5zLnNwbGljZSh0b2tlbkluZGV4KzEsIDAsIG5ld0JyZWFrVG9rZW4sIG5ld1RleHRUb2tlbik7XG5cdFx0cmV0dXJuIHRva2Vuc1t0b2tlbkluZGV4XS52YWx1ZS5zdWJzdHJpbmcoMCwgYnJlYWtJbmRleCk7XG5cdH1cbn1cbi8qKlxuICogQHJldHVybnMge2FueX0gUmFuZG9tbHkgcGlja2VkIGl0ZW0sIG51bGwgd2hlbiBsZW5ndGg9MFxuICovXG5BcnJheS5wcm90b3R5cGUucmFuZG9tID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5sZW5ndGgpIHsgcmV0dXJuIG51bGw7IH1cblx0cmV0dXJuIHRoaXNbTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIHRoaXMubGVuZ3RoKV07XG59XG5cbi8qKlxuICogQHJldHVybnMge2FycmF5fSBOZXcgYXJyYXkgd2l0aCByYW5kb21pemVkIGl0ZW1zXG4gKiBGSVhNRSBkZXN0cm95cyB0aGlzIVxuICovXG5BcnJheS5wcm90b3R5cGUucmFuZG9taXplID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZXN1bHQgPSBbXTtcblx0d2hpbGUgKHRoaXMubGVuZ3RoKSB7XG5cdFx0dmFyIGluZGV4ID0gdGhpcy5pbmRleE9mKHRoaXMucmFuZG9tKCkpO1xuXHRcdHJlc3VsdC5wdXNoKHRoaXMuc3BsaWNlKGluZGV4LCAxKVswXSk7XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogQWx3YXlzIHBvc2l0aXZlIG1vZHVsdXNcbiAqIEBwYXJhbSB7aW50fSBuIE1vZHVsdXNcbiAqIEByZXR1cm5zIHtpbnR9IHRoaXMgbW9kdWxvIG5cbiAqL1xuTnVtYmVyLnByb3RvdHlwZS5tb2QgPSBmdW5jdGlvbihuKSB7XG5cdHJldHVybiAoKHRoaXMlbikrbiklbjtcbn1cbi8qKlxuICogQHJldHVybnMge3N0cmluZ30gRmlyc3QgbGV0dGVyIGNhcGl0YWxpemVkXG4gKi9cblN0cmluZy5wcm90b3R5cGUuY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHRoaXMuc3Vic3RyaW5nKDEpO1xufVxuXG4vKiogXG4gKiBMZWZ0IHBhZFxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFyYWN0ZXI9XCIwXCJdXG4gKiBAcGFyYW0ge2ludH0gW2NvdW50PTJdXG4gKi9cblN0cmluZy5wcm90b3R5cGUubHBhZCA9IGZ1bmN0aW9uKGNoYXJhY3RlciwgY291bnQpIHtcblx0dmFyIGNoID0gY2hhcmFjdGVyIHx8IFwiMFwiO1xuXHR2YXIgY250ID0gY291bnQgfHwgMjtcblxuXHR2YXIgcyA9IFwiXCI7XG5cdHdoaWxlIChzLmxlbmd0aCA8IChjbnQgLSB0aGlzLmxlbmd0aCkpIHsgcyArPSBjaDsgfVxuXHRzID0gcy5zdWJzdHJpbmcoMCwgY250LXRoaXMubGVuZ3RoKTtcblx0cmV0dXJuIHMrdGhpcztcbn1cblxuLyoqIFxuICogUmlnaHQgcGFkXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NoYXJhY3Rlcj1cIjBcIl1cbiAqIEBwYXJhbSB7aW50fSBbY291bnQ9Ml1cbiAqL1xuU3RyaW5nLnByb3RvdHlwZS5ycGFkID0gZnVuY3Rpb24oY2hhcmFjdGVyLCBjb3VudCkge1xuXHR2YXIgY2ggPSBjaGFyYWN0ZXIgfHwgXCIwXCI7XG5cdHZhciBjbnQgPSBjb3VudCB8fCAyO1xuXG5cdHZhciBzID0gXCJcIjtcblx0d2hpbGUgKHMubGVuZ3RoIDwgKGNudCAtIHRoaXMubGVuZ3RoKSkgeyBzICs9IGNoOyB9XG5cdHMgPSBzLnN1YnN0cmluZygwLCBjbnQtdGhpcy5sZW5ndGgpO1xuXHRyZXR1cm4gdGhpcytzO1xufVxuXG4vKipcbiAqIEZvcm1hdCBhIHN0cmluZyBpbiBhIGZsZXhpYmxlIHdheS4gU2NhbnMgZm9yICVzIHN0cmluZ3MgYW5kIHJlcGxhY2VzIHRoZW0gd2l0aCBhcmd1bWVudHMuIExpc3Qgb2YgcGF0dGVybnMgaXMgbW9kaWZpYWJsZSB2aWEgU3RyaW5nLmZvcm1hdC5tYXAuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVcbiAqIEBwYXJhbSB7YW55fSBbYXJndl1cbiAqL1xuU3RyaW5nLmZvcm1hdCA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG5cdHZhciBtYXAgPSBTdHJpbmcuZm9ybWF0Lm1hcDtcblx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG5cdHZhciByZXBsYWNlciA9IGZ1bmN0aW9uKG1hdGNoLCBncm91cDEsIGdyb3VwMiwgaW5kZXgpIHtcblx0XHRpZiAodGVtcGxhdGUuY2hhckF0KGluZGV4LTEpID09IFwiJVwiKSB7IHJldHVybiBtYXRjaC5zdWJzdHJpbmcoMSk7IH1cblx0XHRpZiAoIWFyZ3MubGVuZ3RoKSB7IHJldHVybiBtYXRjaDsgfVxuXHRcdHZhciBvYmogPSBhcmdzWzBdO1xuXG5cdFx0dmFyIGdyb3VwID0gZ3JvdXAxIHx8IGdyb3VwMjtcblx0XHR2YXIgcGFydHMgPSBncm91cC5zcGxpdChcIixcIik7XG5cdFx0dmFyIG5hbWUgPSBwYXJ0cy5zaGlmdCgpO1xuXHRcdHZhciBtZXRob2QgPSBtYXBbbmFtZS50b0xvd2VyQ2FzZSgpXTtcblx0XHRpZiAoIW1ldGhvZCkgeyByZXR1cm4gbWF0Y2g7IH1cblxuXHRcdHZhciBvYmogPSBhcmdzLnNoaWZ0KCk7XG5cdFx0dmFyIHJlcGxhY2VkID0gb2JqW21ldGhvZF0uYXBwbHkob2JqLCBwYXJ0cyk7XG5cblx0XHR2YXIgZmlyc3QgPSBuYW1lLmNoYXJBdCgwKTtcblx0XHRpZiAoZmlyc3QgIT0gZmlyc3QudG9Mb3dlckNhc2UoKSkgeyByZXBsYWNlZCA9IHJlcGxhY2VkLmNhcGl0YWxpemUoKTsgfVxuXG5cdFx0cmV0dXJuIHJlcGxhY2VkO1xuXHR9XG5cdHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKC8lKD86KFthLXpdKyl8KD86eyhbXn1dKyl9KSkvZ2ksIHJlcGxhY2VyKTtcbn1cblxuU3RyaW5nLmZvcm1hdC5tYXAgPSB7XG5cdFwic1wiOiBcInRvU3RyaW5nXCJcbn1cblxuLyoqXG4gKiBDb252ZW5pZW5jZSBzaG9ydGN1dCB0byBTdHJpbmcuZm9ybWF0KHRoaXMpXG4gKi9cblN0cmluZy5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG5cdHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblx0YXJncy51bnNoaWZ0KHRoaXMpO1xuXHRyZXR1cm4gU3RyaW5nLmZvcm1hdC5hcHBseShTdHJpbmcsIGFyZ3MpO1xufVxuXG5pZiAoIU9iamVjdC5jcmVhdGUpIHsgIFxuXHQvKipcblx0ICogRVM1IE9iamVjdC5jcmVhdGVcblx0ICovXG5cdE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbihvKSB7ICBcblx0XHR2YXIgdG1wID0gZnVuY3Rpb24oKSB7fTtcblx0XHR0bXAucHJvdG90eXBlID0gbztcblx0XHRyZXR1cm4gbmV3IHRtcCgpO1xuXHR9OyAgXG59ICBcbi8qKlxuICogU2V0cyBwcm90b3R5cGUgb2YgdGhpcyBmdW5jdGlvbiB0byBhbiBpbnN0YW5jZSBvZiBwYXJlbnQgZnVuY3Rpb25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhcmVudFxuICovXG5GdW5jdGlvbi5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24ocGFyZW50KSB7XG5cdHRoaXMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShwYXJlbnQucHJvdG90eXBlKTtcblx0dGhpcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSB0aGlzO1xuXHRyZXR1cm4gdGhpcztcbn1cbndpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxuXHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lXG5cdHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcblx0fHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZVxuXHR8fCB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZVxuXHR8fCB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcblx0fHwgZnVuY3Rpb24oY2IpIHsgcmV0dXJuIHNldFRpbWVvdXQoY2IsIDEwMDAvNjApOyB9O1xuXG53aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPVxuXHR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWVcblx0fHwgd2luZG93Lm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lXG5cdHx8IHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZVxuXHR8fCB3aW5kb3cub0NhbmNlbEFuaW1hdGlvbkZyYW1lXG5cdHx8IHdpbmRvdy5tc0NhbmNlbEFuaW1hdGlvbkZyYW1lXG5cdHx8IGZ1bmN0aW9uKGlkKSB7IHJldHVybiBjbGVhclRpbWVvdXQoaWQpOyB9O1xuLyoqXG4gKiBAY2xhc3MgVmlzdWFsIG1hcCBkaXNwbGF5XG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMud2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5mb250U2l6ZT0xNV1cbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5mb250RmFtaWx5PVwibW9ub3NwYWNlXCJdXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuZm9udFN0eWxlPVwiXCJdIGJvbGQvaXRhbGljL25vbmUvYm90aFxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmZnPVwiI2NjY1wiXVxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmJnPVwiIzAwMFwiXVxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMuc3BhY2luZz0xXVxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMuYm9yZGVyPTBdXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubGF5b3V0PVwicmVjdFwiXVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRpbGVXaWR0aD0zMl1cbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy50aWxlSGVpZ2h0PTMyXVxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zLnRpbGVNYXA9e31dXG4gKiBAcGFyYW0ge2ltYWdlfSBbb3B0aW9ucy50aWxlU2V0PW51bGxdXG4gKi9cblJPVC5EaXNwbGF5ID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblx0dGhpcy5fY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cdHRoaXMuX2RhdGEgPSB7fTtcblx0dGhpcy5fZGlydHkgPSBmYWxzZTsgLyogZmFsc2UgPSBub3RoaW5nLCB0cnVlID0gYWxsLCBvYmplY3QgPSBkaXJ0eSBjZWxscyAqL1xuXHR0aGlzLl9vcHRpb25zID0ge307XG5cdHRoaXMuX2JhY2tlbmQgPSBudWxsO1xuXHRcblx0dmFyIGRlZmF1bHRPcHRpb25zID0ge1xuXHRcdHdpZHRoOiBST1QuREVGQVVMVF9XSURUSCxcblx0XHRoZWlnaHQ6IFJPVC5ERUZBVUxUX0hFSUdIVCxcblx0XHRsYXlvdXQ6IFwicmVjdFwiLFxuXHRcdGZvbnRTaXplOiAxNSxcblx0XHRzcGFjaW5nOiAxLFxuXHRcdGJvcmRlcjogMCxcblx0XHRmb250RmFtaWx5OiBcIm1vbm9zcGFjZVwiLFxuXHRcdGZvbnRTdHlsZTogXCJcIixcblx0XHRmZzogXCIjY2NjXCIsXG5cdFx0Ymc6IFwiIzAwMFwiLFxuXHRcdHRpbGVXaWR0aDogMzIsXG5cdFx0dGlsZUhlaWdodDogMzIsXG5cdFx0dGlsZU1hcDoge30sXG5cdFx0dGlsZVNldDogbnVsbCxcblx0XHR0ZXJtQ29sb3I6IFwieHRlcm1cIlxuXHR9O1xuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgZGVmYXVsdE9wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XG5cdHRoaXMuc2V0T3B0aW9ucyhkZWZhdWx0T3B0aW9ucyk7XG5cdHRoaXMuREVCVUcgPSB0aGlzLkRFQlVHLmJpbmQodGhpcyk7XG5cblx0dGhpcy5fdGljayA9IHRoaXMuX3RpY2suYmluZCh0aGlzKTtcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX3RpY2spO1xufVxuXG4vKipcbiAqIERlYnVnIGhlbHBlciwgaWRlYWwgYXMgYSBtYXAgZ2VuZXJhdG9yIGNhbGxiYWNrLiBBbHdheXMgYm91bmQgdG8gdGhpcy5cbiAqIEBwYXJhbSB7aW50fSB4XG4gKiBAcGFyYW0ge2ludH0geVxuICogQHBhcmFtIHtpbnR9IHdoYXRcbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLkRFQlVHID0gZnVuY3Rpb24oeCwgeSwgd2hhdCkge1xuXHR2YXIgY29sb3JzID0gW3RoaXMuX29wdGlvbnMuYmcsIHRoaXMuX29wdGlvbnMuZmddO1xuXHR0aGlzLmRyYXcoeCwgeSwgbnVsbCwgbnVsbCwgY29sb3JzW3doYXQgJSBjb2xvcnMubGVuZ3RoXSk7XG59XG5cbi8qKlxuICogQ2xlYXIgdGhlIHdob2xlIGRpc3BsYXkgKGNvdmVyIGl0IHdpdGggYmFja2dyb3VuZCBjb2xvcilcbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuX2RhdGEgPSB7fTtcblx0dGhpcy5fZGlydHkgPSB0cnVlO1xufVxuXG4vKipcbiAqIEBzZWUgUk9ULkRpc3BsYXlcbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxuXHRpZiAob3B0aW9ucy53aWR0aCB8fCBvcHRpb25zLmhlaWdodCB8fCBvcHRpb25zLmZvbnRTaXplIHx8IG9wdGlvbnMuZm9udEZhbWlseSB8fCBvcHRpb25zLnNwYWNpbmcgfHwgb3B0aW9ucy5sYXlvdXQpIHtcblx0XHRpZiAob3B0aW9ucy5sYXlvdXQpIHsgXG5cdFx0XHR0aGlzLl9iYWNrZW5kID0gbmV3IFJPVC5EaXNwbGF5W29wdGlvbnMubGF5b3V0LmNhcGl0YWxpemUoKV0odGhpcy5fY29udGV4dCk7XG5cdFx0fVxuXG5cdFx0dmFyIGZvbnQgPSAodGhpcy5fb3B0aW9ucy5mb250U3R5bGUgPyB0aGlzLl9vcHRpb25zLmZvbnRTdHlsZSArIFwiIFwiIDogXCJcIikgKyB0aGlzLl9vcHRpb25zLmZvbnRTaXplICsgXCJweCBcIiArIHRoaXMuX29wdGlvbnMuZm9udEZhbWlseTtcblx0XHR0aGlzLl9jb250ZXh0LmZvbnQgPSBmb250O1xuXHRcdHRoaXMuX2JhY2tlbmQuY29tcHV0ZSh0aGlzLl9vcHRpb25zKTtcblx0XHR0aGlzLl9jb250ZXh0LmZvbnQgPSBmb250O1xuXHRcdHRoaXMuX2NvbnRleHQudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcblx0XHR0aGlzLl9jb250ZXh0LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCI7XG5cdFx0dGhpcy5fZGlydHkgPSB0cnVlO1xuXHR9XG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFJldHVybnMgY3VycmVudGx5IHNldCBvcHRpb25zXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBDdXJyZW50IG9wdGlvbnMgb2JqZWN0IFxuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZ2V0T3B0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fb3B0aW9ucztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBET00gbm9kZSBvZiB0aGlzIGRpc3BsYXlcbiAqIEByZXR1cm5zIHtub2RlfSBET00gbm9kZVxuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9jb250ZXh0LmNhbnZhcztcbn1cblxuLyoqXG4gKiBDb21wdXRlIHRoZSBtYXhpbXVtIHdpZHRoL2hlaWdodCB0byBmaXQgaW50byBhIHNldCBvZiBnaXZlbiBjb25zdHJhaW50c1xuICogQHBhcmFtIHtpbnR9IGF2YWlsV2lkdGggTWF4aW11bSBhbGxvd2VkIHBpeGVsIHdpZHRoXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxIZWlnaHQgTWF4aW11bSBhbGxvd2VkIHBpeGVsIGhlaWdodFxuICogQHJldHVybnMge2ludFsyXX0gY2VsbFdpZHRoLGNlbGxIZWlnaHRcbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLmNvbXB1dGVTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuY29tcHV0ZVNpemUoYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQsIHRoaXMuX29wdGlvbnMpO1xufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIG1heGltdW0gZm9udCBzaXplIHRvIGZpdCBpbnRvIGEgc2V0IG9mIGdpdmVuIGNvbnN0cmFpbnRzXG4gKiBAcGFyYW0ge2ludH0gYXZhaWxXaWR0aCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgd2lkdGhcbiAqIEBwYXJhbSB7aW50fSBhdmFpbEhlaWdodCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgaGVpZ2h0XG4gKiBAcmV0dXJucyB7aW50fSBmb250U2l6ZVxuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcblx0cmV0dXJuIHRoaXMuX2JhY2tlbmQuY29tcHV0ZUZvbnRTaXplKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0LCB0aGlzLl9vcHRpb25zKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0IGEgRE9NIGV2ZW50IChtb3VzZSBvciB0b3VjaCkgdG8gbWFwIGNvb3JkaW5hdGVzLiBVc2VzIGZpcnN0IHRvdWNoIGZvciBtdWx0aS10b3VjaC5cbiAqIEBwYXJhbSB7RXZlbnR9IGUgZXZlbnRcbiAqIEByZXR1cm5zIHtpbnRbMl19IC0xIGZvciB2YWx1ZXMgb3V0c2lkZSBvZiB0aGUgY2FudmFzXG4gKi9cblJPVC5EaXNwbGF5LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbihlKSB7XG5cdGlmIChlLnRvdWNoZXMpIHtcblx0XHR2YXIgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuXHRcdHZhciB5ID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIHggPSBlLmNsaWVudFg7XG5cdFx0dmFyIHkgPSBlLmNsaWVudFk7XG5cdH1cblxuXHR2YXIgcmVjdCA9IHRoaXMuX2NvbnRleHQuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXHR4IC09IHJlY3QubGVmdDtcblx0eSAtPSByZWN0LnRvcDtcblx0XG5cdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX2NvbnRleHQuY2FudmFzLndpZHRoIHx8IHkgPj0gdGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0KSB7IHJldHVybiBbLTEsIC0xXTsgfVxuXG5cdHJldHVybiB0aGlzLl9iYWNrZW5kLmV2ZW50VG9Qb3NpdGlvbih4LCB5KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ludH0geFxuICogQHBhcmFtIHtpbnR9IHlcbiAqIEBwYXJhbSB7c3RyaW5nIHx8IHN0cmluZ1tdfSBjaCBPbmUgb3IgbW9yZSBjaGFycyAod2lsbCBiZSBvdmVybGFwcGluZyB0aGVtc2VsdmVzKVxuICogQHBhcmFtIHtzdHJpbmd9IFtmZ10gZm9yZWdyb3VuZCBjb2xvclxuICogQHBhcmFtIHtzdHJpbmd9IFtiZ10gYmFja2dyb3VuZCBjb2xvclxuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKHgsIHksIGNoLCBmZywgYmcpIHtcblx0aWYgKCFmZykgeyBmZyA9IHRoaXMuX29wdGlvbnMuZmc7IH1cblx0aWYgKCFiZykgeyBiZyA9IHRoaXMuX29wdGlvbnMuYmc7IH1cblx0dGhpcy5fZGF0YVt4K1wiLFwiK3ldID0gW3gsIHksIGNoLCBmZywgYmddO1xuXHRcblx0aWYgKHRoaXMuX2RpcnR5ID09PSB0cnVlKSB7IHJldHVybjsgfSAvKiB3aWxsIGFscmVhZHkgcmVkcmF3IGV2ZXJ5dGhpbmcgKi9cblx0aWYgKCF0aGlzLl9kaXJ0eSkgeyB0aGlzLl9kaXJ0eSA9IHt9OyB9IC8qIGZpcnN0ISAqL1xuXHR0aGlzLl9kaXJ0eVt4K1wiLFwiK3ldID0gdHJ1ZTtcbn1cblxuLyoqXG4gKiBEcmF3cyBhIHRleHQgYXQgZ2l2ZW4gcG9zaXRpb24uIE9wdGlvbmFsbHkgd3JhcHMgYXQgYSBtYXhpbXVtIGxlbmd0aC4gQ3VycmVudGx5IGRvZXMgbm90IHdvcmsgd2l0aCBoZXggbGF5b3V0LlxuICogQHBhcmFtIHtpbnR9IHhcbiAqIEBwYXJhbSB7aW50fSB5XG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBNYXkgY29udGFpbiBjb2xvci9iYWNrZ3JvdW5kIGZvcm1hdCBzcGVjaWZpZXJzLCAlY3tuYW1lfS8lYntuYW1lfSwgYm90aCBvcHRpb25hbC4gJWN7fS8lYnt9IHJlc2V0cyB0byBkZWZhdWx0LlxuICogQHBhcmFtIHtpbnR9IFttYXhXaWR0aF0gd3JhcCBhdCB3aGF0IHdpZHRoP1xuICogQHJldHVybnMge2ludH0gbGluZXMgZHJhd25cbiAqL1xuUk9ULkRpc3BsYXkucHJvdG90eXBlLmRyYXdUZXh0ID0gZnVuY3Rpb24oeCwgeSwgdGV4dCwgbWF4V2lkdGgpIHtcblx0dmFyIGZnID0gbnVsbDtcblx0dmFyIGJnID0gbnVsbDtcblx0dmFyIGN4ID0geDtcblx0dmFyIGN5ID0geTtcblx0dmFyIGxpbmVzID0gMTtcblx0aWYgKCFtYXhXaWR0aCkgeyBtYXhXaWR0aCA9IHRoaXMuX29wdGlvbnMud2lkdGgteDsgfVxuXG5cdHZhciB0b2tlbnMgPSBST1QuVGV4dC50b2tlbml6ZSh0ZXh0LCBtYXhXaWR0aCk7XG5cblx0d2hpbGUgKHRva2Vucy5sZW5ndGgpIHsgLyogaW50ZXJwcmV0IHRva2VuaXplZCBvcGNvZGUgc3RyZWFtICovXG5cdFx0dmFyIHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG5cdFx0c3dpdGNoICh0b2tlbi50eXBlKSB7XG5cdFx0XHRjYXNlIFJPVC5UZXh0LlRZUEVfVEVYVDpcblx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8dG9rZW4udmFsdWUubGVuZ3RoO2krKykge1xuXHRcdFx0XHRcdHRoaXMuZHJhdyhjeCsrLCBjeSwgdG9rZW4udmFsdWUuY2hhckF0KGkpLCBmZywgYmcpO1xuXHRcdFx0XHR9XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX0ZHOlxuXHRcdFx0XHRmZyA9IHRva2VuLnZhbHVlIHx8IG51bGw7XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX0JHOlxuXHRcdFx0XHRiZyA9IHRva2VuLnZhbHVlIHx8IG51bGw7XG5cdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBST1QuVGV4dC5UWVBFX05FV0xJTkU6XG5cdFx0XHRcdGN4ID0geDtcblx0XHRcdFx0Y3krKztcblx0XHRcdFx0bGluZXMrK1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGxpbmVzO1xufVxuXG4vKipcbiAqIFRpbWVyIHRpY2s6IHVwZGF0ZSBkaXJ0eSBwYXJ0c1xuICovXG5ST1QuRGlzcGxheS5wcm90b3R5cGUuX3RpY2sgPSBmdW5jdGlvbigpIHtcblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX3RpY2spO1xuXG5cdGlmICghdGhpcy5fZGlydHkpIHsgcmV0dXJuOyB9XG5cblx0aWYgKHRoaXMuX2RpcnR5ID09PSB0cnVlKSB7IC8qIGRyYXcgYWxsICovXG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLl9vcHRpb25zLmJnO1xuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGgsIHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodCk7XG5cblx0XHRmb3IgKHZhciBpZCBpbiB0aGlzLl9kYXRhKSB7IC8qIHJlZHJhdyBjYWNoZWQgZGF0YSAqL1xuXHRcdFx0dGhpcy5fZHJhdyhpZCwgZmFsc2UpO1xuXHRcdH1cblxuXHR9IGVsc2UgeyAvKiBkcmF3IG9ubHkgZGlydHkgKi9cblx0XHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fZGlydHkpIHtcblx0XHRcdHRoaXMuX2RyYXcoa2V5LCB0cnVlKTtcblx0XHR9XG5cdH1cblxuXHR0aGlzLl9kaXJ0eSA9IGZhbHNlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgV2hhdCB0byBkcmF3XG4gKiBAcGFyYW0ge2Jvb2x9IGNsZWFyQmVmb3JlIElzIGl0IG5lY2Vzc2FyeSB0byBjbGVhbiBiZWZvcmU/XG4gKi9cblJPVC5EaXNwbGF5LnByb3RvdHlwZS5fZHJhdyA9IGZ1bmN0aW9uKGtleSwgY2xlYXJCZWZvcmUpIHtcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XG5cdGlmIChkYXRhWzRdICE9IHRoaXMuX29wdGlvbnMuYmcpIHsgY2xlYXJCZWZvcmUgPSB0cnVlOyB9XG5cblx0dGhpcy5fYmFja2VuZC5kcmF3KGRhdGEsIGNsZWFyQmVmb3JlKTtcbn1cbi8qKlxuICogQGNsYXNzIEFic3RyYWN0IGRpc3BsYXkgYmFja2VuZCBtb2R1bGVcbiAqIEBwcml2YXRlXG4gKi9cblJPVC5EaXNwbGF5LkJhY2tlbmQgPSBmdW5jdGlvbihjb250ZXh0KSB7XG5cdHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xufVxuXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xufVxuXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcbn1cblxuUk9ULkRpc3BsYXkuQmFja2VuZC5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xufVxuXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xufVxuXG5ST1QuRGlzcGxheS5CYWNrZW5kLnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XG59XG4vKipcbiAqIEBjbGFzcyBSZWN0YW5ndWxhciBiYWNrZW5kXG4gKiBAcHJpdmF0ZVxuICovXG5ST1QuRGlzcGxheS5SZWN0ID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHRST1QuRGlzcGxheS5CYWNrZW5kLmNhbGwodGhpcywgY29udGV4dCk7XG5cdFxuXHR0aGlzLl9zcGFjaW5nWCA9IDA7XG5cdHRoaXMuX3NwYWNpbmdZID0gMDtcblx0dGhpcy5fY2FudmFzQ2FjaGUgPSB7fTtcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xufVxuUk9ULkRpc3BsYXkuUmVjdC5leHRlbmQoUk9ULkRpc3BsYXkuQmFja2VuZCk7XG5cblJPVC5EaXNwbGF5LlJlY3QuY2FjaGUgPSBmYWxzZTtcblxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dGhpcy5fY2FudmFzQ2FjaGUgPSB7fTtcblx0dGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG5cblx0dmFyIGNoYXJXaWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XG5cdHRoaXMuX3NwYWNpbmdYID0gTWF0aC5jZWlsKG9wdGlvbnMuc3BhY2luZyAqIGNoYXJXaWR0aCk7XG5cdHRoaXMuX3NwYWNpbmdZID0gTWF0aC5jZWlsKG9wdGlvbnMuc3BhY2luZyAqIG9wdGlvbnMuZm9udFNpemUpO1xuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGggKiB0aGlzLl9zcGFjaW5nWDtcblx0dGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgKiB0aGlzLl9zcGFjaW5nWTtcbn1cblxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XG5cdGlmICh0aGlzLmNvbnN0cnVjdG9yLmNhY2hlKSB7XG5cdFx0dGhpcy5fZHJhd1dpdGhDYWNoZShkYXRhLCBjbGVhckJlZm9yZSk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5fZHJhd05vQ2FjaGUoZGF0YSwgY2xlYXJCZWZvcmUpO1xuXHR9XG59XG5cblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLl9kcmF3V2l0aENhY2hlID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcblx0dmFyIHggPSBkYXRhWzBdO1xuXHR2YXIgeSA9IGRhdGFbMV07XG5cdHZhciBjaCA9IGRhdGFbMl07XG5cdHZhciBmZyA9IGRhdGFbM107XG5cdHZhciBiZyA9IGRhdGFbNF07XG5cblx0dmFyIGhhc2ggPSBcIlwiK2NoK2ZnK2JnO1xuXHRpZiAoaGFzaCBpbiB0aGlzLl9jYW52YXNDYWNoZSkge1xuXHRcdHZhciBjYW52YXMgPSB0aGlzLl9jYW52YXNDYWNoZVtoYXNoXTtcblx0fSBlbHNlIHtcblx0XHR2YXIgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xuXHRcdHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXHRcdHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXHRcdGNhbnZhcy53aWR0aCA9IHRoaXMuX3NwYWNpbmdYO1xuXHRcdGNhbnZhcy5oZWlnaHQgPSB0aGlzLl9zcGFjaW5nWTtcblx0XHRjdHguZmlsbFN0eWxlID0gYmc7XG5cdFx0Y3R4LmZpbGxSZWN0KGIsIGIsIGNhbnZhcy53aWR0aC1iLCBjYW52YXMuaGVpZ2h0LWIpO1xuXHRcdFxuXHRcdGlmIChjaCkge1xuXHRcdFx0Y3R4LmZpbGxTdHlsZSA9IGZnO1xuXHRcdFx0Y3R4LmZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XG5cdFx0XHRjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcblx0XHRcdGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuXG5cdFx0XHR2YXIgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xuXHRcdFx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xuXHRcdFx0XHRjdHguZmlsbFRleHQoY2hhcnNbaV0sIHRoaXMuX3NwYWNpbmdYLzIsIHRoaXMuX3NwYWNpbmdZLzIpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR0aGlzLl9jYW52YXNDYWNoZVtoYXNoXSA9IGNhbnZhcztcblx0fVxuXHRcblx0dGhpcy5fY29udGV4dC5kcmF3SW1hZ2UoY2FudmFzLCB4KnRoaXMuX3NwYWNpbmdYLCB5KnRoaXMuX3NwYWNpbmdZKTtcbn1cblxuUk9ULkRpc3BsYXkuUmVjdC5wcm90b3R5cGUuX2RyYXdOb0NhY2hlID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcblx0dmFyIHggPSBkYXRhWzBdO1xuXHR2YXIgeSA9IGRhdGFbMV07XG5cdHZhciBjaCA9IGRhdGFbMl07XG5cdHZhciBmZyA9IGRhdGFbM107XG5cdHZhciBiZyA9IGRhdGFbNF07XG5cblx0aWYgKGNsZWFyQmVmb3JlKSB7IFxuXHRcdHZhciBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxSZWN0KHgqdGhpcy5fc3BhY2luZ1ggKyBiLCB5KnRoaXMuX3NwYWNpbmdZICsgYiwgdGhpcy5fc3BhY2luZ1ggLSBiLCB0aGlzLl9zcGFjaW5nWSAtIGIpO1xuXHR9XG5cdFxuXHRpZiAoIWNoKSB7IHJldHVybjsgfVxuXG5cdHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gZmc7XG5cblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcblx0Zm9yICh2YXIgaT0wO2k8Y2hhcnMubGVuZ3RoO2krKykge1xuXHRcdHRoaXMuX2NvbnRleHQuZmlsbFRleHQoY2hhcnNbaV0sICh4KzAuNSkgKiB0aGlzLl9zcGFjaW5nWCwgKHkrMC41KSAqIHRoaXMuX3NwYWNpbmdZKTtcblx0fVxufVxuXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG5cdHZhciB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX3NwYWNpbmdYKTtcblx0dmFyIGhlaWdodCA9IE1hdGguZmxvb3IoYXZhaWxIZWlnaHQgLyB0aGlzLl9zcGFjaW5nWSk7XG5cdHJldHVybiBbd2lkdGgsIGhlaWdodF07XG59XG5cblJPVC5EaXNwbGF5LlJlY3QucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG5cdHZhciBib3hXaWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX29wdGlvbnMud2lkdGgpO1xuXHR2YXIgYm94SGVpZ2h0ID0gTWF0aC5mbG9vcihhdmFpbEhlaWdodCAvIHRoaXMuX29wdGlvbnMuaGVpZ2h0KTtcblxuXHQvKiBjb21wdXRlIGNoYXIgcmF0aW8gKi9cblx0dmFyIG9sZEZvbnQgPSB0aGlzLl9jb250ZXh0LmZvbnQ7XG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IFwiMTAwcHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XG5cdHZhciB3aWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jb250ZXh0Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XG5cdHRoaXMuX2NvbnRleHQuZm9udCA9IG9sZEZvbnQ7XG5cdHZhciByYXRpbyA9IHdpZHRoIC8gMTAwO1xuXHRcdFxuXHR2YXIgd2lkdGhGcmFjdGlvbiA9IHJhdGlvICogYm94SGVpZ2h0IC8gYm94V2lkdGg7XG5cdGlmICh3aWR0aEZyYWN0aW9uID4gMSkgeyAvKiB0b28gd2lkZSB3aXRoIGN1cnJlbnQgYXNwZWN0IHJhdGlvICovXG5cdFx0Ym94SGVpZ2h0ID0gTWF0aC5mbG9vcihib3hIZWlnaHQgLyB3aWR0aEZyYWN0aW9uKTtcblx0fVxuXHRyZXR1cm4gTWF0aC5mbG9vcihib3hIZWlnaHQgLyB0aGlzLl9vcHRpb25zLnNwYWNpbmcpO1xufVxuXG5ST1QuRGlzcGxheS5SZWN0LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XG5cdHJldHVybiBbTWF0aC5mbG9vcih4L3RoaXMuX3NwYWNpbmdYKSwgTWF0aC5mbG9vcih5L3RoaXMuX3NwYWNpbmdZKV07XG59XG4vKipcbiAqIEBjbGFzcyBIZXhhZ29uYWwgYmFja2VuZFxuICogQHByaXZhdGVcbiAqL1xuUk9ULkRpc3BsYXkuSGV4ID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHRST1QuRGlzcGxheS5CYWNrZW5kLmNhbGwodGhpcywgY29udGV4dCk7XG5cblx0dGhpcy5fc3BhY2luZ1ggPSAwO1xuXHR0aGlzLl9zcGFjaW5nWSA9IDA7XG5cdHRoaXMuX2hleFNpemUgPSAwO1xuXHR0aGlzLl9vcHRpb25zID0ge307XG59XG5ST1QuRGlzcGxheS5IZXguZXh0ZW5kKFJPVC5EaXNwbGF5LkJhY2tlbmQpO1xuXG5ST1QuRGlzcGxheS5IZXgucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuXG5cdHZhciBjaGFyV2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xuXHR0aGlzLl9oZXhTaXplID0gTWF0aC5mbG9vcihvcHRpb25zLnNwYWNpbmcgKiAob3B0aW9ucy5mb250U2l6ZSArIGNoYXJXaWR0aC9NYXRoLnNxcnQoMykpIC8gMik7XG5cdHRoaXMuX3NwYWNpbmdYID0gdGhpcy5faGV4U2l6ZSAqIE1hdGguc3FydCgzKSAvIDI7XG5cdHRoaXMuX3NwYWNpbmdZID0gdGhpcy5faGV4U2l6ZSAqIDEuNTtcblx0dGhpcy5fY29udGV4dC5jYW52YXMud2lkdGggPSBNYXRoLmNlaWwoIChvcHRpb25zLndpZHRoICsgMSkgKiB0aGlzLl9zcGFjaW5nWCApO1xuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgPSBNYXRoLmNlaWwoIChvcHRpb25zLmhlaWdodCAtIDEpICogdGhpcy5fc3BhY2luZ1kgKyAyKnRoaXMuX2hleFNpemUgKTtcbn1cblxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oZGF0YSwgY2xlYXJCZWZvcmUpIHtcblx0dmFyIHggPSBkYXRhWzBdO1xuXHR2YXIgeSA9IGRhdGFbMV07XG5cdHZhciBjaCA9IGRhdGFbMl07XG5cdHZhciBmZyA9IGRhdGFbM107XG5cdHZhciBiZyA9IGRhdGFbNF07XG5cblx0dmFyIGN4ID0gKHgrMSkgKiB0aGlzLl9zcGFjaW5nWDtcblx0dmFyIGN5ID0geSAqIHRoaXMuX3NwYWNpbmdZICsgdGhpcy5faGV4U2l6ZTtcblxuXHRpZiAoY2xlYXJCZWZvcmUpIHsgXG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcblx0XHR0aGlzLl9maWxsKGN4LCBjeSk7XG5cdH1cblx0XG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XG5cblx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBmZztcblxuXHR2YXIgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xuXHRmb3IgKHZhciBpPTA7aTxjaGFycy5sZW5ndGg7aSsrKSB7XG5cdFx0dGhpcy5fY29udGV4dC5maWxsVGV4dChjaGFyc1tpXSwgY3gsIGN5KTtcblx0fVxufVxuXG5cblJPVC5EaXNwbGF5LkhleC5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9zcGFjaW5nWCkgLSAxO1xuXHR2YXIgaGVpZ2h0ID0gTWF0aC5mbG9vcigoYXZhaWxIZWlnaHQgLSAyKnRoaXMuX2hleFNpemUpIC8gdGhpcy5fc3BhY2luZ1kgKyAxKTtcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcbn1cblxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5jb21wdXRlRm9udFNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuXHR2YXIgaGV4U2l6ZVdpZHRoID0gMiphdmFpbFdpZHRoIC8gKCh0aGlzLl9vcHRpb25zLndpZHRoKzEpICogTWF0aC5zcXJ0KDMpKSAtIDE7XG5cdHZhciBoZXhTaXplSGVpZ2h0ID0gYXZhaWxIZWlnaHQgLyAoMiArIDEuNSoodGhpcy5fb3B0aW9ucy5oZWlnaHQtMSkpO1xuXHR2YXIgaGV4U2l6ZSA9IE1hdGgubWluKGhleFNpemVXaWR0aCwgaGV4U2l6ZUhlaWdodCk7XG5cblx0LyogY29tcHV0ZSBjaGFyIHJhdGlvICovXG5cdHZhciBvbGRGb250ID0gdGhpcy5fY29udGV4dC5mb250O1xuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBcIjEwMHB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xuXHR2YXIgd2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY29udGV4dC5tZWFzdXJlVGV4dChcIldcIikud2lkdGgpO1xuXHR0aGlzLl9jb250ZXh0LmZvbnQgPSBvbGRGb250O1xuXHR2YXIgcmF0aW8gPSB3aWR0aCAvIDEwMDtcblxuXHRoZXhTaXplID0gTWF0aC5mbG9vcihoZXhTaXplKSsxOyAvKiBjbG9zZXN0IGxhcmdlciBoZXhTaXplICovXG5cblx0dmFyIGZvbnRTaXplID0gMipoZXhTaXplIC8gKHRoaXMuX29wdGlvbnMuc3BhY2luZyAqICgxICsgcmF0aW8gLyBNYXRoLnNxcnQoMykpKTtcblxuXHQvKiBjbG9zZXN0IHNtYWxsZXIgZm9udFNpemUgKi9cblx0cmV0dXJuIE1hdGguY2VpbChmb250U2l6ZSktMTtcbn1cblxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5ldmVudFRvUG9zaXRpb24gPSBmdW5jdGlvbih4LCB5KSB7XG5cdHZhciBoZWlnaHQgPSB0aGlzLl9jb250ZXh0LmNhbnZhcy5oZWlnaHQgLyB0aGlzLl9vcHRpb25zLmhlaWdodDtcblx0eSA9IE1hdGguZmxvb3IoeS9oZWlnaHQpO1xuXHRcblx0aWYgKHkubW9kKDIpKSB7IC8qIG9kZCByb3cgKi9cblx0XHR4IC09IHRoaXMuX3NwYWNpbmdYO1xuXHRcdHggPSAxICsgMipNYXRoLmZsb29yKHgvKDIqdGhpcy5fc3BhY2luZ1gpKTtcblx0fSBlbHNlIHtcblx0XHR4ID0gMipNYXRoLmZsb29yKHgvKDIqdGhpcy5fc3BhY2luZ1gpKTtcblx0fVxuXHRcblx0cmV0dXJuIFt4LCB5XTtcbn1cblxuUk9ULkRpc3BsYXkuSGV4LnByb3RvdHlwZS5fZmlsbCA9IGZ1bmN0aW9uKGN4LCBjeSkge1xuXHR2YXIgYSA9IHRoaXMuX2hleFNpemU7XG5cdHZhciBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XG5cdFxuXHR0aGlzLl9jb250ZXh0LmJlZ2luUGF0aCgpO1xuXHR0aGlzLl9jb250ZXh0Lm1vdmVUbyhjeCwgY3ktYStiKTtcblx0dGhpcy5fY29udGV4dC5saW5lVG8oY3ggKyB0aGlzLl9zcGFjaW5nWCAtIGIsIGN5LWEvMitiKTtcblx0dGhpcy5fY29udGV4dC5saW5lVG8oY3ggKyB0aGlzLl9zcGFjaW5nWCAtIGIsIGN5K2EvMi1iKTtcblx0dGhpcy5fY29udGV4dC5saW5lVG8oY3gsIGN5K2EtYik7XG5cdHRoaXMuX2NvbnRleHQubGluZVRvKGN4IC0gdGhpcy5fc3BhY2luZ1ggKyBiLCBjeSthLzItYik7XG5cdHRoaXMuX2NvbnRleHQubGluZVRvKGN4IC0gdGhpcy5fc3BhY2luZ1ggKyBiLCBjeS1hLzIrYik7XG5cdHRoaXMuX2NvbnRleHQubGluZVRvKGN4LCBjeS1hK2IpO1xuXHR0aGlzLl9jb250ZXh0LmZpbGwoKTtcbn1cbi8qKlxuICogQGNsYXNzIFRpbGUgYmFja2VuZFxuICogQHByaXZhdGVcbiAqL1xuUk9ULkRpc3BsYXkuVGlsZSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0Uk9ULkRpc3BsYXkuUmVjdC5jYWxsKHRoaXMsIGNvbnRleHQpO1xuXHRcblx0dGhpcy5fb3B0aW9ucyA9IHt9O1xufVxuUk9ULkRpc3BsYXkuVGlsZS5leHRlbmQoUk9ULkRpc3BsYXkuUmVjdCk7XG5cblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHRoaXMuX29wdGlvbnMgPSBvcHRpb25zO1xuXHR0aGlzLl9jb250ZXh0LmNhbnZhcy53aWR0aCA9IG9wdGlvbnMud2lkdGggKiBvcHRpb25zLnRpbGVXaWR0aDtcblx0dGhpcy5fY29udGV4dC5jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQgKiBvcHRpb25zLnRpbGVIZWlnaHQ7XG59XG5cblJPVC5EaXNwbGF5LlRpbGUucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihkYXRhLCBjbGVhckJlZm9yZSkge1xuXHR2YXIgeCA9IGRhdGFbMF07XG5cdHZhciB5ID0gZGF0YVsxXTtcblx0dmFyIGNoID0gZGF0YVsyXTtcblx0dmFyIGZnID0gZGF0YVszXTtcblx0dmFyIGJnID0gZGF0YVs0XTtcblxuXHR2YXIgdGlsZVdpZHRoID0gdGhpcy5fb3B0aW9ucy50aWxlV2lkdGg7XG5cdHZhciB0aWxlSGVpZ2h0ID0gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0O1xuXG5cdGlmIChjbGVhckJlZm9yZSkge1xuXHRcdHZhciBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XG5cdFx0dGhpcy5fY29udGV4dC5maWxsU3R5bGUgPSBiZztcblx0XHR0aGlzLl9jb250ZXh0LmZpbGxSZWN0KHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG5cdH1cblxuXHRpZiAoIWNoKSB7IHJldHVybjsgfVxuXG5cdHZhciBjaGFycyA9IFtdLmNvbmNhdChjaCk7XG5cdGZvciAodmFyIGk9MDtpPGNoYXJzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgdGlsZSA9IHRoaXMuX29wdGlvbnMudGlsZU1hcFtjaGFyc1tpXV07XG5cdFx0aWYgKCF0aWxlKSB7IHRocm93IG5ldyBFcnJvcihcIkNoYXIgJ1wiICsgY2hhcnNbaV0gKyBcIicgbm90IGZvdW5kIGluIHRpbGVNYXBcIik7IH1cblx0XHRcblx0XHR0aGlzLl9jb250ZXh0LmRyYXdJbWFnZShcblx0XHRcdHRoaXMuX29wdGlvbnMudGlsZVNldCxcblx0XHRcdHRpbGVbMF0sIHRpbGVbMV0sIHRpbGVXaWR0aCwgdGlsZUhlaWdodCxcblx0XHRcdHgqdGlsZVdpZHRoLCB5KnRpbGVIZWlnaHQsIHRpbGVXaWR0aCwgdGlsZUhlaWdodFxuXHRcdCk7XG5cdH1cbn1cblxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuY29tcHV0ZVNpemUgPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuXHR2YXIgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aCk7XG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KTtcblx0cmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcbn1cblxuUk9ULkRpc3BsYXkuVGlsZS5wcm90b3R5cGUuY29tcHV0ZUZvbnRTaXplID0gZnVuY3Rpb24oYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcblx0dmFyIHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fb3B0aW9ucy53aWR0aCk7XG5cdHZhciBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQpO1xuXHRyZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xufVxuLyoqXG4gKiBAY2xhc3MgVGVybWluYWwgYmFja2VuZFxuICogQHByaXZhdGVcbiAqL1xuUk9ULkRpc3BsYXkuVGVybSA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0Uk9ULkRpc3BsYXkuQmFja2VuZC5jYWxsKHRoaXMsIGNvbnRleHQpO1xuXHR0aGlzLl9jeCA9IC0xO1xuXHR0aGlzLl9jeSA9IC0xO1xuXHR0aGlzLl9sYXN0Q29sb3IgPSBcIlwiO1xuXHR0aGlzLl9vcHRpb25zID0ge307XG5cdHRoaXMuX294ID0gMDtcblx0dGhpcy5fb3kgPSAwO1xuXHR0aGlzLl90ZXJtY29sb3IgPSB7fTtcbn1cblJPVC5EaXNwbGF5LlRlcm0uZXh0ZW5kKFJPVC5EaXNwbGF5LkJhY2tlbmQpO1xuXG5ST1QuRGlzcGxheS5UZXJtLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHR0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcblx0dGhpcy5fb3ggPSBNYXRoLmZsb29yKChwcm9jZXNzLnN0ZG91dC5jb2x1bW5zIC0gb3B0aW9ucy53aWR0aCkgLyAyKTtcblx0dGhpcy5fb3kgPSBNYXRoLmZsb29yKChwcm9jZXNzLnN0ZG91dC5yb3dzIC0gb3B0aW9ucy5oZWlnaHQpIC8gMik7XG5cdHRoaXMuX3Rlcm1jb2xvciA9IG5ldyBST1QuRGlzcGxheS5UZXJtW29wdGlvbnMudGVybUNvbG9yLmNhcGl0YWxpemUoKV0odGhpcy5fY29udGV4dCk7XG5cdHRoaXMuX2NvbnRleHQuX3Rlcm1jb2xvciA9IHRoaXMuX3Rlcm1jb2xvcjtcbn1cblxuUk9ULkRpc3BsYXkuVGVybS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKGRhdGEsIGNsZWFyQmVmb3JlKSB7XG5cdC8vIGRldGVybWluZSB3aGVyZSB0byBkcmF3IHdoYXQgd2l0aCB3aGF0IGNvbG9yc1xuXHR2YXIgeCA9IGRhdGFbMF07XG5cdHZhciB5ID0gZGF0YVsxXTtcblx0dmFyIGNoID0gZGF0YVsyXTtcblx0dmFyIGZnID0gZGF0YVszXTtcblx0dmFyIGJnID0gZGF0YVs0XTtcblxuXHQvLyBkZXRlcm1pbmUgaWYgd2UgbmVlZCB0byBtb3ZlIHRoZSB0ZXJtaW5hbCBjdXJzb3Jcblx0dmFyIGR4ID0gdGhpcy5fb3ggKyB4O1xuXHR2YXIgZHkgPSB0aGlzLl9veSArIHk7XG5cdGlmIChkeCA8IDAgfHwgZHggPj0gcHJvY2Vzcy5zdGRvdXQuY29sdW1ucykgeyByZXR1cm47IH1cblx0aWYgKGR5IDwgMCB8fCBkeSA+PSBwcm9jZXNzLnN0ZG91dC5yb3dzKSB7IHJldHVybjsgfVxuXHRpZiAoZHggIT09IHRoaXMuX2N4IHx8IGR5ICE9PSB0aGlzLl9jeSkge1xuXHRcdHByb2Nlc3Muc3Rkb3V0LndyaXRlKHRoaXMuX3Rlcm1jb2xvci5wb3NpdGlvblRvQW5zaShkeCxkeSkpO1xuXHRcdHRoaXMuX2N4ID0gZHg7XG5cdFx0dGhpcy5fY3kgPSBkeTtcblx0fVxuXG5cdC8vIHRlcm1pbmFscyBhdXRvbWF0aWNhbGx5IGNsZWFyLCBidXQgaWYgd2UncmUgY2xlYXJpbmcgd2hlbiB3ZSdyZVxuXHQvLyBub3Qgb3RoZXJ3aXNlIHByb3ZpZGVkIHdpdGggYSBjaGFyYWN0ZXIsIGp1c3QgdXNlIGEgc3BhY2UgaW5zdGVhZFxuXHRpZiAoY2xlYXJCZWZvcmUpIHtcblx0XHRpZiAoIWNoKSB7XG5cdFx0XHRjaCA9IFwiIFwiO1xuXHRcdH1cblx0fVxuXHRcdFxuXHQvLyBpZiB3ZSdyZSBub3QgY2xlYXJpbmcgYW5kIG5vdCBwcm92aWRlZCB3aXRoIGEgY2hhcmFjdGVyLCBkbyBub3RoaW5nXG5cdGlmICghY2gpIHsgcmV0dXJuOyB9XG5cblx0Ly8gZGV0ZXJtaW5lIGlmIHdlIG5lZWQgdG8gY2hhbmdlIGNvbG9yc1xuXHR2YXIgbmV3Q29sb3IgPSB0aGlzLl90ZXJtY29sb3IuY29sb3JUb0Fuc2koZmcsYmcpO1xuXHRpZiAobmV3Q29sb3IgIT09IHRoaXMuX2xhc3RDb2xvcikge1xuXHRcdHByb2Nlc3Muc3Rkb3V0LndyaXRlKG5ld0NvbG9yKTtcblx0XHR0aGlzLl9sYXN0Q29sb3IgPSBuZXdDb2xvcjtcblx0fVxuXG5cdC8vIHdyaXRlIHRoZSBwcm92aWRlZCBzeW1ib2wgdG8gdGhlIGRpc3BsYXlcblx0dmFyIGNoYXJzID0gW10uY29uY2F0KGNoKTtcblx0cHJvY2Vzcy5zdGRvdXQud3JpdGUoY2hhcnNbMF0pO1xuXG5cdC8vIHVwZGF0ZSBvdXIgcG9zaXRpb24sIGdpdmVuIHRoYXQgd2Ugd3JvdGUgYSBjaGFyYWN0ZXJcblx0dGhpcy5fY3grKztcblx0aWYgKHRoaXMuX2N4ID49IHByb2Nlc3Muc3Rkb3V0LmNvbHVtbnMpIHtcblx0XHR0aGlzLl9jeCA9IDA7XG5cdFx0dGhpcy5fY3krKztcblx0fVxufVxuXG5ST1QuRGlzcGxheS5UZXJtLnByb3RvdHlwZS5jb21wdXRlU2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG5cdHJldHVybiBbcHJvY2Vzcy5zdGRvdXQuY29sdW1ucywgcHJvY2Vzcy5zdGRvdXQucm93c107XG59XG5cblJPVC5EaXNwbGF5LlRlcm0ucHJvdG90eXBlLmNvbXB1dGVGb250U2l6ZSA9IGZ1bmN0aW9uKGF2YWlsV2lkdGgsIGF2YWlsSGVpZ2h0KSB7XG5cdHJldHVybiAxMjtcbn1cblxuUk9ULkRpc3BsYXkuVGVybS5wcm90b3R5cGUuZXZlbnRUb1Bvc2l0aW9uID0gZnVuY3Rpb24oeCwgeSkge1xuXHRyZXR1cm4gW3gseV1cbn1cbi8qKlxuICogQGNsYXNzIEFic3RyYWN0IHRlcm1pbmFsIGNvZGUgbW9kdWxlXG4gKiBAcHJpdmF0ZVxuICovXG5ST1QuRGlzcGxheS5UZXJtLkNvbG9yID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHR0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbn1cblxuUk9ULkRpc3BsYXkuVGVybS5Db2xvci5wcm90b3R5cGUuY2xlYXJUb0Fuc2kgPSBmdW5jdGlvbihiZykge1xufVxuXG5ST1QuRGlzcGxheS5UZXJtLkNvbG9yLnByb3RvdHlwZS5jb2xvclRvQW5zaSA9IGZ1bmN0aW9uKGZnLCBiZykge1xufVxuXG5ST1QuRGlzcGxheS5UZXJtLkNvbG9yLnByb3RvdHlwZS5wb3NpdGlvblRvQW5zaSA9IGZ1bmN0aW9uKHgsIHkpIHtcbn1cbi8qKlxuICogQGNsYXNzIHh0ZXJtIHRlcm1pbmFsIGNvZGUgbW9kdWxlXG4gKiBAcHJpdmF0ZVxuICovXG5ST1QuRGlzcGxheS5UZXJtLlh0ZXJtID0gZnVuY3Rpb24oY29udGV4dCkge1xuXHRST1QuRGlzcGxheS5UZXJtLkNvbG9yLmNhbGwodGhpcywgY29udGV4dCk7XG59XG5ST1QuRGlzcGxheS5UZXJtLlh0ZXJtLmV4dGVuZChST1QuRGlzcGxheS5UZXJtLkNvbG9yKTtcblxuUk9ULkRpc3BsYXkuVGVybS5YdGVybS5wcm90b3R5cGUuY2xlYXJUb0Fuc2kgPSBmdW5jdGlvbihiZykge1xuXHRyZXR1cm4gXCJcXHgxYlswOzQ4OzU7XCJcblx0XHQrIHRoaXMuX3Rlcm1jb2xvcihiZylcblx0XHQrIFwibVxceDFiWzJKXCI7XG59XG5cblJPVC5EaXNwbGF5LlRlcm0uWHRlcm0ucHJvdG90eXBlLmNvbG9yVG9BbnNpID0gZnVuY3Rpb24oZmcsIGJnKSB7XG5cdHJldHVybiBcIlxceDFiWzA7Mzg7NTtcIlxuXHRcdCsgdGhpcy5fdGVybWNvbG9yKGZnKVxuXHRcdCsgXCI7NDg7NTtcIlxuXHRcdCsgdGhpcy5fdGVybWNvbG9yKGJnKVxuXHRcdCsgXCJtXCI7XG59XG5cblJPVC5EaXNwbGF5LlRlcm0uWHRlcm0ucHJvdG90eXBlLnBvc2l0aW9uVG9BbnNpID0gZnVuY3Rpb24oeCwgeSkge1xuXHRyZXR1cm4gXCJcXHgxYltcIiArICh5KzEpICsgXCI7XCIgKyAoeCsxKSArIFwiSFwiO1xufVxuXG5ST1QuRGlzcGxheS5UZXJtLlh0ZXJtLnByb3RvdHlwZS5fdGVybWNvbG9yID0gZnVuY3Rpb24oY29sb3IpIHtcblx0dmFyIFNSQ19DT0xPUlMgPSAyNTYuMDtcblx0dmFyIERTVF9DT0xPUlMgPSA2LjA7XG5cdHZhciBDT0xPUl9SQVRJTyA9IERTVF9DT0xPUlMgLyBTUkNfQ09MT1JTO1xuXHR2YXIgcmdiID0gUk9ULkNvbG9yLmZyb21TdHJpbmcoY29sb3IpO1xuXHR2YXIgciA9IE1hdGguZmxvb3IocmdiWzBdICogQ09MT1JfUkFUSU8pO1xuXHR2YXIgZyA9IE1hdGguZmxvb3IocmdiWzFdICogQ09MT1JfUkFUSU8pO1xuXHR2YXIgYiA9IE1hdGguZmxvb3IocmdiWzJdICogQ09MT1JfUkFUSU8pO1xuXHRyZXR1cm4gciozNiArIGcqNiArIGIqMSArIDE2O1xufVxuLyoqXG4gKiBAbmFtZXNwYWNlXG4gKiBUaGlzIGNvZGUgaXMgYW4gaW1wbGVtZW50YXRpb24gb2YgQWxlYSBhbGdvcml0aG07IChDKSAyMDEwIEpvaGFubmVzIEJhYWfDuGUuXG4gKiBBbGVhIGlzIGxpY2Vuc2VkIGFjY29yZGluZyB0byB0aGUgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZS5cbiAqL1xuUk9ULlJORyA9IHtcblx0LyoqXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFxuXHQgKi9cblx0Z2V0U2VlZDogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3NlZWQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBzZWVkIFNlZWQgdGhlIG51bWJlciBnZW5lcmF0b3Jcblx0ICovXG5cdHNldFNlZWQ6IGZ1bmN0aW9uKHNlZWQpIHtcblx0XHRzZWVkID0gKHNlZWQgPCAxID8gMS9zZWVkIDogc2VlZCk7XG5cblx0XHR0aGlzLl9zZWVkID0gc2VlZDtcblx0XHR0aGlzLl9zMCA9IChzZWVkID4+PiAwKSAqIHRoaXMuX2ZyYWM7XG5cblx0XHRzZWVkID0gKHNlZWQqNjkwNjkgKyAxKSA+Pj4gMDtcblx0XHR0aGlzLl9zMSA9IHNlZWQgKiB0aGlzLl9mcmFjO1xuXG5cdFx0c2VlZCA9IChzZWVkKjY5MDY5ICsgMSkgPj4+IDA7XG5cdFx0dGhpcy5fczIgPSBzZWVkICogdGhpcy5fZnJhYztcblxuXHRcdHRoaXMuX2MgPSAxO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBAcmV0dXJucyB7ZmxvYXR9IFBzZXVkb3JhbmRvbSB2YWx1ZSBbMCwxKSwgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkXG5cdCAqL1xuXHRnZXRVbmlmb3JtOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgdCA9IDIwOTE2MzkgKiB0aGlzLl9zMCArIHRoaXMuX2MgKiB0aGlzLl9mcmFjO1xuXHRcdHRoaXMuX3MwID0gdGhpcy5fczE7XG5cdFx0dGhpcy5fczEgPSB0aGlzLl9zMjtcblx0XHR0aGlzLl9jID0gdCB8IDA7XG5cdFx0dGhpcy5fczIgPSB0IC0gdGhpcy5fYztcblx0XHRyZXR1cm4gdGhpcy5fczI7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7aW50fSBsb3dlckJvdW5kIFRoZSBsb3dlciBlbmQgb2YgdGhlIHJhbmdlIHRvIHJldHVybiBhIHZhbHVlIGZyb20sIGluY2x1c2l2ZVxuXHQgKiBAcGFyYW0ge2ludH0gdXBwZXJCb3VuZCBUaGUgdXBwZXIgZW5kIG9mIHRoZSByYW5nZSB0byByZXR1cm4gYSB2YWx1ZSBmcm9tLCBpbmNsdXNpdmVcblx0ICogQHJldHVybnMge2ludH0gUHNldWRvcmFuZG9tIHZhbHVlIFtsb3dlckJvdW5kLCB1cHBlckJvdW5kXSwgdXNpbmcgUk9ULlJORy5nZXRVbmlmb3JtKCkgdG8gZGlzdHJpYnV0ZSB0aGUgdmFsdWVcblx0ICovXG5cdGdldFVuaWZvcm1JbnQ6IGZ1bmN0aW9uKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcblx0XHR2YXIgbWF4ID0gTWF0aC5tYXgobG93ZXJCb3VuZCwgdXBwZXJCb3VuZCk7XG5cdFx0dmFyIG1pbiA9IE1hdGgubWluKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpO1xuXHRcdHJldHVybiBNYXRoLmZsb29yKHRoaXMuZ2V0VW5pZm9ybSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcblx0fSxcblxuXHQvKipcblx0ICogQHBhcmFtIHtmbG9hdH0gW21lYW49MF0gTWVhbiB2YWx1ZVxuXHQgKiBAcGFyYW0ge2Zsb2F0fSBbc3RkZGV2PTFdIFN0YW5kYXJkIGRldmlhdGlvbi4gfjk1JSBvZiB0aGUgYWJzb2x1dGUgdmFsdWVzIHdpbGwgYmUgbG93ZXIgdGhhbiAyKnN0ZGRldi5cblx0ICogQHJldHVybnMge2Zsb2F0fSBBIG5vcm1hbGx5IGRpc3RyaWJ1dGVkIHBzZXVkb3JhbmRvbSB2YWx1ZVxuXHQgKi9cblx0Z2V0Tm9ybWFsOiBmdW5jdGlvbihtZWFuLCBzdGRkZXYpIHtcblx0XHRkbyB7XG5cdFx0XHR2YXIgdSA9IDIqdGhpcy5nZXRVbmlmb3JtKCktMTtcblx0XHRcdHZhciB2ID0gMip0aGlzLmdldFVuaWZvcm0oKS0xO1xuXHRcdFx0dmFyIHIgPSB1KnUgKyB2KnY7XG5cdFx0fSB3aGlsZSAociA+IDEgfHwgciA9PSAwKTtcblxuXHRcdHZhciBnYXVzcyA9IHUgKiBNYXRoLnNxcnQoLTIqTWF0aC5sb2cocikvcik7XG5cdFx0cmV0dXJuIChtZWFuIHx8IDApICsgZ2F1c3MqKHN0ZGRldiB8fCAxKTtcblx0fSxcblxuXHQvKipcblx0ICogQHJldHVybnMge2ludH0gUHNldWRvcmFuZG9tIHZhbHVlIFsxLDEwMF0gaW5jbHVzaXZlLCB1bmlmb3JtbHkgZGlzdHJpYnV0ZWRcblx0ICovXG5cdGdldFBlcmNlbnRhZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAxICsgTWF0aC5mbG9vcih0aGlzLmdldFVuaWZvcm0oKSoxMDApO1xuXHR9LFxuXHRcblx0LyoqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIGtleT13aGF0ZXZlciwgdmFsdWU9d2VpZ2h0IChyZWxhdGl2ZSBwcm9iYWJpbGl0eSlcblx0ICogQHJldHVybnMge3N0cmluZ30gd2hhdGV2ZXJcblx0ICovXG5cdGdldFdlaWdodGVkVmFsdWU6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHR2YXIgYXZhaWwgPSBbXTtcblx0XHR2YXIgdG90YWwgPSAwO1xuXHRcdFxuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcblx0XHRcdHRvdGFsICs9IGRhdGFbaWRdO1xuXHRcdH1cblx0XHR2YXIgcmFuZG9tID0gTWF0aC5mbG9vcih0aGlzLmdldFVuaWZvcm0oKSp0b3RhbCk7XG5cdFx0XG5cdFx0dmFyIHBhcnQgPSAwO1xuXHRcdGZvciAodmFyIGlkIGluIGRhdGEpIHtcblx0XHRcdHBhcnQgKz0gZGF0YVtpZF07XG5cdFx0XHRpZiAocmFuZG9tIDwgcGFydCkgeyByZXR1cm4gaWQ7IH1cblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIG51bGw7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEdldCBSTkcgc3RhdGUuIFVzZWZ1bCBmb3Igc3RvcmluZyB0aGUgc3RhdGUgYW5kIHJlLXNldHRpbmcgaXQgdmlhIHNldFN0YXRlLlxuXHQgKiBAcmV0dXJucyB7P30gSW50ZXJuYWwgc3RhdGVcblx0ICovXG5cdGdldFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gW3RoaXMuX3MwLCB0aGlzLl9zMSwgdGhpcy5fczIsIHRoaXMuX2NdO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBTZXQgYSBwcmV2aW91c2x5IHJldHJpZXZlZCBzdGF0ZS5cblx0ICogQHBhcmFtIHs/fSBzdGF0ZVxuXHQgKi9cblx0c2V0U3RhdGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG5cdFx0dGhpcy5fczAgPSBzdGF0ZVswXTtcblx0XHR0aGlzLl9zMSA9IHN0YXRlWzFdO1xuXHRcdHRoaXMuX3MyID0gc3RhdGVbMl07XG5cdFx0dGhpcy5fYyAgPSBzdGF0ZVszXTtcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHRfczA6IDAsXG5cdF9zMTogMCxcblx0X3MyOiAwLFxuXHRfYzogMCxcblx0X2ZyYWM6IDIuMzI4MzA2NDM2NTM4Njk2M2UtMTAgLyogMl4tMzIgKi9cbn1cblxuUk9ULlJORy5zZXRTZWVkKERhdGUubm93KCkpO1xuLyoqXG4gKiBAY2xhc3MgKE1hcmtvdiBwcm9jZXNzKS1iYXNlZCBzdHJpbmcgZ2VuZXJhdG9yLiBcbiAqIENvcGllZCBmcm9tIGEgPGEgaHJlZj1cImh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPU5hbWVzX2Zyb21fYV9oaWdoX29yZGVyX01hcmtvdl9Qcm9jZXNzX2FuZF9hX3NpbXBsaWZpZWRfS2F0el9iYWNrLW9mZl9zY2hlbWVcIj5Sb2d1ZUJhc2luIGFydGljbGU8L2E+LiBcbiAqIE9mZmVycyBjb25maWd1cmFibGUgb3JkZXIgYW5kIHByaW9yLlxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtib29sfSBbb3B0aW9ucy53b3Jkcz1mYWxzZV0gVXNlIHdvcmQgbW9kZT9cbiAqIEBwYXJhbSB7aW50fSBbb3B0aW9ucy5vcmRlcj0zXVxuICogQHBhcmFtIHtmbG9hdH0gW29wdGlvbnMucHJpb3I9MC4wMDFdXG4gKi9cblJPVC5TdHJpbmdHZW5lcmF0b3IgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdHRoaXMuX29wdGlvbnMgPSB7XG5cdFx0d29yZHM6IGZhbHNlLFxuXHRcdG9yZGVyOiAzLFxuXHRcdHByaW9yOiAwLjAwMVxuXHR9XG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxuXG5cdHRoaXMuX2JvdW5kYXJ5ID0gU3RyaW5nLmZyb21DaGFyQ29kZSgwKTtcblx0dGhpcy5fc3VmZml4ID0gdGhpcy5fYm91bmRhcnk7XG5cdHRoaXMuX3ByZWZpeCA9IFtdO1xuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9vcHRpb25zLm9yZGVyO2krKykgeyB0aGlzLl9wcmVmaXgucHVzaCh0aGlzLl9ib3VuZGFyeSk7IH1cblxuXHR0aGlzLl9wcmlvclZhbHVlcyA9IHt9O1xuXHR0aGlzLl9wcmlvclZhbHVlc1t0aGlzLl9ib3VuZGFyeV0gPSB0aGlzLl9vcHRpb25zLnByaW9yO1xuXG5cdHRoaXMuX2RhdGEgPSB7fTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYWxsIGxlYXJuaW5nIGRhdGFcbiAqL1xuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5fZGF0YSA9IHt9O1xuXHR0aGlzLl9wcmlvclZhbHVlcyA9IHt9O1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEdlbmVyYXRlZCBzdHJpbmdcbiAqL1xuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlc3VsdCA9IFt0aGlzLl9zYW1wbGUodGhpcy5fcHJlZml4KV07XG5cdHdoaWxlIChyZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXSAhPSB0aGlzLl9ib3VuZGFyeSkge1xuXHRcdHJlc3VsdC5wdXNoKHRoaXMuX3NhbXBsZShyZXN1bHQpKTtcblx0fVxuXHRyZXR1cm4gdGhpcy5fam9pbihyZXN1bHQuc2xpY2UoMCwgLTEpKTtcbn1cblxuLyoqXG4gKiBPYnNlcnZlIChsZWFybikgYSBzdHJpbmcgZnJvbSBhIHRyYWluaW5nIHNldFxuICovXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5vYnNlcnZlID0gZnVuY3Rpb24oc3RyaW5nKSB7XG5cdHZhciB0b2tlbnMgPSB0aGlzLl9zcGxpdChzdHJpbmcpO1xuXG5cdGZvciAodmFyIGk9MDsgaTx0b2tlbnMubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLl9wcmlvclZhbHVlc1t0b2tlbnNbaV1dID0gdGhpcy5fb3B0aW9ucy5wcmlvcjtcblx0fVxuXG5cdHRva2VucyA9IHRoaXMuX3ByZWZpeC5jb25jYXQodG9rZW5zKS5jb25jYXQodGhpcy5fc3VmZml4KTsgLyogYWRkIGJvdW5kYXJ5IHN5bWJvbHMgKi9cblxuXHRmb3IgKHZhciBpPXRoaXMuX29wdGlvbnMub3JkZXI7IGk8dG9rZW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGNvbnRleHQgPSB0b2tlbnMuc2xpY2UoaS10aGlzLl9vcHRpb25zLm9yZGVyLCBpKTtcblx0XHR2YXIgZXZlbnQgPSB0b2tlbnNbaV07XG5cdFx0Zm9yICh2YXIgaj0wOyBqPGNvbnRleHQubGVuZ3RoOyBqKyspIHtcblx0XHRcdHZhciBzdWJjb250ZXh0ID0gY29udGV4dC5zbGljZShqKTtcblx0XHRcdHRoaXMuX29ic2VydmVFdmVudChzdWJjb250ZXh0LCBldmVudCk7XG5cdFx0fVxuXHR9XG59XG5cblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLmdldFN0YXRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBwYXJ0cyA9IFtdO1xuXG5cdHZhciBwcmlvckNvdW50ID0gMDtcblx0Zm9yICh2YXIgcCBpbiB0aGlzLl9wcmlvclZhbHVlcykgeyBwcmlvckNvdW50Kys7IH1cblx0cHJpb3JDb3VudC0tOyAvKiBib3VuZGFyeSAqL1xuXHRwYXJ0cy5wdXNoKFwiZGlzdGluY3Qgc2FtcGxlczogXCIgKyBwcmlvckNvdW50KTtcblxuXHR2YXIgZGF0YUNvdW50ID0gMDtcblx0dmFyIGV2ZW50Q291bnQgPSAwO1xuXHRmb3IgKHZhciBwIGluIHRoaXMuX2RhdGEpIHsgXG5cdFx0ZGF0YUNvdW50Kys7IFxuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9kYXRhW3BdKSB7XG5cdFx0XHRldmVudENvdW50Kys7XG5cdFx0fVxuXHR9XG5cdHBhcnRzLnB1c2goXCJkaWN0aW9uYXJ5IHNpemUgKGNvbnRleHRzKTogXCIgKyBkYXRhQ291bnQpO1xuXHRwYXJ0cy5wdXNoKFwiZGljdGlvbmFyeSBzaXplIChldmVudHMpOiBcIiArIGV2ZW50Q291bnQpO1xuXG5cdHJldHVybiBwYXJ0cy5qb2luKFwiLCBcIik7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9XG4gKiBAcmV0dXJucyB7c3RyaW5nW119XG4gKi9cblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9zcGxpdCA9IGZ1bmN0aW9uKHN0cikge1xuXHRyZXR1cm4gc3RyLnNwbGl0KHRoaXMuX29wdGlvbnMud29yZHMgPyAvXFxzKy8gOiBcIlwiKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxuICogQHJldHVybnMge3N0cmluZ30gXG4gKi9cblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9qb2luID0gZnVuY3Rpb24oYXJyKSB7XG5cdHJldHVybiBhcnIuam9pbih0aGlzLl9vcHRpb25zLndvcmRzID8gXCIgXCIgOiBcIlwiKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBjb250ZXh0XG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAqL1xuUk9ULlN0cmluZ0dlbmVyYXRvci5wcm90b3R5cGUuX29ic2VydmVFdmVudCA9IGZ1bmN0aW9uKGNvbnRleHQsIGV2ZW50KSB7XG5cdHZhciBrZXkgPSB0aGlzLl9qb2luKGNvbnRleHQpO1xuXHRpZiAoIShrZXkgaW4gdGhpcy5fZGF0YSkpIHsgdGhpcy5fZGF0YVtrZXldID0ge307IH1cblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XG5cblx0aWYgKCEoZXZlbnQgaW4gZGF0YSkpIHsgZGF0YVtldmVudF0gPSAwOyB9XG5cdGRhdGFbZXZlbnRdKys7XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmdbXX1cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cblJPVC5TdHJpbmdHZW5lcmF0b3IucHJvdG90eXBlLl9zYW1wbGUgPSBmdW5jdGlvbihjb250ZXh0KSB7XG5cdGNvbnRleHQgPSB0aGlzLl9iYWNrb2ZmKGNvbnRleHQpO1xuXHR2YXIga2V5ID0gdGhpcy5fam9pbihjb250ZXh0KTtcblx0dmFyIGRhdGEgPSB0aGlzLl9kYXRhW2tleV07XG5cblx0dmFyIGF2YWlsYWJsZSA9IHt9O1xuXG5cdGlmICh0aGlzLl9vcHRpb25zLnByaW9yKSB7XG5cdFx0Zm9yICh2YXIgZXZlbnQgaW4gdGhpcy5fcHJpb3JWYWx1ZXMpIHsgYXZhaWxhYmxlW2V2ZW50XSA9IHRoaXMuX3ByaW9yVmFsdWVzW2V2ZW50XTsgfVxuXHRcdGZvciAodmFyIGV2ZW50IGluIGRhdGEpIHsgYXZhaWxhYmxlW2V2ZW50XSArPSBkYXRhW2V2ZW50XTsgfVxuXHR9IGVsc2UgeyBcblx0XHRhdmFpbGFibGUgPSBkYXRhO1xuXHR9XG5cblx0cmV0dXJuIHRoaXMuX3BpY2tSYW5kb20oYXZhaWxhYmxlKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfVxuICogQHJldHVybnMge3N0cmluZ1tdfVxuICovXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fYmFja29mZiA9IGZ1bmN0aW9uKGNvbnRleHQpIHtcblx0aWYgKGNvbnRleHQubGVuZ3RoID4gdGhpcy5fb3B0aW9ucy5vcmRlcikge1xuXHRcdGNvbnRleHQgPSBjb250ZXh0LnNsaWNlKC10aGlzLl9vcHRpb25zLm9yZGVyKTtcblx0fSBlbHNlIGlmIChjb250ZXh0Lmxlbmd0aCA8IHRoaXMuX29wdGlvbnMub3JkZXIpIHtcblx0XHRjb250ZXh0ID0gdGhpcy5fcHJlZml4LnNsaWNlKDAsIHRoaXMuX29wdGlvbnMub3JkZXIgLSBjb250ZXh0Lmxlbmd0aCkuY29uY2F0KGNvbnRleHQpO1xuXHR9XG5cblx0d2hpbGUgKCEodGhpcy5fam9pbihjb250ZXh0KSBpbiB0aGlzLl9kYXRhKSAmJiBjb250ZXh0Lmxlbmd0aCA+IDApIHsgY29udGV4dCA9IGNvbnRleHQuc2xpY2UoMSk7IH1cblxuXHRyZXR1cm4gY29udGV4dDtcbn1cblxuXG5ST1QuU3RyaW5nR2VuZXJhdG9yLnByb3RvdHlwZS5fcGlja1JhbmRvbSA9IGZ1bmN0aW9uKGRhdGEpIHtcblx0dmFyIHRvdGFsID0gMDtcblx0XG5cdGZvciAodmFyIGlkIGluIGRhdGEpIHtcblx0XHR0b3RhbCArPSBkYXRhW2lkXTtcblx0fVxuXHR2YXIgcmFuZG9tID0gUk9ULlJORy5nZXRVbmlmb3JtKCkqdG90YWw7XG5cdFxuXHR2YXIgcGFydCA9IDA7XG5cdGZvciAodmFyIGlkIGluIGRhdGEpIHtcblx0XHRwYXJ0ICs9IGRhdGFbaWRdO1xuXHRcdGlmIChyYW5kb20gPCBwYXJ0KSB7IHJldHVybiBpZDsgfVxuXHR9XG59XG4vKipcbiAqIEBjbGFzcyBHZW5lcmljIGV2ZW50IHF1ZXVlOiBzdG9yZXMgZXZlbnRzIGFuZCByZXRyaWV2ZXMgdGhlbSBiYXNlZCBvbiB0aGVpciB0aW1lXG4gKi9cblJPVC5FdmVudFF1ZXVlID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuX3RpbWUgPSAwO1xuXHR0aGlzLl9ldmVudHMgPSBbXTtcblx0dGhpcy5fZXZlbnRUaW1lcyA9IFtdO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEVsYXBzZWQgdGltZVxuICovXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuZ2V0VGltZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fdGltZTtcbn1cblxuLyoqXG4gKiBDbGVhciBhbGwgc2NoZWR1bGVkIGV2ZW50c1xuICovXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5fZXZlbnRzID0gW107XG5cdHRoaXMuX2V2ZW50VGltZXMgPSBbXTtcblx0cmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQHBhcmFtIHs/fSBldmVudFxuICogQHBhcmFtIHtudW1iZXJ9IHRpbWVcbiAqL1xuUk9ULkV2ZW50UXVldWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGV2ZW50LCB0aW1lKSB7XG5cdHZhciBpbmRleCA9IHRoaXMuX2V2ZW50cy5sZW5ndGg7XG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX2V2ZW50VGltZXMubGVuZ3RoO2krKykge1xuXHRcdGlmICh0aGlzLl9ldmVudFRpbWVzW2ldID4gdGltZSkge1xuXHRcdFx0aW5kZXggPSBpO1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0dGhpcy5fZXZlbnRzLnNwbGljZShpbmRleCwgMCwgZXZlbnQpO1xuXHR0aGlzLl9ldmVudFRpbWVzLnNwbGljZShpbmRleCwgMCwgdGltZSk7XG59XG5cbi8qKlxuICogTG9jYXRlcyB0aGUgbmVhcmVzdCBldmVudCwgYWR2YW5jZXMgdGltZSBpZiBuZWNlc3NhcnkuIFJldHVybnMgdGhhdCBldmVudCBhbmQgcmVtb3ZlcyBpdCBmcm9tIHRoZSBxdWV1ZS5cbiAqIEByZXR1cm5zIHs/IHx8IG51bGx9IFRoZSBldmVudCBwcmV2aW91c2x5IGFkZGVkIGJ5IGFkZEV2ZW50LCBudWxsIGlmIG5vIGV2ZW50IGF2YWlsYWJsZVxuICovXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICghdGhpcy5fZXZlbnRzLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfVxuXG5cdHZhciB0aW1lID0gdGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoMCwgMSlbMF07XG5cdGlmICh0aW1lID4gMCkgeyAvKiBhZHZhbmNlICovXG5cdFx0dGhpcy5fdGltZSArPSB0aW1lO1xuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX2V2ZW50VGltZXMubGVuZ3RoO2krKykgeyB0aGlzLl9ldmVudFRpbWVzW2ldIC09IHRpbWU7IH1cblx0fVxuXG5cdHJldHVybiB0aGlzLl9ldmVudHMuc3BsaWNlKDAsIDEpWzBdO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbiBldmVudCBmcm9tIHRoZSBxdWV1ZVxuICogQHBhcmFtIHs/fSBldmVudFxuICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3M/XG4gKi9cblJPVC5FdmVudFF1ZXVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihldmVudCkge1xuXHR2YXIgaW5kZXggPSB0aGlzLl9ldmVudHMuaW5kZXhPZihldmVudCk7XG5cdGlmIChpbmRleCA9PSAtMSkgeyByZXR1cm4gZmFsc2UgfVxuXHR0aGlzLl9yZW1vdmUoaW5kZXgpO1xuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW4gZXZlbnQgZnJvbSB0aGUgcXVldWVcbiAqIEBwYXJhbSB7aW50fSBpbmRleFxuICovXG5ST1QuRXZlbnRRdWV1ZS5wcm90b3R5cGUuX3JlbW92ZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG5cdHRoaXMuX2V2ZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuXHR0aGlzLl9ldmVudFRpbWVzLnNwbGljZShpbmRleCwgMSk7XG59XG4vKipcbiAqIEBjbGFzcyBBYnN0cmFjdCBzY2hlZHVsZXJcbiAqL1xuUk9ULlNjaGVkdWxlciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9xdWV1ZSA9IG5ldyBST1QuRXZlbnRRdWV1ZSgpO1xuXHR0aGlzLl9yZXBlYXQgPSBbXTtcblx0dGhpcy5fY3VycmVudCA9IG51bGw7XG59XG5cbi8qKlxuICogQHNlZSBST1QuRXZlbnRRdWV1ZSNnZXRUaW1lXG4gKi9cblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3F1ZXVlLmdldFRpbWUoKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gez99IGl0ZW1cbiAqIEBwYXJhbSB7Ym9vbH0gcmVwZWF0XG4gKi9cblJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCkge1xuXHRpZiAocmVwZWF0KSB7IHRoaXMuX3JlcGVhdC5wdXNoKGl0ZW0pOyB9XG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENsZWFyIGFsbCBpdGVtc1xuICovXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9xdWV1ZS5jbGVhcigpO1xuXHR0aGlzLl9yZXBlYXQgPSBbXTtcblx0dGhpcy5fY3VycmVudCA9IG51bGw7XG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIHByZXZpb3VzbHkgYWRkZWQgaXRlbVxuICogQHBhcmFtIHs/fSBpdGVtXG4gKiBAcmV0dXJucyB7Ym9vbH0gc3VjY2Vzc2Z1bD9cbiAqL1xuUk9ULlNjaGVkdWxlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaXRlbSkge1xuXHR2YXIgcmVzdWx0ID0gdGhpcy5fcXVldWUucmVtb3ZlKGl0ZW0pO1xuXG5cdHZhciBpbmRleCA9IHRoaXMuX3JlcGVhdC5pbmRleE9mKGl0ZW0pO1xuXHRpZiAoaW5kZXggIT0gLTEpIHsgdGhpcy5fcmVwZWF0LnNwbGljZShpbmRleCwgMSk7IH1cblxuXHRpZiAodGhpcy5fY3VycmVudCA9PSBpdGVtKSB7IHRoaXMuX2N1cnJlbnQgPSBudWxsOyB9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBTY2hlZHVsZSBuZXh0IGl0ZW1cbiAqIEByZXR1cm5zIHs/fVxuICovXG5ST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9xdWV1ZS5nZXQoKTtcblx0cmV0dXJuIHRoaXMuX2N1cnJlbnQ7XG59XG4vKipcbiAqIEBjbGFzcyBTaW1wbGUgZmFpciBzY2hlZHVsZXIgKHJvdW5kLXJvYmluIHN0eWxlKVxuICogQGF1Z21lbnRzIFJPVC5TY2hlZHVsZXJcbiAqL1xuUk9ULlNjaGVkdWxlci5TaW1wbGUgPSBmdW5jdGlvbigpIHtcblx0Uk9ULlNjaGVkdWxlci5jYWxsKHRoaXMpO1xufVxuUk9ULlNjaGVkdWxlci5TaW1wbGUuZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xuXG4vKipcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNhZGRcbiAqL1xuUk9ULlNjaGVkdWxlci5TaW1wbGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKGl0ZW0sIHJlcGVhdCkge1xuXHR0aGlzLl9xdWV1ZS5hZGQoaXRlbSwgMCk7XG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5hZGQuY2FsbCh0aGlzLCBpdGVtLCByZXBlYXQpO1xufVxuXG4vKipcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XG4gKi9cblJPVC5TY2hlZHVsZXIuU2ltcGxlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLl9jdXJyZW50ICYmIHRoaXMuX3JlcGVhdC5pbmRleE9mKHRoaXMuX2N1cnJlbnQpICE9IC0xKSB7XG5cdFx0dGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIDApO1xuXHR9XG5cdHJldHVybiBST1QuU2NoZWR1bGVyLnByb3RvdHlwZS5uZXh0LmNhbGwodGhpcyk7XG59XG4vKipcbiAqIEBjbGFzcyBTcGVlZC1iYXNlZCBzY2hlZHVsZXJcbiAqIEBhdWdtZW50cyBST1QuU2NoZWR1bGVyXG4gKi9cblJPVC5TY2hlZHVsZXIuU3BlZWQgPSBmdW5jdGlvbigpIHtcblx0Uk9ULlNjaGVkdWxlci5jYWxsKHRoaXMpO1xufVxuUk9ULlNjaGVkdWxlci5TcGVlZC5leHRlbmQoUk9ULlNjaGVkdWxlcik7XG5cbi8qKlxuICogQHBhcmFtIHtvYmplY3R9IGl0ZW0gYW55dGhpbmcgd2l0aCBcImdldFNwZWVkXCIgbWV0aG9kXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxuICogQHNlZSBST1QuU2NoZWR1bGVyI2FkZFxuICovXG5ST1QuU2NoZWR1bGVyLlNwZWVkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQpIHtcblx0dGhpcy5fcXVldWUuYWRkKGl0ZW0sIDEvaXRlbS5nZXRTcGVlZCgpKTtcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XG59XG5cbi8qKlxuICogQHNlZSBST1QuU2NoZWR1bGVyI25leHRcbiAqL1xuUk9ULlNjaGVkdWxlci5TcGVlZC5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAodGhpcy5fY3VycmVudCAmJiB0aGlzLl9yZXBlYXQuaW5kZXhPZih0aGlzLl9jdXJyZW50KSAhPSAtMSkge1xuXHRcdHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCAxL3RoaXMuX2N1cnJlbnQuZ2V0U3BlZWQoKSk7XG5cdH1cblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcbn1cbi8qKlxuICogQGNsYXNzIEFjdGlvbi1iYXNlZCBzY2hlZHVsZXJcbiAqIEBhdWdtZW50cyBST1QuU2NoZWR1bGVyXG4gKi9cblJPVC5TY2hlZHVsZXIuQWN0aW9uID0gZnVuY3Rpb24oKSB7XG5cdFJPVC5TY2hlZHVsZXIuY2FsbCh0aGlzKTtcblx0dGhpcy5fZGVmYXVsdER1cmF0aW9uID0gMTsgLyogZm9yIG5ld2x5IGFkZGVkICovXG5cdHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uOyAvKiBmb3IgdGhpcy5fY3VycmVudCAqL1xufVxuUk9ULlNjaGVkdWxlci5BY3Rpb24uZXh0ZW5kKFJPVC5TY2hlZHVsZXIpO1xuXG4vKipcbiAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtXG4gKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxuICogQHBhcmFtIHtudW1iZXJ9IFt0aW1lPTFdXG4gKiBAc2VlIFJPVC5TY2hlZHVsZXIjYWRkXG4gKi9cblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihpdGVtLCByZXBlYXQsIHRpbWUpIHtcblx0dGhpcy5fcXVldWUuYWRkKGl0ZW0sIHRpbWUgfHwgdGhpcy5fZGVmYXVsdER1cmF0aW9uKTtcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmFkZC5jYWxsKHRoaXMsIGl0ZW0sIHJlcGVhdCk7XG59XG5cblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLmNsZWFyLmNhbGwodGhpcyk7XG59XG5cblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpdGVtKSB7XG5cdGlmIChpdGVtID09IHRoaXMuX2N1cnJlbnQpIHsgdGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247IH1cblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLnJlbW92ZS5jYWxsKHRoaXMsIGl0ZW0pO1xufVxuXG4vKipcbiAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XG4gKi9cblJPVC5TY2hlZHVsZXIuQWN0aW9uLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG5cdGlmICh0aGlzLl9jdXJyZW50ICYmIHRoaXMuX3JlcGVhdC5pbmRleE9mKHRoaXMuX2N1cnJlbnQpICE9IC0xKSB7XG5cdFx0dGhpcy5fcXVldWUuYWRkKHRoaXMuX2N1cnJlbnQsIHRoaXMuX2R1cmF0aW9uIHx8IHRoaXMuX2RlZmF1bHREdXJhdGlvbik7XG5cdFx0dGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247XG5cdH1cblx0cmV0dXJuIFJPVC5TY2hlZHVsZXIucHJvdG90eXBlLm5leHQuY2FsbCh0aGlzKTtcbn1cblxuLyoqXG4gKiBTZXQgZHVyYXRpb24gZm9yIHRoZSBhY3RpdmUgaXRlbVxuICovXG5ST1QuU2NoZWR1bGVyLkFjdGlvbi5wcm90b3R5cGUuc2V0RHVyYXRpb24gPSBmdW5jdGlvbih0aW1lKSB7XG5cdGlmICh0aGlzLl9jdXJyZW50KSB7IHRoaXMuX2R1cmF0aW9uID0gdGltZTsgfVxuXHRyZXR1cm4gdGhpcztcbn1cbi8qKlxuICogQGNsYXNzIEFzeW5jaHJvbm91cyBtYWluIGxvb3BcbiAqIEBwYXJhbSB7Uk9ULlNjaGVkdWxlcn0gc2NoZWR1bGVyXG4gKi9cblJPVC5FbmdpbmUgPSBmdW5jdGlvbihzY2hlZHVsZXIpIHtcblx0dGhpcy5fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuXHR0aGlzLl9sb2NrID0gMTtcbn1cblxuLyoqXG4gKiBTdGFydCB0aGUgbWFpbiBsb29wLiBXaGVuIHRoaXMgY2FsbCByZXR1cm5zLCB0aGUgbG9vcCBpcyBsb2NrZWQuXG4gKi9cblJPVC5FbmdpbmUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLnVubG9jaygpO1xufVxuXG4vKipcbiAqIEludGVycnVwdCB0aGUgZW5naW5lIGJ5IGFuIGFzeW5jaHJvbm91cyBhY3Rpb25cbiAqL1xuUk9ULkVuZ2luZS5wcm90b3R5cGUubG9jayA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9sb2NrKys7XG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFJlc3VtZSBleGVjdXRpb24gKHBhdXNlZCBieSBhIHByZXZpb3VzIGxvY2spXG4gKi9cblJPVC5FbmdpbmUucHJvdG90eXBlLnVubG9jayA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIXRoaXMuX2xvY2spIHsgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHVubG9jayB1bmxvY2tlZCBlbmdpbmVcIik7IH1cblx0dGhpcy5fbG9jay0tO1xuXG5cdHdoaWxlICghdGhpcy5fbG9jaykge1xuXHRcdHZhciBhY3RvciA9IHRoaXMuX3NjaGVkdWxlci5uZXh0KCk7XG5cdFx0aWYgKCFhY3RvcikgeyByZXR1cm4gdGhpcy5sb2NrKCk7IH0gLyogbm8gYWN0b3JzICovXG5cdFx0dmFyIHJlc3VsdCA9IGFjdG9yLmFjdCgpO1xuXHRcdGlmIChyZXN1bHQgJiYgcmVzdWx0LnRoZW4pIHsgLyogYWN0b3IgcmV0dXJuZWQgYSBcInRoZW5hYmxlXCIsIGxvb2tzIGxpa2UgYSBQcm9taXNlICovXG5cdFx0XHR0aGlzLmxvY2soKTtcblx0XHRcdHJlc3VsdC50aGVuKHRoaXMudW5sb2NrLmJpbmQodGhpcykpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0aGlzO1xufVxuLyoqXG4gKiBAY2xhc3MgQmFzZSBtYXAgZ2VuZXJhdG9yXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxuICovXG5ST1QuTWFwID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXHR0aGlzLl93aWR0aCA9IHdpZHRoIHx8IFJPVC5ERUZBVUxUX1dJRFRIO1xuXHR0aGlzLl9oZWlnaHQgPSBoZWlnaHQgfHwgUk9ULkRFRkFVTFRfSEVJR0hUO1xufTtcblxuUk9ULk1hcC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHt9XG5cblJPVC5NYXAucHJvdG90eXBlLl9maWxsTWFwID0gZnVuY3Rpb24odmFsdWUpIHtcblx0dmFyIG1hcCA9IFtdO1xuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcblx0XHRtYXAucHVzaChbXSk7XG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykgeyBtYXBbaV0ucHVzaCh2YWx1ZSk7IH1cblx0fVxuXHRyZXR1cm4gbWFwO1xufVxuLyoqXG4gKiBAY2xhc3MgU2ltcGxlIGVtcHR5IHJlY3Rhbmd1bGFyIHJvb21cbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKi9cblJPVC5NYXAuQXJlbmEgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcbn1cblJPVC5NYXAuQXJlbmEuZXh0ZW5kKFJPVC5NYXApO1xuXG5ST1QuTWFwLkFyZW5hLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuXHR2YXIgdyA9IHRoaXMuX3dpZHRoLTE7XG5cdHZhciBoID0gdGhpcy5faGVpZ2h0LTE7XG5cdGZvciAodmFyIGk9MDtpPD13O2krKykge1xuXHRcdGZvciAodmFyIGo9MDtqPD1oO2orKykge1xuXHRcdFx0dmFyIGVtcHR5ID0gKGkgJiYgaiAmJiBpPHcgJiYgajxoKTtcblx0XHRcdGNhbGxiYWNrKGksIGosIGVtcHR5ID8gMCA6IDEpO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdGhpcztcbn1cbi8qKlxuICogQGNsYXNzIFJlY3Vyc2l2ZWx5IGRpdmlkZWQgbWF6ZSwgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NYXplX2dlbmVyYXRpb25fYWxnb3JpdGhtI1JlY3Vyc2l2ZV9kaXZpc2lvbl9tZXRob2RcbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKi9cblJPVC5NYXAuRGl2aWRlZE1hemUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcblx0dGhpcy5fc3RhY2sgPSBbXTtcbn1cblJPVC5NYXAuRGl2aWRlZE1hemUuZXh0ZW5kKFJPVC5NYXApO1xuXG5ST1QuTWFwLkRpdmlkZWRNYXplLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuXHR2YXIgdyA9IHRoaXMuX3dpZHRoO1xuXHR2YXIgaCA9IHRoaXMuX2hlaWdodDtcblx0XG5cdHRoaXMuX21hcCA9IFtdO1xuXHRcblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcblx0XHR0aGlzLl9tYXAucHVzaChbXSk7XG5cdFx0Zm9yICh2YXIgaj0wO2o8aDtqKyspIHtcblx0XHRcdHZhciBib3JkZXIgPSAoaSA9PSAwIHx8IGogPT0gMCB8fCBpKzEgPT0gdyB8fCBqKzEgPT0gaCk7XG5cdFx0XHR0aGlzLl9tYXBbaV0ucHVzaChib3JkZXIgPyAxIDogMCk7XG5cdFx0fVxuXHR9XG5cdFxuXHR0aGlzLl9zdGFjayA9IFtcblx0XHRbMSwgMSwgdy0yLCBoLTJdXG5cdF07XG5cdHRoaXMuX3Byb2Nlc3MoKTtcblx0XG5cdGZvciAodmFyIGk9MDtpPHc7aSsrKSB7XG5cdFx0Zm9yICh2YXIgaj0wO2o8aDtqKyspIHtcblx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XG5cdFx0fVxuXHR9XG5cdHRoaXMuX21hcCA9IG51bGw7XG5cdHJldHVybiB0aGlzO1xufVxuXG5ST1QuTWFwLkRpdmlkZWRNYXplLnByb3RvdHlwZS5fcHJvY2VzcyA9IGZ1bmN0aW9uKCkge1xuXHR3aGlsZSAodGhpcy5fc3RhY2subGVuZ3RoKSB7XG5cdFx0dmFyIHJvb20gPSB0aGlzLl9zdGFjay5zaGlmdCgpOyAvKiBbbGVmdCwgdG9wLCByaWdodCwgYm90dG9tXSAqL1xuXHRcdHRoaXMuX3BhcnRpdGlvblJvb20ocm9vbSk7XG5cdH1cbn1cblxuUk9ULk1hcC5EaXZpZGVkTWF6ZS5wcm90b3R5cGUuX3BhcnRpdGlvblJvb20gPSBmdW5jdGlvbihyb29tKSB7XG5cdHZhciBhdmFpbFggPSBbXTtcblx0dmFyIGF2YWlsWSA9IFtdO1xuXHRcblx0Zm9yICh2YXIgaT1yb29tWzBdKzE7aTxyb29tWzJdO2krKykge1xuXHRcdHZhciB0b3AgPSB0aGlzLl9tYXBbaV1bcm9vbVsxXS0xXTtcblx0XHR2YXIgYm90dG9tID0gdGhpcy5fbWFwW2ldW3Jvb21bM10rMV07XG5cdFx0aWYgKHRvcCAmJiBib3R0b20gJiYgIShpICUgMikpIHsgYXZhaWxYLnB1c2goaSk7IH1cblx0fVxuXHRcblx0Zm9yICh2YXIgaj1yb29tWzFdKzE7ajxyb29tWzNdO2orKykge1xuXHRcdHZhciBsZWZ0ID0gdGhpcy5fbWFwW3Jvb21bMF0tMV1bal07XG5cdFx0dmFyIHJpZ2h0ID0gdGhpcy5fbWFwW3Jvb21bMl0rMV1bal07XG5cdFx0aWYgKGxlZnQgJiYgcmlnaHQgJiYgIShqICUgMikpIHsgYXZhaWxZLnB1c2goaik7IH1cblx0fVxuXG5cdGlmICghYXZhaWxYLmxlbmd0aCB8fCAhYXZhaWxZLmxlbmd0aCkgeyByZXR1cm47IH1cblxuXHR2YXIgeCA9IGF2YWlsWC5yYW5kb20oKTtcblx0dmFyIHkgPSBhdmFpbFkucmFuZG9tKCk7XG5cdFxuXHR0aGlzLl9tYXBbeF1beV0gPSAxO1xuXHRcblx0dmFyIHdhbGxzID0gW107XG5cdFxuXHR2YXIgdyA9IFtdOyB3YWxscy5wdXNoKHcpOyAvKiBsZWZ0IHBhcnQgKi9cblx0Zm9yICh2YXIgaT1yb29tWzBdOyBpPHg7IGkrKykgeyBcblx0XHR0aGlzLl9tYXBbaV1beV0gPSAxO1xuXHRcdHcucHVzaChbaSwgeV0pOyBcblx0fVxuXHRcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogcmlnaHQgcGFydCAqL1xuXHRmb3IgKHZhciBpPXgrMTsgaTw9cm9vbVsyXTsgaSsrKSB7IFxuXHRcdHRoaXMuX21hcFtpXVt5XSA9IDE7XG5cdFx0dy5wdXNoKFtpLCB5XSk7IFxuXHR9XG5cblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogdG9wIHBhcnQgKi9cblx0Zm9yICh2YXIgaj1yb29tWzFdOyBqPHk7IGorKykgeyBcblx0XHR0aGlzLl9tYXBbeF1bal0gPSAxO1xuXHRcdHcucHVzaChbeCwgal0pOyBcblx0fVxuXHRcblx0dmFyIHcgPSBbXTsgd2FsbHMucHVzaCh3KTsgLyogYm90dG9tIHBhcnQgKi9cblx0Zm9yICh2YXIgaj15KzE7IGo8PXJvb21bM107IGorKykgeyBcblx0XHR0aGlzLl9tYXBbeF1bal0gPSAxO1xuXHRcdHcucHVzaChbeCwgal0pOyBcblx0fVxuXHRcdFxuXHR2YXIgc29saWQgPSB3YWxscy5yYW5kb20oKTtcblx0Zm9yICh2YXIgaT0wO2k8d2FsbHMubGVuZ3RoO2krKykge1xuXHRcdHZhciB3ID0gd2FsbHNbaV07XG5cdFx0aWYgKHcgPT0gc29saWQpIHsgY29udGludWU7IH1cblx0XHRcblx0XHR2YXIgaG9sZSA9IHcucmFuZG9tKCk7XG5cdFx0dGhpcy5fbWFwW2hvbGVbMF1dW2hvbGVbMV1dID0gMDtcblx0fVxuXG5cdHRoaXMuX3N0YWNrLnB1c2goW3Jvb21bMF0sIHJvb21bMV0sIHgtMSwgeS0xXSk7IC8qIGxlZnQgdG9wICovXG5cdHRoaXMuX3N0YWNrLnB1c2goW3grMSwgcm9vbVsxXSwgcm9vbVsyXSwgeS0xXSk7IC8qIHJpZ2h0IHRvcCAqL1xuXHR0aGlzLl9zdGFjay5wdXNoKFtyb29tWzBdLCB5KzEsIHgtMSwgcm9vbVszXV0pOyAvKiBsZWZ0IGJvdHRvbSAqL1xuXHR0aGlzLl9zdGFjay5wdXNoKFt4KzEsIHkrMSwgcm9vbVsyXSwgcm9vbVszXV0pOyAvKiByaWdodCBib3R0b20gKi9cbn1cbi8qKlxuICogQGNsYXNzIEljZXkncyBNYXplIGdlbmVyYXRvclxuICogU2VlIGh0dHA6Ly93d3cucm9ndWViYXNpbi5yb2d1ZWxpa2VkZXZlbG9wbWVudC5vcmcvaW5kZXgucGhwP3RpdGxlPVNpbXBsZV9tYXplIGZvciBleHBsYW5hdGlvblxuICogQGF1Z21lbnRzIFJPVC5NYXBcbiAqL1xuUk9ULk1hcC5JY2V5TWF6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIHJlZ3VsYXJpdHkpIHtcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuXHR0aGlzLl9yZWd1bGFyaXR5ID0gcmVndWxhcml0eSB8fCAwO1xufVxuUk9ULk1hcC5JY2V5TWF6ZS5leHRlbmQoUk9ULk1hcCk7XG5cblJPVC5NYXAuSWNleU1hemUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdHZhciB3aWR0aCA9IHRoaXMuX3dpZHRoO1xuXHR2YXIgaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuXHRcblx0dmFyIG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG5cdFxuXHR3aWR0aCAtPSAod2lkdGggJSAyID8gMSA6IDIpO1xuXHRoZWlnaHQgLT0gKGhlaWdodCAlIDIgPyAxIDogMik7XG5cblx0dmFyIGN4ID0gMDtcblx0dmFyIGN5ID0gMDtcblx0dmFyIG54ID0gMDtcblx0dmFyIG55ID0gMDtcblxuXHR2YXIgZG9uZSA9IDA7XG5cdHZhciBibG9ja2VkID0gZmFsc2U7XG5cdHZhciBkaXJzID0gW1xuXHRcdFswLCAwXSxcblx0XHRbMCwgMF0sXG5cdFx0WzAsIDBdLFxuXHRcdFswLCAwXVxuXHRdO1xuXHRkbyB7XG5cdFx0Y3ggPSAxICsgMipNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKih3aWR0aC0xKSAvIDIpO1xuXHRcdGN5ID0gMSArIDIqTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSooaGVpZ2h0LTEpIC8gMik7XG5cblx0XHRpZiAoIWRvbmUpIHsgbWFwW2N4XVtjeV0gPSAwOyB9XG5cdFx0XG5cdFx0aWYgKCFtYXBbY3hdW2N5XSkge1xuXHRcdFx0dGhpcy5fcmFuZG9taXplKGRpcnMpO1xuXHRcdFx0ZG8ge1xuXHRcdFx0XHRpZiAoTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSoodGhpcy5fcmVndWxhcml0eSsxKSkgPT0gMCkgeyB0aGlzLl9yYW5kb21pemUoZGlycyk7IH1cblx0XHRcdFx0YmxvY2tlZCA9IHRydWU7XG5cdFx0XHRcdGZvciAodmFyIGk9MDtpPDQ7aSsrKSB7XG5cdFx0XHRcdFx0bnggPSBjeCArIGRpcnNbaV1bMF0qMjtcblx0XHRcdFx0XHRueSA9IGN5ICsgZGlyc1tpXVsxXSoyO1xuXHRcdFx0XHRcdGlmICh0aGlzLl9pc0ZyZWUobWFwLCBueCwgbnksIHdpZHRoLCBoZWlnaHQpKSB7XG5cdFx0XHRcdFx0XHRtYXBbbnhdW255XSA9IDA7XG5cdFx0XHRcdFx0XHRtYXBbY3ggKyBkaXJzW2ldWzBdXVtjeSArIGRpcnNbaV1bMV1dID0gMDtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Y3ggPSBueDtcblx0XHRcdFx0XHRcdGN5ID0gbnk7XG5cdFx0XHRcdFx0XHRibG9ja2VkID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRkb25lKys7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gd2hpbGUgKCFibG9ja2VkKTtcblx0XHR9XG5cdH0gd2hpbGUgKGRvbmUrMSA8IHdpZHRoKmhlaWdodC80KTtcblx0XG5cdGZvciAodmFyIGk9MDtpPHRoaXMuX3dpZHRoO2krKykge1xuXHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcblx0XHRcdGNhbGxiYWNrKGksIGosIG1hcFtpXVtqXSk7XG5cdFx0fVxuXHR9XG5cdHRoaXMuX21hcCA9IG51bGw7XG5cdHJldHVybiB0aGlzO1xufVxuXG5ST1QuTWFwLkljZXlNYXplLnByb3RvdHlwZS5fcmFuZG9taXplID0gZnVuY3Rpb24oZGlycykge1xuXHRmb3IgKHZhciBpPTA7aTw0O2krKykge1xuXHRcdGRpcnNbaV1bMF0gPSAwO1xuXHRcdGRpcnNbaV1bMV0gPSAwO1xuXHR9XG5cdFxuXHRzd2l0Y2ggKE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqNCkpIHtcblx0XHRjYXNlIDA6XG5cdFx0XHRkaXJzWzBdWzBdID0gLTE7IGRpcnNbMV1bMF0gPSAxO1xuXHRcdFx0ZGlyc1syXVsxXSA9IC0xOyBkaXJzWzNdWzFdID0gMTtcblx0XHRicmVhaztcblx0XHRjYXNlIDE6XG5cdFx0XHRkaXJzWzNdWzBdID0gLTE7IGRpcnNbMl1bMF0gPSAxO1xuXHRcdFx0ZGlyc1sxXVsxXSA9IC0xOyBkaXJzWzBdWzFdID0gMTtcblx0XHRicmVhaztcblx0XHRjYXNlIDI6XG5cdFx0XHRkaXJzWzJdWzBdID0gLTE7IGRpcnNbM11bMF0gPSAxO1xuXHRcdFx0ZGlyc1swXVsxXSA9IC0xOyBkaXJzWzFdWzFdID0gMTtcblx0XHRicmVhaztcblx0XHRjYXNlIDM6XG5cdFx0XHRkaXJzWzFdWzBdID0gLTE7IGRpcnNbMF1bMF0gPSAxO1xuXHRcdFx0ZGlyc1szXVsxXSA9IC0xOyBkaXJzWzJdWzFdID0gMTtcblx0XHRicmVhaztcblx0fVxufVxuXG5ST1QuTWFwLkljZXlNYXplLnByb3RvdHlwZS5faXNGcmVlID0gZnVuY3Rpb24obWFwLCB4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XG5cdGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4ID49IHdpZHRoIHx8IHkgPj0gaGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxuXHRyZXR1cm4gbWFwW3hdW3ldO1xufVxuLyoqXG4gKiBAY2xhc3MgTWF6ZSBnZW5lcmF0b3IgLSBFbGxlcidzIGFsZ29yaXRobVxuICogU2VlIGh0dHA6Ly9ob21lcGFnZXMuY3dpLm5sL350cm9tcC9tYXplLmh0bWwgZm9yIGV4cGxhbmF0aW9uXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxuICovXG5ST1QuTWFwLkVsbGVyTWF6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcblx0Uk9ULk1hcC5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xufVxuUk9ULk1hcC5FbGxlck1hemUuZXh0ZW5kKFJPVC5NYXApO1xuXG5ST1QuTWFwLkVsbGVyTWF6ZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0dmFyIG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG5cdHZhciB3ID0gTWF0aC5jZWlsKCh0aGlzLl93aWR0aC0yKS8yKTtcblx0XG5cdHZhciByYW5kID0gOS8yNDtcblx0XG5cdHZhciBMID0gW107XG5cdHZhciBSID0gW107XG5cdFxuXHRmb3IgKHZhciBpPTA7aTx3O2krKykge1xuXHRcdEwucHVzaChpKTtcblx0XHRSLnB1c2goaSk7XG5cdH1cblx0TC5wdXNoKHctMSk7IC8qIGZha2Ugc3RvcC1ibG9jayBhdCB0aGUgcmlnaHQgc2lkZSAqL1xuXG5cdGZvciAodmFyIGo9MTtqKzM8dGhpcy5faGVpZ2h0O2orPTIpIHtcblx0XHQvKiBvbmUgcm93ICovXG5cdFx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcblx0XHRcdC8qIGNlbGwgY29vcmRzICh3aWxsIGJlIGFsd2F5cyBlbXB0eSkgKi9cblx0XHRcdHZhciB4ID0gMippKzE7XG5cdFx0XHR2YXIgeSA9IGo7XG5cdFx0XHRtYXBbeF1beV0gPSAwO1xuXHRcdFx0XG5cdFx0XHQvKiByaWdodCBjb25uZWN0aW9uICovXG5cdFx0XHRpZiAoaSAhPSBMW2krMV0gJiYgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSB7XG5cdFx0XHRcdHRoaXMuX2FkZFRvTGlzdChpLCBMLCBSKTtcblx0XHRcdFx0bWFwW3grMV1beV0gPSAwO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvKiBib3R0b20gY29ubmVjdGlvbiAqL1xuXHRcdFx0aWYgKGkgIT0gTFtpXSAmJiBST1QuUk5HLmdldFVuaWZvcm0oKSA+IHJhbmQpIHtcblx0XHRcdFx0LyogcmVtb3ZlIGNvbm5lY3Rpb24gKi9cblx0XHRcdFx0dGhpcy5fcmVtb3ZlRnJvbUxpc3QoaSwgTCwgUik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvKiBjcmVhdGUgY29ubmVjdGlvbiAqL1xuXHRcdFx0XHRtYXBbeF1beSsxXSA9IDA7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0LyogbGFzdCByb3cgKi9cblx0Zm9yICh2YXIgaT0wO2k8dztpKyspIHtcblx0XHQvKiBjZWxsIGNvb3JkcyAod2lsbCBiZSBhbHdheXMgZW1wdHkpICovXG5cdFx0dmFyIHggPSAyKmkrMTtcblx0XHR2YXIgeSA9IGo7XG5cdFx0bWFwW3hdW3ldID0gMDtcblx0XHRcblx0XHQvKiByaWdodCBjb25uZWN0aW9uICovXG5cdFx0aWYgKGkgIT0gTFtpKzFdICYmIChpID09IExbaV0gfHwgUk9ULlJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSkge1xuXHRcdFx0LyogZGlnIHJpZ2h0IGFsc28gaWYgdGhlIGNlbGwgaXMgc2VwYXJhdGVkLCBzbyBpdCBnZXRzIGNvbm5lY3RlZCB0byB0aGUgcmVzdCBvZiBtYXplICovXG5cdFx0XHR0aGlzLl9hZGRUb0xpc3QoaSwgTCwgUik7XG5cdFx0XHRtYXBbeCsxXVt5XSA9IDA7XG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMuX3JlbW92ZUZyb21MaXN0KGksIEwsIFIpO1xuXHR9XG5cdFxuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcblx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XG5cdFx0XHRjYWxsYmFjayhpLCBqLCBtYXBbaV1bal0pO1xuXHRcdH1cblx0fVxuXHRcblx0cmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogUmVtb3ZlIFwiaVwiIGZyb20gaXRzIGxpc3RcbiAqL1xuUk9ULk1hcC5FbGxlck1hemUucHJvdG90eXBlLl9yZW1vdmVGcm9tTGlzdCA9IGZ1bmN0aW9uKGksIEwsIFIpIHtcblx0UltMW2ldXSA9IFJbaV07XG5cdExbUltpXV0gPSBMW2ldO1xuXHRSW2ldID0gaTtcblx0TFtpXSA9IGk7XG59XG5cbi8qKlxuICogSm9pbiBsaXN0cyB3aXRoIFwiaVwiIGFuZCBcImkrMVwiXG4gKi9cblJPVC5NYXAuRWxsZXJNYXplLnByb3RvdHlwZS5fYWRkVG9MaXN0ID0gZnVuY3Rpb24oaSwgTCwgUikge1xuXHRSW0xbaSsxXV0gPSBSW2ldO1xuXHRMW1JbaV1dID0gTFtpKzFdO1xuXHRSW2ldID0gaSsxO1xuXHRMW2krMV0gPSBpO1xufVxuLyoqXG4gKiBAY2xhc3MgQ2VsbHVsYXIgYXV0b21hdG9uIG1hcCBnZW5lcmF0b3JcbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBPcHRpb25zXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5ib3JuXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYSBuZXcgY2VsbCB0byBiZSBib3JuIGluIGVtcHR5IHNwYWNlXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5zdXJ2aXZlXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYW4gZXhpc3RpbmcgIGNlbGwgdG8gc3Vydml2ZVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5XSBUb3BvbG9neSA0IG9yIDYgb3IgOFxuICovXG5ST1QuTWFwLkNlbGx1bGFyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMuX29wdGlvbnMgPSB7XG5cdFx0Ym9ybjogWzUsIDYsIDcsIDhdLFxuXHRcdHN1cnZpdmU6IFs0LCA1LCA2LCA3LCA4XSxcblx0XHR0b3BvbG9neTogOCxcblx0XHRjb25uZWN0ZWQ6IGZhbHNlXG5cdH07XG5cdHRoaXMuc2V0T3B0aW9ucyhvcHRpb25zKTtcblx0XG5cdHRoaXMuX2RpcnMgPSBST1QuRElSU1t0aGlzLl9vcHRpb25zLnRvcG9sb2d5XTtcblx0dGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgwKTtcbn1cblJPVC5NYXAuQ2VsbHVsYXIuZXh0ZW5kKFJPVC5NYXApO1xuXG4vKipcbiAqIEZpbGwgdGhlIG1hcCB3aXRoIHJhbmRvbSB2YWx1ZXNcbiAqIEBwYXJhbSB7ZmxvYXR9IHByb2JhYmlsaXR5IFByb2JhYmlsaXR5IGZvciBhIGNlbGwgdG8gYmVjb21lIGFsaXZlOyAwID0gYWxsIGVtcHR5LCAxID0gYWxsIGZ1bGxcbiAqL1xuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUucmFuZG9taXplID0gZnVuY3Rpb24ocHJvYmFiaWxpdHkpIHtcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XG5cdFx0Zm9yICh2YXIgaj0wO2o8dGhpcy5faGVpZ2h0O2orKykge1xuXHRcdFx0dGhpcy5fbWFwW2ldW2pdID0gKFJPVC5STkcuZ2V0VW5pZm9ybSgpIDwgcHJvYmFiaWxpdHkgPyAxIDogMCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENoYW5nZSBvcHRpb25zLlxuICogQHNlZSBST1QuTWFwLkNlbGx1bGFyXG4gKi9cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxufVxuXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbih4LCB5LCB2YWx1ZSkge1xuXHR0aGlzLl9tYXBbeF1beV0gPSB2YWx1ZTtcbn1cblxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0dmFyIG5ld01hcCA9IHRoaXMuX2ZpbGxNYXAoMCk7XG5cdHZhciBib3JuID0gdGhpcy5fb3B0aW9ucy5ib3JuO1xuXHR2YXIgc3Vydml2ZSA9IHRoaXMuX29wdGlvbnMuc3Vydml2ZTtcblxuXG5cdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcblx0XHR2YXIgd2lkdGhTdGVwID0gMTtcblx0XHR2YXIgd2lkdGhTdGFydCA9IDA7XG5cdFx0aWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gNikgeyBcblx0XHRcdHdpZHRoU3RlcCA9IDI7XG5cdFx0XHR3aWR0aFN0YXJ0ID0gaiUyO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGk9d2lkdGhTdGFydDsgaTx0aGlzLl93aWR0aDsgaSs9d2lkdGhTdGVwKSB7XG5cblx0XHRcdHZhciBjdXIgPSB0aGlzLl9tYXBbaV1bal07XG5cdFx0XHR2YXIgbmNvdW50ID0gdGhpcy5fZ2V0TmVpZ2hib3JzKGksIGopO1xuXHRcdFx0XG5cdFx0XHRpZiAoY3VyICYmIHN1cnZpdmUuaW5kZXhPZihuY291bnQpICE9IC0xKSB7IC8qIHN1cnZpdmUgKi9cblx0XHRcdFx0bmV3TWFwW2ldW2pdID0gMTtcblx0XHRcdH0gZWxzZSBpZiAoIWN1ciAmJiBib3JuLmluZGV4T2YobmNvdW50KSAhPSAtMSkgeyAvKiBib3JuICovXG5cdFx0XHRcdG5ld01hcFtpXVtqXSA9IDE7XG5cdFx0XHR9XHRcdFx0XG5cdFx0fVxuXHR9XG5cdFxuXHR0aGlzLl9tYXAgPSBuZXdNYXA7XG5cblx0Ly8gb3B0aW5pYWxseSBjb25uZWN0IGV2ZXJ5IHNwYWNlXG5cdGlmICh0aGlzLl9vcHRpb25zLmNvbm5lY3RlZCkge1xuXHRcdHRoaXMuX2NvbXBsZXRlTWF6ZSgpO1x0XG5cdH1cblxuXHRpZiAoY2FsbGJhY2spIHsgXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl93aWR0aDsgaSsrKSB7XG5cdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIG5ld01hcFtpXVtqXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbi8qKlxuICogR2V0IG5laWdoYm9yIGNvdW50IGF0IFtpLGpdIGluIHRoaXMuX21hcFxuICovXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0TmVpZ2hib3JzID0gZnVuY3Rpb24oY3gsIGN5KSB7XG5cdHZhciByZXN1bHQgPSAwO1xuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9kaXJzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgZGlyID0gdGhpcy5fZGlyc1tpXTtcblx0XHR2YXIgeCA9IGN4ICsgZGlyWzBdO1xuXHRcdHZhciB5ID0gY3kgKyBkaXJbMV07XG5cdFx0XG5cdFx0aWYgKHggPCAwIHx8IHggPj0gdGhpcy5fd2lkdGggfHwgeCA8IDAgfHwgeSA+PSB0aGlzLl93aWR0aCkgeyBjb250aW51ZTsgfVxuXHRcdHJlc3VsdCArPSAodGhpcy5fbWFwW3hdW3ldID09IDEgPyAxIDogMCk7XG5cdH1cblx0XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogTWFrZSBzdXJlIGV2ZXJ5IG5vbi13YWxsIHNwYWNlIGlzIGFjY2Vzc2libGUuXG4gKi9cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9jb21wbGV0ZU1hemUgPSBmdW5jdGlvbigpIHtcblx0dmFyIGFsbEZyZWVTcGFjZSA9IFtdO1xuXHR2YXIgbm90Q29ubmVjdGVkID0ge307XG5cdC8vIGZpbmQgYWxsIGZyZWUgc3BhY2Vcblx0Zm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLl93aWR0aDsgeCsrKSB7XG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCB0aGlzLl9oZWlnaHQ7IHkrKykge1xuXHRcdFx0aWYgKHRoaXMuX2ZyZWVTcGFjZSh4LCB5KSkge1xuXHRcdFx0XHR2YXIgcCA9IFt4LCB5XTtcblx0XHRcdFx0bm90Q29ubmVjdGVkW3RoaXMuX3BvaW50S2V5KHApXSA9IHA7XG5cdFx0XHRcdGFsbEZyZWVTcGFjZS5wdXNoKFt4LCB5XSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHZhciBzdGFydCA9IGFsbEZyZWVTcGFjZVtST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwgYWxsRnJlZVNwYWNlLmxlbmd0aCAtIDEpXTtcblxuXHR2YXIga2V5ID0gdGhpcy5fcG9pbnRLZXkoc3RhcnQpO1xuXHR2YXIgY29ubmVjdGVkID0ge307XG5cdGNvbm5lY3RlZFtrZXldID0gc3RhcnQ7XG5cdGRlbGV0ZSBub3RDb25uZWN0ZWRba2V5XVxuXG5cdC8vIGZpbmQgd2hhdCdzIGNvbm5lY3RlZCB0byB0aGUgc3RhcnRpbmcgcG9pbnRcblx0dGhpcy5fZmluZENvbm5lY3RlZChjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCwgW3N0YXJ0XSk7XG5cblx0d2hpbGUoT2JqZWN0LmtleXMobm90Q29ubmVjdGVkKS5sZW5ndGggPiAwKSB7XG5cblx0XHQvLyBmaW5kIHR3byBwb2ludHMgZnJvbSBub3RDb25uZWN0ZWQgdG8gY29ubmVjdGVkXG5cdFx0dmFyIHAgPSB0aGlzLl9nZXRGcm9tVG8oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQpO1xuXHRcdHZhciBmcm9tID0gcFswXTsgLy8gbm90Q29ubmVjdGVkXG5cdFx0dmFyIHRvID0gcFsxXTsgLy8gY29ubmVjdGVkXG5cblx0XHQvLyBmaW5kIGV2ZXJ5dGhpbmcgY29ubmVjdGVkIHRvIHRoZSBzdGFydGluZyBwb2ludFxuXHRcdHZhciBsb2NhbCA9IHt9O1xuXHRcdGxvY2FsW3RoaXMuX3BvaW50S2V5KGZyb20pXSA9IGZyb207XG5cdFx0dGhpcy5fZmluZENvbm5lY3RlZChsb2NhbCwgbm90Q29ubmVjdGVkLCBbZnJvbV0sIHRydWUpO1xuXG5cdFx0Ly8gY29ubmVjdCB0byBhIGNvbm5lY3RlZCBzcXVhcmVcblx0XHR0aGlzLl90dW5uZWxUb0Nvbm5lY3RlZCh0bywgZnJvbSwgY29ubmVjdGVkLCBub3RDb25uZWN0ZWQpO1xuXG5cdFx0Ly8gbm93IGFsbCBvZiBsb2NhbCBpcyBjb25uZWN0ZWRcblx0XHRmb3IgKHZhciBrIGluIGxvY2FsKSB7XG5cdFx0XHR2YXIgcHAgPSBsb2NhbFtrXTtcblx0XHRcdHRoaXMuX21hcFtwcFswXV1bcHBbMV1dID0gMDtcblx0XHRcdGNvbm5lY3RlZFtrXSA9IHBwO1xuXHRcdFx0ZGVsZXRlIG5vdENvbm5lY3RlZFtrXTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiBGaW5kIHJhbmRvbSBwb2ludHMgdG8gY29ubmVjdC4gU2VhcmNoIGZvciB0aGUgY2xvc2VzdCBwb2ludCBpbiB0aGUgbGFyZ2VyIHNwYWNlLiBcbiAqIFRoaXMgaXMgdG8gbWluaW1pemUgdGhlIGxlbmd0aCBvZiB0aGUgcGFzc2FnZSB3aGlsZSBtYWludGFpbmluZyBnb29kIHBlcmZvcm1hbmNlLlxuICovXG5ST1QuTWFwLkNlbGx1bGFyLnByb3RvdHlwZS5fZ2V0RnJvbVRvID0gZnVuY3Rpb24oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQpIHtcblx0dmFyIGZyb20sIHRvLCBkO1xuXHR2YXIgY29ubmVjdGVkS2V5cyA9IE9iamVjdC5rZXlzKGNvbm5lY3RlZCk7XG5cdHZhciBub3RDb25uZWN0ZWRLZXlzID0gT2JqZWN0LmtleXMobm90Q29ubmVjdGVkKTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcblx0XHRpZiAoY29ubmVjdGVkS2V5cy5sZW5ndGggPCBub3RDb25uZWN0ZWRLZXlzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGtleXMgPSBjb25uZWN0ZWRLZXlzO1xuXHRcdFx0dG8gPSBjb25uZWN0ZWRba2V5c1tST1QuUk5HLmdldFVuaWZvcm1JbnQoMCwga2V5cy5sZW5ndGggLSAxKV1dXG5cdFx0XHRmcm9tID0gdGhpcy5fZ2V0Q2xvc2VzdCh0bywgbm90Q29ubmVjdGVkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGtleXMgPSBub3RDb25uZWN0ZWRLZXlzO1xuXHRcdFx0ZnJvbSA9IG5vdENvbm5lY3RlZFtrZXlzW1JPVC5STkcuZ2V0VW5pZm9ybUludCgwLCBrZXlzLmxlbmd0aCAtIDEpXV1cblx0XHRcdHRvID0gdGhpcy5fZ2V0Q2xvc2VzdChmcm9tLCBjb25uZWN0ZWQpO1xuXHRcdH1cblx0XHRkID0gKGZyb21bMF0gLSB0b1swXSkgKiAoZnJvbVswXSAtIHRvWzBdKSArIChmcm9tWzFdIC0gdG9bMV0pICogKGZyb21bMV0gLSB0b1sxXSk7XG5cdFx0aWYgKGQgPCA2NCkge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdC8vIGNvbnNvbGUubG9nKFwiPj4+IGNvbm5lY3RlZD1cIiArIHRvICsgXCIgbm90Q29ubmVjdGVkPVwiICsgZnJvbSArIFwiIGRpc3Q9XCIgKyBkKTtcblx0cmV0dXJuIFtmcm9tLCB0b107XG59XG5cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9nZXRDbG9zZXN0ID0gZnVuY3Rpb24ocG9pbnQsIHNwYWNlKSB7XG5cdHZhciBtaW5Qb2ludCA9IG51bGw7XG5cdHZhciBtaW5EaXN0ID0gbnVsbDtcblx0Zm9yIChrIGluIHNwYWNlKSB7XG5cdFx0dmFyIHAgPSBzcGFjZVtrXTtcblx0XHR2YXIgZCA9IChwWzBdIC0gcG9pbnRbMF0pICogKHBbMF0gLSBwb2ludFswXSkgKyAocFsxXSAtIHBvaW50WzFdKSAqIChwWzFdIC0gcG9pbnRbMV0pO1xuXHRcdGlmIChtaW5EaXN0ID09IG51bGwgfHwgZCA8IG1pbkRpc3QpIHtcblx0XHRcdG1pbkRpc3QgPSBkO1xuXHRcdFx0bWluUG9pbnQgPSBwO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gbWluUG9pbnQ7XG59XG5cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9maW5kQ29ubmVjdGVkID0gZnVuY3Rpb24oY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHN0YWNrLCBrZWVwTm90Q29ubmVjdGVkKSB7XG5cdHdoaWxlKHN0YWNrLmxlbmd0aCA+IDApIHtcblx0XHR2YXIgcCA9IHN0YWNrLnNwbGljZSgwLCAxKVswXTtcblx0XHR2YXIgdGVzdHMgPSBbXG5cdFx0XHRbcFswXSArIDEsIHBbMV1dLFxuXHRcdFx0W3BbMF0gLSAxLCBwWzFdXSxcblx0XHRcdFtwWzBdLCAgICAgcFsxXSArIDFdLFxuXHRcdFx0W3BbMF0sICAgICBwWzFdIC0gMV1cblx0XHRdO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGVzdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBrZXkgPSB0aGlzLl9wb2ludEtleSh0ZXN0c1tpXSk7XG5cdFx0XHRpZiAoY29ubmVjdGVkW2tleV0gPT0gbnVsbCAmJiB0aGlzLl9mcmVlU3BhY2UodGVzdHNbaV1bMF0sIHRlc3RzW2ldWzFdKSkge1xuXHRcdFx0XHRjb25uZWN0ZWRba2V5XSA9IHRlc3RzW2ldO1xuXHRcdFx0XHRpZiAoIWtlZXBOb3RDb25uZWN0ZWQpIHtcblx0XHRcdFx0XHRkZWxldGUgbm90Q29ubmVjdGVkW2tleV07XG5cdFx0XHRcdH1cblx0XHRcdFx0c3RhY2sucHVzaCh0ZXN0c1tpXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl90dW5uZWxUb0Nvbm5lY3RlZCA9IGZ1bmN0aW9uKHRvLCBmcm9tLCBjb25uZWN0ZWQsIG5vdENvbm5lY3RlZCkge1xuXHR2YXIga2V5ID0gdGhpcy5fcG9pbnRLZXkoZnJvbSk7XG5cdHZhciBhLCBiO1xuXHRpZiAoZnJvbVswXSA8IHRvWzBdKSB7XG5cdFx0YSA9IGZyb207XG5cdFx0YiA9IHRvO1xuXHR9IGVsc2Uge1xuXHRcdGEgPSB0bztcblx0XHRiID0gZnJvbTtcblx0fVxuXHRmb3IgKHZhciB4eCA9IGFbMF07IHh4IDw9IGJbMF07IHh4KyspIHtcblx0XHR0aGlzLl9tYXBbeHhdW2FbMV1dID0gMDtcblx0XHR2YXIgcCA9IFt4eCwgYVsxXV07XG5cdFx0dmFyIHBrZXkgPSB0aGlzLl9wb2ludEtleShwKTtcblx0XHRjb25uZWN0ZWRbcGtleV0gPSBwO1xuXHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRbcGtleV07XG5cdH1cblxuXHQvLyB4IGlzIG5vdyBmaXhlZFxuXHR2YXIgeCA9IGJbMF07XG5cblx0aWYgKGZyb21bMV0gPCB0b1sxXSkge1xuXHRcdGEgPSBmcm9tO1xuXHRcdGIgPSB0bztcblx0fSBlbHNlIHtcblx0XHRhID0gdG87XG5cdFx0YiA9IGZyb207XG5cdH1cblx0Zm9yICh2YXIgeXkgPSBhWzFdOyB5eSA8IGJbMV07IHl5KyspIHtcblx0XHR0aGlzLl9tYXBbeF1beXldID0gMDtcblx0XHR2YXIgcCA9IFt4LCB5eV07XG5cdFx0dmFyIHBrZXkgPSB0aGlzLl9wb2ludEtleShwKTtcblx0XHRjb25uZWN0ZWRbcGtleV0gPSBwO1xuXHRcdGRlbGV0ZSBub3RDb25uZWN0ZWRbcGtleV07XG5cdH1cbn1cblxuUk9ULk1hcC5DZWxsdWxhci5wcm90b3R5cGUuX2ZyZWVTcGFjZSA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0cmV0dXJuIHggPj0gMCAmJiB4IDwgdGhpcy5fd2lkdGggJiYgeSA+PSAwICYmIHkgPCB0aGlzLl9oZWlnaHQgJiYgdGhpcy5fbWFwW3hdW3ldICE9IDE7XG59XG5cblJPVC5NYXAuQ2VsbHVsYXIucHJvdG90eXBlLl9wb2ludEtleSA9IGZ1bmN0aW9uKHApIHtcblx0cmV0dXJuIHBbMF0gKyBcIi5cIiArIHBbMV07XG59XG5cbi8qKlxuICogQGNsYXNzIER1bmdlb24gbWFwOiBoYXMgcm9vbXMgYW5kIGNvcnJpZG9yc1xuICogQGF1Z21lbnRzIFJPVC5NYXBcbiAqL1xuUk9ULk1hcC5EdW5nZW9uID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXHRST1QuTWFwLmNhbGwodGhpcywgd2lkdGgsIGhlaWdodCk7XG5cdHRoaXMuX3Jvb21zID0gW107IC8qIGxpc3Qgb2YgYWxsIHJvb21zICovXG5cdHRoaXMuX2NvcnJpZG9ycyA9IFtdO1xufVxuUk9ULk1hcC5EdW5nZW9uLmV4dGVuZChST1QuTWFwKTtcblxuLyoqXG4gKiBHZXQgYWxsIGdlbmVyYXRlZCByb29tc1xuICogQHJldHVybnMge1JPVC5NYXAuRmVhdHVyZS5Sb29tW119XG4gKi9cblJPVC5NYXAuRHVuZ2Vvbi5wcm90b3R5cGUuZ2V0Um9vbXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3Jvb21zO1xufVxuXG4vKipcbiAqIEdldCBhbGwgZ2VuZXJhdGVkIGNvcnJpZG9yc1xuICogQHJldHVybnMge1JPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcltdfVxuICovXG5ST1QuTWFwLkR1bmdlb24ucHJvdG90eXBlLmdldENvcnJpZG9ycyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fY29ycmlkb3JzO1xufVxuLyoqXG4gKiBAY2xhc3MgUmFuZG9tIGR1bmdlb24gZ2VuZXJhdG9yIHVzaW5nIGh1bWFuLWxpa2UgZGlnZ2luZyBwYXR0ZXJucy5cbiAqIEhlYXZpbHkgYmFzZWQgb24gTWlrZSBBbmRlcnNvbidzIGlkZWFzIGZyb20gdGhlIFwiVHlyYW50XCIgYWxnbywgbWVudGlvbmVkIGF0IFxuICogaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9RHVuZ2Vvbi1CdWlsZGluZ19BbGdvcml0aG0uXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5EdW5nZW9uXG4gKi9cblJPVC5NYXAuRGlnZ2VyID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuXHRST1QuTWFwLkR1bmdlb24uY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcblx0XG5cdHRoaXMuX29wdGlvbnMgPSB7XG5cdFx0cm9vbVdpZHRoOiBbMywgOV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSB3aWR0aCAqL1xuXHRcdHJvb21IZWlnaHQ6IFszLCA1XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIGhlaWdodCAqL1xuXHRcdGNvcnJpZG9yTGVuZ3RoOiBbMywgMTBdLCAvKiBjb3JyaWRvciBtaW5pbXVtIGFuZCBtYXhpbXVtIGxlbmd0aCAqL1xuXHRcdGR1Z1BlcmNlbnRhZ2U6IDAuMiwgLyogd2Ugc3RvcCBhZnRlciB0aGlzIHBlcmNlbnRhZ2Ugb2YgbGV2ZWwgYXJlYSBoYXMgYmVlbiBkdWcgb3V0ICovXG5cdFx0dGltZUxpbWl0OiAxMDAwIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBtdWNoIHRpbWUgaGFzIHBhc3NlZCAobXNlYykgKi9cblx0fVxuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cblx0XG5cdHRoaXMuX2ZlYXR1cmVzID0ge1xuXHRcdFwiUm9vbVwiOiA0LFxuXHRcdFwiQ29ycmlkb3JcIjogNFxuXHR9XG5cdHRoaXMuX2ZlYXR1cmVBdHRlbXB0cyA9IDIwOyAvKiBob3cgbWFueSB0aW1lcyBkbyB3ZSB0cnkgdG8gY3JlYXRlIGEgZmVhdHVyZSBvbiBhIHN1aXRhYmxlIHdhbGwgKi9cblx0dGhpcy5fd2FsbHMgPSB7fTsgLyogdGhlc2UgYXJlIGF2YWlsYWJsZSBmb3IgZGlnZ2luZyAqL1xuXHRcblx0dGhpcy5fZGlnQ2FsbGJhY2sgPSB0aGlzLl9kaWdDYWxsYmFjay5iaW5kKHRoaXMpO1xuXHR0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrID0gdGhpcy5fY2FuQmVEdWdDYWxsYmFjay5iaW5kKHRoaXMpO1xuXHR0aGlzLl9pc1dhbGxDYWxsYmFjayA9IHRoaXMuX2lzV2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XG5cdHRoaXMuX3ByaW9yaXR5V2FsbENhbGxiYWNrID0gdGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2suYmluZCh0aGlzKTtcbn1cblJPVC5NYXAuRGlnZ2VyLmV4dGVuZChST1QuTWFwLkR1bmdlb24pO1xuXG4vKipcbiAqIENyZWF0ZSBhIG1hcFxuICogQHNlZSBST1QuTWFwI2NyZWF0ZVxuICovXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0dGhpcy5fcm9vbXMgPSBbXTtcblx0dGhpcy5fY29ycmlkb3JzID0gW107XG5cdHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG5cdHRoaXMuX3dhbGxzID0ge307XG5cdHRoaXMuX2R1ZyA9IDA7XG5cdHZhciBhcmVhID0gKHRoaXMuX3dpZHRoLTIpICogKHRoaXMuX2hlaWdodC0yKTtcblxuXHR0aGlzLl9maXJzdFJvb20oKTtcblx0XG5cdHZhciB0MSA9IERhdGUubm93KCk7XG5cblx0ZG8ge1xuXHRcdHZhciB0MiA9IERhdGUubm93KCk7XG5cdFx0aWYgKHQyIC0gdDEgPiB0aGlzLl9vcHRpb25zLnRpbWVMaW1pdCkgeyBicmVhazsgfVxuXG5cdFx0LyogZmluZCBhIGdvb2Qgd2FsbCAqL1xuXHRcdHZhciB3YWxsID0gdGhpcy5fZmluZFdhbGwoKTtcblx0XHRpZiAoIXdhbGwpIHsgYnJlYWs7IH0gLyogbm8gbW9yZSB3YWxscyAqL1xuXHRcdFxuXHRcdHZhciBwYXJ0cyA9IHdhbGwuc3BsaXQoXCIsXCIpO1xuXHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xuXHRcdHZhciBkaXIgPSB0aGlzLl9nZXREaWdnaW5nRGlyZWN0aW9uKHgsIHkpO1xuXHRcdGlmICghZGlyKSB7IGNvbnRpbnVlOyB9IC8qIHRoaXMgd2FsbCBpcyBub3Qgc3VpdGFibGUgKi9cblx0XHRcbi8vXHRcdGNvbnNvbGUubG9nKFwid2FsbFwiLCB4LCB5KTtcblxuXHRcdC8qIHRyeSBhZGRpbmcgYSBmZWF0dXJlICovXG5cdFx0dmFyIGZlYXR1cmVBdHRlbXB0cyA9IDA7XG5cdFx0ZG8ge1xuXHRcdFx0ZmVhdHVyZUF0dGVtcHRzKys7XG5cdFx0XHRpZiAodGhpcy5fdHJ5RmVhdHVyZSh4LCB5LCBkaXJbMF0sIGRpclsxXSkpIHsgLyogZmVhdHVyZSBhZGRlZCAqL1xuXHRcdFx0XHQvL2lmICh0aGlzLl9yb29tcy5sZW5ndGggKyB0aGlzLl9jb3JyaWRvcnMubGVuZ3RoID09IDIpIHsgdGhpcy5fcm9vbXNbMF0uYWRkRG9vcih4LCB5KTsgfSAvKiBmaXJzdCByb29tIG9maWNpYWxseSBoYXMgZG9vcnMgKi9cblx0XHRcdFx0dGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4LCB5KTtcblx0XHRcdFx0dGhpcy5fcmVtb3ZlU3Vycm91bmRpbmdXYWxscyh4LWRpclswXSwgeS1kaXJbMV0pO1xuXHRcdFx0XHRicmVhazsgXG5cdFx0XHR9XG5cdFx0fSB3aGlsZSAoZmVhdHVyZUF0dGVtcHRzIDwgdGhpcy5fZmVhdHVyZUF0dGVtcHRzKTtcblx0XHRcblx0XHR2YXIgcHJpb3JpdHlXYWxscyA9IDA7XG5cdFx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fd2FsbHMpIHsgXG5cdFx0XHRpZiAodGhpcy5fd2FsbHNbaWRdID4gMSkgeyBwcmlvcml0eVdhbGxzKys7IH1cblx0XHR9XG5cblx0fSB3aGlsZSAodGhpcy5fZHVnL2FyZWEgPCB0aGlzLl9vcHRpb25zLmR1Z1BlcmNlbnRhZ2UgfHwgcHJpb3JpdHlXYWxscyk7IC8qIGZpeG1lIG51bWJlciBvZiBwcmlvcml0eSB3YWxscyAqL1xuXG5cdHRoaXMuX2FkZERvb3JzKCk7XG5cblx0aWYgKGNhbGxiYWNrKSB7XG5cdFx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fd2lkdGg7aSsrKSB7XG5cdFx0XHRmb3IgKHZhciBqPTA7ajx0aGlzLl9oZWlnaHQ7aisrKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdFxuXHR0aGlzLl93YWxscyA9IHt9O1xuXHR0aGlzLl9tYXAgPSBudWxsO1xuXG5cdHJldHVybiB0aGlzO1xufVxuXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2RpZ0NhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSwgdmFsdWUpIHtcblx0aWYgKHZhbHVlID09IDAgfHwgdmFsdWUgPT0gMikgeyAvKiBlbXB0eSAqL1xuXHRcdHRoaXMuX21hcFt4XVt5XSA9IDA7XG5cdFx0dGhpcy5fZHVnKys7XG5cdH0gZWxzZSB7IC8qIHdhbGwgKi9cblx0XHR0aGlzLl93YWxsc1t4K1wiLFwiK3ldID0gMTtcblx0fVxufVxuXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2lzV2FsbENhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xuXHRpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5ID49IHRoaXMuX2hlaWdodCkgeyByZXR1cm4gZmFsc2U7IH1cblx0cmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XG59XG5cblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fY2FuQmVEdWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0aWYgKHggPCAxIHx8IHkgPCAxIHx8IHgrMSA+PSB0aGlzLl93aWR0aCB8fCB5KzEgPj0gdGhpcy5faGVpZ2h0KSB7IHJldHVybiBmYWxzZTsgfVxuXHRyZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcbn1cblxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9wcmlvcml0eVdhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0dGhpcy5fd2FsbHNbeCtcIixcIit5XSA9IDI7XG59XG5cblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fZmlyc3RSb29tID0gZnVuY3Rpb24oKSB7XG5cdHZhciBjeCA9IE1hdGguZmxvb3IodGhpcy5fd2lkdGgvMik7XG5cdHZhciBjeSA9IE1hdGguZmxvb3IodGhpcy5faGVpZ2h0LzIpO1xuXHR2YXIgcm9vbSA9IFJPVC5NYXAuRmVhdHVyZS5Sb29tLmNyZWF0ZVJhbmRvbUNlbnRlcihjeCwgY3ksIHRoaXMuX29wdGlvbnMpO1xuXHR0aGlzLl9yb29tcy5wdXNoKHJvb20pO1xuXHRyb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7XG59XG5cbi8qKlxuICogR2V0IGEgc3VpdGFibGUgd2FsbFxuICovXG5ST1QuTWFwLkRpZ2dlci5wcm90b3R5cGUuX2ZpbmRXYWxsID0gZnVuY3Rpb24oKSB7XG5cdHZhciBwcmlvMSA9IFtdO1xuXHR2YXIgcHJpbzIgPSBbXTtcblx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fd2FsbHMpIHtcblx0XHR2YXIgcHJpbyA9IHRoaXMuX3dhbGxzW2lkXTtcblx0XHRpZiAocHJpbyA9PSAyKSB7IFxuXHRcdFx0cHJpbzIucHVzaChpZCk7IFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRwcmlvMS5wdXNoKGlkKTtcblx0XHR9XG5cdH1cblx0XG5cdHZhciBhcnIgPSAocHJpbzIubGVuZ3RoID8gcHJpbzIgOiBwcmlvMSk7XG5cdGlmICghYXJyLmxlbmd0aCkgeyByZXR1cm4gbnVsbDsgfSAvKiBubyB3YWxscyA6LyAqL1xuXHRcblx0dmFyIGlkID0gYXJyLnJhbmRvbSgpO1xuXHRkZWxldGUgdGhpcy5fd2FsbHNbaWRdO1xuXG5cdHJldHVybiBpZDtcbn1cblxuLyoqXG4gKiBUcmllcyBhZGRpbmcgYSBmZWF0dXJlXG4gKiBAcmV0dXJucyB7Ym9vbH0gd2FzIHRoaXMgYSBzdWNjZXNzZnVsIHRyeT9cbiAqL1xuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl90cnlGZWF0dXJlID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5KSB7XG5cdHZhciBmZWF0dXJlID0gUk9ULlJORy5nZXRXZWlnaHRlZFZhbHVlKHRoaXMuX2ZlYXR1cmVzKTtcblx0ZmVhdHVyZSA9IFJPVC5NYXAuRmVhdHVyZVtmZWF0dXJlXS5jcmVhdGVSYW5kb21BdCh4LCB5LCBkeCwgZHksIHRoaXMuX29wdGlvbnMpO1xuXHRcblx0aWYgKCFmZWF0dXJlLmlzVmFsaWQodGhpcy5faXNXYWxsQ2FsbGJhY2ssIHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2spKSB7XG4vL1x0XHRjb25zb2xlLmxvZyhcIm5vdCB2YWxpZFwiKTtcbi8vXHRcdGZlYXR1cmUuZGVidWcoKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0XG5cdGZlYXR1cmUuY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcbi8vXHRmZWF0dXJlLmRlYnVnKCk7XG5cblx0aWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBST1QuTWFwLkZlYXR1cmUuUm9vbSkgeyB0aGlzLl9yb29tcy5wdXNoKGZlYXR1cmUpOyB9XG5cdGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yKSB7IFxuXHRcdGZlYXR1cmUuY3JlYXRlUHJpb3JpdHlXYWxscyh0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjayk7XG5cdFx0dGhpcy5fY29ycmlkb3JzLnB1c2goZmVhdHVyZSk7IFxuXHR9XG5cdFxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzID0gZnVuY3Rpb24oY3gsIGN5KSB7XG5cdHZhciBkZWx0YXMgPSBST1QuRElSU1s0XTtcblxuXHRmb3IgKHZhciBpPTA7aTxkZWx0YXMubGVuZ3RoO2krKykge1xuXHRcdHZhciBkZWx0YSA9IGRlbHRhc1tpXTtcblx0XHR2YXIgeCA9IGN4ICsgZGVsdGFbMF07XG5cdFx0dmFyIHkgPSBjeSArIGRlbHRhWzFdO1xuXHRcdGRlbGV0ZSB0aGlzLl93YWxsc1t4K1wiLFwiK3ldO1xuXHRcdHZhciB4ID0gY3ggKyAyKmRlbHRhWzBdO1xuXHRcdHZhciB5ID0gY3kgKyAyKmRlbHRhWzFdO1xuXHRcdGRlbGV0ZSB0aGlzLl93YWxsc1t4K1wiLFwiK3ldO1xuXHR9XG59XG5cbi8qKlxuICogUmV0dXJucyB2ZWN0b3IgaW4gXCJkaWdnaW5nXCIgZGlyZWN0aW9uLCBvciBmYWxzZSwgaWYgdGhpcyBkb2VzIG5vdCBleGlzdCAob3IgaXMgbm90IHVuaXF1ZSlcbiAqL1xuUk9ULk1hcC5EaWdnZXIucHJvdG90eXBlLl9nZXREaWdnaW5nRGlyZWN0aW9uID0gZnVuY3Rpb24oY3gsIGN5KSB7XG5cdHZhciByZXN1bHQgPSBudWxsO1xuXHR2YXIgZGVsdGFzID0gUk9ULkRJUlNbNF07XG5cdFxuXHRmb3IgKHZhciBpPTA7aTxkZWx0YXMubGVuZ3RoO2krKykge1xuXHRcdHZhciBkZWx0YSA9IGRlbHRhc1tpXTtcblx0XHR2YXIgeCA9IGN4ICsgZGVsdGFbMF07XG5cdFx0dmFyIHkgPSBjeSArIGRlbHRhWzFdO1xuXHRcdFxuXHRcdGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPj0gdGhpcy5fd2lkdGgpIHsgcmV0dXJuIG51bGw7IH1cblx0XHRcblx0XHRpZiAoIXRoaXMuX21hcFt4XVt5XSkgeyAvKiB0aGVyZSBhbHJlYWR5IGlzIGFub3RoZXIgZW1wdHkgbmVpZ2hib3IhICovXG5cdFx0XHRpZiAocmVzdWx0KSB7IHJldHVybiBudWxsOyB9XG5cdFx0XHRyZXN1bHQgPSBkZWx0YTtcblx0XHR9XG5cdH1cblx0XG5cdC8qIG5vIGVtcHR5IG5laWdoYm9yICovXG5cdGlmICghcmVzdWx0KSB7IHJldHVybiBudWxsOyB9XG5cdFxuXHRyZXR1cm4gWy1yZXN1bHRbMF0sIC1yZXN1bHRbMV1dO1xufVxuXG4vKipcbiAqIEZpbmQgZW1wdHkgc3BhY2VzIHN1cnJvdW5kaW5nIHJvb21zLCBhbmQgYXBwbHkgZG9vcnMuXG4gKi9cblJPVC5NYXAuRGlnZ2VyLnByb3RvdHlwZS5fYWRkRG9vcnMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGRhdGEgPSB0aGlzLl9tYXA7XG5cdHZhciBpc1dhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0XHRyZXR1cm4gKGRhdGFbeF1beV0gPT0gMSk7XG5cdH1cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9yb29tcy5sZW5ndGg7IGkrKyApIHtcblx0XHR2YXIgcm9vbSA9IHRoaXMuX3Jvb21zW2ldO1xuXHRcdHJvb20uY2xlYXJEb29ycygpO1xuXHRcdHJvb20uYWRkRG9vcnMoaXNXYWxsQ2FsbGJhY2spO1xuXHR9XG59XG4vKipcbiAqIEBjbGFzcyBEdW5nZW9uIGdlbmVyYXRvciB3aGljaCB0cmllcyB0byBmaWxsIHRoZSBzcGFjZSBldmVubHkuIEdlbmVyYXRlcyBpbmRlcGVuZGVudCByb29tcyBhbmQgdHJpZXMgdG8gY29ubmVjdCB0aGVtLlxuICogQGF1Z21lbnRzIFJPVC5NYXAuRHVuZ2VvblxuICovXG5ST1QuTWFwLlVuaWZvcm0gPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG5cdFJPVC5NYXAuRHVuZ2Vvbi5jYWxsKHRoaXMsIHdpZHRoLCBoZWlnaHQpO1xuXG5cdHRoaXMuX29wdGlvbnMgPSB7XG5cdFx0cm9vbVdpZHRoOiBbMywgOV0sIC8qIHJvb20gbWluaW11bSBhbmQgbWF4aW11bSB3aWR0aCAqL1xuXHRcdHJvb21IZWlnaHQ6IFszLCA1XSwgLyogcm9vbSBtaW5pbXVtIGFuZCBtYXhpbXVtIGhlaWdodCAqL1xuXHRcdHJvb21EdWdQZXJjZW50YWdlOiAwLjEsIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBwZXJjZW50YWdlIG9mIGxldmVsIGFyZWEgaGFzIGJlZW4gZHVnIG91dCBieSByb29tcyAqL1xuXHRcdHRpbWVMaW1pdDogMTAwMCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgbXVjaCB0aW1lIGhhcyBwYXNzZWQgKG1zZWMpICovXG5cdH1cblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XG5cblx0dGhpcy5fcm9vbUF0dGVtcHRzID0gMjA7IC8qIG5ldyByb29tIGlzIGNyZWF0ZWQgTi10aW1lcyB1bnRpbCBpcyBjb25zaWRlcmVkIGFzIGltcG9zc2libGUgdG8gZ2VuZXJhdGUgKi9cblx0dGhpcy5fY29ycmlkb3JBdHRlbXB0cyA9IDIwOyAvKiBjb3JyaWRvcnMgYXJlIHRyaWVkIE4tdGltZXMgdW50aWwgdGhlIGxldmVsIGlzIGNvbnNpZGVyZWQgYXMgaW1wb3NzaWJsZSB0byBjb25uZWN0ICovXG5cblx0dGhpcy5fY29ubmVjdGVkID0gW107IC8qIGxpc3Qgb2YgYWxyZWFkeSBjb25uZWN0ZWQgcm9vbXMgKi9cblx0dGhpcy5fdW5jb25uZWN0ZWQgPSBbXTsgLyogbGlzdCBvZiByZW1haW5pbmcgdW5jb25uZWN0ZWQgcm9vbXMgKi9cblx0XG5cdHRoaXMuX2RpZ0NhbGxiYWNrID0gdGhpcy5fZGlnQ2FsbGJhY2suYmluZCh0aGlzKTtcblx0dGhpcy5fY2FuQmVEdWdDYWxsYmFjayA9IHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2suYmluZCh0aGlzKTtcblx0dGhpcy5faXNXYWxsQ2FsbGJhY2sgPSB0aGlzLl9pc1dhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xufVxuUk9ULk1hcC5Vbmlmb3JtLmV4dGVuZChST1QuTWFwLkR1bmdlb24pO1xuXG4vKipcbiAqIENyZWF0ZSBhIG1hcC4gSWYgdGhlIHRpbWUgbGltaXQgaGFzIGJlZW4gaGl0LCByZXR1cm5zIG51bGwuXG4gKiBAc2VlIFJPVC5NYXAjY3JlYXRlXG4gKi9cblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblx0dmFyIHQxID0gRGF0ZS5ub3coKTtcblx0d2hpbGUgKDEpIHtcblx0XHR2YXIgdDIgPSBEYXRlLm5vdygpO1xuXHRcdGlmICh0MiAtIHQxID4gdGhpcy5fb3B0aW9ucy50aW1lTGltaXQpIHsgcmV0dXJuIG51bGw7IH0gLyogdGltZSBsaW1pdCEgKi9cblx0XG5cdFx0dGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcblx0XHR0aGlzLl9kdWcgPSAwO1xuXHRcdHRoaXMuX3Jvb21zID0gW107XG5cdFx0dGhpcy5fdW5jb25uZWN0ZWQgPSBbXTtcblx0XHR0aGlzLl9nZW5lcmF0ZVJvb21zKCk7XG5cdFx0aWYgKHRoaXMuX3Jvb21zLmxlbmd0aCA8IDIpIHsgY29udGludWU7IH1cblx0XHRpZiAodGhpcy5fZ2VuZXJhdGVDb3JyaWRvcnMoKSkgeyBicmVhazsgfVxuXHR9XG5cdFxuXHRpZiAoY2FsbGJhY2spIHtcblx0XHRmb3IgKHZhciBpPTA7aTx0aGlzLl93aWR0aDtpKyspIHtcblx0XHRcdGZvciAodmFyIGo9MDtqPHRoaXMuX2hlaWdodDtqKyspIHtcblx0XHRcdFx0Y2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHN1aXRhYmxlIGFtb3VudCBvZiByb29tc1xuICovXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9nZW5lcmF0ZVJvb21zID0gZnVuY3Rpb24oKSB7XG5cdHZhciB3ID0gdGhpcy5fd2lkdGgtMjtcblx0dmFyIGggPSB0aGlzLl9oZWlnaHQtMjtcblxuXHRkbyB7XG5cdFx0dmFyIHJvb20gPSB0aGlzLl9nZW5lcmF0ZVJvb20oKTtcblx0XHRpZiAodGhpcy5fZHVnLyh3KmgpID4gdGhpcy5fb3B0aW9ucy5yb29tRHVnUGVyY2VudGFnZSkgeyBicmVhazsgfSAvKiBhY2hpZXZlZCByZXF1ZXN0ZWQgYW1vdW50IG9mIGZyZWUgc3BhY2UgKi9cblx0fSB3aGlsZSAocm9vbSk7XG5cblx0LyogZWl0aGVyIGVub3VnaCByb29tcywgb3Igbm90IGFibGUgdG8gZ2VuZXJhdGUgbW9yZSBvZiB0aGVtIDopICovXG59XG5cbi8qKlxuICogVHJ5IHRvIGdlbmVyYXRlIG9uZSByb29tXG4gKi9cblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2dlbmVyYXRlUm9vbSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY291bnQgPSAwO1xuXHR3aGlsZSAoY291bnQgPCB0aGlzLl9yb29tQXR0ZW1wdHMpIHtcblx0XHRjb3VudCsrO1xuXHRcdFxuXHRcdHZhciByb29tID0gUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQsIHRoaXMuX29wdGlvbnMpO1xuXHRcdGlmICghcm9vbS5pc1ZhbGlkKHRoaXMuX2lzV2FsbENhbGxiYWNrLCB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrKSkgeyBjb250aW51ZTsgfVxuXHRcdFxuXHRcdHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcblx0XHR0aGlzLl9yb29tcy5wdXNoKHJvb20pO1xuXHRcdHJldHVybiByb29tO1xuXHR9IFxuXG5cdC8qIG5vIHJvb20gd2FzIGdlbmVyYXRlZCBpbiBhIGdpdmVuIG51bWJlciBvZiBhdHRlbXB0cyAqL1xuXHRyZXR1cm4gbnVsbDtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgY29ubmVjdG9ycyBiZXdlZW4gcm9vbXNcbiAqIEByZXR1cm5zIHtib29sfSBzdWNjZXNzIFdhcyB0aGlzIGF0dGVtcHQgc3VjY2Vzc2Z1bGw/XG4gKi9cblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2dlbmVyYXRlQ29ycmlkb3JzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBjbnQgPSAwO1xuXHR3aGlsZSAoY250IDwgdGhpcy5fY29ycmlkb3JBdHRlbXB0cykge1xuXHRcdGNudCsrO1xuXHRcdHRoaXMuX2NvcnJpZG9ycyA9IFtdO1xuXG5cdFx0LyogZGlnIHJvb21zIGludG8gYSBjbGVhciBtYXAgKi9cblx0XHR0aGlzLl9tYXAgPSB0aGlzLl9maWxsTWFwKDEpO1xuXHRcdGZvciAodmFyIGk9MDtpPHRoaXMuX3Jvb21zLmxlbmd0aDtpKyspIHsgXG5cdFx0XHR2YXIgcm9vbSA9IHRoaXMuX3Jvb21zW2ldO1xuXHRcdFx0cm9vbS5jbGVhckRvb3JzKCk7XG5cdFx0XHRyb29tLmNyZWF0ZSh0aGlzLl9kaWdDYWxsYmFjayk7IFxuXHRcdH1cblxuXHRcdHRoaXMuX3VuY29ubmVjdGVkID0gdGhpcy5fcm9vbXMuc2xpY2UoKS5yYW5kb21pemUoKTtcblx0XHR0aGlzLl9jb25uZWN0ZWQgPSBbXTtcblx0XHRpZiAodGhpcy5fdW5jb25uZWN0ZWQubGVuZ3RoKSB7IHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHRoaXMuX3VuY29ubmVjdGVkLnBvcCgpKTsgfSAvKiBmaXJzdCBvbmUgaXMgYWx3YXlzIGNvbm5lY3RlZCAqL1xuXHRcdFxuXHRcdHdoaWxlICgxKSB7XG5cdFx0XHQvKiAxLiBwaWNrIHJhbmRvbSBjb25uZWN0ZWQgcm9vbSAqL1xuXHRcdFx0dmFyIGNvbm5lY3RlZCA9IHRoaXMuX2Nvbm5lY3RlZC5yYW5kb20oKTtcblx0XHRcdFxuXHRcdFx0LyogMi4gZmluZCBjbG9zZXN0IHVuY29ubmVjdGVkICovXG5cdFx0XHR2YXIgcm9vbTEgPSB0aGlzLl9jbG9zZXN0Um9vbSh0aGlzLl91bmNvbm5lY3RlZCwgY29ubmVjdGVkKTtcblx0XHRcdFxuXHRcdFx0LyogMy4gY29ubmVjdCBpdCB0byBjbG9zZXN0IGNvbm5lY3RlZCAqL1xuXHRcdFx0dmFyIHJvb20yID0gdGhpcy5fY2xvc2VzdFJvb20odGhpcy5fY29ubmVjdGVkLCByb29tMSk7XG5cdFx0XHRcblx0XHRcdHZhciBvayA9IHRoaXMuX2Nvbm5lY3RSb29tcyhyb29tMSwgcm9vbTIpO1xuXHRcdFx0aWYgKCFvaykgeyBicmVhazsgfSAvKiBzdG9wIGNvbm5lY3RpbmcsIHJlLXNodWZmbGUgKi9cblx0XHRcdFxuXHRcdFx0aWYgKCF0aGlzLl91bmNvbm5lY3RlZC5sZW5ndGgpIHsgcmV0dXJuIHRydWU7IH0gLyogZG9uZTsgbm8gcm9vbXMgcmVtYWluICovXG5cdFx0fVxuXHR9XG5cdHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBGb3IgYSBnaXZlbiByb29tLCBmaW5kIHRoZSBjbG9zZXN0IG9uZSBmcm9tIHRoZSBsaXN0XG4gKi9cblJPVC5NYXAuVW5pZm9ybS5wcm90b3R5cGUuX2Nsb3Nlc3RSb29tID0gZnVuY3Rpb24ocm9vbXMsIHJvb20pIHtcblx0dmFyIGRpc3QgPSBJbmZpbml0eTtcblx0dmFyIGNlbnRlciA9IHJvb20uZ2V0Q2VudGVyKCk7XG5cdHZhciByZXN1bHQgPSBudWxsO1xuXHRcblx0Zm9yICh2YXIgaT0wO2k8cm9vbXMubGVuZ3RoO2krKykge1xuXHRcdHZhciByID0gcm9vbXNbaV07XG5cdFx0dmFyIGMgPSByLmdldENlbnRlcigpO1xuXHRcdHZhciBkeCA9IGNbMF0tY2VudGVyWzBdO1xuXHRcdHZhciBkeSA9IGNbMV0tY2VudGVyWzFdO1xuXHRcdHZhciBkID0gZHgqZHgrZHkqZHk7XG5cdFx0XG5cdFx0aWYgKGQgPCBkaXN0KSB7XG5cdFx0XHRkaXN0ID0gZDtcblx0XHRcdHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gcmVzdWx0O1xufVxuXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9jb25uZWN0Um9vbXMgPSBmdW5jdGlvbihyb29tMSwgcm9vbTIpIHtcblx0Lypcblx0XHRyb29tMS5kZWJ1ZygpO1xuXHRcdHJvb20yLmRlYnVnKCk7XG5cdCovXG5cblx0dmFyIGNlbnRlcjEgPSByb29tMS5nZXRDZW50ZXIoKTtcblx0dmFyIGNlbnRlcjIgPSByb29tMi5nZXRDZW50ZXIoKTtcblxuXHR2YXIgZGlmZlggPSBjZW50ZXIyWzBdIC0gY2VudGVyMVswXTtcblx0dmFyIGRpZmZZID0gY2VudGVyMlsxXSAtIGNlbnRlcjFbMV07XG5cblx0aWYgKE1hdGguYWJzKGRpZmZYKSA8IE1hdGguYWJzKGRpZmZZKSkgeyAvKiBmaXJzdCB0cnkgY29ubmVjdGluZyBub3J0aC1zb3V0aCB3YWxscyAqL1xuXHRcdHZhciBkaXJJbmRleDEgPSAoZGlmZlkgPiAwID8gMiA6IDApO1xuXHRcdHZhciBkaXJJbmRleDIgPSAoZGlySW5kZXgxICsgMikgJSA0O1xuXHRcdHZhciBtaW4gPSByb29tMi5nZXRMZWZ0KCk7XG5cdFx0dmFyIG1heCA9IHJvb20yLmdldFJpZ2h0KCk7XG5cdFx0dmFyIGluZGV4ID0gMDtcblx0fSBlbHNlIHsgLyogZmlyc3QgdHJ5IGNvbm5lY3RpbmcgZWFzdC13ZXN0IHdhbGxzICovXG5cdFx0dmFyIGRpckluZGV4MSA9IChkaWZmWCA+IDAgPyAxIDogMyk7XG5cdFx0dmFyIGRpckluZGV4MiA9IChkaXJJbmRleDEgKyAyKSAlIDQ7XG5cdFx0dmFyIG1pbiA9IHJvb20yLmdldFRvcCgpO1xuXHRcdHZhciBtYXggPSByb29tMi5nZXRCb3R0b20oKTtcblx0XHR2YXIgaW5kZXggPSAxO1xuXHR9XG5cblx0dmFyIHN0YXJ0ID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTEsIGRpckluZGV4MSk7IC8qIGNvcnJpZG9yIHdpbGwgc3RhcnQgaGVyZSAqL1xuXHRpZiAoIXN0YXJ0KSB7IHJldHVybiBmYWxzZTsgfVxuXG5cdGlmIChzdGFydFtpbmRleF0gPj0gbWluICYmIHN0YXJ0W2luZGV4XSA8PSBtYXgpIHsgLyogcG9zc2libGUgdG8gY29ubmVjdCB3aXRoIHN0cmFpZ2h0IGxpbmUgKEktbGlrZSkgKi9cblx0XHR2YXIgZW5kID0gc3RhcnQuc2xpY2UoKTtcblx0XHR2YXIgdmFsdWUgPSBudWxsO1xuXHRcdHN3aXRjaCAoZGlySW5kZXgyKSB7XG5cdFx0XHRjYXNlIDA6IHZhbHVlID0gcm9vbTIuZ2V0VG9wKCktMTsgYnJlYWs7XG5cdFx0XHRjYXNlIDE6IHZhbHVlID0gcm9vbTIuZ2V0UmlnaHQoKSsxOyBicmVhaztcblx0XHRcdGNhc2UgMjogdmFsdWUgPSByb29tMi5nZXRCb3R0b20oKSsxOyBicmVhaztcblx0XHRcdGNhc2UgMzogdmFsdWUgPSByb29tMi5nZXRMZWZ0KCktMTsgYnJlYWs7XG5cdFx0fVxuXHRcdGVuZFsoaW5kZXgrMSklMl0gPSB2YWx1ZTtcblx0XHR0aGlzLl9kaWdMaW5lKFtzdGFydCwgZW5kXSk7XG5cdFx0XG5cdH0gZWxzZSBpZiAoc3RhcnRbaW5kZXhdIDwgbWluLTEgfHwgc3RhcnRbaW5kZXhdID4gbWF4KzEpIHsgLyogbmVlZCB0byBzd2l0Y2ggdGFyZ2V0IHdhbGwgKEwtbGlrZSkgKi9cblxuXHRcdHZhciBkaWZmID0gc3RhcnRbaW5kZXhdIC0gY2VudGVyMltpbmRleF07XG5cdFx0c3dpdGNoIChkaXJJbmRleDIpIHtcblx0XHRcdGNhc2UgMDpcblx0XHRcdGNhc2UgMTpcdHZhciByb3RhdGlvbiA9IChkaWZmIDwgMCA/IDMgOiAxKTsgYnJlYWs7XG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRjYXNlIDM6XHR2YXIgcm90YXRpb24gPSAoZGlmZiA8IDAgPyAxIDogMyk7IGJyZWFrO1xuXHRcdH1cblx0XHRkaXJJbmRleDIgPSAoZGlySW5kZXgyICsgcm90YXRpb24pICUgNDtcblx0XHRcblx0XHR2YXIgZW5kID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTIsIGRpckluZGV4Mik7XG5cdFx0aWYgKCFlbmQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0XHR2YXIgbWlkID0gWzAsIDBdO1xuXHRcdG1pZFtpbmRleF0gPSBzdGFydFtpbmRleF07XG5cdFx0dmFyIGluZGV4MiA9IChpbmRleCsxKSUyO1xuXHRcdG1pZFtpbmRleDJdID0gZW5kW2luZGV4Ml07XG5cdFx0dGhpcy5fZGlnTGluZShbc3RhcnQsIG1pZCwgZW5kXSk7XG5cdFx0XG5cdH0gZWxzZSB7IC8qIHVzZSBjdXJyZW50IHdhbGwgcGFpciwgYnV0IGFkanVzdCB0aGUgbGluZSBpbiB0aGUgbWlkZGxlIChTLWxpa2UpICovXG5cdFxuXHRcdHZhciBpbmRleDIgPSAoaW5kZXgrMSklMjtcblx0XHR2YXIgZW5kID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTIsIGRpckluZGV4Mik7XG5cdFx0aWYgKCFlbmQpIHsgcmV0dXJuOyB9XG5cdFx0dmFyIG1pZCA9IE1hdGgucm91bmQoKGVuZFtpbmRleDJdICsgc3RhcnRbaW5kZXgyXSkvMik7XG5cblx0XHR2YXIgbWlkMSA9IFswLCAwXTtcblx0XHR2YXIgbWlkMiA9IFswLCAwXTtcblx0XHRtaWQxW2luZGV4XSA9IHN0YXJ0W2luZGV4XTtcblx0XHRtaWQxW2luZGV4Ml0gPSBtaWQ7XG5cdFx0bWlkMltpbmRleF0gPSBlbmRbaW5kZXhdO1xuXHRcdG1pZDJbaW5kZXgyXSA9IG1pZDtcblx0XHR0aGlzLl9kaWdMaW5lKFtzdGFydCwgbWlkMSwgbWlkMiwgZW5kXSk7XG5cdH1cblxuXHRyb29tMS5hZGREb29yKHN0YXJ0WzBdLCBzdGFydFsxXSk7XG5cdHJvb20yLmFkZERvb3IoZW5kWzBdLCBlbmRbMV0pO1xuXHRcblx0dmFyIGluZGV4ID0gdGhpcy5fdW5jb25uZWN0ZWQuaW5kZXhPZihyb29tMSk7XG5cdGlmIChpbmRleCAhPSAtMSkge1xuXHRcdHRoaXMuX3VuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XG5cdFx0dGhpcy5fY29ubmVjdGVkLnB1c2gocm9vbTEpO1xuXHR9XG5cblx0dmFyIGluZGV4ID0gdGhpcy5fdW5jb25uZWN0ZWQuaW5kZXhPZihyb29tMik7XG5cdGlmIChpbmRleCAhPSAtMSkge1xuXHRcdHRoaXMuX3VuY29ubmVjdGVkLnNwbGljZShpbmRleCwgMSk7XG5cdFx0dGhpcy5fY29ubmVjdGVkLnB1c2gocm9vbTIpO1xuXHR9XG5cdFxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fcGxhY2VJbldhbGwgPSBmdW5jdGlvbihyb29tLCBkaXJJbmRleCkge1xuXHR2YXIgc3RhcnQgPSBbMCwgMF07XG5cdHZhciBkaXIgPSBbMCwgMF07XG5cdHZhciBsZW5ndGggPSAwO1xuXHRcblx0c3dpdGNoIChkaXJJbmRleCkge1xuXHRcdGNhc2UgMDpcblx0XHRcdGRpciA9IFsxLCAwXTtcblx0XHRcdHN0YXJ0ID0gW3Jvb20uZ2V0TGVmdCgpLCByb29tLmdldFRvcCgpLTFdO1xuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRSaWdodCgpLXJvb20uZ2V0TGVmdCgpKzE7XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSAxOlxuXHRcdFx0ZGlyID0gWzAsIDFdO1xuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRSaWdodCgpKzEsIHJvb20uZ2V0VG9wKCldO1xuXHRcdFx0bGVuZ3RoID0gcm9vbS5nZXRCb3R0b20oKS1yb29tLmdldFRvcCgpKzE7XG5cdFx0YnJlYWs7XG5cdFx0Y2FzZSAyOlxuXHRcdFx0ZGlyID0gWzEsIDBdO1xuXHRcdFx0c3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCksIHJvb20uZ2V0Qm90dG9tKCkrMV07XG5cdFx0XHRsZW5ndGggPSByb29tLmdldFJpZ2h0KCktcm9vbS5nZXRMZWZ0KCkrMTtcblx0XHRicmVhaztcblx0XHRjYXNlIDM6XG5cdFx0XHRkaXIgPSBbMCwgMV07XG5cdFx0XHRzdGFydCA9IFtyb29tLmdldExlZnQoKS0xLCByb29tLmdldFRvcCgpXTtcblx0XHRcdGxlbmd0aCA9IHJvb20uZ2V0Qm90dG9tKCktcm9vbS5nZXRUb3AoKSsxO1xuXHRcdGJyZWFrO1xuXHR9XG5cdFxuXHR2YXIgYXZhaWwgPSBbXTtcblx0dmFyIGxhc3RCYWRJbmRleCA9IC0yO1xuXG5cdGZvciAodmFyIGk9MDtpPGxlbmd0aDtpKyspIHtcblx0XHR2YXIgeCA9IHN0YXJ0WzBdICsgaSpkaXJbMF07XG5cdFx0dmFyIHkgPSBzdGFydFsxXSArIGkqZGlyWzFdO1xuXHRcdGF2YWlsLnB1c2gobnVsbCk7XG5cdFx0XG5cdFx0dmFyIGlzV2FsbCA9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XG5cdFx0aWYgKGlzV2FsbCkge1xuXHRcdFx0aWYgKGxhc3RCYWRJbmRleCAhPSBpLTEpIHsgYXZhaWxbaV0gPSBbeCwgeV07IH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bGFzdEJhZEluZGV4ID0gaTtcblx0XHRcdGlmIChpKSB7IGF2YWlsW2ktMV0gPSBudWxsOyB9XG5cdFx0fVxuXHR9XG5cdFxuXHRmb3IgKHZhciBpPWF2YWlsLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcblx0XHRpZiAoIWF2YWlsW2ldKSB7IGF2YWlsLnNwbGljZShpLCAxKTsgfVxuXHR9XG5cdHJldHVybiAoYXZhaWwubGVuZ3RoID8gYXZhaWwucmFuZG9tKCkgOiBudWxsKTtcbn1cblxuLyoqXG4gKiBEaWcgYSBwb2x5bGluZS5cbiAqL1xuUk9ULk1hcC5Vbmlmb3JtLnByb3RvdHlwZS5fZGlnTGluZSA9IGZ1bmN0aW9uKHBvaW50cykge1xuXHRmb3IgKHZhciBpPTE7aTxwb2ludHMubGVuZ3RoO2krKykge1xuXHRcdHZhciBzdGFydCA9IHBvaW50c1tpLTFdO1xuXHRcdHZhciBlbmQgPSBwb2ludHNbaV07XG5cdFx0dmFyIGNvcnJpZG9yID0gbmV3IFJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcihzdGFydFswXSwgc3RhcnRbMV0sIGVuZFswXSwgZW5kWzFdKTtcblx0XHRjb3JyaWRvci5jcmVhdGUodGhpcy5fZGlnQ2FsbGJhY2spO1xuXHRcdHRoaXMuX2NvcnJpZG9ycy5wdXNoKGNvcnJpZG9yKTtcblx0fVxufVxuXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9kaWdDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHksIHZhbHVlKSB7XG5cdHRoaXMuX21hcFt4XVt5XSA9IHZhbHVlO1xuXHRpZiAodmFsdWUgPT0gMCkgeyB0aGlzLl9kdWcrKzsgfVxufVxuXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9pc1dhbGxDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcblx0aWYgKHggPCAwIHx8IHkgPCAwIHx8IHggPj0gdGhpcy5fd2lkdGggfHwgeSA+PSB0aGlzLl9oZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xufVxuXG5ST1QuTWFwLlVuaWZvcm0ucHJvdG90eXBlLl9jYW5CZUR1Z0NhbGxiYWNrID0gZnVuY3Rpb24oeCwgeSkge1xuXHRpZiAoeCA8IDEgfHwgeSA8IDEgfHwgeCsxID49IHRoaXMuX3dpZHRoIHx8IHkrMSA+PSB0aGlzLl9oZWlnaHQpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xufVxuXG4vKipcbiAqIEBhdXRob3IgaHlha3VnZWlcbiAqIEBjbGFzcyBEdW5nZW9uIGdlbmVyYXRvciB3aGljaCB1c2VzIHRoZSBcIm9yZ2luYWxcIiBSb2d1ZSBkdW5nZW9uIGdlbmVyYXRpb24gYWxnb3JpdGhtLiBTZWUgaHR0cDovL2t1b2kuY29tL35rYW1pa2F6ZS9HYW1lRGVzaWduL2FydDA3X3JvZ3VlX2R1bmdlb24ucGhwXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxuICogQHBhcmFtIHtpbnR9IFt3aWR0aD1ST1QuREVGQVVMVF9XSURUSF1cbiAqIEBwYXJhbSB7aW50fSBbaGVpZ2h0PVJPVC5ERUZBVUxUX0hFSUdIVF1cbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc10gT3B0aW9uc1xuICogQHBhcmFtIHtpbnRbXX0gW29wdGlvbnMuY2VsbFdpZHRoPTNdIE51bWJlciBvZiBjZWxscyB0byBjcmVhdGUgb24gdGhlIGhvcml6b250YWwgKG51bWJlciBvZiByb29tcyBob3Jpem9udGFsbHkpXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5jZWxsSGVpZ2h0PTNdIE51bWJlciBvZiBjZWxscyB0byBjcmVhdGUgb24gdGhlIHZlcnRpY2FsIChudW1iZXIgb2Ygcm9vbXMgdmVydGljYWxseSkgXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucm9vbVdpZHRoXSBSb29tIG1pbiBhbmQgbWF4IHdpZHRoIC0gbm9ybWFsbHkgc2V0IGF1dG8tbWFnaWNhbGx5IHZpYSB0aGUgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucm9vbUhlaWdodF0gUm9vbSBtaW4gYW5kIG1heCBoZWlnaHQgLSBub3JtYWxseSBzZXQgYXV0by1tYWdpY2FsbHkgdmlhIHRoZSBjb25zdHJ1Y3Rvci4gXG4gKi9cblJPVC5NYXAuUm9ndWUgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBvcHRpb25zKSB7XG5cdFJPVC5NYXAuY2FsbCh0aGlzLCB3aWR0aCwgaGVpZ2h0KTtcblx0XG5cdHRoaXMuX29wdGlvbnMgPSB7XG5cdFx0Y2VsbFdpZHRoOiAzLCAgLy8gTk9URSB0byBzZWxmLCB0aGVzZSBjb3VsZCBwcm9iYWJseSB3b3JrIHRoZSBzYW1lIGFzIHRoZSByb29tV2lkdGgvcm9vbSBIZWlnaHQgdmFsdWVzXG5cdFx0Y2VsbEhlaWdodDogMyAgLy8gICAgIGllLiBhcyBhbiBhcnJheSB3aXRoIG1pbi1tYXggdmFsdWVzIGZvciBlYWNoIGRpcmVjdGlvbi4uLi5cblx0fVxuXHRcblx0Zm9yICh2YXIgcCBpbiBvcHRpb25zKSB7IHRoaXMuX29wdGlvbnNbcF0gPSBvcHRpb25zW3BdOyB9XG5cdFxuXHQvKlxuXHRTZXQgdGhlIHJvb20gc2l6ZXMgYWNjb3JkaW5nIHRvIHRoZSBvdmVyLWFsbCB3aWR0aCBvZiB0aGUgbWFwLCBcblx0YW5kIHRoZSBjZWxsIHNpemVzLiBcblx0Ki9cblx0XG5cdGlmICghdGhpcy5fb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcInJvb21XaWR0aFwiKSkge1xuXHRcdHRoaXMuX29wdGlvbnNbXCJyb29tV2lkdGhcIl0gPSB0aGlzLl9jYWxjdWxhdGVSb29tU2l6ZSh3aWR0aCwgdGhpcy5fb3B0aW9uc1tcImNlbGxXaWR0aFwiXSk7XG5cdH1cblx0aWYgKCF0aGlzLl9vcHRpb25zLmhhc093blByb3BlcnR5W1wicm9vbUhlaWdodFwiXSkge1xuXHRcdHRoaXMuX29wdGlvbnNbXCJyb29tSGVpZ2h0XCJdID0gdGhpcy5fY2FsY3VsYXRlUm9vbVNpemUoaGVpZ2h0LCB0aGlzLl9vcHRpb25zW1wiY2VsbEhlaWdodFwiXSk7XG5cdH1cblx0XG59XG5cblJPVC5NYXAuUm9ndWUuZXh0ZW5kKFJPVC5NYXApOyBcblxuLyoqXG4gKiBAc2VlIFJPVC5NYXAjY3JlYXRlXG4gKi9cblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdHRoaXMubWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcblx0dGhpcy5yb29tcyA9IFtdO1xuXHR0aGlzLmNvbm5lY3RlZENlbGxzID0gW107XG5cdFxuXHR0aGlzLl9pbml0Um9vbXMoKTtcblx0dGhpcy5fY29ubmVjdFJvb21zKCk7XG5cdHRoaXMuX2Nvbm5lY3RVbmNvbm5lY3RlZFJvb21zKCk7XG5cdHRoaXMuX2NyZWF0ZVJhbmRvbVJvb21Db25uZWN0aW9ucygpO1xuXHR0aGlzLl9jcmVhdGVSb29tcygpO1xuXHR0aGlzLl9jcmVhdGVDb3JyaWRvcnMoKTtcblx0XG5cdGlmIChjYWxsYmFjaykge1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fd2lkdGg7IGkrKykge1xuXHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9oZWlnaHQ7IGorKykge1xuXHRcdFx0XHRjYWxsYmFjayhpLCBqLCB0aGlzLm1hcFtpXVtqXSk7ICAgXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4gdGhpcztcbn1cblxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2dldFJhbmRvbUludCA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG5cdHJldHVybiBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcbn1cblxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NhbGN1bGF0ZVJvb21TaXplID0gZnVuY3Rpb24oc2l6ZSwgY2VsbCkge1xuXHR2YXIgbWF4ID0gTWF0aC5mbG9vcigoc2l6ZS9jZWxsKSAqIDAuOCk7XG5cdHZhciBtaW4gPSBNYXRoLmZsb29yKChzaXplL2NlbGwpICogMC4yNSk7XG5cdGlmIChtaW4gPCAyKSBtaW4gPSAyO1xuXHRpZiAobWF4IDwgMikgbWF4ID0gMjtcblx0cmV0dXJuIFttaW4sIG1heF07XG59XG5cblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9pbml0Um9vbXMgPSBmdW5jdGlvbiAoKSB7IFxuXHQvLyBjcmVhdGUgcm9vbXMgYXJyYXkuIFRoaXMgaXMgdGhlIFwiZ3JpZFwiIGxpc3QgZnJvbSB0aGUgYWxnby4gIFxuXHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoOyBpKyspIHsgIFxuXHRcdHRoaXMucm9vbXMucHVzaChbXSk7XG5cdFx0Zm9yKHZhciBqID0gMDsgaiA8IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDsgaisrKSB7XG5cdFx0XHR0aGlzLnJvb21zW2ldLnB1c2goe1wieFwiOjAsIFwieVwiOjAsIFwid2lkdGhcIjowLCBcImhlaWdodFwiOjAsIFwiY29ubmVjdGlvbnNcIjpbXSwgXCJjZWxseFwiOmksIFwiY2VsbHlcIjpqfSk7XG5cdFx0fVxuXHR9XG59XG5cblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9jb25uZWN0Um9vbXMgPSBmdW5jdGlvbigpIHtcblx0Ly9waWNrIHJhbmRvbSBzdGFydGluZyBncmlkXG5cdHZhciBjZ3ggPSB0aGlzLl9nZXRSYW5kb21JbnQoMCwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGgtMSk7XG5cdHZhciBjZ3kgPSB0aGlzLl9nZXRSYW5kb21JbnQoMCwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0LTEpO1xuXHRcblx0dmFyIGlkeDtcblx0dmFyIG5jZ3g7XG5cdHZhciBuY2d5O1xuXHRcblx0dmFyIGZvdW5kID0gZmFsc2U7XG5cdHZhciByb29tO1xuXHR2YXIgb3RoZXJSb29tO1xuXHRcblx0Ly8gZmluZCAgdW5jb25uZWN0ZWQgbmVpZ2hib3VyIGNlbGxzXG5cdGRvIHtcblx0XG5cdFx0Ly92YXIgZGlyVG9DaGVjayA9IFswLDEsMiwzLDQsNSw2LDddO1xuXHRcdHZhciBkaXJUb0NoZWNrID0gWzAsMiw0LDZdO1xuXHRcdGRpclRvQ2hlY2sgPSBkaXJUb0NoZWNrLnJhbmRvbWl6ZSgpO1xuXHRcdFxuXHRcdGRvIHtcblx0XHRcdGZvdW5kID0gZmFsc2U7XG5cdFx0XHRpZHggPSBkaXJUb0NoZWNrLnBvcCgpO1xuXHRcdFx0XG5cdFx0XHRcblx0XHRcdG5jZ3ggPSBjZ3ggKyBST1QuRElSU1s4XVtpZHhdWzBdO1xuXHRcdFx0bmNneSA9IGNneSArIFJPVC5ESVJTWzhdW2lkeF1bMV07XG5cdFx0XHRcblx0XHRcdGlmKG5jZ3ggPCAwIHx8IG5jZ3ggPj0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGgpIGNvbnRpbnVlO1xuXHRcdFx0aWYobmNneSA8IDAgfHwgbmNneSA+PSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQpIGNvbnRpbnVlO1xuXHRcdFx0XG5cdFx0XHRyb29tID0gdGhpcy5yb29tc1tjZ3hdW2NneV07XG5cdFx0XHRcblx0XHRcdGlmKHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPiAwKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBhcyBsb25nIGFzIHRoaXMgcm9vbSBkb2Vzbid0IGFscmVhZHkgY29vbmVjdCB0byBtZSwgd2UgYXJlIG9rIHdpdGggaXQuIFxuXHRcdFx0XHRpZihyb29tW1wiY29ubmVjdGlvbnNcIl1bMF1bMF0gPT0gbmNneCAmJlxuXHRcdFx0XHRyb29tW1wiY29ubmVjdGlvbnNcIl1bMF1bMV0gPT0gbmNneSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdG90aGVyUm9vbSA9IHRoaXMucm9vbXNbbmNneF1bbmNneV07XG5cdFx0XHRcblx0XHRcdGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkgeyBcblx0XHRcdFx0b3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ucHVzaChbY2d4LGNneV0pO1xuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5jb25uZWN0ZWRDZWxscy5wdXNoKFtuY2d4LCBuY2d5XSk7XG5cdFx0XHRcdGNneCA9IG5jZ3g7XG5cdFx0XHRcdGNneSA9IG5jZ3k7XG5cdFx0XHRcdGZvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHR9IHdoaWxlIChkaXJUb0NoZWNrLmxlbmd0aCA+IDAgJiYgZm91bmQgPT0gZmFsc2UpXG5cdFx0XG5cdH0gd2hpbGUgKGRpclRvQ2hlY2subGVuZ3RoID4gMClcblxufVxuXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY29ubmVjdFVuY29ubmVjdGVkUm9vbXMgPSBmdW5jdGlvbigpIHtcblx0Ly9XaGlsZSB0aGVyZSBhcmUgdW5jb25uZWN0ZWQgcm9vbXMsIHRyeSB0byBjb25uZWN0IHRoZW0gdG8gYSByYW5kb20gY29ubmVjdGVkIG5laWdoYm9yIFxuXHQvLyhpZiBhIHJvb20gaGFzIG5vIGNvbm5lY3RlZCBuZWlnaGJvcnMgeWV0LCBqdXN0IGtlZXAgY3ljbGluZywgeW91J2xsIGZpbGwgb3V0IHRvIGl0IGV2ZW50dWFsbHkpLlxuXHR2YXIgY3cgPSB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDtcblx0dmFyIGNoID0gdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0O1xuXHRcblx0dmFyIHJhbmRvbUNvbm5lY3RlZENlbGw7XG5cdHRoaXMuY29ubmVjdGVkQ2VsbHMgPSB0aGlzLmNvbm5lY3RlZENlbGxzLnJhbmRvbWl6ZSgpO1xuXHR2YXIgcm9vbTtcblx0dmFyIG90aGVyUm9vbTtcblx0dmFyIHZhbGlkUm9vbTtcblx0XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7IGkrKykge1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fb3B0aW9ucy5jZWxsSGVpZ2h0OyBqKyspICB7XG5cdFx0XHRcdFxuXHRcdFx0cm9vbSA9IHRoaXMucm9vbXNbaV1bal07XG5cdFx0XHRcblx0XHRcdGlmIChyb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoID09IDApIHtcblx0XHRcdFx0dmFyIGRpcmVjdGlvbnMgPSBbMCwyLDQsNl07XG5cdFx0XHRcdGRpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLnJhbmRvbWl6ZSgpO1xuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHZhbGlkUm9vbSA9IGZhbHNlO1xuXHRcdFx0XHRcblx0XHRcdFx0ZG8ge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHZhciBkaXJJZHggPSBkaXJlY3Rpb25zLnBvcCgpO1xuXHRcdFx0XHRcdHZhciBuZXdJID0gaSArIFJPVC5ESVJTWzhdW2RpcklkeF1bMF07XG5cdFx0XHRcdFx0dmFyIG5ld0ogPSBqICsgUk9ULkRJUlNbOF1bZGlySWR4XVsxXTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZiAobmV3SSA8IDAgfHwgbmV3SSA+PSBjdyB8fCBcblx0XHRcdFx0XHRuZXdKIDwgMCB8fCBuZXdKID49IGNoKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tuZXdJXVtuZXdKXTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR2YWxpZFJvb20gPSB0cnVlO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkge1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgb3RoZXJSb29tW1wiY29ubmVjdGlvbnNcIl0ubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHRcdGlmKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdW2tdWzBdID09IGkgJiYgXG5cdFx0XHRcdFx0XHRvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXVtrXVsxXSA9PSBqKSB7XG5cdFx0XHRcdFx0XHRcdHZhbGlkUm9vbSA9IGZhbHNlO1xuXHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYgKHZhbGlkUm9vbSkgYnJlYWs7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH0gd2hpbGUgKGRpcmVjdGlvbnMubGVuZ3RoKVxuXHRcdFx0XHRcblx0XHRcdFx0aWYodmFsaWRSb29tKSB7IFxuXHRcdFx0XHRcdHJvb21bXCJjb25uZWN0aW9uc1wiXS5wdXNoKCBbb3RoZXJSb29tW1wiY2VsbHhcIl0sIG90aGVyUm9vbVtcImNlbGx5XCJdXSApOyAgXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCItLSBVbmFibGUgdG8gY29ubmVjdCByb29tLlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY3JlYXRlUmFuZG9tUm9vbUNvbm5lY3Rpb25zID0gZnVuY3Rpb24oY29ubmVjdGlvbnMpIHtcblx0Ly8gRW1wdHkgZm9yIG5vdy4gXG59XG5cblxuUk9ULk1hcC5Sb2d1ZS5wcm90b3R5cGUuX2NyZWF0ZVJvb21zID0gZnVuY3Rpb24oKSB7XG5cdC8vIENyZWF0ZSBSb29tcyBcblx0XG5cdHZhciB3ID0gdGhpcy5fd2lkdGg7XG5cdHZhciBoID0gdGhpcy5faGVpZ2h0O1xuXHRcblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcblx0XG5cdHZhciBjd3AgPSBNYXRoLmZsb29yKHRoaXMuX3dpZHRoIC8gY3cpO1xuXHR2YXIgY2hwID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQgLyBjaCk7XG5cdFxuXHR2YXIgcm9vbXc7XG5cdHZhciByb29taDtcblx0dmFyIHJvb21XaWR0aCA9IHRoaXMuX29wdGlvbnNbXCJyb29tV2lkdGhcIl07XG5cdHZhciByb29tSGVpZ2h0ID0gdGhpcy5fb3B0aW9uc1tcInJvb21IZWlnaHRcIl07XG5cdHZhciBzeDtcblx0dmFyIHN5O1xuXHR2YXIgdHg7XG5cdHZhciB0eTtcblx0dmFyIG90aGVyUm9vbTtcblx0XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY3c7IGkrKykge1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2g7IGorKykge1xuXHRcdFx0c3ggPSBjd3AgKiBpO1xuXHRcdFx0c3kgPSBjaHAgKiBqO1xuXHRcdFx0XG5cdFx0XHRpZiAoc3ggPT0gMCkgc3ggPSAxO1xuXHRcdFx0aWYgKHN5ID09IDApIHN5ID0gMTtcblx0XHRcdFxuXHRcdFx0cm9vbXcgPSB0aGlzLl9nZXRSYW5kb21JbnQocm9vbVdpZHRoWzBdLCByb29tV2lkdGhbMV0pO1xuXHRcdFx0cm9vbWggPSB0aGlzLl9nZXRSYW5kb21JbnQocm9vbUhlaWdodFswXSwgcm9vbUhlaWdodFsxXSk7XG5cdFx0XHRcblx0XHRcdGlmIChqID4gMCkge1xuXHRcdFx0XHRvdGhlclJvb20gPSB0aGlzLnJvb21zW2ldW2otMV07XG5cdFx0XHRcdHdoaWxlIChzeSAtIChvdGhlclJvb21bXCJ5XCJdICsgb3RoZXJSb29tW1wiaGVpZ2h0XCJdICkgPCAzKSB7XG5cdFx0XHRcdFx0c3krKztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAoaSA+IDApIHtcblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tpLTFdW2pdO1xuXHRcdFx0XHR3aGlsZShzeCAtIChvdGhlclJvb21bXCJ4XCJdICsgb3RoZXJSb29tW1wid2lkdGhcIl0pIDwgMykge1xuXHRcdFx0XHRcdHN4Kys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0dmFyIHN4T2Zmc2V0ID0gTWF0aC5yb3VuZCh0aGlzLl9nZXRSYW5kb21JbnQoMCwgY3dwLXJvb213KS8yKTtcblx0XHRcdHZhciBzeU9mZnNldCA9IE1hdGgucm91bmQodGhpcy5fZ2V0UmFuZG9tSW50KDAsIGNocC1yb29taCkvMik7XG5cdFx0XHRcblx0XHRcdHdoaWxlIChzeCArIHN4T2Zmc2V0ICsgcm9vbXcgPj0gdykge1xuXHRcdFx0XHRpZihzeE9mZnNldCkge1xuXHRcdFx0XHRcdHN4T2Zmc2V0LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cm9vbXctLTsgXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0d2hpbGUgKHN5ICsgc3lPZmZzZXQgKyByb29taCA+PSBoKSB7IFxuXHRcdFx0XHRpZihzeU9mZnNldCkge1xuXHRcdFx0XHRcdHN5T2Zmc2V0LS07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cm9vbWgtLTsgXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0c3ggPSBzeCArIHN4T2Zmc2V0O1xuXHRcdFx0c3kgPSBzeSArIHN5T2Zmc2V0O1xuXHRcdFx0XG5cdFx0XHR0aGlzLnJvb21zW2ldW2pdW1wieFwiXSA9IHN4O1xuXHRcdFx0dGhpcy5yb29tc1tpXVtqXVtcInlcIl0gPSBzeTtcblx0XHRcdHRoaXMucm9vbXNbaV1bal1bXCJ3aWR0aFwiXSA9IHJvb213O1xuXHRcdFx0dGhpcy5yb29tc1tpXVtqXVtcImhlaWdodFwiXSA9IHJvb21oOyAgXG5cdFx0XHRcblx0XHRcdGZvciAodmFyIGlpID0gc3g7IGlpIDwgc3ggKyByb29tdzsgaWkrKykge1xuXHRcdFx0XHRmb3IgKHZhciBqaiA9IHN5OyBqaiA8IHN5ICsgcm9vbWg7IGpqKyspIHtcblx0XHRcdFx0XHR0aGlzLm1hcFtpaV1bampdID0gMDtcblx0XHRcdFx0fVxuXHRcdFx0fSAgXG5cdFx0fVxuXHR9XG59XG5cblJPVC5NYXAuUm9ndWUucHJvdG90eXBlLl9nZXRXYWxsUG9zaXRpb24gPSBmdW5jdGlvbihhUm9vbSwgYURpcmVjdGlvbikge1xuXHR2YXIgcng7XG5cdHZhciByeTtcblx0dmFyIGRvb3I7XG5cdFxuXHRpZiAoYURpcmVjdGlvbiA9PSAxIHx8IGFEaXJlY3Rpb24gPT0gMykge1xuXHRcdHJ4ID0gdGhpcy5fZ2V0UmFuZG9tSW50KGFSb29tW1wieFwiXSArIDEsIGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gLSAyKTtcblx0XHRpZiAoYURpcmVjdGlvbiA9PSAxKSB7XG5cdFx0XHRyeSA9IGFSb29tW1wieVwiXSAtIDI7XG5cdFx0XHRkb29yID0gcnkgKyAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyeSA9IGFSb29tW1wieVwiXSArIGFSb29tW1wiaGVpZ2h0XCJdICsgMTtcblx0XHRcdGRvb3IgPSByeSAtMTtcblx0XHR9XG5cdFx0XG5cdFx0dGhpcy5tYXBbcnhdW2Rvb3JdID0gMDsgLy8gaSdtIG5vdCBzZXR0aW5nIGEgc3BlY2lmaWMgJ2Rvb3InIHRpbGUgdmFsdWUgcmlnaHQgbm93LCBqdXN0IGVtcHR5IHNwYWNlLiBcblx0XHRcblx0fSBlbHNlIGlmIChhRGlyZWN0aW9uID09IDIgfHwgYURpcmVjdGlvbiA9PSA0KSB7XG5cdFx0cnkgPSB0aGlzLl9nZXRSYW5kb21JbnQoYVJvb21bXCJ5XCJdICsgMSwgYVJvb21bXCJ5XCJdICsgYVJvb21bXCJoZWlnaHRcIl0gLSAyKTtcblx0XHRpZihhRGlyZWN0aW9uID09IDIpIHtcblx0XHRcdHJ4ID0gYVJvb21bXCJ4XCJdICsgYVJvb21bXCJ3aWR0aFwiXSArIDE7XG5cdFx0XHRkb29yID0gcnggLSAxO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyeCA9IGFSb29tW1wieFwiXSAtIDI7XG5cdFx0XHRkb29yID0gcnggKyAxO1xuXHRcdH1cblx0XHRcblx0XHR0aGlzLm1hcFtkb29yXVtyeV0gPSAwOyAvLyBpJ20gbm90IHNldHRpbmcgYSBzcGVjaWZpYyAnZG9vcicgdGlsZSB2YWx1ZSByaWdodCBub3csIGp1c3QgZW1wdHkgc3BhY2UuIFxuXHRcdFxuXHR9XG5cdHJldHVybiBbcngsIHJ5XTtcbn1cblxuLyoqKlxuKiBAcGFyYW0gc3RhcnRQb3NpdGlvbiBhIDIgZWxlbWVudCBhcnJheVxuKiBAcGFyYW0gZW5kUG9zaXRpb24gYSAyIGVsZW1lbnQgYXJyYXlcbiovXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fZHJhd0NvcnJpZG9yZSA9IGZ1bmN0aW9uIChzdGFydFBvc2l0aW9uLCBlbmRQb3NpdGlvbikge1xuXHR2YXIgeE9mZnNldCA9IGVuZFBvc2l0aW9uWzBdIC0gc3RhcnRQb3NpdGlvblswXTtcblx0dmFyIHlPZmZzZXQgPSBlbmRQb3NpdGlvblsxXSAtIHN0YXJ0UG9zaXRpb25bMV07XG5cdFxuXHR2YXIgeHBvcyA9IHN0YXJ0UG9zaXRpb25bMF07XG5cdHZhciB5cG9zID0gc3RhcnRQb3NpdGlvblsxXTtcblx0XG5cdHZhciB0ZW1wRGlzdDtcblx0dmFyIHhEaXI7XG5cdHZhciB5RGlyO1xuXHRcblx0dmFyIG1vdmU7IC8vIDIgZWxlbWVudCBhcnJheSwgZWxlbWVudCAwIGlzIHRoZSBkaXJlY3Rpb24sIGVsZW1lbnQgMSBpcyB0aGUgdG90YWwgdmFsdWUgdG8gbW92ZS4gXG5cdHZhciBtb3ZlcyA9IFtdOyAvLyBhIGxpc3Qgb2YgMiBlbGVtZW50IGFycmF5c1xuXHRcblx0dmFyIHhBYnMgPSBNYXRoLmFicyh4T2Zmc2V0KTtcblx0dmFyIHlBYnMgPSBNYXRoLmFicyh5T2Zmc2V0KTtcblx0XG5cdHZhciBwZXJjZW50ID0gUk9ULlJORy5nZXRVbmlmb3JtKCk7IC8vIHVzZWQgdG8gc3BsaXQgdGhlIG1vdmUgYXQgZGlmZmVyZW50IHBsYWNlcyBhbG9uZyB0aGUgbG9uZyBheGlzXG5cdHZhciBmaXJzdEhhbGYgPSBwZXJjZW50O1xuXHR2YXIgc2Vjb25kSGFsZiA9IDEgLSBwZXJjZW50O1xuXHRcblx0eERpciA9IHhPZmZzZXQgPiAwID8gMiA6IDY7XG5cdHlEaXIgPSB5T2Zmc2V0ID4gMCA/IDQgOiAwO1xuXHRcblx0aWYgKHhBYnMgPCB5QWJzKSB7XG5cdFx0Ly8gbW92ZSBmaXJzdEhhbGYgb2YgdGhlIHkgb2Zmc2V0XG5cdFx0dGVtcERpc3QgPSBNYXRoLmNlaWwoeUFicyAqIGZpcnN0SGFsZik7XG5cdFx0bW92ZXMucHVzaChbeURpciwgdGVtcERpc3RdKTtcblx0XHQvLyBtb3ZlIGFsbCB0aGUgeCBvZmZzZXRcblx0XHRtb3Zlcy5wdXNoKFt4RGlyLCB4QWJzXSk7XG5cdFx0Ly8gbW92ZSBzZW5kSGFsZiBvZiB0aGUgIHkgb2Zmc2V0XG5cdFx0dGVtcERpc3QgPSBNYXRoLmZsb29yKHlBYnMgKiBzZWNvbmRIYWxmKTtcblx0XHRtb3Zlcy5wdXNoKFt5RGlyLCB0ZW1wRGlzdF0pO1xuXHR9IGVsc2Uge1xuXHRcdC8vICBtb3ZlIGZpcnN0SGFsZiBvZiB0aGUgeCBvZmZzZXRcblx0XHR0ZW1wRGlzdCA9IE1hdGguY2VpbCh4QWJzICogZmlyc3RIYWxmKTtcblx0XHRtb3Zlcy5wdXNoKFt4RGlyLCB0ZW1wRGlzdF0pO1xuXHRcdC8vIG1vdmUgYWxsIHRoZSB5IG9mZnNldFxuXHRcdG1vdmVzLnB1c2goW3lEaXIsIHlBYnNdKTtcblx0XHQvLyBtb3ZlIHNlY29uZEhhbGYgb2YgdGhlIHggb2Zmc2V0LlxuXHRcdHRlbXBEaXN0ID0gTWF0aC5mbG9vcih4QWJzICogc2Vjb25kSGFsZik7XG5cdFx0bW92ZXMucHVzaChbeERpciwgdGVtcERpc3RdKTsgIFxuXHR9XG5cdFxuXHR0aGlzLm1hcFt4cG9zXVt5cG9zXSA9IDA7XG5cdFxuXHR3aGlsZSAobW92ZXMubGVuZ3RoID4gMCkge1xuXHRcdG1vdmUgPSBtb3Zlcy5wb3AoKTtcblx0XHR3aGlsZSAobW92ZVsxXSA+IDApIHtcblx0XHRcdHhwb3MgKz0gUk9ULkRJUlNbOF1bbW92ZVswXV1bMF07XG5cdFx0XHR5cG9zICs9IFJPVC5ESVJTWzhdW21vdmVbMF1dWzFdO1xuXHRcdFx0dGhpcy5tYXBbeHBvc11beXBvc10gPSAwO1xuXHRcdFx0bW92ZVsxXSA9IG1vdmVbMV0gLSAxO1xuXHRcdH1cblx0fVxufVxuXG5ST1QuTWFwLlJvZ3VlLnByb3RvdHlwZS5fY3JlYXRlQ29ycmlkb3JzID0gZnVuY3Rpb24gKCkge1xuXHQvLyBEcmF3IENvcnJpZG9ycyBiZXR3ZWVuIGNvbm5lY3RlZCByb29tc1xuXHRcblx0dmFyIGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XG5cdHZhciBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcblx0dmFyIHJvb207XG5cdHZhciBjb25uZWN0aW9uO1xuXHR2YXIgb3RoZXJSb29tO1xuXHR2YXIgd2FsbDtcblx0dmFyIG90aGVyV2FsbDtcblx0XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgY3c7IGkrKykge1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2g7IGorKykge1xuXHRcdFx0cm9vbSA9IHRoaXMucm9vbXNbaV1bal07XG5cdFx0XHRcblx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgcm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdGNvbm5lY3Rpb24gPSByb29tW1wiY29ubmVjdGlvbnNcIl1ba107IFxuXHRcdFx0XHRcblx0XHRcdFx0b3RoZXJSb29tID0gdGhpcy5yb29tc1tjb25uZWN0aW9uWzBdXVtjb25uZWN0aW9uWzFdXTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIGZpZ3VyZSBvdXQgd2hhdCB3YWxsIG91ciBjb3JyaWRvciB3aWxsIHN0YXJ0IG9uZS5cblx0XHRcdFx0Ly8gZmlndXJlIG91dCB3aGF0IHdhbGwgb3VyIGNvcnJpZG9yIHdpbGwgZW5kIG9uLiBcblx0XHRcdFx0aWYgKG90aGVyUm9vbVtcImNlbGx4XCJdID4gcm9vbVtcImNlbGx4XCJdICkge1xuXHRcdFx0XHRcdHdhbGwgPSAyO1xuXHRcdFx0XHRcdG90aGVyV2FsbCA9IDQ7XG5cdFx0XHRcdH0gZWxzZSBpZiAob3RoZXJSb29tW1wiY2VsbHhcIl0gPCByb29tW1wiY2VsbHhcIl0gKSB7XG5cdFx0XHRcdFx0d2FsbCA9IDQ7XG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gMjtcblx0XHRcdFx0fSBlbHNlIGlmKG90aGVyUm9vbVtcImNlbGx5XCJdID4gcm9vbVtcImNlbGx5XCJdKSB7XG5cdFx0XHRcdFx0d2FsbCA9IDM7XG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gMTtcblx0XHRcdFx0fSBlbHNlIGlmKG90aGVyUm9vbVtcImNlbGx5XCJdIDwgcm9vbVtcImNlbGx5XCJdKSB7XG5cdFx0XHRcdFx0d2FsbCA9IDE7XG5cdFx0XHRcdFx0b3RoZXJXYWxsID0gMztcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0dGhpcy5fZHJhd0NvcnJpZG9yZSh0aGlzLl9nZXRXYWxsUG9zaXRpb24ocm9vbSwgd2FsbCksIHRoaXMuX2dldFdhbGxQb3NpdGlvbihvdGhlclJvb20sIG90aGVyV2FsbCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuLyoqXG4gKiBAY2xhc3MgRHVuZ2VvbiBmZWF0dXJlOyBoYXMgb3duIC5jcmVhdGUoKSBtZXRob2RcbiAqL1xuUk9ULk1hcC5GZWF0dXJlID0gZnVuY3Rpb24oKSB7fVxuUk9ULk1hcC5GZWF0dXJlLnByb3RvdHlwZS5pc1ZhbGlkID0gZnVuY3Rpb24oY2FuQmVEdWdDYWxsYmFjaykge31cblJPVC5NYXAuRmVhdHVyZS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHt9XG5ST1QuTWFwLkZlYXR1cmUucHJvdG90eXBlLmRlYnVnID0gZnVuY3Rpb24oKSB7fVxuUk9ULk1hcC5GZWF0dXJlLmNyZWF0ZVJhbmRvbUF0ID0gZnVuY3Rpb24oeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7fVxuXG4vKipcbiAqIEBjbGFzcyBSb29tXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5GZWF0dXJlXG4gKiBAcGFyYW0ge2ludH0geDFcbiAqIEBwYXJhbSB7aW50fSB5MVxuICogQHBhcmFtIHtpbnR9IHgyXG4gKiBAcGFyYW0ge2ludH0geTJcbiAqIEBwYXJhbSB7aW50fSBbZG9vclhdXG4gKiBAcGFyYW0ge2ludH0gW2Rvb3JZXVxuICovXG5ST1QuTWFwLkZlYXR1cmUuUm9vbSA9IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyLCBkb29yWCwgZG9vclkpIHtcblx0dGhpcy5feDEgPSB4MTtcblx0dGhpcy5feTEgPSB5MTtcblx0dGhpcy5feDIgPSB4Mjtcblx0dGhpcy5feTIgPSB5Mjtcblx0dGhpcy5fZG9vcnMgPSB7fTtcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiA0KSB7IHRoaXMuYWRkRG9vcihkb29yWCwgZG9vclkpOyB9XG59XG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5leHRlbmQoUk9ULk1hcC5GZWF0dXJlKTtcblxuLyoqXG4gKiBSb29tIG9mIHJhbmRvbSBzaXplLCB3aXRoIGEgZ2l2ZW4gZG9vcnMgYW5kIGRpcmVjdGlvblxuICovXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb21BdCA9IGZ1bmN0aW9uKHgsIHksIGR4LCBkeSwgb3B0aW9ucykge1xuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcblx0dmFyIHdpZHRoID0gbWluICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSoobWF4LW1pbisxKSk7XG5cdFxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xuXHR2YXIgaGVpZ2h0ID0gbWluICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSoobWF4LW1pbisxKSk7XG5cdFxuXHRpZiAoZHggPT0gMSkgeyAvKiB0byB0aGUgcmlnaHQgKi9cblx0XHR2YXIgeTIgPSB5IC0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIGhlaWdodCk7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgrMSwgeTIsIHgrd2lkdGgsIHkyK2hlaWdodC0xLCB4LCB5KTtcblx0fVxuXHRcblx0aWYgKGR4ID09IC0xKSB7IC8qIHRvIHRoZSBsZWZ0ICovXG5cdFx0dmFyIHkyID0geSAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiBoZWlnaHQpO1xuXHRcdHJldHVybiBuZXcgdGhpcyh4LXdpZHRoLCB5MiwgeC0xLCB5MitoZWlnaHQtMSwgeCwgeSk7XG5cdH1cblxuXHRpZiAoZHkgPT0gMSkgeyAvKiB0byB0aGUgYm90dG9tICovXG5cdFx0dmFyIHgyID0geCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgyLCB5KzEsIHgyK3dpZHRoLTEsIHkraGVpZ2h0LCB4LCB5KTtcblx0fVxuXG5cdGlmIChkeSA9PSAtMSkgeyAvKiB0byB0aGUgdG9wICovXG5cdFx0dmFyIHgyID0geCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XG5cdFx0cmV0dXJuIG5ldyB0aGlzKHgyLCB5LWhlaWdodCwgeDIrd2lkdGgtMSwgeS0xLCB4LCB5KTtcblx0fVxufVxuXG4vKipcbiAqIFJvb20gb2YgcmFuZG9tIHNpemUsIHBvc2l0aW9uZWQgYXJvdW5kIGNlbnRlciBjb29yZHNcbiAqL1xuUk9ULk1hcC5GZWF0dXJlLlJvb20uY3JlYXRlUmFuZG9tQ2VudGVyID0gZnVuY3Rpb24oY3gsIGN5LCBvcHRpb25zKSB7XG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21XaWR0aFswXTtcblx0dmFyIG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xuXHR2YXIgd2lkdGggPSBtaW4gKyBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKihtYXgtbWluKzEpKTtcblx0XG5cdHZhciBtaW4gPSBvcHRpb25zLnJvb21IZWlnaHRbMF07XG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21IZWlnaHRbMV07XG5cdHZhciBoZWlnaHQgPSBtaW4gKyBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKihtYXgtbWluKzEpKTtcblxuXHR2YXIgeDEgPSBjeCAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqd2lkdGgpO1xuXHR2YXIgeTEgPSBjeSAtIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqaGVpZ2h0KTtcblx0dmFyIHgyID0geDEgKyB3aWR0aCAtIDE7XG5cdHZhciB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcblxuXHRyZXR1cm4gbmV3IHRoaXMoeDEsIHkxLCB4MiwgeTIpO1xufVxuXG4vKipcbiAqIFJvb20gb2YgcmFuZG9tIHNpemUgd2l0aGluIGEgZ2l2ZW4gZGltZW5zaW9uc1xuICovXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5jcmVhdGVSYW5kb20gPSBmdW5jdGlvbihhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCwgb3B0aW9ucykge1xuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XG5cdHZhciBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcblx0dmFyIHdpZHRoID0gbWluICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSoobWF4LW1pbisxKSk7XG5cdFxuXHR2YXIgbWluID0gb3B0aW9ucy5yb29tSGVpZ2h0WzBdO1xuXHR2YXIgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xuXHR2YXIgaGVpZ2h0ID0gbWluICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSoobWF4LW1pbisxKSk7XG5cdFxuXHR2YXIgbGVmdCA9IGF2YWlsV2lkdGggLSB3aWR0aCAtIDE7XG5cdHZhciB0b3AgPSBhdmFpbEhlaWdodCAtIGhlaWdodCAtIDE7XG5cblx0dmFyIHgxID0gMSArIE1hdGguZmxvb3IoUk9ULlJORy5nZXRVbmlmb3JtKCkqbGVmdCk7XG5cdHZhciB5MSA9IDEgKyBNYXRoLmZsb29yKFJPVC5STkcuZ2V0VW5pZm9ybSgpKnRvcCk7XG5cdHZhciB4MiA9IHgxICsgd2lkdGggLSAxO1xuXHR2YXIgeTIgPSB5MSArIGhlaWdodCAtIDE7XG5cblx0cmV0dXJuIG5ldyB0aGlzKHgxLCB5MSwgeDIsIHkyKTtcbn1cblxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmFkZERvb3IgPSBmdW5jdGlvbih4LCB5KSB7XG5cdHRoaXMuX2Rvb3JzW3grXCIsXCIreV0gPSAxO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufVxuICovXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0RG9vcnMgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuXHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fZG9vcnMpIHtcblx0XHR2YXIgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xuXHRcdGNhbGxiYWNrKHBhcnNlSW50KHBhcnRzWzBdKSwgcGFyc2VJbnQocGFydHNbMV0pKTtcblx0fVxuXHRyZXR1cm4gdGhpcztcbn1cblxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmNsZWFyRG9vcnMgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5fZG9vcnMgPSB7fTtcblx0cmV0dXJuIHRoaXM7XG59XG5cblJPVC5NYXAuRmVhdHVyZS5Sb29tLnByb3RvdHlwZS5hZGREb29ycyA9IGZ1bmN0aW9uKGlzV2FsbENhbGxiYWNrKSB7XG5cdHZhciBsZWZ0ID0gdGhpcy5feDEtMTtcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcblx0dmFyIHRvcCA9IHRoaXMuX3kxLTE7XG5cdHZhciBib3R0b20gPSB0aGlzLl95MisxO1xuXG5cdGZvciAodmFyIHg9bGVmdDsgeDw9cmlnaHQ7IHgrKykge1xuXHRcdGZvciAodmFyIHk9dG9wOyB5PD1ib3R0b207IHkrKykge1xuXHRcdFx0aWYgKHggIT0gbGVmdCAmJiB4ICE9IHJpZ2h0ICYmIHkgIT0gdG9wICYmIHkgIT0gYm90dG9tKSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRpZiAoaXNXYWxsQ2FsbGJhY2soeCwgeSkpIHsgY29udGludWU7IH1cblxuXHRcdFx0dGhpcy5hZGREb29yKHgsIHkpO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0aGlzO1xufVxuXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCJyb29tXCIsIHRoaXMuX3gxLCB0aGlzLl95MSwgdGhpcy5feDIsIHRoaXMuX3kyKTtcbn1cblxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmlzVmFsaWQgPSBmdW5jdGlvbihpc1dhbGxDYWxsYmFjaywgY2FuQmVEdWdDYWxsYmFjaykgeyBcblx0dmFyIGxlZnQgPSB0aGlzLl94MS0xO1xuXHR2YXIgcmlnaHQgPSB0aGlzLl94MisxO1xuXHR2YXIgdG9wID0gdGhpcy5feTEtMTtcblx0dmFyIGJvdHRvbSA9IHRoaXMuX3kyKzE7XG5cdFxuXHRmb3IgKHZhciB4PWxlZnQ7IHg8PXJpZ2h0OyB4KyspIHtcblx0XHRmb3IgKHZhciB5PXRvcDsgeTw9Ym90dG9tOyB5KyspIHtcblx0XHRcdGlmICh4ID09IGxlZnQgfHwgeCA9PSByaWdodCB8fCB5ID09IHRvcCB8fCB5ID09IGJvdHRvbSkge1xuXHRcdFx0XHRpZiAoIWlzV2FsbENhbGxiYWNrKHgsIHkpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKCFjYW5CZUR1Z0NhbGxiYWNrKHgsIHkpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpZ0NhbGxiYWNrIERpZyBjYWxsYmFjayB3aXRoIGEgc2lnbmF0dXJlICh4LCB5LCB2YWx1ZSkuIFZhbHVlczogMCA9IGVtcHR5LCAxID0gd2FsbCwgMiA9IGRvb3IuIE11bHRpcGxlIGRvb3JzIGFyZSBhbGxvd2VkLlxuICovXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXG5cdHZhciBsZWZ0ID0gdGhpcy5feDEtMTtcblx0dmFyIHJpZ2h0ID0gdGhpcy5feDIrMTtcblx0dmFyIHRvcCA9IHRoaXMuX3kxLTE7XG5cdHZhciBib3R0b20gPSB0aGlzLl95MisxO1xuXHRcblx0dmFyIHZhbHVlID0gMDtcblx0Zm9yICh2YXIgeD1sZWZ0OyB4PD1yaWdodDsgeCsrKSB7XG5cdFx0Zm9yICh2YXIgeT10b3A7IHk8PWJvdHRvbTsgeSsrKSB7XG5cdFx0XHRpZiAoeCtcIixcIit5IGluIHRoaXMuX2Rvb3JzKSB7XG5cdFx0XHRcdHZhbHVlID0gMjtcblx0XHRcdH0gZWxzZSBpZiAoeCA9PSBsZWZ0IHx8IHggPT0gcmlnaHQgfHwgeSA9PSB0b3AgfHwgeSA9PSBib3R0b20pIHtcblx0XHRcdFx0dmFsdWUgPSAxO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFsdWUgPSAwO1xuXHRcdFx0fVxuXHRcdFx0ZGlnQ2FsbGJhY2soeCwgeSwgdmFsdWUpO1xuXHRcdH1cblx0fVxufVxuXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0Q2VudGVyID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBbTWF0aC5yb3VuZCgodGhpcy5feDEgKyB0aGlzLl94MikvMiksIE1hdGgucm91bmQoKHRoaXMuX3kxICsgdGhpcy5feTIpLzIpXTtcbn1cblxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldExlZnQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3gxO1xufVxuXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0UmlnaHQgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3gyO1xufVxuXG5ST1QuTWFwLkZlYXR1cmUuUm9vbS5wcm90b3R5cGUuZ2V0VG9wID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl95MTtcbn1cblxuUk9ULk1hcC5GZWF0dXJlLlJvb20ucHJvdG90eXBlLmdldEJvdHRvbSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5feTI7XG59XG5cbi8qKlxuICogQGNsYXNzIENvcnJpZG9yXG4gKiBAYXVnbWVudHMgUk9ULk1hcC5GZWF0dXJlXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRYXG4gKiBAcGFyYW0ge2ludH0gc3RhcnRZXG4gKiBAcGFyYW0ge2ludH0gZW5kWFxuICogQHBhcmFtIHtpbnR9IGVuZFlcbiAqL1xuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yID0gZnVuY3Rpb24oc3RhcnRYLCBzdGFydFksIGVuZFgsIGVuZFkpIHtcblx0dGhpcy5fc3RhcnRYID0gc3RhcnRYO1xuXHR0aGlzLl9zdGFydFkgPSBzdGFydFk7XG5cdHRoaXMuX2VuZFggPSBlbmRYOyBcblx0dGhpcy5fZW5kWSA9IGVuZFk7XG5cdHRoaXMuX2VuZHNXaXRoQVdhbGwgPSB0cnVlO1xufVxuUk9ULk1hcC5GZWF0dXJlLkNvcnJpZG9yLmV4dGVuZChST1QuTWFwLkZlYXR1cmUpO1xuXG5ST1QuTWFwLkZlYXR1cmUuQ29ycmlkb3IuY3JlYXRlUmFuZG9tQXQgPSBmdW5jdGlvbih4LCB5LCBkeCwgZHksIG9wdGlvbnMpIHtcblx0dmFyIG1pbiA9IG9wdGlvbnMuY29ycmlkb3JMZW5ndGhbMF07XG5cdHZhciBtYXggPSBvcHRpb25zLmNvcnJpZG9yTGVuZ3RoWzFdO1xuXHR2YXIgbGVuZ3RoID0gbWluICsgTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSoobWF4LW1pbisxKSk7XG5cdFxuXHRyZXR1cm4gbmV3IHRoaXMoeCwgeSwgeCArIGR4Kmxlbmd0aCwgeSArIGR5Kmxlbmd0aCk7XG59XG5cblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuZGVidWcgPSBmdW5jdGlvbigpIHtcblx0Y29uc29sZS5sb2coXCJjb3JyaWRvclwiLCB0aGlzLl9zdGFydFgsIHRoaXMuX3N0YXJ0WSwgdGhpcy5fZW5kWCwgdGhpcy5fZW5kWSk7XG59XG5cblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uKGlzV2FsbENhbGxiYWNrLCBjYW5CZUR1Z0NhbGxiYWNrKXsgXG5cdHZhciBzeCA9IHRoaXMuX3N0YXJ0WDtcblx0dmFyIHN5ID0gdGhpcy5fc3RhcnRZO1xuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xuXHR2YXIgbGVuZ3RoID0gMSArIE1hdGgubWF4KE1hdGguYWJzKGR4KSwgTWF0aC5hYnMoZHkpKTtcblx0XG5cdGlmIChkeCkgeyBkeCA9IGR4L01hdGguYWJzKGR4KTsgfVxuXHRpZiAoZHkpIHsgZHkgPSBkeS9NYXRoLmFicyhkeSk7IH1cblx0dmFyIG54ID0gZHk7XG5cdHZhciBueSA9IC1keDtcblx0XG5cdHZhciBvayA9IHRydWU7XG5cdGZvciAodmFyIGk9MDsgaTxsZW5ndGg7IGkrKykge1xuXHRcdHZhciB4ID0gc3ggKyBpKmR4O1xuXHRcdHZhciB5ID0gc3kgKyBpKmR5O1xuXG5cdFx0aWYgKCFjYW5CZUR1Z0NhbGxiYWNrKCAgICAgeCwgICAgICB5KSkgeyBvayA9IGZhbHNlOyB9XG5cdFx0aWYgKCFpc1dhbGxDYWxsYmFjayAgKHggKyBueCwgeSArIG55KSkgeyBvayA9IGZhbHNlOyB9XG5cdFx0aWYgKCFpc1dhbGxDYWxsYmFjayAgKHggLSBueCwgeSAtIG55KSkgeyBvayA9IGZhbHNlOyB9XG5cdFx0XG5cdFx0aWYgKCFvaykge1xuXHRcdFx0bGVuZ3RoID0gaTtcblx0XHRcdHRoaXMuX2VuZFggPSB4LWR4O1xuXHRcdFx0dGhpcy5fZW5kWSA9IHktZHk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0XG5cdC8qKlxuXHQgKiBJZiB0aGUgbGVuZ3RoIGRlZ2VuZXJhdGVkLCB0aGlzIGNvcnJpZG9yIG1pZ2h0IGJlIGludmFsaWRcblx0ICovXG5cdCBcblx0Lyogbm90IHN1cHBvcnRlZCAqL1xuXHRpZiAobGVuZ3RoID09IDApIHsgcmV0dXJuIGZhbHNlOyB9IFxuXHRcblx0IC8qIGxlbmd0aCAxIGFsbG93ZWQgb25seSBpZiB0aGUgbmV4dCBzcGFjZSBpcyBlbXB0eSAqL1xuXHRpZiAobGVuZ3RoID09IDEgJiYgaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpKSB7IHJldHVybiBmYWxzZTsgfVxuXHRcblx0LyoqXG5cdCAqIFdlIGRvIG5vdCB3YW50IHRoZSBjb3JyaWRvciB0byBjcmFzaCBpbnRvIGEgY29ybmVyIG9mIGEgcm9vbTtcblx0ICogaWYgYW55IG9mIHRoZSBlbmRpbmcgY29ybmVycyBpcyBlbXB0eSwgdGhlIE4rMXRoIGNlbGwgb2YgdGhpcyBjb3JyaWRvciBtdXN0IGJlIGVtcHR5IHRvby5cblx0ICogXG5cdCAqIFNpdHVhdGlvbjpcblx0ICogIyMjIyMjIzFcblx0ICogLi4uLi4uLj9cblx0ICogIyMjIyMjIzJcblx0ICogXG5cdCAqIFRoZSBjb3JyaWRvciB3YXMgZHVnIGZyb20gbGVmdCB0byByaWdodC5cblx0ICogMSwgMiAtIHByb2JsZW1hdGljIGNvcm5lcnMsID8gPSBOKzF0aCBjZWxsIChub3QgZHVnKVxuXHQgKi9cblx0dmFyIGZpcnN0Q29ybmVyQmFkID0gIWlzV2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCArIG54LCB0aGlzLl9lbmRZICsgZHkgKyBueSk7XG5cdHZhciBzZWNvbmRDb3JuZXJCYWQgPSAhaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4IC0gbngsIHRoaXMuX2VuZFkgKyBkeSAtIG55KTtcblx0dGhpcy5fZW5kc1dpdGhBV2FsbCA9IGlzV2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCwgdGhpcy5fZW5kWSArIGR5KTtcblx0aWYgKChmaXJzdENvcm5lckJhZCB8fCBzZWNvbmRDb3JuZXJCYWQpICYmIHRoaXMuX2VuZHNXaXRoQVdhbGwpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0cmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZGlnQ2FsbGJhY2sgRGlnIGNhbGxiYWNrIHdpdGggYSBzaWduYXR1cmUgKHgsIHksIHZhbHVlKS4gVmFsdWVzOiAwID0gZW1wdHkuXG4gKi9cblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24oZGlnQ2FsbGJhY2spIHsgXG5cdHZhciBzeCA9IHRoaXMuX3N0YXJ0WDtcblx0dmFyIHN5ID0gdGhpcy5fc3RhcnRZO1xuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xuXHR2YXIgbGVuZ3RoID0gMStNYXRoLm1heChNYXRoLmFicyhkeCksIE1hdGguYWJzKGR5KSk7XG5cdFxuXHRpZiAoZHgpIHsgZHggPSBkeC9NYXRoLmFicyhkeCk7IH1cblx0aWYgKGR5KSB7IGR5ID0gZHkvTWF0aC5hYnMoZHkpOyB9XG5cdHZhciBueCA9IGR5O1xuXHR2YXIgbnkgPSAtZHg7XG5cdFxuXHRmb3IgKHZhciBpPTA7IGk8bGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgeCA9IHN4ICsgaSpkeDtcblx0XHR2YXIgeSA9IHN5ICsgaSpkeTtcblx0XHRkaWdDYWxsYmFjayh4LCB5LCAwKTtcblx0fVxuXHRcblx0cmV0dXJuIHRydWU7XG59XG5cblJPVC5NYXAuRmVhdHVyZS5Db3JyaWRvci5wcm90b3R5cGUuY3JlYXRlUHJpb3JpdHlXYWxscyA9IGZ1bmN0aW9uKHByaW9yaXR5V2FsbENhbGxiYWNrKSB7XG5cdGlmICghdGhpcy5fZW5kc1dpdGhBV2FsbCkgeyByZXR1cm47IH1cblxuXHR2YXIgc3ggPSB0aGlzLl9zdGFydFg7XG5cdHZhciBzeSA9IHRoaXMuX3N0YXJ0WTtcblxuXHR2YXIgZHggPSB0aGlzLl9lbmRYLXN4O1xuXHR2YXIgZHkgPSB0aGlzLl9lbmRZLXN5O1xuXHRpZiAoZHgpIHsgZHggPSBkeC9NYXRoLmFicyhkeCk7IH1cblx0aWYgKGR5KSB7IGR5ID0gZHkvTWF0aC5hYnMoZHkpOyB9XG5cdHZhciBueCA9IGR5O1xuXHR2YXIgbnkgPSAtZHg7XG5cblx0cHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpO1xuXHRwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgbngsIHRoaXMuX2VuZFkgKyBueSk7XG5cdHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggLSBueCwgdGhpcy5fZW5kWSAtIG55KTtcbn0vKipcbiAqIEBjbGFzcyBCYXNlIG5vaXNlIGdlbmVyYXRvclxuICovXG5ST1QuTm9pc2UgPSBmdW5jdGlvbigpIHtcbn07XG5cblJPVC5Ob2lzZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oeCwgeSkge31cbi8qKlxuICogQSBzaW1wbGUgMmQgaW1wbGVtZW50YXRpb24gb2Ygc2ltcGxleCBub2lzZSBieSBPbmRyZWogWmFyYVxuICpcbiAqIEJhc2VkIG9uIGEgc3BlZWQtaW1wcm92ZWQgc2ltcGxleCBub2lzZSBhbGdvcml0aG0gZm9yIDJELCAzRCBhbmQgNEQgaW4gSmF2YS5cbiAqIFdoaWNoIGlzIGJhc2VkIG9uIGV4YW1wbGUgY29kZSBieSBTdGVmYW4gR3VzdGF2c29uIChzdGVndUBpdG4ubGl1LnNlKS5cbiAqIFdpdGggT3B0aW1pc2F0aW9ucyBieSBQZXRlciBFYXN0bWFuIChwZWFzdG1hbkBkcml6emxlLnN0YW5mb3JkLmVkdSkuXG4gKiBCZXR0ZXIgcmFuayBvcmRlcmluZyBtZXRob2QgYnkgU3RlZmFuIEd1c3RhdnNvbiBpbiAyMDEyLlxuICovXG5cbi8qKlxuICogQGNsYXNzIDJEIHNpbXBsZXggbm9pc2UgZ2VuZXJhdG9yXG4gKiBAcGFyYW0ge2ludH0gW2dyYWRpZW50cz0yNTZdIFJhbmRvbSBncmFkaWVudHNcbiAqL1xuUk9ULk5vaXNlLlNpbXBsZXggPSBmdW5jdGlvbihncmFkaWVudHMpIHtcblx0Uk9ULk5vaXNlLmNhbGwodGhpcyk7XG5cblx0dGhpcy5fRjIgPSAwLjUgKiAoTWF0aC5zcXJ0KDMpIC0gMSk7XG4gICAgdGhpcy5fRzIgPSAoMyAtIE1hdGguc3FydCgzKSkgLyA2O1xuXG5cdHRoaXMuX2dyYWRpZW50cyA9IFtcblx0XHRbIDAsIC0xXSxcblx0XHRbIDEsIC0xXSxcblx0XHRbIDEsICAwXSxcblx0XHRbIDEsICAxXSxcblx0XHRbIDAsICAxXSxcblx0XHRbLTEsICAxXSxcblx0XHRbLTEsICAwXSxcblx0XHRbLTEsIC0xXVxuXHRdO1xuXG5cdHZhciBwZXJtdXRhdGlvbnMgPSBbXTtcblx0dmFyIGNvdW50ID0gZ3JhZGllbnRzIHx8IDI1Njtcblx0Zm9yICh2YXIgaT0wO2k8Y291bnQ7aSsrKSB7IHBlcm11dGF0aW9ucy5wdXNoKGkpOyB9XG5cdHBlcm11dGF0aW9ucyA9IHBlcm11dGF0aW9ucy5yYW5kb21pemUoKTtcblxuXHR0aGlzLl9wZXJtcyA9IFtdO1xuXHR0aGlzLl9pbmRleGVzID0gW107XG5cblx0Zm9yICh2YXIgaT0wO2k8Mipjb3VudDtpKyspIHtcblx0XHR0aGlzLl9wZXJtcy5wdXNoKHBlcm11dGF0aW9uc1tpICUgY291bnRdKTtcblx0XHR0aGlzLl9pbmRleGVzLnB1c2godGhpcy5fcGVybXNbaV0gJSB0aGlzLl9ncmFkaWVudHMubGVuZ3RoKTtcblx0fVxuXG59O1xuUk9ULk5vaXNlLlNpbXBsZXguZXh0ZW5kKFJPVC5Ob2lzZSk7XG5cblJPVC5Ob2lzZS5TaW1wbGV4LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbih4aW4sIHlpbikge1xuXHR2YXIgcGVybXMgPSB0aGlzLl9wZXJtcztcblx0dmFyIGluZGV4ZXMgPSB0aGlzLl9pbmRleGVzO1xuXHR2YXIgY291bnQgPSBwZXJtcy5sZW5ndGgvMjtcblx0dmFyIEcyID0gdGhpcy5fRzI7XG5cblx0dmFyIG4wID0wLCBuMSA9IDAsIG4yID0gMCwgZ2k7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuXG5cdC8vIFNrZXcgdGhlIGlucHV0IHNwYWNlIHRvIGRldGVybWluZSB3aGljaCBzaW1wbGV4IGNlbGwgd2UncmUgaW5cblx0dmFyIHMgPSAoeGluICsgeWluKSAqIHRoaXMuX0YyOyAvLyBIYWlyeSBmYWN0b3IgZm9yIDJEXG5cdHZhciBpID0gTWF0aC5mbG9vcih4aW4gKyBzKTtcblx0dmFyIGogPSBNYXRoLmZsb29yKHlpbiArIHMpO1xuXHR2YXIgdCA9IChpICsgaikgKiBHMjtcblx0dmFyIFgwID0gaSAtIHQ7IC8vIFVuc2tldyB0aGUgY2VsbCBvcmlnaW4gYmFjayB0byAoeCx5KSBzcGFjZVxuXHR2YXIgWTAgPSBqIC0gdDtcblx0dmFyIHgwID0geGluIC0gWDA7IC8vIFRoZSB4LHkgZGlzdGFuY2VzIGZyb20gdGhlIGNlbGwgb3JpZ2luXG5cdHZhciB5MCA9IHlpbiAtIFkwO1xuXG5cdC8vIEZvciB0aGUgMkQgY2FzZSwgdGhlIHNpbXBsZXggc2hhcGUgaXMgYW4gZXF1aWxhdGVyYWwgdHJpYW5nbGUuXG5cdC8vIERldGVybWluZSB3aGljaCBzaW1wbGV4IHdlIGFyZSBpbi5cblx0dmFyIGkxLCBqMTsgLy8gT2Zmc2V0cyBmb3Igc2Vjb25kIChtaWRkbGUpIGNvcm5lciBvZiBzaW1wbGV4IGluIChpLGopIGNvb3Jkc1xuXHRpZiAoeDAgPiB5MCkge1xuXHRcdGkxID0gMTtcblx0XHRqMSA9IDA7XG5cdH0gZWxzZSB7IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxuXHRcdGkxID0gMDtcblx0XHRqMSA9IDE7XG5cdH0gLy8gdXBwZXIgdHJpYW5nbGUsIFlYIG9yZGVyOiAoMCwwKS0+KDAsMSktPigxLDEpXG5cblx0Ly8gQSBzdGVwIG9mICgxLDApIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoMS1jLC1jKSBpbiAoeCx5KSwgYW5kXG5cdC8vIGEgc3RlcCBvZiAoMCwxKSBpbiAoaSxqKSBtZWFucyBhIHN0ZXAgb2YgKC1jLDEtYykgaW4gKHgseSksIHdoZXJlXG5cdC8vIGMgPSAoMy1zcXJ0KDMpKS82XG5cdHZhciB4MSA9IHgwIC0gaTEgKyBHMjsgLy8gT2Zmc2V0cyBmb3IgbWlkZGxlIGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcblx0dmFyIHkxID0geTAgLSBqMSArIEcyO1xuXHR2YXIgeDIgPSB4MCAtIDEgKyAyKkcyOyAvLyBPZmZzZXRzIGZvciBsYXN0IGNvcm5lciBpbiAoeCx5KSB1bnNrZXdlZCBjb29yZHNcblx0dmFyIHkyID0geTAgLSAxICsgMipHMjtcblxuXHQvLyBXb3JrIG91dCB0aGUgaGFzaGVkIGdyYWRpZW50IGluZGljZXMgb2YgdGhlIHRocmVlIHNpbXBsZXggY29ybmVyc1xuXHR2YXIgaWkgPSBpLm1vZChjb3VudCk7XG5cdHZhciBqaiA9IGoubW9kKGNvdW50KTtcblxuXHQvLyBDYWxjdWxhdGUgdGhlIGNvbnRyaWJ1dGlvbiBmcm9tIHRoZSB0aHJlZSBjb3JuZXJzXG5cdHZhciB0MCA9IDAuNSAtIHgwKngwIC0geTAqeTA7XG5cdGlmICh0MCA+PSAwKSB7XG5cdFx0dDAgKj0gdDA7XG5cdFx0Z2kgPSBpbmRleGVzW2lpK3Blcm1zW2pqXV07XG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xuXHRcdG4wID0gdDAgKiB0MCAqIChncmFkWzBdICogeDAgKyBncmFkWzFdICogeTApO1xuXHR9XG5cdFxuXHR2YXIgdDEgPSAwLjUgLSB4MSp4MSAtIHkxKnkxO1xuXHRpZiAodDEgPj0gMCkge1xuXHRcdHQxICo9IHQxO1xuXHRcdGdpID0gaW5kZXhlc1tpaStpMStwZXJtc1tqaitqMV1dO1xuXHRcdHZhciBncmFkID0gdGhpcy5fZ3JhZGllbnRzW2dpXTtcblx0XHRuMSA9IHQxICogdDEgKiAoZ3JhZFswXSAqIHgxICsgZ3JhZFsxXSAqIHkxKTtcblx0fVxuXHRcblx0dmFyIHQyID0gMC41IC0geDIqeDIgLSB5Mip5Mjtcblx0aWYgKHQyID49IDApIHtcblx0XHR0MiAqPSB0Mjtcblx0XHRnaSA9IGluZGV4ZXNbaWkrMStwZXJtc1tqaisxXV07XG5cdFx0dmFyIGdyYWQgPSB0aGlzLl9ncmFkaWVudHNbZ2ldO1xuXHRcdG4yID0gdDIgKiB0MiAqIChncmFkWzBdICogeDIgKyBncmFkWzFdICogeTIpO1xuXHR9XG5cblx0Ly8gQWRkIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIGNvcm5lciB0byBnZXQgdGhlIGZpbmFsIG5vaXNlIHZhbHVlLlxuXHQvLyBUaGUgcmVzdWx0IGlzIHNjYWxlZCB0byByZXR1cm4gdmFsdWVzIGluIHRoZSBpbnRlcnZhbCBbLTEsMV0uXG5cdHJldHVybiA3MCAqIChuMCArIG4xICsgbjIpO1xufVxuLyoqXG4gKiBAY2xhc3MgQWJzdHJhY3QgRk9WIGFsZ29yaXRobVxuICogQHBhcmFtIHtmdW5jdGlvbn0gbGlnaHRQYXNzZXNDYWxsYmFjayBEb2VzIHRoZSBsaWdodCBwYXNzIHRocm91Z2ggeCx5P1xuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdIDQvNi84XG4gKi9cblJPVC5GT1YgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XG5cdHRoaXMuX2xpZ2h0UGFzc2VzID0gbGlnaHRQYXNzZXNDYWxsYmFjaztcblx0dGhpcy5fb3B0aW9ucyA9IHtcblx0XHR0b3BvbG9neTogOFxuXHR9XG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxufTtcblxuLyoqXG4gKiBDb21wdXRlIHZpc2liaWxpdHkgZm9yIGEgMzYwLWRlZ3JlZSBjaXJjbGVcbiAqIEBwYXJhbSB7aW50fSB4XG4gKiBAcGFyYW0ge2ludH0geVxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuUk9ULkZPVi5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKHgsIHksIFIsIGNhbGxiYWNrKSB7fVxuXG4vKipcbiAqIFJldHVybiBhbGwgbmVpZ2hib3JzIGluIGEgY29uY2VudHJpYyByaW5nXG4gKiBAcGFyYW0ge2ludH0gY3ggY2VudGVyLXhcbiAqIEBwYXJhbSB7aW50fSBjeSBjZW50ZXIteVxuICogQHBhcmFtIHtpbnR9IHIgcmFuZ2VcbiAqL1xuUk9ULkZPVi5wcm90b3R5cGUuX2dldENpcmNsZSA9IGZ1bmN0aW9uKGN4LCBjeSwgcikge1xuXHR2YXIgcmVzdWx0ID0gW107XG5cdHZhciBkaXJzLCBjb3VudEZhY3Rvciwgc3RhcnRPZmZzZXQ7XG5cblx0c3dpdGNoICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5KSB7XG5cdFx0Y2FzZSA0OlxuXHRcdFx0Y291bnRGYWN0b3IgPSAxO1xuXHRcdFx0c3RhcnRPZmZzZXQgPSBbMCwgMV07XG5cdFx0XHRkaXJzID0gW1xuXHRcdFx0XHRST1QuRElSU1s4XVs3XSxcblx0XHRcdFx0Uk9ULkRJUlNbOF1bMV0sXG5cdFx0XHRcdFJPVC5ESVJTWzhdWzNdLFxuXHRcdFx0XHRST1QuRElSU1s4XVs1XVxuXHRcdFx0XVxuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSA2OlxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzZdO1xuXHRcdFx0Y291bnRGYWN0b3IgPSAxO1xuXHRcdFx0c3RhcnRPZmZzZXQgPSBbLTEsIDFdO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSA4OlxuXHRcdFx0ZGlycyA9IFJPVC5ESVJTWzRdO1xuXHRcdFx0Y291bnRGYWN0b3IgPSAyO1xuXHRcdFx0c3RhcnRPZmZzZXQgPSBbLTEsIDFdO1xuXHRcdGJyZWFrO1xuXHR9XG5cblx0Lyogc3RhcnRpbmcgbmVpZ2hib3IgKi9cblx0dmFyIHggPSBjeCArIHN0YXJ0T2Zmc2V0WzBdKnI7XG5cdHZhciB5ID0gY3kgKyBzdGFydE9mZnNldFsxXSpyO1xuXG5cdC8qIGNpcmNsZSAqL1xuXHRmb3IgKHZhciBpPTA7aTxkaXJzLmxlbmd0aDtpKyspIHtcblx0XHRmb3IgKHZhciBqPTA7ajxyKmNvdW50RmFjdG9yO2orKykge1xuXHRcdFx0cmVzdWx0LnB1c2goW3gsIHldKTtcblx0XHRcdHggKz0gZGlyc1tpXVswXTtcblx0XHRcdHkgKz0gZGlyc1tpXVsxXTtcblxuXHRcdH1cblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIEBjbGFzcyBEaXNjcmV0ZSBzaGFkb3djYXN0aW5nIGFsZ29yaXRobS4gT2Jzb2xldGVkIGJ5IFByZWNpc2Ugc2hhZG93Y2FzdGluZy5cbiAqIEBhdWdtZW50cyBST1QuRk9WXG4gKi9cblJPVC5GT1YuRGlzY3JldGVTaGFkb3djYXN0aW5nID0gZnVuY3Rpb24obGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucykge1xuXHRST1QuRk9WLmNhbGwodGhpcywgbGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyk7XG59XG5ST1QuRk9WLkRpc2NyZXRlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XG5cbi8qKlxuICogQHNlZSBST1QuRk9WI2NvbXB1dGVcbiAqL1xuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge1xuXHR2YXIgY2VudGVyID0gdGhpcy5fY29vcmRzO1xuXHR2YXIgbWFwID0gdGhpcy5fbWFwO1xuXG5cdC8qIHRoaXMgcGxhY2UgaXMgYWx3YXlzIHZpc2libGUgKi9cblx0Y2FsbGJhY2soeCwgeSwgMCk7XG5cblx0Lyogc3RhbmRpbmcgaW4gYSBkYXJrIHBsYWNlLiBGSVhNRSBpcyB0aGlzIGEgZ29vZCBpZGVhPyAgKi9cblx0aWYgKCF0aGlzLl9saWdodFBhc3Nlcyh4LCB5KSkgeyByZXR1cm47IH1cblx0XG5cdC8qIHN0YXJ0IGFuZCBlbmQgYW5nbGVzICovXG5cdHZhciBEQVRBID0gW107XG5cdFxuXHR2YXIgQSwgQiwgY3gsIGN5LCBibG9ja3M7XG5cblx0LyogYW5hbHl6ZSBzdXJyb3VuZGluZyBjZWxscyBpbiBjb25jZW50cmljIHJpbmdzLCBzdGFydGluZyBmcm9tIHRoZSBjZW50ZXIgKi9cblx0Zm9yICh2YXIgcj0xOyByPD1SOyByKyspIHtcblx0XHR2YXIgbmVpZ2hib3JzID0gdGhpcy5fZ2V0Q2lyY2xlKHgsIHksIHIpO1xuXHRcdHZhciBhbmdsZSA9IDM2MCAvIG5laWdoYm9ycy5sZW5ndGg7XG5cblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvcnMubGVuZ3RoO2krKykge1xuXHRcdFx0Y3ggPSBuZWlnaGJvcnNbaV1bMF07XG5cdFx0XHRjeSA9IG5laWdoYm9yc1tpXVsxXTtcblx0XHRcdEEgPSBhbmdsZSAqIChpIC0gMC41KTtcblx0XHRcdEIgPSBBICsgYW5nbGU7XG5cdFx0XHRcblx0XHRcdGJsb2NrcyA9ICF0aGlzLl9saWdodFBhc3NlcyhjeCwgY3kpO1xuXHRcdFx0aWYgKHRoaXMuX3Zpc2libGVDb29yZHMoTWF0aC5mbG9vcihBKSwgTWF0aC5jZWlsKEIpLCBibG9ja3MsIERBVEEpKSB7IGNhbGxiYWNrKGN4LCBjeSwgciwgMSk7IH1cblx0XHRcdFxuXHRcdFx0aWYgKERBVEEubGVuZ3RoID09IDIgJiYgREFUQVswXSA9PSAwICYmIERBVEFbMV0gPT0gMzYwKSB7IHJldHVybjsgfSAvKiBjdXRvZmY/ICovXG5cblx0XHR9IC8qIGZvciBhbGwgY2VsbHMgaW4gdGhpcyByaW5nICovXG5cdH0gLyogZm9yIGFsbCByaW5ncyAqL1xufVxuXG4vKipcbiAqIEBwYXJhbSB7aW50fSBBIHN0YXJ0IGFuZ2xlXG4gKiBAcGFyYW0ge2ludH0gQiBlbmQgYW5nbGVcbiAqIEBwYXJhbSB7Ym9vbH0gYmxvY2tzIERvZXMgY3VycmVudCBjZWxsIGJsb2NrIHZpc2liaWxpdHk/XG4gKiBAcGFyYW0ge2ludFtdW119IERBVEEgc2hhZG93ZWQgYW5nbGUgcGFpcnNcbiAqL1xuUk9ULkZPVi5EaXNjcmV0ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLl92aXNpYmxlQ29vcmRzID0gZnVuY3Rpb24oQSwgQiwgYmxvY2tzLCBEQVRBKSB7XG5cdGlmIChBIDwgMCkgeyBcblx0XHR2YXIgdjEgPSBhcmd1bWVudHMuY2FsbGVlKDAsIEIsIGJsb2NrcywgREFUQSk7XG5cdFx0dmFyIHYyID0gYXJndW1lbnRzLmNhbGxlZSgzNjArQSwgMzYwLCBibG9ja3MsIERBVEEpO1xuXHRcdHJldHVybiB2MSB8fCB2Mjtcblx0fVxuXHRcblx0dmFyIGluZGV4ID0gMDtcblx0d2hpbGUgKGluZGV4IDwgREFUQS5sZW5ndGggJiYgREFUQVtpbmRleF0gPCBBKSB7IGluZGV4Kys7IH1cblx0XG5cdGlmIChpbmRleCA9PSBEQVRBLmxlbmd0aCkgeyAvKiBjb21wbGV0ZWx5IG5ldyBzaGFkb3cgKi9cblx0XHRpZiAoYmxvY2tzKSB7IERBVEEucHVzaChBLCBCKTsgfSBcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHRcblx0dmFyIGNvdW50ID0gMDtcblx0XG5cdGlmIChpbmRleCAlIDIpIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIGluIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2l0aGluIGl0cyBlbmRpbmcgYm91bmRhcnkgKi9cblx0XHR3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEIpIHtcblx0XHRcdGluZGV4Kys7XG5cdFx0XHRjb3VudCsrO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoY291bnQgPT0gMCkgeyByZXR1cm4gZmFsc2U7IH1cblx0XHRcblx0XHRpZiAoYmxvY2tzKSB7IFxuXHRcdFx0aWYgKGNvdW50ICUgMikge1xuXHRcdFx0XHREQVRBLnNwbGljZShpbmRleC1jb3VudCwgY291bnQsIEIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIHRydWU7XG5cblx0fSBlbHNlIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIG91dHNpZGUgYW4gZXhpc3Rpbmcgc2hhZG93LCBvciB3aXRoaW4gYSBzdGFydGluZyBib3VuZGFyeSAqL1xuXHRcdHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQikge1xuXHRcdFx0aW5kZXgrKztcblx0XHRcdGNvdW50Kys7XG5cdFx0fVxuXHRcdFxuXHRcdC8qIHZpc2libGUgd2hlbiBvdXRzaWRlIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2hlbiBvdmVybGFwcGluZyAqL1xuXHRcdGlmIChBID09IERBVEFbaW5kZXgtY291bnRdICYmIGNvdW50ID09IDEpIHsgcmV0dXJuIGZhbHNlOyB9XG5cdFx0XG5cdFx0aWYgKGJsb2NrcykgeyBcblx0XHRcdGlmIChjb3VudCAlIDIpIHtcblx0XHRcdFx0REFUQS5zcGxpY2UoaW5kZXgtY291bnQsIGNvdW50LCBBKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdERBVEEuc3BsaWNlKGluZGV4LWNvdW50LCBjb3VudCwgQSwgQik7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFx0XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cbn1cbi8qKlxuICogQGNsYXNzIFByZWNpc2Ugc2hhZG93Y2FzdGluZyBhbGdvcml0aG1cbiAqIEBhdWdtZW50cyBST1QuRk9WXG4gKi9cblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XG5cdFJPVC5GT1YuY2FsbCh0aGlzLCBsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKTtcbn1cblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcuZXh0ZW5kKFJPVC5GT1YpO1xuXG4vKipcbiAqIEBzZWUgUk9ULkZPViNjb21wdXRlXG4gKi9cblJPVC5GT1YuUHJlY2lzZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge1xuXHQvKiB0aGlzIHBsYWNlIGlzIGFsd2F5cyB2aXNpYmxlICovXG5cdGNhbGxiYWNrKHgsIHksIDAsIDEpO1xuXG5cdC8qIHN0YW5kaW5nIGluIGEgZGFyayBwbGFjZS4gRklYTUUgaXMgdGhpcyBhIGdvb2QgaWRlYT8gICovXG5cdGlmICghdGhpcy5fbGlnaHRQYXNzZXMoeCwgeSkpIHsgcmV0dXJuOyB9XG5cdFxuXHQvKiBsaXN0IG9mIGFsbCBzaGFkb3dzICovXG5cdHZhciBTSEFET1dTID0gW107XG5cdFxuXHR2YXIgY3gsIGN5LCBibG9ja3MsIEExLCBBMiwgdmlzaWJpbGl0eTtcblxuXHQvKiBhbmFseXplIHN1cnJvdW5kaW5nIGNlbGxzIGluIGNvbmNlbnRyaWMgcmluZ3MsIHN0YXJ0aW5nIGZyb20gdGhlIGNlbnRlciAqL1xuXHRmb3IgKHZhciByPTE7IHI8PVI7IHIrKykge1xuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXRDaXJjbGUoeCwgeSwgcik7XG5cdFx0dmFyIG5laWdoYm9yQ291bnQgPSBuZWlnaGJvcnMubGVuZ3RoO1xuXG5cdFx0Zm9yICh2YXIgaT0wO2k8bmVpZ2hib3JDb3VudDtpKyspIHtcblx0XHRcdGN4ID0gbmVpZ2hib3JzW2ldWzBdO1xuXHRcdFx0Y3kgPSBuZWlnaGJvcnNbaV1bMV07XG5cdFx0XHQvKiBzaGlmdCBoYWxmLWFuLWFuZ2xlIGJhY2t3YXJkcyB0byBtYWludGFpbiBjb25zaXN0ZW5jeSBvZiAwLXRoIGNlbGxzICovXG5cdFx0XHRBMSA9IFtpID8gMippLTEgOiAyKm5laWdoYm9yQ291bnQtMSwgMipuZWlnaGJvckNvdW50XTtcblx0XHRcdEEyID0gWzIqaSsxLCAyKm5laWdoYm9yQ291bnRdOyBcblx0XHRcdFxuXHRcdFx0YmxvY2tzID0gIXRoaXMuX2xpZ2h0UGFzc2VzKGN4LCBjeSk7XG5cdFx0XHR2aXNpYmlsaXR5ID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KEExLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcblx0XHRcdGlmICh2aXNpYmlsaXR5KSB7IGNhbGxiYWNrKGN4LCBjeSwgciwgdmlzaWJpbGl0eSk7IH1cblxuXHRcdFx0aWYgKFNIQURPV1MubGVuZ3RoID09IDIgJiYgU0hBRE9XU1swXVswXSA9PSAwICYmIFNIQURPV1NbMV1bMF0gPT0gU0hBRE9XU1sxXVsxXSkgeyByZXR1cm47IH0gLyogY3V0b2ZmPyAqL1xuXG5cdFx0fSAvKiBmb3IgYWxsIGNlbGxzIGluIHRoaXMgcmluZyAqL1xuXHR9IC8qIGZvciBhbGwgcmluZ3MgKi9cbn1cblxuLyoqXG4gKiBAcGFyYW0ge2ludFsyXX0gQTEgYXJjIHN0YXJ0XG4gKiBAcGFyYW0ge2ludFsyXX0gQTIgYXJjIGVuZFxuICogQHBhcmFtIHtib29sfSBibG9ja3MgRG9lcyBjdXJyZW50IGFyYyBibG9jayB2aXNpYmlsaXR5P1xuICogQHBhcmFtIHtpbnRbXVtdfSBTSEFET1dTIGxpc3Qgb2YgYWN0aXZlIHNoYWRvd3NcbiAqL1xuUk9ULkZPVi5QcmVjaXNlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuX2NoZWNrVmlzaWJpbGl0eSA9IGZ1bmN0aW9uKEExLCBBMiwgYmxvY2tzLCBTSEFET1dTKSB7XG5cdGlmIChBMVswXSA+IEEyWzBdKSB7IC8qIHNwbGl0IGludG8gdHdvIHN1Yi1hcmNzICovXG5cdFx0dmFyIHYxID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KEExLCBbQTFbMV0sIEExWzFdXSwgYmxvY2tzLCBTSEFET1dTKTtcblx0XHR2YXIgdjIgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoWzAsIDFdLCBBMiwgYmxvY2tzLCBTSEFET1dTKTtcblx0XHRyZXR1cm4gKHYxK3YyKS8yO1xuXHR9XG5cblx0LyogaW5kZXgxOiBmaXJzdCBzaGFkb3cgPj0gQTEgKi9cblx0dmFyIGluZGV4MSA9IDAsIGVkZ2UxID0gZmFsc2U7XG5cdHdoaWxlIChpbmRleDEgPCBTSEFET1dTLmxlbmd0aCkge1xuXHRcdHZhciBvbGQgPSBTSEFET1dTW2luZGV4MV07XG5cdFx0dmFyIGRpZmYgPSBvbGRbMF0qQTFbMV0gLSBBMVswXSpvbGRbMV07XG5cdFx0aWYgKGRpZmYgPj0gMCkgeyAvKiBvbGQgPj0gQTEgKi9cblx0XHRcdGlmIChkaWZmID09IDAgJiYgIShpbmRleDEgJSAyKSkgeyBlZGdlMSA9IHRydWU7IH1cblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHRpbmRleDErKztcblx0fVxuXG5cdC8qIGluZGV4MjogbGFzdCBzaGFkb3cgPD0gQTIgKi9cblx0dmFyIGluZGV4MiA9IFNIQURPV1MubGVuZ3RoLCBlZGdlMiA9IGZhbHNlO1xuXHR3aGlsZSAoaW5kZXgyLS0pIHtcblx0XHR2YXIgb2xkID0gU0hBRE9XU1tpbmRleDJdO1xuXHRcdHZhciBkaWZmID0gQTJbMF0qb2xkWzFdIC0gb2xkWzBdKkEyWzFdO1xuXHRcdGlmIChkaWZmID49IDApIHsgLyogb2xkIDw9IEEyICovXG5cdFx0XHRpZiAoZGlmZiA9PSAwICYmIChpbmRleDIgJSAyKSkgeyBlZGdlMiA9IHRydWU7IH1cblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdHZhciB2aXNpYmxlID0gdHJ1ZTtcblx0aWYgKGluZGV4MSA9PSBpbmRleDIgJiYgKGVkZ2UxIHx8IGVkZ2UyKSkgeyAgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgb25lIG9mIHRoZSBlZGdlcyBtYXRjaCAqL1xuXHRcdHZpc2libGUgPSBmYWxzZTsgXG5cdH0gZWxzZSBpZiAoZWRnZTEgJiYgZWRnZTIgJiYgaW5kZXgxKzE9PWluZGV4MiAmJiAoaW5kZXgyICUgMikpIHsgLyogY29tcGxldGVseSBlcXVpdmFsZW50IHdpdGggZXhpc3Rpbmcgc2hhZG93ICovXG5cdFx0dmlzaWJsZSA9IGZhbHNlO1xuXHR9IGVsc2UgaWYgKGluZGV4MSA+IGluZGV4MiAmJiAoaW5kZXgxICUgMikpIHsgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgbm90IHRvdWNoaW5nICovXG5cdFx0dmlzaWJsZSA9IGZhbHNlO1xuXHR9XG5cdFxuXHRpZiAoIXZpc2libGUpIHsgcmV0dXJuIDA7IH0gLyogZmFzdCBjYXNlOiBub3QgdmlzaWJsZSAqL1xuXHRcblx0dmFyIHZpc2libGVMZW5ndGgsIFA7XG5cblx0LyogY29tcHV0ZSB0aGUgbGVuZ3RoIG9mIHZpc2libGUgYXJjLCBhZGp1c3QgbGlzdCBvZiBzaGFkb3dzIChpZiBibG9ja2luZykgKi9cblx0dmFyIHJlbW92ZSA9IGluZGV4Mi1pbmRleDErMTtcblx0aWYgKHJlbW92ZSAlIDIpIHtcblx0XHRpZiAoaW5kZXgxICUgMikgeyAvKiBmaXJzdCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIHNlY29uZCBvdXRzaWRlICovXG5cdFx0XHR2YXIgUCA9IFNIQURPV1NbaW5kZXgxXTtcblx0XHRcdHZpc2libGVMZW5ndGggPSAoQTJbMF0qUFsxXSAtIFBbMF0qQTJbMV0pIC8gKFBbMV0gKiBBMlsxXSk7XG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMik7IH1cblx0XHR9IGVsc2UgeyAvKiBzZWNvbmQgZWRnZSB3aXRoaW4gZXhpc3Rpbmcgc2hhZG93LCBmaXJzdCBvdXRzaWRlICovXG5cdFx0XHR2YXIgUCA9IFNIQURPV1NbaW5kZXgyXTtcblx0XHRcdHZpc2libGVMZW5ndGggPSAoUFswXSpBMVsxXSAtIEExWzBdKlBbMV0pIC8gKEExWzFdICogUFsxXSk7XG5cdFx0XHRpZiAoYmxvY2tzKSB7IFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMSk7IH1cblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0aWYgKGluZGV4MSAlIDIpIHsgLyogYm90aCBlZGdlcyB3aXRoaW4gZXhpc3Rpbmcgc2hhZG93cyAqL1xuXHRcdFx0dmFyIFAxID0gU0hBRE9XU1tpbmRleDFdO1xuXHRcdFx0dmFyIFAyID0gU0hBRE9XU1tpbmRleDJdO1xuXHRcdFx0dmlzaWJsZUxlbmd0aCA9IChQMlswXSpQMVsxXSAtIFAxWzBdKlAyWzFdKSAvIChQMVsxXSAqIFAyWzFdKTtcblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUpOyB9XG5cdFx0fSBlbHNlIHsgLyogYm90aCBlZGdlcyBvdXRzaWRlIGV4aXN0aW5nIHNoYWRvd3MgKi9cblx0XHRcdGlmIChibG9ja3MpIHsgU0hBRE9XUy5zcGxpY2UoaW5kZXgxLCByZW1vdmUsIEExLCBBMik7IH1cblx0XHRcdHJldHVybiAxOyAvKiB3aG9sZSBhcmMgdmlzaWJsZSEgKi9cblx0XHR9XG5cdH1cblxuXHR2YXIgYXJjTGVuZ3RoID0gKEEyWzBdKkExWzFdIC0gQTFbMF0qQTJbMV0pIC8gKEExWzFdICogQTJbMV0pO1xuXG5cdHJldHVybiB2aXNpYmxlTGVuZ3RoL2FyY0xlbmd0aDtcbn1cbi8qKlxuICogQGNsYXNzIFJlY3Vyc2l2ZSBzaGFkb3djYXN0aW5nIGFsZ29yaXRobVxuICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgNC84IHRvcG9sb2dpZXMsIG5vdCBoZXhhZ29uYWwuXG4gKiBCYXNlZCBvbiBQZXRlciBIYXJraW5zJyBpbXBsZW1lbnRhdGlvbiBvZiBCasO2cm4gQmVyZ3N0csO2bSdzIGFsZ29yaXRobSBkZXNjcmliZWQgaGVyZTogaHR0cDovL3d3dy5yb2d1ZWJhc2luLmNvbS9pbmRleC5waHA/dGl0bGU9Rk9WX3VzaW5nX3JlY3Vyc2l2ZV9zaGFkb3djYXN0aW5nXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxuICovXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcgPSBmdW5jdGlvbihsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKSB7XG5cdFJPVC5GT1YuY2FsbCh0aGlzLCBsaWdodFBhc3Nlc0NhbGxiYWNrLCBvcHRpb25zKTtcbn1cblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5leHRlbmQoUk9ULkZPVik7XG5cbi8qKiBPY3RhbnRzIHVzZWQgZm9yIHRyYW5zbGF0aW5nIHJlY3Vyc2l2ZSBzaGFkb3djYXN0aW5nIG9mZnNldHMgKi9cblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTID0gW1xuXHRbLTEsICAwLCAgMCwgIDFdLFxuXHRbIDAsIC0xLCAgMSwgIDBdLFxuXHRbIDAsIC0xLCAtMSwgIDBdLFxuXHRbLTEsICAwLCAgMCwgLTFdLFxuXHRbIDEsICAwLCAgMCwgLTFdLFxuXHRbIDAsICAxLCAtMSwgIDBdLFxuXHRbIDAsICAxLCAgMSwgIDBdLFxuXHRbIDEsICAwLCAgMCwgIDFdXG5dO1xuXG4vKipcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAzNjAtZGVncmVlIGNpcmNsZVxuICogQHBhcmFtIHtpbnR9IHhcbiAqIEBwYXJhbSB7aW50fSB5XG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbih4LCB5LCBSLCBjYWxsYmFjaykge1xuXHQvL1lvdSBjYW4gYWx3YXlzIHNlZSB5b3VyIG93biB0aWxlXG5cdGNhbGxiYWNrKHgsIHksIDAsIHRydWUpO1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFMubGVuZ3RoOyBpKyspIHtcblx0XHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbaV0sIFIsIGNhbGxiYWNrKTtcblx0fVxufVxuXG4vKipcbiAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAxODAtZGVncmVlIGFyY1xuICogQHBhcmFtIHtpbnR9IHhcbiAqIEBwYXJhbSB7aW50fSB5XG4gKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXG4gKiBAcGFyYW0ge2ludH0gZGlyIERpcmVjdGlvbiB0byBsb29rIGluIChleHByZXNzZWQgaW4gYSBST1QuRElSIHZhbHVlKTtcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKi9cblJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5wcm90b3R5cGUuY29tcHV0ZTE4MCA9IGZ1bmN0aW9uKHgsIHksIFIsIGRpciwgY2FsbGJhY2spIHtcblx0Ly9Zb3UgY2FuIGFsd2F5cyBzZWUgeW91ciBvd24gdGlsZVxuXHRjYWxsYmFjayh4LCB5LCAwLCB0cnVlKTtcblx0dmFyIHByZXZpb3VzT2N0YW50ID0gKGRpciAtIDEgKyA4KSAlIDg7IC8vTmVlZCB0byByZXRyaWV2ZSB0aGUgcHJldmlvdXMgb2N0YW50IHRvIHJlbmRlciBhIGZ1bGwgMTgwIGRlZ3JlZXNcblx0dmFyIG5leHRQcmV2aW91c09jdGFudCA9IChkaXIgLSAyICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIHR3byBvY3RhbnRzIHRvIHJlbmRlciBhIGZ1bGwgMTgwIGRlZ3JlZXNcblx0dmFyIG5leHRPY3RhbnQgPSAoZGlyKyAxICsgOCkgJSA4OyAvL05lZWQgdG8gZ3JhYiB0byBuZXh0IG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1tuZXh0UHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XG5cdHRoaXMuX3JlbmRlck9jdGFudCh4LCB5LCBST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcuT0NUQU5UU1twcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW2Rpcl0sIFIsIGNhbGxiYWNrKTtcblx0dGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIFJPVC5GT1YuUmVjdXJzaXZlU2hhZG93Y2FzdGluZy5PQ1RBTlRTW25leHRPY3RhbnRdLCBSLCBjYWxsYmFjayk7XG59XG5cbi8qKlxuICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDkwLWRlZ3JlZSBhcmNcbiAqIEBwYXJhbSB7aW50fSB4XG4gKiBAcGFyYW0ge2ludH0geVxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xuICogQHBhcmFtIHtpbnR9IGRpciBEaXJlY3Rpb24gdG8gbG9vayBpbiAoZXhwcmVzc2VkIGluIGEgUk9ULkRJUiB2YWx1ZSk7XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICovXG5ST1QuRk9WLlJlY3Vyc2l2ZVNoYWRvd2Nhc3RpbmcucHJvdG90eXBlLmNvbXB1dGU5MCA9IGZ1bmN0aW9uKHgsIHksIFIsIGRpciwgY2FsbGJhY2spIHtcblx0Ly9Zb3UgY2FuIGFsd2F5cyBzZWUgeW91ciBvd24gdGlsZVxuXHRjYWxsYmFjayh4LCB5LCAwLCB0cnVlKTtcblx0dmFyIHByZXZpb3VzT2N0YW50ID0gKGRpciAtIDEgKyA4KSAlIDg7IC8vTmVlZCB0byByZXRyaWV2ZSB0aGUgcHJldmlvdXMgb2N0YW50IHRvIHJlbmRlciBhIGZ1bGwgOTAgZGVncmVlc1xuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbZGlyXSwgUiwgY2FsbGJhY2spO1xuXHR0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLk9DVEFOVFNbcHJldmlvdXNPY3RhbnRdLCBSLCBjYWxsYmFjayk7XG59XG5cbi8qKlxuICogUmVuZGVyIG9uZSBvY3RhbnQgKDQ1LWRlZ3JlZSBhcmMpIG9mIHRoZSB2aWV3c2hlZFxuICogQHBhcmFtIHtpbnR9IHhcbiAqIEBwYXJhbSB7aW50fSB5XG4gKiBAcGFyYW0ge2ludH0gb2N0YW50IE9jdGFudCB0byBiZSByZW5kZXJlZFxuICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqL1xuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5fcmVuZGVyT2N0YW50ID0gZnVuY3Rpb24oeCwgeSwgb2N0YW50LCBSLCBjYWxsYmFjaykge1xuXHQvL1JhZGl1cyBpbmNyZW1lbnRlZCBieSAxIHRvIHByb3ZpZGUgc2FtZSBjb3ZlcmFnZSBhcmVhIGFzIG90aGVyIHNoYWRvd2Nhc3RpbmcgcmFkaXVzZXNcblx0dGhpcy5fY2FzdFZpc2liaWxpdHkoeCwgeSwgMSwgMS4wLCAwLjAsIFIgKyAxLCBvY3RhbnRbMF0sIG9jdGFudFsxXSwgb2N0YW50WzJdLCBvY3RhbnRbM10sIGNhbGxiYWNrKTtcbn1cblxuLyoqXG4gKiBBY3R1YWxseSBjYWxjdWxhdGVzIHRoZSB2aXNpYmlsaXR5XG4gKiBAcGFyYW0ge2ludH0gc3RhcnRYIFRoZSBzdGFydGluZyBYIGNvb3JkaW5hdGVcbiAqIEBwYXJhbSB7aW50fSBzdGFydFkgVGhlIHN0YXJ0aW5nIFkgY29vcmRpbmF0ZVxuICogQHBhcmFtIHtpbnR9IHJvdyBUaGUgcm93IHRvIHJlbmRlclxuICogQHBhcmFtIHtmbG9hdH0gdmlzU2xvcGVTdGFydCBUaGUgc2xvcGUgdG8gc3RhcnQgYXRcbiAqIEBwYXJhbSB7ZmxvYXR9IHZpc1Nsb3BlRW5kIFRoZSBzbG9wZSB0byBlbmQgYXRcbiAqIEBwYXJhbSB7aW50fSByYWRpdXMgVGhlIHJhZGl1cyB0byByZWFjaCBvdXQgdG9cbiAqIEBwYXJhbSB7aW50fSB4eCBcbiAqIEBwYXJhbSB7aW50fSB4eSBcbiAqIEBwYXJhbSB7aW50fSB5eCBcbiAqIEBwYXJhbSB7aW50fSB5eSBcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byB1c2Ugd2hlbiB3ZSBoaXQgYSBibG9jayB0aGF0IGlzIHZpc2libGVcbiAqL1xuUk9ULkZPVi5SZWN1cnNpdmVTaGFkb3djYXN0aW5nLnByb3RvdHlwZS5fY2FzdFZpc2liaWxpdHkgPSBmdW5jdGlvbihzdGFydFgsIHN0YXJ0WSwgcm93LCB2aXNTbG9wZVN0YXJ0LCB2aXNTbG9wZUVuZCwgcmFkaXVzLCB4eCwgeHksIHl4LCB5eSwgY2FsbGJhY2spIHtcblx0aWYodmlzU2xvcGVTdGFydCA8IHZpc1Nsb3BlRW5kKSB7IHJldHVybjsgfVxuXHRmb3IodmFyIGkgPSByb3c7IGkgPD0gcmFkaXVzOyBpKyspIHtcblx0XHR2YXIgZHggPSAtaSAtIDE7XG5cdFx0dmFyIGR5ID0gLWk7XG5cdFx0dmFyIGJsb2NrZWQgPSBmYWxzZTtcblx0XHR2YXIgbmV3U3RhcnQgPSAwO1xuXG5cdFx0Ly8nUm93JyBjb3VsZCBiZSBjb2x1bW4sIG5hbWVzIGhlcmUgYXNzdW1lIG9jdGFudCAwIGFuZCB3b3VsZCBiZSBmbGlwcGVkIGZvciBoYWxmIHRoZSBvY3RhbnRzXG5cdFx0d2hpbGUoZHggPD0gMCkge1xuXHRcdFx0ZHggKz0gMTtcblxuXHRcdFx0Ly9UcmFuc2xhdGUgZnJvbSByZWxhdGl2ZSBjb29yZGluYXRlcyB0byBtYXAgY29vcmRpbmF0ZXNcblx0XHRcdHZhciBtYXBYID0gc3RhcnRYICsgZHggKiB4eCArIGR5ICogeHk7XG5cdFx0XHR2YXIgbWFwWSA9IHN0YXJ0WSArIGR4ICogeXggKyBkeSAqIHl5O1xuXG5cdFx0XHQvL1JhbmdlIG9mIHRoZSByb3dcblx0XHRcdHZhciBzbG9wZVN0YXJ0ID0gKGR4IC0gMC41KSAvIChkeSArIDAuNSk7XG5cdFx0XHR2YXIgc2xvcGVFbmQgPSAoZHggKyAwLjUpIC8gKGR5IC0gMC41KTtcblx0XHRcblx0XHRcdC8vSWdub3JlIGlmIG5vdCB5ZXQgYXQgbGVmdCBlZGdlIG9mIE9jdGFudFxuXHRcdFx0aWYoc2xvcGVFbmQgPiB2aXNTbG9wZVN0YXJ0KSB7IGNvbnRpbnVlOyB9XG5cdFx0XHRcblx0XHRcdC8vRG9uZSBpZiBwYXN0IHJpZ2h0IGVkZ2Vcblx0XHRcdGlmKHNsb3BlU3RhcnQgPCB2aXNTbG9wZUVuZCkgeyBicmVhazsgfVxuXHRcdFx0XHRcblx0XHRcdC8vSWYgaXQncyBpbiByYW5nZSwgaXQncyB2aXNpYmxlXG5cdFx0XHRpZigoZHggKiBkeCArIGR5ICogZHkpIDwgKHJhZGl1cyAqIHJhZGl1cykpIHtcblx0XHRcdFx0Y2FsbGJhY2sobWFwWCwgbWFwWSwgaSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFxuXHRcdFx0aWYoIWJsb2NrZWQpIHtcblx0XHRcdFx0Ly9JZiB0aWxlIGlzIGEgYmxvY2tpbmcgdGlsZSwgY2FzdCBhcm91bmQgaXRcblx0XHRcdFx0aWYoIXRoaXMuX2xpZ2h0UGFzc2VzKG1hcFgsIG1hcFkpICYmIGkgPCByYWRpdXMpIHtcblx0XHRcdFx0XHRibG9ja2VkID0gdHJ1ZTtcblx0XHRcdFx0XHR0aGlzLl9jYXN0VmlzaWJpbGl0eShzdGFydFgsIHN0YXJ0WSwgaSArIDEsIHZpc1Nsb3BlU3RhcnQsIHNsb3BlU3RhcnQsIHJhZGl1cywgeHgsIHh5LCB5eCwgeXksIGNhbGxiYWNrKTtcblx0XHRcdFx0XHRuZXdTdGFydCA9IHNsb3BlRW5kO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL0tlZXAgbmFycm93aW5nIGlmIHNjYW5uaW5nIGFjcm9zcyBhIGJsb2NrXG5cdFx0XHRcdGlmKCF0aGlzLl9saWdodFBhc3NlcyhtYXBYLCBtYXBZKSkge1xuXHRcdFx0XHRcdG5ld1N0YXJ0ID0gc2xvcGVFbmQ7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblx0XHRcdFxuXHRcdFx0XHQvL0Jsb2NrIGhhcyBlbmRlZFxuXHRcdFx0XHRibG9ja2VkID0gZmFsc2U7XG5cdFx0XHRcdHZpc1Nsb3BlU3RhcnQgPSBuZXdTdGFydDtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoYmxvY2tlZCkgeyBicmVhazsgfVxuXHR9XG59XG4vKipcbiAqIEBuYW1lc3BhY2UgQ29sb3Igb3BlcmF0aW9uc1xuICovXG5ST1QuQ29sb3IgPSB7XG5cdGZyb21TdHJpbmc6IGZ1bmN0aW9uKHN0cikge1xuXHRcdHZhciBjYWNoZWQsIHI7XG5cdFx0aWYgKHN0ciBpbiB0aGlzLl9jYWNoZSkge1xuXHRcdFx0Y2FjaGVkID0gdGhpcy5fY2FjaGVbc3RyXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHN0ci5jaGFyQXQoMCkgPT0gXCIjXCIpIHsgLyogaGV4IHJnYiAqL1xuXG5cdFx0XHRcdHZhciB2YWx1ZXMgPSBzdHIubWF0Y2goL1swLTlhLWZdL2dpKS5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4gcGFyc2VJbnQoeCwgMTYpOyB9KTtcblx0XHRcdFx0aWYgKHZhbHVlcy5sZW5ndGggPT0gMykge1xuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcy5tYXAoZnVuY3Rpb24oeCkgeyByZXR1cm4geCoxNzsgfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcblx0XHRcdFx0XHRcdHZhbHVlc1tpKzFdICs9IDE2KnZhbHVlc1tpXTtcblx0XHRcdFx0XHRcdHZhbHVlcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNhY2hlZCA9IHZhbHVlcztcblx0XHRcdFx0fVxuXG5cdFx0XHR9IGVsc2UgaWYgKHIgPSBzdHIubWF0Y2goL3JnYlxcKChbMC05LCBdKylcXCkvaSkpIHsgLyogZGVjaW1hbCByZ2IgKi9cblx0XHRcdFx0Y2FjaGVkID0gclsxXS5zcGxpdCgvXFxzKixcXHMqLykubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHBhcnNlSW50KHgpOyB9KTtcblx0XHRcdH0gZWxzZSB7IC8qIGh0bWwgbmFtZSAqL1xuXHRcdFx0XHRjYWNoZWQgPSBbMCwgMCwgMF07XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2NhY2hlW3N0cl0gPSBjYWNoZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNhY2hlZC5zbGljZSgpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBBZGQgdHdvIG9yIG1vcmUgY29sb3JzXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcblx0ICogQHJldHVybnMge251bWJlcltdfVxuXHQgKi9cblx0YWRkOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xuXHRcdHZhciByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xuXHRcdFx0Zm9yICh2YXIgaj0xO2o8YXJndW1lbnRzLmxlbmd0aDtqKyspIHtcblx0XHRcdFx0cmVzdWx0W2ldICs9IGFyZ3VtZW50c1tqXVtpXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fSxcblxuXHQvKipcblx0ICogQWRkIHR3byBvciBtb3JlIGNvbG9ycywgTU9ESUZJRVMgRklSU1QgQVJHVU1FTlRcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XG5cdCAqL1xuXHRhZGRfOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMikge1xuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XG5cdFx0XHRmb3IgKHZhciBqPTE7ajxhcmd1bWVudHMubGVuZ3RoO2orKykge1xuXHRcdFx0XHRjb2xvcjFbaV0gKz0gYXJndW1lbnRzW2pdW2ldO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gY29sb3IxO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBNdWx0aXBseSAobWl4KSB0d28gb3IgbW9yZSBjb2xvcnNcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XG5cdCAqL1xuXHRtdWx0aXBseTogZnVuY3Rpb24oY29sb3IxLCBjb2xvcjIpIHtcblx0XHR2YXIgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XG5cdFx0XHRcdHJlc3VsdFtpXSAqPSBhcmd1bWVudHNbal1baV0gLyAyNTU7XG5cdFx0XHR9XG5cdFx0XHRyZXN1bHRbaV0gPSBNYXRoLnJvdW5kKHJlc3VsdFtpXSk7XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0LyoqXG5cdCAqIE11bHRpcGx5IChtaXgpIHR3byBvciBtb3JlIGNvbG9ycywgTU9ESUZJRVMgRklSU1QgQVJHVU1FTlRcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IxXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XG5cdCAqL1xuXHRtdWx0aXBseV86IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyKSB7XG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcblx0XHRcdGZvciAodmFyIGo9MTtqPGFyZ3VtZW50cy5sZW5ndGg7aisrKSB7XG5cdFx0XHRcdGNvbG9yMVtpXSAqPSBhcmd1bWVudHNbal1baV0gLyAyNTU7XG5cdFx0XHR9XG5cdFx0XHRjb2xvcjFbaV0gPSBNYXRoLnJvdW5kKGNvbG9yMVtpXSk7XG5cdFx0fVxuXHRcdHJldHVybiBjb2xvcjE7XG5cdH0sXG5cblx0LyoqXG5cdCAqIEludGVycG9sYXRlIChibGVuZCkgdHdvIGNvbG9ycyB3aXRoIGEgZ2l2ZW4gZmFjdG9yXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGNvbG9yMVxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjJcblx0ICogQHBhcmFtIHtmbG9hdH0gW2ZhY3Rvcj0wLjVdIDAuLjFcblx0ICogQHJldHVybnMge251bWJlcltdfVxuXHQgKi9cblx0aW50ZXJwb2xhdGU6IGZ1bmN0aW9uKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IpIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHsgZmFjdG9yID0gMC41OyB9XG5cdFx0dmFyIHJlc3VsdCA9IGNvbG9yMS5zbGljZSgpO1xuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XG5cdFx0XHRyZXN1bHRbaV0gPSBNYXRoLnJvdW5kKHJlc3VsdFtpXSArIGZhY3RvciooY29sb3IyW2ldLWNvbG9yMVtpXSkpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBJbnRlcnBvbGF0ZSAoYmxlbmQpIHR3byBjb2xvcnMgd2l0aCBhIGdpdmVuIGZhY3RvciBpbiBIU0wgbW9kZVxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBjb2xvcjFcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3IyXG5cdCAqIEBwYXJhbSB7ZmxvYXR9IFtmYWN0b3I9MC41XSAwLi4xXG5cdCAqIEByZXR1cm5zIHtudW1iZXJbXX1cblx0ICovXG5cdGludGVycG9sYXRlSFNMOiBmdW5jdGlvbihjb2xvcjEsIGNvbG9yMiwgZmFjdG9yKSB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7IGZhY3RvciA9IDAuNTsgfVxuXHRcdHZhciBoc2wxID0gdGhpcy5yZ2IyaHNsKGNvbG9yMSk7XG5cdFx0dmFyIGhzbDIgPSB0aGlzLnJnYjJoc2woY29sb3IyKTtcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xuXHRcdFx0aHNsMVtpXSArPSBmYWN0b3IqKGhzbDJbaV0taHNsMVtpXSk7XG5cdFx0fVxuXHRcdHJldHVybiB0aGlzLmhzbDJyZ2IoaHNsMSk7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENyZWF0ZSBhIG5ldyByYW5kb20gY29sb3IgYmFzZWQgb24gdGhpcyBvbmVcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3Jcblx0ICogQHBhcmFtIHtudW1iZXJbXX0gZGlmZiBTZXQgb2Ygc3RhbmRhcmQgZGV2aWF0aW9uc1xuXHQgKiBAcmV0dXJucyB7bnVtYmVyW119XG5cdCAqL1xuXHRyYW5kb21pemU6IGZ1bmN0aW9uKGNvbG9yLCBkaWZmKSB7XG5cdFx0aWYgKCEoZGlmZiBpbnN0YW5jZW9mIEFycmF5KSkgeyBkaWZmID0gUk9ULlJORy5nZXROb3JtYWwoMCwgZGlmZik7IH1cblx0XHR2YXIgcmVzdWx0ID0gY29sb3Iuc2xpY2UoKTtcblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykge1xuXHRcdFx0cmVzdWx0W2ldICs9IChkaWZmIGluc3RhbmNlb2YgQXJyYXkgPyBNYXRoLnJvdW5kKFJPVC5STkcuZ2V0Tm9ybWFsKDAsIGRpZmZbaV0pKSA6IGRpZmYpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhbiBSR0IgY29sb3IgdmFsdWUgdG8gSFNMLiBFeHBlY3RzIDAuLjI1NSBpbnB1dHMsIHByb2R1Y2VzIDAuLjEgb3V0cHV0cy5cblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3Jcblx0ICogQHJldHVybnMge251bWJlcltdfVxuXHQgKi9cblx0cmdiMmhzbDogZnVuY3Rpb24oY29sb3IpIHtcblx0XHR2YXIgciA9IGNvbG9yWzBdLzI1NTtcblx0XHR2YXIgZyA9IGNvbG9yWzFdLzI1NTtcblx0XHR2YXIgYiA9IGNvbG9yWzJdLzI1NTtcblxuXHRcdHZhciBtYXggPSBNYXRoLm1heChyLCBnLCBiKSwgbWluID0gTWF0aC5taW4ociwgZywgYik7XG5cdFx0dmFyIGgsIHMsIGwgPSAobWF4ICsgbWluKSAvIDI7XG5cblx0XHRpZiAobWF4ID09IG1pbikge1xuXHRcdFx0aCA9IHMgPSAwOyAvLyBhY2hyb21hdGljXG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBkID0gbWF4IC0gbWluO1xuXHRcdFx0cyA9IChsID4gMC41ID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKSk7XG5cdFx0XHRzd2l0Y2gobWF4KSB7XG5cdFx0XHRcdGNhc2UgcjogaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApOyBicmVhaztcblx0XHRcdFx0Y2FzZSBnOiBoID0gKGIgLSByKSAvIGQgKyAyOyBicmVhaztcblx0XHRcdFx0Y2FzZSBiOiBoID0gKHIgLSBnKSAvIGQgKyA0OyBicmVhaztcblx0XHRcdH1cblx0XHRcdGggLz0gNjtcblx0XHR9XG5cblx0XHRyZXR1cm4gW2gsIHMsIGxdO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyBhbiBIU0wgY29sb3IgdmFsdWUgdG8gUkdCLiBFeHBlY3RzIDAuLjEgaW5wdXRzLCBwcm9kdWNlcyAwLi4yNTUgb3V0cHV0cy5cblx0ICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3Jcblx0ICogQHJldHVybnMge251bWJlcltdfVxuXHQgKi9cblx0aHNsMnJnYjogZnVuY3Rpb24oY29sb3IpIHtcblx0XHR2YXIgbCA9IGNvbG9yWzJdO1xuXG5cdFx0aWYgKGNvbG9yWzFdID09IDApIHtcblx0XHRcdGwgPSBNYXRoLnJvdW5kKGwqMjU1KTtcblx0XHRcdHJldHVybiBbbCwgbCwgbF07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZ1bmN0aW9uIGh1ZTJyZ2IocCwgcSwgdCkge1xuXHRcdFx0XHRpZiAodCA8IDApIHQgKz0gMTtcblx0XHRcdFx0aWYgKHQgPiAxKSB0IC09IDE7XG5cdFx0XHRcdGlmICh0IDwgMS82KSByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcblx0XHRcdFx0aWYgKHQgPCAxLzIpIHJldHVybiBxO1xuXHRcdFx0XHRpZiAodCA8IDIvMykgcmV0dXJuIHAgKyAocSAtIHApICogKDIvMyAtIHQpICogNjtcblx0XHRcdFx0cmV0dXJuIHA7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzID0gY29sb3JbMV07XG5cdFx0XHR2YXIgcSA9IChsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzKTtcblx0XHRcdHZhciBwID0gMiAqIGwgLSBxO1xuXHRcdFx0dmFyIHIgPSBodWUycmdiKHAsIHEsIGNvbG9yWzBdICsgMS8zKTtcblx0XHRcdHZhciBnID0gaHVlMnJnYihwLCBxLCBjb2xvclswXSk7XG5cdFx0XHR2YXIgYiA9IGh1ZTJyZ2IocCwgcSwgY29sb3JbMF0gLSAxLzMpO1xuXHRcdFx0cmV0dXJuIFtNYXRoLnJvdW5kKHIqMjU1KSwgTWF0aC5yb3VuZChnKjI1NSksIE1hdGgucm91bmQoYioyNTUpXTtcblx0XHR9XG5cdH0sXG5cblx0dG9SR0I6IGZ1bmN0aW9uKGNvbG9yKSB7XG5cdFx0cmV0dXJuIFwicmdiKFwiICsgdGhpcy5fY2xhbXAoY29sb3JbMF0pICsgXCIsXCIgKyB0aGlzLl9jbGFtcChjb2xvclsxXSkgKyBcIixcIiArIHRoaXMuX2NsYW1wKGNvbG9yWzJdKSArIFwiKVwiO1xuXHR9LFxuXG5cdHRvSGV4OiBmdW5jdGlvbihjb2xvcikge1xuXHRcdHZhciBwYXJ0cyA9IFtdO1xuXHRcdGZvciAodmFyIGk9MDtpPDM7aSsrKSB7XG5cdFx0XHRwYXJ0cy5wdXNoKHRoaXMuX2NsYW1wKGNvbG9yW2ldKS50b1N0cmluZygxNikubHBhZChcIjBcIiwgMikpO1xuXHRcdH1cblx0XHRyZXR1cm4gXCIjXCIgKyBwYXJ0cy5qb2luKFwiXCIpO1xuXHR9LFxuXG5cdF9jbGFtcDogZnVuY3Rpb24obnVtKSB7XG5cdFx0aWYgKG51bSA8IDApIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH0gZWxzZSBpZiAobnVtID4gMjU1KSB7XG5cdFx0XHRyZXR1cm4gMjU1O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gbnVtO1xuXHRcdH1cblx0fSxcblxuXHRfY2FjaGU6IHtcblx0XHRcImJsYWNrXCI6IFswLDAsMF0sXG5cdFx0XCJuYXZ5XCI6IFswLDAsMTI4XSxcblx0XHRcImRhcmtibHVlXCI6IFswLDAsMTM5XSxcblx0XHRcIm1lZGl1bWJsdWVcIjogWzAsMCwyMDVdLFxuXHRcdFwiYmx1ZVwiOiBbMCwwLDI1NV0sXG5cdFx0XCJkYXJrZ3JlZW5cIjogWzAsMTAwLDBdLFxuXHRcdFwiZ3JlZW5cIjogWzAsMTI4LDBdLFxuXHRcdFwidGVhbFwiOiBbMCwxMjgsMTI4XSxcblx0XHRcImRhcmtjeWFuXCI6IFswLDEzOSwxMzldLFxuXHRcdFwiZGVlcHNreWJsdWVcIjogWzAsMTkxLDI1NV0sXG5cdFx0XCJkYXJrdHVycXVvaXNlXCI6IFswLDIwNiwyMDldLFxuXHRcdFwibWVkaXVtc3ByaW5nZ3JlZW5cIjogWzAsMjUwLDE1NF0sXG5cdFx0XCJsaW1lXCI6IFswLDI1NSwwXSxcblx0XHRcInNwcmluZ2dyZWVuXCI6IFswLDI1NSwxMjddLFxuXHRcdFwiYXF1YVwiOiBbMCwyNTUsMjU1XSxcblx0XHRcImN5YW5cIjogWzAsMjU1LDI1NV0sXG5cdFx0XCJtaWRuaWdodGJsdWVcIjogWzI1LDI1LDExMl0sXG5cdFx0XCJkb2RnZXJibHVlXCI6IFszMCwxNDQsMjU1XSxcblx0XHRcImZvcmVzdGdyZWVuXCI6IFszNCwxMzksMzRdLFxuXHRcdFwic2VhZ3JlZW5cIjogWzQ2LDEzOSw4N10sXG5cdFx0XCJkYXJrc2xhdGVncmF5XCI6IFs0Nyw3OSw3OV0sXG5cdFx0XCJkYXJrc2xhdGVncmV5XCI6IFs0Nyw3OSw3OV0sXG5cdFx0XCJsaW1lZ3JlZW5cIjogWzUwLDIwNSw1MF0sXG5cdFx0XCJtZWRpdW1zZWFncmVlblwiOiBbNjAsMTc5LDExM10sXG5cdFx0XCJ0dXJxdW9pc2VcIjogWzY0LDIyNCwyMDhdLFxuXHRcdFwicm95YWxibHVlXCI6IFs2NSwxMDUsMjI1XSxcblx0XHRcInN0ZWVsYmx1ZVwiOiBbNzAsMTMwLDE4MF0sXG5cdFx0XCJkYXJrc2xhdGVibHVlXCI6IFs3Miw2MSwxMzldLFxuXHRcdFwibWVkaXVtdHVycXVvaXNlXCI6IFs3MiwyMDksMjA0XSxcblx0XHRcImluZGlnb1wiOiBbNzUsMCwxMzBdLFxuXHRcdFwiZGFya29saXZlZ3JlZW5cIjogWzg1LDEwNyw0N10sXG5cdFx0XCJjYWRldGJsdWVcIjogWzk1LDE1OCwxNjBdLFxuXHRcdFwiY29ybmZsb3dlcmJsdWVcIjogWzEwMCwxNDksMjM3XSxcblx0XHRcIm1lZGl1bWFxdWFtYXJpbmVcIjogWzEwMiwyMDUsMTcwXSxcblx0XHRcImRpbWdyYXlcIjogWzEwNSwxMDUsMTA1XSxcblx0XHRcImRpbWdyZXlcIjogWzEwNSwxMDUsMTA1XSxcblx0XHRcInNsYXRlYmx1ZVwiOiBbMTA2LDkwLDIwNV0sXG5cdFx0XCJvbGl2ZWRyYWJcIjogWzEwNywxNDIsMzVdLFxuXHRcdFwic2xhdGVncmF5XCI6IFsxMTIsMTI4LDE0NF0sXG5cdFx0XCJzbGF0ZWdyZXlcIjogWzExMiwxMjgsMTQ0XSxcblx0XHRcImxpZ2h0c2xhdGVncmF5XCI6IFsxMTksMTM2LDE1M10sXG5cdFx0XCJsaWdodHNsYXRlZ3JleVwiOiBbMTE5LDEzNiwxNTNdLFxuXHRcdFwibWVkaXVtc2xhdGVibHVlXCI6IFsxMjMsMTA0LDIzOF0sXG5cdFx0XCJsYXduZ3JlZW5cIjogWzEyNCwyNTIsMF0sXG5cdFx0XCJjaGFydHJldXNlXCI6IFsxMjcsMjU1LDBdLFxuXHRcdFwiYXF1YW1hcmluZVwiOiBbMTI3LDI1NSwyMTJdLFxuXHRcdFwibWFyb29uXCI6IFsxMjgsMCwwXSxcblx0XHRcInB1cnBsZVwiOiBbMTI4LDAsMTI4XSxcblx0XHRcIm9saXZlXCI6IFsxMjgsMTI4LDBdLFxuXHRcdFwiZ3JheVwiOiBbMTI4LDEyOCwxMjhdLFxuXHRcdFwiZ3JleVwiOiBbMTI4LDEyOCwxMjhdLFxuXHRcdFwic2t5Ymx1ZVwiOiBbMTM1LDIwNiwyMzVdLFxuXHRcdFwibGlnaHRza3libHVlXCI6IFsxMzUsMjA2LDI1MF0sXG5cdFx0XCJibHVldmlvbGV0XCI6IFsxMzgsNDMsMjI2XSxcblx0XHRcImRhcmtyZWRcIjogWzEzOSwwLDBdLFxuXHRcdFwiZGFya21hZ2VudGFcIjogWzEzOSwwLDEzOV0sXG5cdFx0XCJzYWRkbGVicm93blwiOiBbMTM5LDY5LDE5XSxcblx0XHRcImRhcmtzZWFncmVlblwiOiBbMTQzLDE4OCwxNDNdLFxuXHRcdFwibGlnaHRncmVlblwiOiBbMTQ0LDIzOCwxNDRdLFxuXHRcdFwibWVkaXVtcHVycGxlXCI6IFsxNDcsMTEyLDIxNl0sXG5cdFx0XCJkYXJrdmlvbGV0XCI6IFsxNDgsMCwyMTFdLFxuXHRcdFwicGFsZWdyZWVuXCI6IFsxNTIsMjUxLDE1Ml0sXG5cdFx0XCJkYXJrb3JjaGlkXCI6IFsxNTMsNTAsMjA0XSxcblx0XHRcInllbGxvd2dyZWVuXCI6IFsxNTQsMjA1LDUwXSxcblx0XHRcInNpZW5uYVwiOiBbMTYwLDgyLDQ1XSxcblx0XHRcImJyb3duXCI6IFsxNjUsNDIsNDJdLFxuXHRcdFwiZGFya2dyYXlcIjogWzE2OSwxNjksMTY5XSxcblx0XHRcImRhcmtncmV5XCI6IFsxNjksMTY5LDE2OV0sXG5cdFx0XCJsaWdodGJsdWVcIjogWzE3MywyMTYsMjMwXSxcblx0XHRcImdyZWVueWVsbG93XCI6IFsxNzMsMjU1LDQ3XSxcblx0XHRcInBhbGV0dXJxdW9pc2VcIjogWzE3NSwyMzgsMjM4XSxcblx0XHRcImxpZ2h0c3RlZWxibHVlXCI6IFsxNzYsMTk2LDIyMl0sXG5cdFx0XCJwb3dkZXJibHVlXCI6IFsxNzYsMjI0LDIzMF0sXG5cdFx0XCJmaXJlYnJpY2tcIjogWzE3OCwzNCwzNF0sXG5cdFx0XCJkYXJrZ29sZGVucm9kXCI6IFsxODQsMTM0LDExXSxcblx0XHRcIm1lZGl1bW9yY2hpZFwiOiBbMTg2LDg1LDIxMV0sXG5cdFx0XCJyb3N5YnJvd25cIjogWzE4OCwxNDMsMTQzXSxcblx0XHRcImRhcmtraGFraVwiOiBbMTg5LDE4MywxMDddLFxuXHRcdFwic2lsdmVyXCI6IFsxOTIsMTkyLDE5Ml0sXG5cdFx0XCJtZWRpdW12aW9sZXRyZWRcIjogWzE5OSwyMSwxMzNdLFxuXHRcdFwiaW5kaWFucmVkXCI6IFsyMDUsOTIsOTJdLFxuXHRcdFwicGVydVwiOiBbMjA1LDEzMyw2M10sXG5cdFx0XCJjaG9jb2xhdGVcIjogWzIxMCwxMDUsMzBdLFxuXHRcdFwidGFuXCI6IFsyMTAsMTgwLDE0MF0sXG5cdFx0XCJsaWdodGdyYXlcIjogWzIxMSwyMTEsMjExXSxcblx0XHRcImxpZ2h0Z3JleVwiOiBbMjExLDIxMSwyMTFdLFxuXHRcdFwicGFsZXZpb2xldHJlZFwiOiBbMjE2LDExMiwxNDddLFxuXHRcdFwidGhpc3RsZVwiOiBbMjE2LDE5MSwyMTZdLFxuXHRcdFwib3JjaGlkXCI6IFsyMTgsMTEyLDIxNF0sXG5cdFx0XCJnb2xkZW5yb2RcIjogWzIxOCwxNjUsMzJdLFxuXHRcdFwiY3JpbXNvblwiOiBbMjIwLDIwLDYwXSxcblx0XHRcImdhaW5zYm9yb1wiOiBbMjIwLDIyMCwyMjBdLFxuXHRcdFwicGx1bVwiOiBbMjIxLDE2MCwyMjFdLFxuXHRcdFwiYnVybHl3b29kXCI6IFsyMjIsMTg0LDEzNV0sXG5cdFx0XCJsaWdodGN5YW5cIjogWzIyNCwyNTUsMjU1XSxcblx0XHRcImxhdmVuZGVyXCI6IFsyMzAsMjMwLDI1MF0sXG5cdFx0XCJkYXJrc2FsbW9uXCI6IFsyMzMsMTUwLDEyMl0sXG5cdFx0XCJ2aW9sZXRcIjogWzIzOCwxMzAsMjM4XSxcblx0XHRcInBhbGVnb2xkZW5yb2RcIjogWzIzOCwyMzIsMTcwXSxcblx0XHRcImxpZ2h0Y29yYWxcIjogWzI0MCwxMjgsMTI4XSxcblx0XHRcImtoYWtpXCI6IFsyNDAsMjMwLDE0MF0sXG5cdFx0XCJhbGljZWJsdWVcIjogWzI0MCwyNDgsMjU1XSxcblx0XHRcImhvbmV5ZGV3XCI6IFsyNDAsMjU1LDI0MF0sXG5cdFx0XCJhenVyZVwiOiBbMjQwLDI1NSwyNTVdLFxuXHRcdFwic2FuZHlicm93blwiOiBbMjQ0LDE2NCw5Nl0sXG5cdFx0XCJ3aGVhdFwiOiBbMjQ1LDIyMiwxNzldLFxuXHRcdFwiYmVpZ2VcIjogWzI0NSwyNDUsMjIwXSxcblx0XHRcIndoaXRlc21va2VcIjogWzI0NSwyNDUsMjQ1XSxcblx0XHRcIm1pbnRjcmVhbVwiOiBbMjQ1LDI1NSwyNTBdLFxuXHRcdFwiZ2hvc3R3aGl0ZVwiOiBbMjQ4LDI0OCwyNTVdLFxuXHRcdFwic2FsbW9uXCI6IFsyNTAsMTI4LDExNF0sXG5cdFx0XCJhbnRpcXVld2hpdGVcIjogWzI1MCwyMzUsMjE1XSxcblx0XHRcImxpbmVuXCI6IFsyNTAsMjQwLDIzMF0sXG5cdFx0XCJsaWdodGdvbGRlbnJvZHllbGxvd1wiOiBbMjUwLDI1MCwyMTBdLFxuXHRcdFwib2xkbGFjZVwiOiBbMjUzLDI0NSwyMzBdLFxuXHRcdFwicmVkXCI6IFsyNTUsMCwwXSxcblx0XHRcImZ1Y2hzaWFcIjogWzI1NSwwLDI1NV0sXG5cdFx0XCJtYWdlbnRhXCI6IFsyNTUsMCwyNTVdLFxuXHRcdFwiZGVlcHBpbmtcIjogWzI1NSwyMCwxNDddLFxuXHRcdFwib3JhbmdlcmVkXCI6IFsyNTUsNjksMF0sXG5cdFx0XCJ0b21hdG9cIjogWzI1NSw5OSw3MV0sXG5cdFx0XCJob3RwaW5rXCI6IFsyNTUsMTA1LDE4MF0sXG5cdFx0XCJjb3JhbFwiOiBbMjU1LDEyNyw4MF0sXG5cdFx0XCJkYXJrb3JhbmdlXCI6IFsyNTUsMTQwLDBdLFxuXHRcdFwibGlnaHRzYWxtb25cIjogWzI1NSwxNjAsMTIyXSxcblx0XHRcIm9yYW5nZVwiOiBbMjU1LDE2NSwwXSxcblx0XHRcImxpZ2h0cGlua1wiOiBbMjU1LDE4MiwxOTNdLFxuXHRcdFwicGlua1wiOiBbMjU1LDE5MiwyMDNdLFxuXHRcdFwiZ29sZFwiOiBbMjU1LDIxNSwwXSxcblx0XHRcInBlYWNocHVmZlwiOiBbMjU1LDIxOCwxODVdLFxuXHRcdFwibmF2YWpvd2hpdGVcIjogWzI1NSwyMjIsMTczXSxcblx0XHRcIm1vY2Nhc2luXCI6IFsyNTUsMjI4LDE4MV0sXG5cdFx0XCJiaXNxdWVcIjogWzI1NSwyMjgsMTk2XSxcblx0XHRcIm1pc3R5cm9zZVwiOiBbMjU1LDIyOCwyMjVdLFxuXHRcdFwiYmxhbmNoZWRhbG1vbmRcIjogWzI1NSwyMzUsMjA1XSxcblx0XHRcInBhcGF5YXdoaXBcIjogWzI1NSwyMzksMjEzXSxcblx0XHRcImxhdmVuZGVyYmx1c2hcIjogWzI1NSwyNDAsMjQ1XSxcblx0XHRcInNlYXNoZWxsXCI6IFsyNTUsMjQ1LDIzOF0sXG5cdFx0XCJjb3Juc2lsa1wiOiBbMjU1LDI0OCwyMjBdLFxuXHRcdFwibGVtb25jaGlmZm9uXCI6IFsyNTUsMjUwLDIwNV0sXG5cdFx0XCJmbG9yYWx3aGl0ZVwiOiBbMjU1LDI1MCwyNDBdLFxuXHRcdFwic25vd1wiOiBbMjU1LDI1MCwyNTBdLFxuXHRcdFwieWVsbG93XCI6IFsyNTUsMjU1LDBdLFxuXHRcdFwibGlnaHR5ZWxsb3dcIjogWzI1NSwyNTUsMjI0XSxcblx0XHRcIml2b3J5XCI6IFsyNTUsMjU1LDI0MF0sXG5cdFx0XCJ3aGl0ZVwiOiBbMjU1LDI1NSwyNTVdXG5cdH1cbn1cbi8qKlxuICogQGNsYXNzIExpZ2h0aW5nIGNvbXB1dGF0aW9uLCBiYXNlZCBvbiBhIHRyYWRpdGlvbmFsIEZPViBmb3IgbXVsdGlwbGUgbGlnaHQgc291cmNlcyBhbmQgbXVsdGlwbGUgcGFzc2VzLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVmbGVjdGl2aXR5Q2FsbGJhY2sgQ2FsbGJhY2sgdG8gcmV0cmlldmUgY2VsbCByZWZsZWN0aXZpdHkgKDAuLjEpXG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMucGFzc2VzPTFdIE51bWJlciBvZiBwYXNzZXMuIDEgZXF1YWxzIHRvIHNpbXBsZSBGT1Ygb2YgYWxsIGxpZ2h0IHNvdXJjZXMsID4xIG1lYW5zIGEgKmhpZ2hseSBzaW1wbGlmaWVkKiByYWRpb3NpdHktbGlrZSBhbGdvcml0aG0uXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQ9MTAwXSBDZWxscyB3aXRoIGVtaXNzaXZpdHkgPiB0aHJlc2hvbGQgd2lsbCBiZSB0cmVhdGVkIGFzIGxpZ2h0IHNvdXJjZSBpbiB0aGUgbmV4dCBwYXNzLlxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnJhbmdlPTEwXSBNYXggbGlnaHQgcmFuZ2VcbiAqL1xuUk9ULkxpZ2h0aW5nID0gZnVuY3Rpb24ocmVmbGVjdGl2aXR5Q2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FsbGJhY2sgPSByZWZsZWN0aXZpdHlDYWxsYmFjaztcblx0dGhpcy5fb3B0aW9ucyA9IHtcblx0XHRwYXNzZXM6IDEsXG5cdFx0ZW1pc3Npb25UaHJlc2hvbGQ6IDEwMCxcblx0XHRyYW5nZTogMTBcblx0fTtcblx0dGhpcy5fZm92ID0gbnVsbDtcblxuXHR0aGlzLl9saWdodHMgPSB7fTtcblx0dGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUgPSB7fTtcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcblxuXHR0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG59XG5cbi8qKlxuICogQWRqdXN0IG9wdGlvbnMgYXQgcnVudGltZVxuICogQHNlZSBST1QuTGlnaHRpbmdcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9uc11cbiAqL1xuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucykge1xuXHRmb3IgKHZhciBwIGluIG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9uc1twXSA9IG9wdGlvbnNbcF07IH1cblx0aWYgKG9wdGlvbnMucmFuZ2UpIHsgdGhpcy5yZXNldCgpOyB9XG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFNldCB0aGUgdXNlZCBGaWVsZC1PZi1WaWV3IGFsZ29cbiAqIEBwYXJhbSB7Uk9ULkZPVn0gZm92XG4gKi9cblJPVC5MaWdodGluZy5wcm90b3R5cGUuc2V0Rk9WID0gZnVuY3Rpb24oZm92KSB7XG5cdHRoaXMuX2ZvdiA9IGZvdjtcblx0dGhpcy5fZm92Q2FjaGUgPSB7fTtcblx0cmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogU2V0IChvciByZW1vdmUpIGEgbGlnaHQgc291cmNlXG4gKiBAcGFyYW0ge2ludH0geFxuICogQHBhcmFtIHtpbnR9IHlcbiAqIEBwYXJhbSB7bnVsbCB8fCBzdHJpbmcgfHwgbnVtYmVyWzNdfSBjb2xvclxuICovXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLnNldExpZ2h0ID0gZnVuY3Rpb24oeCwgeSwgY29sb3IpIHtcblx0dmFyIGtleSA9IHgrXCIsXCIreTtcblxuXHRpZiAoY29sb3IpIHtcblx0XHR0aGlzLl9saWdodHNba2V5XSA9ICh0eXBlb2YoY29sb3IpID09IFwic3RyaW5nXCIgPyBST1QuQ29sb3IuZnJvbVN0cmluZyhjb2xvcikgOiBjb2xvcik7XG5cdH0gZWxzZSB7XG5cdFx0ZGVsZXRlIHRoaXMuX2xpZ2h0c1trZXldO1xuXHR9XG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIFJlc2V0IHRoZSBwcmUtY29tcHV0ZWQgdG9wb2xvZ3kgdmFsdWVzLiBDYWxsIHdoZW5ldmVyIHRoZSB1bmRlcmx5aW5nIG1hcCBjaGFuZ2VzIGl0cyBsaWdodC1wYXNzYWJpbGl0eS5cbiAqL1xuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZSA9IHt9O1xuXHR0aGlzLl9mb3ZDYWNoZSA9IHt9O1xuXG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENvbXB1dGUgdGhlIGxpZ2h0aW5nXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaWdodGluZ0NhbGxiYWNrIFdpbGwgYmUgY2FsbGVkIHdpdGggKHgsIHksIGNvbG9yKSBmb3IgZXZlcnkgbGl0IGNlbGxcbiAqL1xuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5jb21wdXRlID0gZnVuY3Rpb24obGlnaHRpbmdDYWxsYmFjaykge1xuXHR2YXIgZG9uZUNlbGxzID0ge307XG5cdHZhciBlbWl0dGluZ0NlbGxzID0ge307XG5cdHZhciBsaXRDZWxscyA9IHt9O1xuXG5cdGZvciAodmFyIGtleSBpbiB0aGlzLl9saWdodHMpIHsgLyogcHJlcGFyZSBlbWl0dGVycyBmb3IgZmlyc3QgcGFzcyAqL1xuXHRcdHZhciBsaWdodCA9IHRoaXMuX2xpZ2h0c1trZXldO1xuXHRcdGlmICghKGtleSBpbiBlbWl0dGluZ0NlbGxzKSkgeyBlbWl0dGluZ0NlbGxzW2tleV0gPSBbMCwgMCwgMF07IH1cblxuXHRcdFJPVC5Db2xvci5hZGRfKGVtaXR0aW5nQ2VsbHNba2V5XSwgbGlnaHQpO1xuXHR9XG5cblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fb3B0aW9ucy5wYXNzZXM7aSsrKSB7IC8qIG1haW4gbG9vcCAqL1xuXHRcdHRoaXMuX2VtaXRMaWdodChlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKTtcblx0XHRpZiAoaSsxID09IHRoaXMuX29wdGlvbnMucGFzc2VzKSB7IGNvbnRpbnVlOyB9IC8qIG5vdCBmb3IgdGhlIGxhc3QgcGFzcyAqL1xuXHRcdGVtaXR0aW5nQ2VsbHMgPSB0aGlzLl9jb21wdXRlRW1pdHRlcnMobGl0Q2VsbHMsIGRvbmVDZWxscyk7XG5cdH1cblxuXHRmb3IgKHZhciBsaXRLZXkgaW4gbGl0Q2VsbHMpIHsgLyogbGV0IHRoZSB1c2VyIGtub3cgd2hhdCBhbmQgaG93IGlzIGxpdCAqL1xuXHRcdHZhciBwYXJ0cyA9IGxpdEtleS5zcGxpdChcIixcIik7XG5cdFx0dmFyIHggPSBwYXJzZUludChwYXJ0c1swXSk7XG5cdFx0dmFyIHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XG5cdFx0bGlnaHRpbmdDYWxsYmFjayh4LCB5LCBsaXRDZWxsc1tsaXRLZXldKTtcblx0fVxuXG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENvbXB1dGUgb25lIGl0ZXJhdGlvbiBmcm9tIGFsbCBlbWl0dGluZyBjZWxsc1xuICogQHBhcmFtIHtvYmplY3R9IGVtaXR0aW5nQ2VsbHMgVGhlc2UgZW1pdCBsaWdodFxuICogQHBhcmFtIHtvYmplY3R9IGxpdENlbGxzIEFkZCBwcm9qZWN0ZWQgbGlnaHQgdG8gdGhlc2VcbiAqIEBwYXJhbSB7b2JqZWN0fSBkb25lQ2VsbHMgVGhlc2UgYWxyZWFkeSBlbWl0dGVkLCBmb3JiaWQgdGhlbSBmcm9tIGZ1cnRoZXIgY2FsY3VsYXRpb25zXG4gKi9cblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2VtaXRMaWdodCA9IGZ1bmN0aW9uKGVtaXR0aW5nQ2VsbHMsIGxpdENlbGxzLCBkb25lQ2VsbHMpIHtcblx0Zm9yICh2YXIga2V5IGluIGVtaXR0aW5nQ2VsbHMpIHtcblx0XHR2YXIgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xuXHRcdHZhciB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xuXHRcdHZhciB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xuXHRcdHRoaXMuX2VtaXRMaWdodEZyb21DZWxsKHgsIHksIGVtaXR0aW5nQ2VsbHNba2V5XSwgbGl0Q2VsbHMpO1xuXHRcdGRvbmVDZWxsc1trZXldID0gMTtcblx0fVxuXHRyZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBQcmVwYXJlIGEgbGlzdCBvZiBlbWl0dGVycyBmb3IgbmV4dCBwYXNzXG4gKiBAcGFyYW0ge29iamVjdH0gbGl0Q2VsbHNcbiAqIEBwYXJhbSB7b2JqZWN0fSBkb25lQ2VsbHNcbiAqIEByZXR1cm5zIHtvYmplY3R9XG4gKi9cblJPVC5MaWdodGluZy5wcm90b3R5cGUuX2NvbXB1dGVFbWl0dGVycyA9IGZ1bmN0aW9uKGxpdENlbGxzLCBkb25lQ2VsbHMpIHtcblx0dmFyIHJlc3VsdCA9IHt9O1xuXG5cdGZvciAodmFyIGtleSBpbiBsaXRDZWxscykge1xuXHRcdGlmIChrZXkgaW4gZG9uZUNlbGxzKSB7IGNvbnRpbnVlOyB9IC8qIGFscmVhZHkgZW1pdHRlZCAqL1xuXG5cdFx0dmFyIGNvbG9yID0gbGl0Q2VsbHNba2V5XTtcblxuXHRcdGlmIChrZXkgaW4gdGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUpIHtcblx0XHRcdHZhciByZWZsZWN0aXZpdHkgPSB0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZVtrZXldO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBrZXkuc3BsaXQoXCIsXCIpO1xuXHRcdFx0dmFyIHggPSBwYXJzZUludChwYXJ0c1swXSk7XG5cdFx0XHR2YXIgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcblx0XHRcdHZhciByZWZsZWN0aXZpdHkgPSB0aGlzLl9yZWZsZWN0aXZpdHlDYWxsYmFjayh4LCB5KTtcblx0XHRcdHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlW2tleV0gPSByZWZsZWN0aXZpdHk7XG5cdFx0fVxuXG5cdFx0aWYgKHJlZmxlY3Rpdml0eSA9PSAwKSB7IGNvbnRpbnVlOyB9IC8qIHdpbGwgbm90IHJlZmxlY3QgYXQgYWxsICovXG5cblx0XHQvKiBjb21wdXRlIGVtaXNzaW9uIGNvbG9yICovXG5cdFx0dmFyIGVtaXNzaW9uID0gW107XG5cdFx0dmFyIGludGVuc2l0eSA9IDA7XG5cdFx0Zm9yICh2YXIgaT0wO2k8MztpKyspIHtcblx0XHRcdHZhciBwYXJ0ID0gTWF0aC5yb3VuZChjb2xvcltpXSpyZWZsZWN0aXZpdHkpO1xuXHRcdFx0ZW1pc3Npb25baV0gPSBwYXJ0O1xuXHRcdFx0aW50ZW5zaXR5ICs9IHBhcnQ7XG5cdFx0fVxuXHRcdGlmIChpbnRlbnNpdHkgPiB0aGlzLl9vcHRpb25zLmVtaXNzaW9uVGhyZXNob2xkKSB7IHJlc3VsdFtrZXldID0gZW1pc3Npb247IH1cblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ29tcHV0ZSBvbmUgaXRlcmF0aW9uIGZyb20gb25lIGNlbGxcbiAqIEBwYXJhbSB7aW50fSB4XG4gKiBAcGFyYW0ge2ludH0geVxuICogQHBhcmFtIHtudW1iZXJbXX0gY29sb3JcbiAqIEBwYXJhbSB7b2JqZWN0fSBsaXRDZWxscyBDZWxsIGRhdGEgdG8gYnkgdXBkYXRlZFxuICovXG5ST1QuTGlnaHRpbmcucHJvdG90eXBlLl9lbWl0TGlnaHRGcm9tQ2VsbCA9IGZ1bmN0aW9uKHgsIHksIGNvbG9yLCBsaXRDZWxscykge1xuXHR2YXIga2V5ID0geCtcIixcIit5O1xuXHRpZiAoa2V5IGluIHRoaXMuX2ZvdkNhY2hlKSB7XG5cdFx0dmFyIGZvdiA9IHRoaXMuX2ZvdkNhY2hlW2tleV07XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGZvdiA9IHRoaXMuX3VwZGF0ZUZPVih4LCB5KTtcblx0fVxuXG5cdGZvciAodmFyIGZvdktleSBpbiBmb3YpIHtcblx0XHR2YXIgZm9ybUZhY3RvciA9IGZvdltmb3ZLZXldO1xuXG5cdFx0aWYgKGZvdktleSBpbiBsaXRDZWxscykgeyAvKiBhbHJlYWR5IGxpdCAqL1xuXHRcdFx0dmFyIHJlc3VsdCA9IGxpdENlbGxzW2ZvdktleV07XG5cdFx0fSBlbHNlIHsgLyogbmV3bHkgbGl0ICovXG5cdFx0XHR2YXIgcmVzdWx0ID0gWzAsIDAsIDBdO1xuXHRcdFx0bGl0Q2VsbHNbZm92S2V5XSA9IHJlc3VsdDtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpPTA7aTwzO2krKykgeyByZXN1bHRbaV0gKz0gTWF0aC5yb3VuZChjb2xvcltpXSpmb3JtRmFjdG9yKTsgfSAvKiBhZGQgbGlnaHQgY29sb3IgKi9cblx0fVxuXG5cdHJldHVybiB0aGlzO1xufVxuXG4vKipcbiAqIENvbXB1dGUgRk9WIChcImZvcm0gZmFjdG9yXCIpIGZvciBhIHBvdGVudGlhbCBsaWdodCBzb3VyY2UgYXQgW3gseV1cbiAqIEBwYXJhbSB7aW50fSB4XG4gKiBAcGFyYW0ge2ludH0geVxuICogQHJldHVybnMge29iamVjdH1cbiAqL1xuUk9ULkxpZ2h0aW5nLnByb3RvdHlwZS5fdXBkYXRlRk9WID0gZnVuY3Rpb24oeCwgeSkge1xuXHR2YXIga2V5MSA9IHgrXCIsXCIreTtcblx0dmFyIGNhY2hlID0ge307XG5cdHRoaXMuX2ZvdkNhY2hlW2tleTFdID0gY2FjaGU7XG5cdHZhciByYW5nZSA9IHRoaXMuX29wdGlvbnMucmFuZ2U7XG5cdHZhciBjYiA9IGZ1bmN0aW9uKHgsIHksIHIsIHZpcykge1xuXHRcdHZhciBrZXkyID0geCtcIixcIit5O1xuXHRcdHZhciBmb3JtRmFjdG9yID0gdmlzICogKDEtci9yYW5nZSk7XG5cdFx0aWYgKGZvcm1GYWN0b3IgPT0gMCkgeyByZXR1cm47IH1cblx0XHRjYWNoZVtrZXkyXSA9IGZvcm1GYWN0b3I7XG5cdH1cblx0dGhpcy5fZm92LmNvbXB1dGUoeCwgeSwgcmFuZ2UsIGNiLmJpbmQodGhpcykpO1xuXG5cdHJldHVybiBjYWNoZTtcbn1cbi8qKlxuICogQGNsYXNzIEFic3RyYWN0IHBhdGhmaW5kZXJcbiAqIEBwYXJhbSB7aW50fSB0b1ggVGFyZ2V0IFggY29vcmRcbiAqIEBwYXJhbSB7aW50fSB0b1kgVGFyZ2V0IFkgY29vcmRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHBhc3NhYmxlQ2FsbGJhY2sgQ2FsbGJhY2sgdG8gZGV0ZXJtaW5lIG1hcCBwYXNzYWJpbGl0eVxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdXG4gKi9cblJPVC5QYXRoID0gZnVuY3Rpb24odG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0dGhpcy5fdG9YID0gdG9YO1xuXHR0aGlzLl90b1kgPSB0b1k7XG5cdHRoaXMuX2Zyb21YID0gbnVsbDtcblx0dGhpcy5fZnJvbVkgPSBudWxsO1xuXHR0aGlzLl9wYXNzYWJsZUNhbGxiYWNrID0gcGFzc2FibGVDYWxsYmFjaztcblx0dGhpcy5fb3B0aW9ucyA9IHtcblx0XHR0b3BvbG9neTogOFxuXHR9XG5cdGZvciAodmFyIHAgaW4gb3B0aW9ucykgeyB0aGlzLl9vcHRpb25zW3BdID0gb3B0aW9uc1twXTsgfVxuXG5cdHRoaXMuX2RpcnMgPSBST1QuRElSU1t0aGlzLl9vcHRpb25zLnRvcG9sb2d5XTtcblx0aWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gOCkgeyAvKiByZW9yZGVyIGRpcnMgZm9yIG1vcmUgYWVzdGhldGljIHJlc3VsdCAodmVydGljYWwvaG9yaXpvbnRhbCBmaXJzdCkgKi9cblx0XHR0aGlzLl9kaXJzID0gW1xuXHRcdFx0dGhpcy5fZGlyc1swXSxcblx0XHRcdHRoaXMuX2RpcnNbMl0sXG5cdFx0XHR0aGlzLl9kaXJzWzRdLFxuXHRcdFx0dGhpcy5fZGlyc1s2XSxcblx0XHRcdHRoaXMuX2RpcnNbMV0sXG5cdFx0XHR0aGlzLl9kaXJzWzNdLFxuXHRcdFx0dGhpcy5fZGlyc1s1XSxcblx0XHRcdHRoaXMuX2RpcnNbN11cblx0XHRdXG5cdH1cbn1cblxuLyoqXG4gKiBDb21wdXRlIGEgcGF0aCBmcm9tIGEgZ2l2ZW4gcG9pbnRcbiAqIEBwYXJhbSB7aW50fSBmcm9tWFxuICogQHBhcmFtIHtpbnR9IGZyb21ZXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBXaWxsIGJlIGNhbGxlZCBmb3IgZXZlcnkgcGF0aCBpdGVtIHdpdGggYXJndW1lbnRzIFwieFwiIGFuZCBcInlcIlxuICovXG5ST1QuUGF0aC5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGZyb21YLCBmcm9tWSwgY2FsbGJhY2spIHtcbn1cblxuUk9ULlBhdGgucHJvdG90eXBlLl9nZXROZWlnaGJvcnMgPSBmdW5jdGlvbihjeCwgY3kpIHtcblx0dmFyIHJlc3VsdCA9IFtdO1xuXHRmb3IgKHZhciBpPTA7aTx0aGlzLl9kaXJzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgZGlyID0gdGhpcy5fZGlyc1tpXTtcblx0XHR2YXIgeCA9IGN4ICsgZGlyWzBdO1xuXHRcdHZhciB5ID0gY3kgKyBkaXJbMV07XG5cdFx0XG5cdFx0aWYgKCF0aGlzLl9wYXNzYWJsZUNhbGxiYWNrKHgsIHkpKSB7IGNvbnRpbnVlOyB9XG5cdFx0cmVzdWx0LnB1c2goW3gsIHldKTtcblx0fVxuXHRcblx0cmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxuICogQGNsYXNzIFNpbXBsaWZpZWQgRGlqa3N0cmEncyBhbGdvcml0aG06IGFsbCBlZGdlcyBoYXZlIGEgdmFsdWUgb2YgMVxuICogQGF1Z21lbnRzIFJPVC5QYXRoXG4gKiBAc2VlIFJPVC5QYXRoXG4gKi9cblJPVC5QYXRoLkRpamtzdHJhID0gZnVuY3Rpb24odG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0Uk9ULlBhdGguY2FsbCh0aGlzLCB0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucyk7XG5cblx0dGhpcy5fY29tcHV0ZWQgPSB7fTtcblx0dGhpcy5fdG9kbyA9IFtdO1xuXHR0aGlzLl9hZGQodG9YLCB0b1ksIG51bGwpO1xufVxuUk9ULlBhdGguRGlqa3N0cmEuZXh0ZW5kKFJPVC5QYXRoKTtcblxuLyoqXG4gKiBDb21wdXRlIGEgcGF0aCBmcm9tIGEgZ2l2ZW4gcG9pbnRcbiAqIEBzZWUgUk9ULlBhdGgjY29tcHV0ZVxuICovXG5ST1QuUGF0aC5EaWprc3RyYS5wcm90b3R5cGUuY29tcHV0ZSA9IGZ1bmN0aW9uKGZyb21YLCBmcm9tWSwgY2FsbGJhY2spIHtcblx0dmFyIGtleSA9IGZyb21YK1wiLFwiK2Zyb21ZO1xuXHRpZiAoIShrZXkgaW4gdGhpcy5fY29tcHV0ZWQpKSB7IHRoaXMuX2NvbXB1dGUoZnJvbVgsIGZyb21ZKTsgfVxuXHRpZiAoIShrZXkgaW4gdGhpcy5fY29tcHV0ZWQpKSB7IHJldHVybjsgfVxuXHRcblx0dmFyIGl0ZW0gPSB0aGlzLl9jb21wdXRlZFtrZXldO1xuXHR3aGlsZSAoaXRlbSkge1xuXHRcdGNhbGxiYWNrKGl0ZW0ueCwgaXRlbS55KTtcblx0XHRpdGVtID0gaXRlbS5wcmV2O1xuXHR9XG59XG5cbi8qKlxuICogQ29tcHV0ZSBhIG5vbi1jYWNoZWQgdmFsdWVcbiAqL1xuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLl9jb21wdXRlID0gZnVuY3Rpb24oZnJvbVgsIGZyb21ZKSB7XG5cdHdoaWxlICh0aGlzLl90b2RvLmxlbmd0aCkge1xuXHRcdHZhciBpdGVtID0gdGhpcy5fdG9kby5zaGlmdCgpO1xuXHRcdGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7IHJldHVybjsgfVxuXHRcdFxuXHRcdHZhciBuZWlnaGJvcnMgPSB0aGlzLl9nZXROZWlnaGJvcnMoaXRlbS54LCBpdGVtLnkpO1xuXHRcdFxuXHRcdGZvciAodmFyIGk9MDtpPG5laWdoYm9ycy5sZW5ndGg7aSsrKSB7XG5cdFx0XHR2YXIgbmVpZ2hib3IgPSBuZWlnaGJvcnNbaV07XG5cdFx0XHR2YXIgeCA9IG5laWdoYm9yWzBdO1xuXHRcdFx0dmFyIHkgPSBuZWlnaGJvclsxXTtcblx0XHRcdHZhciBpZCA9IHgrXCIsXCIreTtcblx0XHRcdGlmIChpZCBpbiB0aGlzLl9jb21wdXRlZCkgeyBjb250aW51ZTsgfSAvKiBhbHJlYWR5IGRvbmUgKi9cdFxuXHRcdFx0dGhpcy5fYWRkKHgsIHksIGl0ZW0pOyBcblx0XHR9XG5cdH1cbn1cblxuUk9ULlBhdGguRGlqa3N0cmEucHJvdG90eXBlLl9hZGQgPSBmdW5jdGlvbih4LCB5LCBwcmV2KSB7XG5cdHZhciBvYmogPSB7XG5cdFx0eDogeCxcblx0XHR5OiB5LFxuXHRcdHByZXY6IHByZXZcblx0fVxuXHR0aGlzLl9jb21wdXRlZFt4K1wiLFwiK3ldID0gb2JqO1xuXHR0aGlzLl90b2RvLnB1c2gob2JqKTtcbn1cbi8qKlxuICogQGNsYXNzIFNpbXBsaWZpZWQgQSogYWxnb3JpdGhtOiBhbGwgZWRnZXMgaGF2ZSBhIHZhbHVlIG9mIDFcbiAqIEBhdWdtZW50cyBST1QuUGF0aFxuICogQHNlZSBST1QuUGF0aFxuICovXG5ST1QuUGF0aC5BU3RhciA9IGZ1bmN0aW9uKHRvWCwgdG9ZLCBwYXNzYWJsZUNhbGxiYWNrLCBvcHRpb25zKSB7XG5cdFJPVC5QYXRoLmNhbGwodGhpcywgdG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMpO1xuXG5cdHRoaXMuX3RvZG8gPSBbXTtcblx0dGhpcy5fZG9uZSA9IHt9O1xuXHR0aGlzLl9mcm9tWCA9IG51bGw7XG5cdHRoaXMuX2Zyb21ZID0gbnVsbDtcbn1cblJPVC5QYXRoLkFTdGFyLmV4dGVuZChST1QuUGF0aCk7XG5cbi8qKlxuICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XG4gKiBAc2VlIFJPVC5QYXRoI2NvbXB1dGVcbiAqL1xuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLmNvbXB1dGUgPSBmdW5jdGlvbihmcm9tWCwgZnJvbVksIGNhbGxiYWNrKSB7XG5cdHRoaXMuX3RvZG8gPSBbXTtcblx0dGhpcy5fZG9uZSA9IHt9O1xuXHR0aGlzLl9mcm9tWCA9IGZyb21YO1xuXHR0aGlzLl9mcm9tWSA9IGZyb21ZO1xuXHR0aGlzLl9hZGQodGhpcy5fdG9YLCB0aGlzLl90b1ksIG51bGwpO1xuXG5cdHdoaWxlICh0aGlzLl90b2RvLmxlbmd0aCkge1xuXHRcdHZhciBpdGVtID0gdGhpcy5fdG9kby5zaGlmdCgpO1xuXHRcdGlmIChpdGVtLnggPT0gZnJvbVggJiYgaXRlbS55ID09IGZyb21ZKSB7IGJyZWFrOyB9XG5cdFx0dmFyIG5laWdoYm9ycyA9IHRoaXMuX2dldE5laWdoYm9ycyhpdGVtLngsIGl0ZW0ueSk7XG5cblx0XHRmb3IgKHZhciBpPTA7aTxuZWlnaGJvcnMubGVuZ3RoO2krKykge1xuXHRcdFx0dmFyIG5laWdoYm9yID0gbmVpZ2hib3JzW2ldO1xuXHRcdFx0dmFyIHggPSBuZWlnaGJvclswXTtcblx0XHRcdHZhciB5ID0gbmVpZ2hib3JbMV07XG5cdFx0XHR2YXIgaWQgPSB4K1wiLFwiK3k7XG5cdFx0XHRpZiAoaWQgaW4gdGhpcy5fZG9uZSkgeyBjb250aW51ZTsgfVxuXHRcdFx0dGhpcy5fYWRkKHgsIHksIGl0ZW0pOyBcblx0XHR9XG5cdH1cblx0XG5cdHZhciBpdGVtID0gdGhpcy5fZG9uZVtmcm9tWCtcIixcIitmcm9tWV07XG5cdGlmICghaXRlbSkgeyByZXR1cm47IH1cblx0XG5cdHdoaWxlIChpdGVtKSB7XG5cdFx0Y2FsbGJhY2soaXRlbS54LCBpdGVtLnkpO1xuXHRcdGl0ZW0gPSBpdGVtLnByZXY7XG5cdH1cbn1cblxuUk9ULlBhdGguQVN0YXIucHJvdG90eXBlLl9hZGQgPSBmdW5jdGlvbih4LCB5LCBwcmV2KSB7XG5cdHZhciBvYmogPSB7XG5cdFx0eDogeCxcblx0XHR5OiB5LFxuXHRcdHByZXY6IHByZXYsXG5cdFx0ZzogKHByZXYgPyBwcmV2LmcrMSA6IDApLFxuXHRcdGg6IHRoaXMuX2Rpc3RhbmNlKHgsIHkpXG5cdH1cblx0dGhpcy5fZG9uZVt4K1wiLFwiK3ldID0gb2JqO1xuXHRcblx0LyogaW5zZXJ0IGludG8gcHJpb3JpdHkgcXVldWUgKi9cblx0XG5cdHZhciBmID0gb2JqLmcgKyBvYmouaDtcblx0Zm9yICh2YXIgaT0wO2k8dGhpcy5fdG9kby5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSB0aGlzLl90b2RvW2ldO1xuXHRcdGlmIChmIDwgaXRlbS5nICsgaXRlbS5oKSB7XG5cdFx0XHR0aGlzLl90b2RvLnNwbGljZShpLCAwLCBvYmopO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0fVxuXHRcblx0dGhpcy5fdG9kby5wdXNoKG9iaik7XG59XG5cblJPVC5QYXRoLkFTdGFyLnByb3RvdHlwZS5fZGlzdGFuY2UgPSBmdW5jdGlvbih4LCB5KSB7XG5cdHN3aXRjaCAodGhpcy5fb3B0aW9ucy50b3BvbG9neSkge1xuXHRcdGNhc2UgNDpcblx0XHRcdHJldHVybiAoTWF0aC5hYnMoeC10aGlzLl9mcm9tWCkgKyBNYXRoLmFicyh5LXRoaXMuX2Zyb21ZKSk7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIDY6XG5cdFx0XHR2YXIgZHggPSBNYXRoLmFicyh4IC0gdGhpcy5fZnJvbVgpO1xuXHRcdFx0dmFyIGR5ID0gTWF0aC5hYnMoeSAtIHRoaXMuX2Zyb21ZKTtcblx0XHRcdHJldHVybiBkeSArIE1hdGgubWF4KDAsIChkeC1keSkvMik7XG5cdFx0YnJlYWs7XG5cblx0XHRjYXNlIDg6IFxuXHRcdFx0cmV0dXJuIE1hdGgubWF4KE1hdGguYWJzKHgtdGhpcy5fZnJvbVgpLCBNYXRoLmFicyh5LXRoaXMuX2Zyb21ZKSk7XG5cdFx0YnJlYWs7XG5cdH1cbn1cbi8qKlxuICogQG5hbWVzcGFjZSBFeHBvcnQgdG8gTm9kZS5qcyBtb2R1bGVcbiAqL1xuZXhwb3J0cy5ST1QgPSBST1Q7XG4iXX0=
