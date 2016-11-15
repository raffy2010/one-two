/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _index = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var CountdownBase = function (_Component) {
	  _inherits(CountdownBase, _Component);

	  function CountdownBase() {
	    _classCallCheck(this, CountdownBase);

	    return _possibleConstructorReturn(this, (CountdownBase.__proto__ || Object.getPrototypeOf(CountdownBase)).apply(this, arguments));
	  }

	  _createClass(CountdownBase, [{
	    key: 'getProps',
	    value: function getProps() {
	      return {
	        total: 0,
	        doneFn: null
	      };
	    }
	  }, {
	    key: 'getData',
	    value: function getData() {
	      return {
	        lastTime: null,
	        timer: null
	      };
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      var _this2 = this;

	      this.data.lastTime = Date.now();

	      this.data.timer = setInterval(function () {
	        if (_this2.props.total <= 0) {
	          _this2.stop();

	          return;
	        }

	        _this2.updateTime();
	        _this2.renderTime();
	      }, 10);
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      clearInterval(this.data.timer);
	      this.data.timer = null;
	    }
	  }, {
	    key: 'updateTime',
	    value: function updateTime() {
	      var lastTime = this.data.lastTime,
	          now = Date.now();

	      this.props.total -= now - lastTime;

	      this.data.lastTime = now;

	      if (this.props.total < 100) {
	        this.props.total = 0;
	      }
	    }
	  }, {
	    key: 'renderTime',
	    value: function renderTime() {
	      var ret = this.calcTime(this.props.total);

	      this.updateDay(ret.day);
	      this.updateHour(ret.hour);
	      this.updateMinute(ret.minute);
	      this.updateSecond(ret.second);
	      this.updateMillisecond(ret.millisecond);
	    }
	  }, {
	    key: 'calcTime',
	    value: function calcTime(time) {
	      var day = void 0,
	          hour = void 0,
	          minute = void 0,
	          second = void 0,
	          millisecond = void 0;

	      day = Math.floor(time / (1000 * 3600 * 24));
	      time -= day * 1000 * 3600 * 24;

	      hour = Math.floor(time / (1000 * 3600));
	      time -= hour * 1000 * 3600;

	      minute = Math.floor(time / (1000 * 60));
	      time -= minute * 1000 * 60;

	      second = Math.floor(time / 1000);
	      time -= second * 1000;

	      millisecond = time;

	      return {
	        day: day,
	        hour: hour,
	        minute: minute,
	        second: second,
	        millisecond: millisecond
	      };
	    }
	  }, {
	    key: 'updateMillisecond',
	    value: function updateMillisecond() {
	      // do something
	      //
	    }
	  }, {
	    key: 'updateSecond',
	    value: function updateSecond() {
	      // do something
	      //
	    }
	  }, {
	    key: 'updateMinute',
	    value: function updateMinute() {
	      // do something
	      //
	    }
	  }, {
	    key: 'updateHour',
	    value: function updateHour() {
	      // do something
	      //
	    }
	  }, {
	    key: 'updateDay',
	    value: function updateDay() {
	      // do something
	      //
	    }
	  }]);

	  return CountdownBase;
	}(_index.Component);

	var Countdown = function (_CountdownBase) {
	  _inherits(Countdown, _CountdownBase);

	  function Countdown() {
	    _classCallCheck(this, Countdown);

	    return _possibleConstructorReturn(this, (Countdown.__proto__ || Object.getPrototypeOf(Countdown)).apply(this, arguments));
	  }

	  _createClass(Countdown, [{
	    key: 'getData',
	    value: function getData() {
	      return Object.assign(_get(Countdown.prototype.__proto__ || Object.getPrototypeOf(Countdown.prototype), 'getData', this).call(this), {
	        second: '',
	        minute: '',
	        color: '',
	        status: 1, // 1:running 0:stop
	        logs: []
	      });
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      this.start();
	    }
	  }, {
	    key: 'updateSecond',
	    value: function updateSecond(second) {
	      if (second < 10) {
	        second = '0' + second;
	      }

	      this.data.second = second;
	    }
	  }, {
	    key: 'updateMinute',
	    value: function updateMinute(minute) {
	      if (minute < 10) {
	        minute = '0' + minute;
	      }

	      this.data.minute = minute;
	    }
	  }, {
	    key: 'start',
	    value: function start() {
	      _get(Countdown.prototype.__proto__ || Object.getPrototypeOf(Countdown.prototype), 'start', this).call(this);

	      this.data.status = 1;
	    }
	  }, {
	    key: 'stop',
	    value: function stop() {
	      _get(Countdown.prototype.__proto__ || Object.getPrototypeOf(Countdown.prototype), 'stop', this).call(this);

	      this.data.status = 0;
	    }
	  }, {
	    key: 'toggleCountdown',
	    value: function toggleCountdown($event) {
	      $event.stopPropagation();

	      if (this.data.status === 1) {
	        this.stop();
	      } else {
	        this.start();
	      }
	    }
	  }, {
	    key: 'renderLog',
	    value: function renderLog(logs) {
	      return logs.map(function (_ref) {
	        var minute = _ref.minute,
	            second = _ref.second;
	        return '<li x-component="TimeRecord"\n        minute="' + minute + '"\n        second="' + second + '"\n        x-class="selected:this.data.selected"\n        x-click="this.data.selected = !this.data.selected"\n        class="time-record">\n        ' + minute + ':' + second + '\n      </li>';
	      }).join('');
	    }
	  }, {
	    key: 'removeSelectedLog',
	    value: function removeSelectedLog() {
	      var logs = this.childs.filter(function (child) {
	        return !child.data.selected;
	      }).map(function (child) {
	        return {
	          minute: child.props.minute,
	          second: child.props.second
	        };
	      });

	      this.data.logs = logs;
	    }
	  }, {
	    key: 'createLog',
	    value: function createLog() {
	      var _data = this.data,
	          minute = _data.minute,
	          second = _data.second;


	      this.data.logs.push({
	        minute: minute,
	        second: second
	      });
	    }
	  }]);

	  return Countdown;
	}(CountdownBase);

	var TimeRecord = function (_Component2) {
	  _inherits(TimeRecord, _Component2);

	  function TimeRecord() {
	    _classCallCheck(this, TimeRecord);

	    return _possibleConstructorReturn(this, (TimeRecord.__proto__ || Object.getPrototypeOf(TimeRecord)).apply(this, arguments));
	  }

	  _createClass(TimeRecord, [{
	    key: 'getData',
	    value: function getData() {
	      return {
	        selected: false
	      };
	    }
	  }, {
	    key: 'getProps',
	    value: function getProps() {
	      return {
	        minute: 0,
	        second: 0
	      };
	    }
	  }]);

	  return TimeRecord;
	}(_index.Component);

	/*
	 * register components with the unique name
	 * then you can use in your html
	 */


	(0, _index.register)('Countdown', Countdown);
	(0, _index.register)('TimeRecord', TimeRecord);

	/*
	 * parse the body node and bootstrap
	 */
	document.addEventListener('DOMContentLoaded', function () {
	  (0, _index.compile)((0, _index.parse)(document.body));
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _component = __webpack_require__(2);

	Object.keys(_component).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _component[key];
	    }
	  });
	});

	var _compile = __webpack_require__(3);

	Object.keys(_compile).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _compile[key];
	    }
	  });
	});

	var _factory = __webpack_require__(4);

	Object.keys(_factory).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _factory[key];
	    }
	  });
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Component = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _factory = __webpack_require__(4);

	var _compile = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var slice = Array.prototype.slice;

	var Component = exports.Component = function () {
	  function Component(node) {
	    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	    _classCallCheck(this, Component);

	    this.uuid = Date.now() + Math.round(Math.random() * 100000);
	    this.data = this.props = null;
	    this.refs = {};
	    this.ref = '';
	    this.as = '';
	    this.childs = [];
	    this.parent = parent;
	    this.destroyQueue = [];
	    this.initQueue = [];
	    this.watchers = [];
	    this.node = node;
	    this.watcherCount = 0;

	    if (this.parent !== null) {
	      this.parent.childs.push(this);
	    }

	    this.data = this.getData();
	    this.props = this.prepareProps(this.getProps());

	    this.prepareWatch('data', this.data);
	    this.prepareWatch('props', this.props);

	    this.init();
	  }

	  _createClass(Component, [{
	    key: 'prepareProps',
	    value: function prepareProps(initProps) {
	      var _this = this;

	      var props = {},
	          attrs = void 0,
	          deps = void 0,
	          propKeys = void 0;

	      if (this.node !== null) {
	        attrs = slice.call(this.node.attributes);
	        propKeys = Object.keys(initProps);

	        if (attrs.length) {
	          deps = (0, _compile.computeDeps)(this.parent);
	        }

	        attrs.forEach(function (attr) {
	          var name = camelize(attr.name),
	              value = attr.value;

	          if (name === 'ref') {
	            _this.ref = value;
	            _this.parent.refs[_this.ref] = _this;
	          } else if (name === 'as') {
	            _this.as = value;
	          } else if (propKeys.indexOf(name) > -1 && value !== '') {
	            props[name] = (0, _compile.computeExpressionWithDeps)(value, _this, deps);
	          }
	        });
	      }

	      return mixin({}, initProps, props);
	    }
	  }, {
	    key: 'prepareWatch',
	    value: function prepareWatch(prefix, target) {
	      var _this2 = this;

	      Object.keys(target).forEach(function (name) {
	        var value = target[name],
	            arrayDecorater = void 0;

	        if (Array.isArray(value)) {
	          arrayDecorater = _compile.decorateArrayMethod.bind(null, function (newValue) {
	            value = newValue;

	            _this2.invokeWatcher(prefix + '.' + name, value, false);
	          });

	          arrayDecorater(value);
	        }

	        Object.defineProperty(target, name, {
	          get: function get() {
	            return value;
	          },
	          set: function set(newValue) {
	            var isEqual = (0, _compile.equal)(newValue, value);

	            value = newValue;

	            if (Array.isArray(value)) {
	              arrayDecorater(value);
	            }

	            _this2.invokeWatcher(prefix + '.' + name, value, isEqual);
	          },
	          configurable: true
	        });
	      });
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      // do something
	    }
	  }, {
	    key: 'getProps',
	    value: function getProps() {
	      return {};
	    }
	  }, {
	    key: 'getData',
	    value: function getData() {
	      return {};
	    }
	  }, {
	    key: 'setIn',
	    value: function setIn(key, value) {
	      var keys = key.split('.');

	      if (keys.length < 2) {
	        throw new Error('invalid param');
	      }

	      var target = keys[0],
	          name = keys[1],
	          path = keys.slice(2),
	          originPropsKeys = Object.keys(this.getProps()),
	          originDataKeys = Object.keys(this.getData());

	      if (!(target === 'props' && originPropsKeys.includes(name) || target === 'data' && originDataKeys.includes(name))) {
	        throw new Error('invalid param');
	      }

	      path.reduce(function (prev, cur, index) {
	        if (index === path.length - 1) {
	          prev[cur] = typeof value === 'function' ? value(prev[cur]) : value;
	        } else {
	          return prev[cur];
	        }
	      }, this[target][name]);

	      this.invokeWatcher(target + '.' + name, this[target][name], false);
	    }
	  }, {
	    key: 'invokeWatcher',
	    value: function invokeWatcher(targetKey, value, isEqual) {
	      this.watchers.forEach(function (_ref) {
	        var key = _ref.key,
	            fn = _ref.fn,
	            force = _ref.force;

	        if (targetKey === key && (!isEqual || force)) {
	          fn(value);
	        }
	      });
	    }
	  }, {
	    key: 'addWatcher',
	    value: function addWatcher(key, fn) {
	      var _this3 = this;

	      var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	      var watcherObj = {
	        key: key,
	        fn: fn,
	        id: ++this.watcherCount,
	        force: force
	      };

	      this.watchers.push(watcherObj);

	      return function () {
	        var index = _this3.watchers.indexOf(watcherObj);

	        if (index > -1) {
	          _this3.watchers.splice(index, 1);
	        }
	      };
	    }
	  }, {
	    key: 'deref',
	    value: function deref(childComponent) {
	      var index = void 0,
	          ref = childComponent.ref;

	      if (this.childs.length && (index = this.childs.indexOf(childComponent)) > -1) {
	        this.childs.splice(index, 1);
	      }

	      if (this.refs && this.refs[ref]) {
	        delete this.refs[ref];
	      }
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      var child = void 0,
	          parent = this.parent;

	      if (parent) {
	        parent.deref(this);
	      }

	      this.refs = this.parent = this.node = this.props = this.data = null;

	      this.destroyQueue.forEach(function (fn) {
	        fn();
	      });

	      this.destroyQueue.length = 0;

	      (0, _factory.removeComponent)(this.uuid);

	      while (child = this.childs.pop()) {
	        child.destroy();
	      }
	    }
	  }, {
	    key: 'onDestroy',
	    value: function onDestroy(fn) {
	      this.destroyQueue.push(fn);
	    }
	  }, {
	    key: 'onInit',
	    value: function onInit(fn) {
	      this.initQueue.push(fn);
	    }
	  }]);

	  return Component;
	}();

	function camelize(str) {
	  if (typeof str !== 'string') {
	    throw new Error('invalid param');
	  }

	  var items = str.split('-');

	  if (items.length === 1) {
	    return items[0];
	  }

	  return items.slice(0, 1).concat(items.slice(1).map(function (item) {
	    return item[0].toUpperCase() + item.substr(1);
	  })).join('');
	}

	function mixin(dest) {
	  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    sources[_key - 1] = arguments[_key];
	  }

	  sources.forEach(function (source) {
	    return extend(dest, source, true);
	  });

	  return dest;
	}

	function extend(dest, src) {
	  var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	  var prop = void 0;

	  for (prop in src) {
	    if (force || !dest[prop]) {
	      dest[prop] = src[prop];
	    }
	  }
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.parse = parse;
	exports.compile = compile;
	exports.destroy = destroy;
	exports.decorateArrayMethod = decorateArrayMethod;
	exports.computeExpression = computeExpression;
	exports.computeExpressionWithDeps = computeExpressionWithDeps;
	exports.computeDeps = computeDeps;
	exports.equal = equal;

	var _factory = __webpack_require__(4);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var slice = Array.prototype.slice,
	    toString = Object.prototype.toString;

	var compileAttrMap = {};
	var keyReg = /this\.((?:props|data)\.[a-zA-Z]+)/g;

	function parse(node, existNode) {
	  if (Array.isArray(node)) {
	    return node.filter(function (node) {
	      return node.nodeType === 1;
	    }).map(function (singleNode) {
	      return parse(singleNode, existNode);
	    }).filter(function (node) {
	      return node;
	    }).reduce(function (prev, current) {
	      return prev.concat(current);
	    }, []);
	  }

	  if (existNode) {
	    // if we reparse in en exist tree
	    // we should bottom up to fetch parent node

	    existNode = {
	      node: bottomUp(node.parentNode, detectComponentNode),
	      parent: null,
	      attrs: [],
	      childs: []
	    };
	  } else {
	    existNode = {
	      node: null,
	      parent: null,
	      attrs: [],
	      childs: []
	    };
	  }

	  var parseTree = traverseDomNode(node, existNode);

	  if (!parseTree.node && !parseTree.parent) {
	    return parseTree.childs.map(function (node) {
	      node.parent = null;

	      return node;
	    });
	  } else {
	    return parseTree;
	  }
	}

	function compile(parseTree) {
	  if (!parseTree || Array.isArray(parseTree) && !parseTree.length) {

	    return;
	  }

	  if (Array.isArray(parseTree)) {
	    parseTree.forEach(function (singleTree) {
	      return compile(singleTree);
	    });

	    return;
	  }

	  var parentComponent = contextComponent(parseTree.node);

	  genComponent(parseTree, parentComponent);
	}

	function destroy(node) {
	  if (!node || node.nodeType !== 1) {
	    return;
	  }

	  if (!tryDestroyComponent(node)) {
	    var queue = [node];

	    while (node = queue.shift()) {
	      var childs = childElements(node),
	          child = void 0;

	      destroyAttr(node);

	      while (child = childs.shift()) {
	        if (!tryDestroyComponent(child)) {
	          queue.push(child);
	        }
	      }
	    }
	  }
	}

	function genComponent(node) {
	  var parentComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	  var child = void 0,
	      component = void 0,
	      inited = false,
	      domNode = node.node;

	  if (component = findComponent(domNode)) {
	    inited = true;
	  } else {
	    component = compileComponent(domNode, parentComponent);
	  }

	  compileAttr(component, node.attrs);

	  while (child = node.childs.shift()) {
	    genComponent(child, component);
	  }

	  if (!inited) {
	    component.initQueue.forEach(function (fn) {
	      return fn();
	    });
	    component.initQueue.length = 0;
	  }
	}

	function traverseDomNode(nodes) {
	  var currentNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	  if (!Array.isArray(nodes)) {
	    nodes = [nodes];
	  }

	  if (!nodes.length) {
	    return currentNode ? rootNode(currentNode) : currentNode;
	  }

	  var node = nodes.shift(),
	      hasComponent = false,
	      attrs = void 0;

	  if (node.hasAttribute('x-component')) {
	    if (currentNode) {
	      currentNode = commonParrentComponent(currentNode, node);
	    }

	    var newComponentNode = {
	      node: node,
	      parent: currentNode,
	      attrs: [],
	      childs: []
	    };

	    if (currentNode) {
	      currentNode.childs.push(newComponentNode);
	    }

	    currentNode = newComponentNode;

	    hasComponent = true;
	  }

	  attrs = slice.call(node.attributes).filter(function (_ref) {
	    var name = _ref.name;
	    return name in compileAttrMap;
	  }).map(function (attr) {
	    return {
	      attr: attr,
	      node: node
	    };
	  });

	  if (attrs.length && currentNode) {
	    currentNode = hasComponent ? currentNode : commonParrentComponent(currentNode, node);

	    currentNode.attrs = currentNode.attrs.concat(attrs);
	  }

	  var childs = childElements(node);

	  if (childs.length) {
	    nodes = childs.concat(nodes);
	  }

	  return traverseDomNode(nodes, currentNode);
	}

	function commonParrentComponent(currentNode, domNode) {
	  do {
	    if (!currentNode.node && !currentNode.parent || currentNode.node.contains(domNode)) {

	      return currentNode;
	    }
	  } while (currentNode = currentNode.parent);
	}

	function rootNode(currentNode) {
	  do {
	    if (!currentNode.parent) {
	      return currentNode;
	    }
	  } while (currentNode = currentNode.parent);
	}

	function bottomUp(node, fn) {
	  if (!node) {
	    throw new Error('bad param');
	  }

	  do {
	    if (!node || node.nodeType !== 1) {
	      return;
	    }

	    var ret = fn.call(null, node);

	    if (ret) {
	      return node;
	    }
	  } while (node = node.parentNode);
	}

	function childElements(node) {
	  return slice.call(node.childNodes).filter(function (node) {
	    return node.nodeType === 1;
	  });
	}

	function contextComponent(node) {
	  return findComponent(bottomUp(node, detectComponentNode));
	}

	function compileComponent(node, component) {
	  var componentName = node.getAttribute('x-component');

	  return (0, _factory.getInstance)(componentName, node, component);
	}

	function compileAttr(component, attrs) {
	  attrs.forEach(function (_ref2) {
	    var node = _ref2.node,
	        attr = _ref2.attr;
	    var name = attr.name,
	        value = attr.value,
	        attrHandler = void 0;


	    if (attrHandler = compileAttrMap[name]) {
	      attrHandler(node, value, component);
	    }
	  });
	}

	function destroyAttr(node) {
	  slice.call(node.attributes).forEach(function (_ref3) {
	    var name = _ref3.name;

	    if (compileAttrMap[name]) {
	      node.$onetwo.forEach(function (fn) {
	        return fn();
	      });

	      delete node.$onetwo;
	    }
	  });
	}

	function registerAttr(name, fn) {
	  if (compileAttrMap[name]) {
	    throw new Error('attr: ' + name + ' has been registered');
	  } else {
	    compileAttrMap[name] = fn;
	  }
	}

	var originEventMap = {
	  'x-click': 'click',
	  'x-touch': 'touchstart'
	};

	Object.keys(originEventMap).forEach(function (key) {
	  var name = originEventMap[key];

	  registerAttr(key, bindEventListener.bind(null, name));
	});

	function bindEventListener(eventName, node, value, component) {
	  /*
	   * <div x-click="this.greet()">click me!</div>
	   */
	  var originFn = computeExpression(value, component, ['$event']),
	      fn = function fn(e) {
	    return originFn(e);
	  },
	      unbind = void 0;

	  node.addEventListener(eventName, fn);

	  unbind = once(function () {
	    return node.removeEventListener(eventName, fn);
	  });

	  storeWatcher(node, unbind);
	  component.onDestroy(unbind);
	}

	registerAttr('x-class', function (node, value, component) {
	  value.split(';').forEach(function (exp) {
	    var classPair = exp.split(':');

	    if (classPair.length === 2) {
	      /*
	       * <div x-class="star:this.props.star"></div>
	       */
	      var watchKey = extractWatchName(classPair[1]);

	      if (watchKey && watchKey.length) {
	        watchKey.forEach(function (key) {
	          var unbindWatch = component.addWatcher(key, commonObserverMaker(toggleClass.bind(null, classPair[0]), component, node, classPair[1]));

	          storeWatcher(node, unbindWatch);
	        });
	      }
	    }
	  });
	});

	registerAttr('x-style', function (node, value, component) {
	  value.split(';').forEach(function (exp) {
	    var stylePair = exp.split(':');

	    if (stylePair.length === 2) {
	      /*
	       * <div x-style="color:this.data.color">6666666</div>
	       */
	      var watchKey = extractWatchName(stylePair[1]);

	      if (watchKey && watchKey.length) {
	        watchKey.forEach(function (key) {
	          var unbindWatch = component.addWatcher(key, commonObserverMaker(updateStyle.bind(null, stylePair[0]), component, node, stylePair[1]));

	          storeWatcher(node, unbindWatch);
	        });
	      }
	    }
	  });
	});

	registerAttr('x-show', function (node, value, component) {
	  /*
	   * <div x-show="this.data.logCount === 0">no logs!</div>
	   */
	  var watchKey = extractWatchName(value);

	  if (watchKey && watchKey.length) {
	    watchKey.forEach(function (key) {
	      var unbindWatch = component.addWatcher(key, commonObserverMaker(updateDisplay, component, node, value));

	      storeWatcher(node, unbindWatch);
	    });
	  }
	});

	registerAttr('x-html', function (node, value, component) {
	  /*
	   * <div x-html="this.props.comment">6666666</div>
	   */
	  var watchKey = extractWatchName(value);

	  if (watchKey) {
	    var unbindWatch = component.addWatcher(watchKey[0], commonObserverMaker(insertDomContent, component, node, value));

	    storeWatcher(node, unbindWatch);
	  }
	});

	registerAttr('x-model', function (node, value, component) {
	  /*
	   * <input x-model="this.props.name">
	   */
	  var watchKey = extractWatchName(value);

	  if (watchKey) {
	    (function () {
	      var assignFn = computeExpression(value + '= newValue', component, ['newValue']);

	      var isCheckbox = /checkbox/i.test(node.type);
	      var isRadio = /radio/i.test(node.type);

	      var bindFn = function bindFn() {
	        var newValue = isCheckbox ? node.checked : node.value;

	        assignFn(newValue);
	      };

	      node.addEventListener('change', bindFn);

	      component.onDestroy(function () {
	        node.removeEventListener('change', bindFn);
	      });

	      var unbindWatch = component.addWatcher(watchKey[0], commonObserverMaker(isCheckbox ? updateCheckbox : isRadio ? updateRadio : updateInputValue, component, node, value));

	      storeWatcher(node, unbindWatch);
	    })();
	  }
	});

	registerAttr('x-append', function (node, value, component) {
	  /*
	   * <div x-html="this.props.comment">6666666</div>
	   */
	  var watchKey = extractWatchName(value);

	  if (watchKey) {
	    var unbindWatch = component.addWatcher(watchKey[0], commonObserverMaker(appendDom, component, node, value), true);

	    storeWatcher(node, unbindWatch);
	  }
	});

	registerAttr('x-update', function (node, value, component) {
	  /*
	   * <ul x-update="this.updateLogs(this.data.logs)">
	   *
	   * </ul>
	   */
	  var watchKey = extractWatchName(value);

	  if (watchKey) {
	    var unbindWatch = component.addWatcher(watchKey[0], commonObserverMaker(updateDom, component, node, value));

	    storeWatcher(node, unbindWatch);
	  }
	});

	function extractWatchName(str) {
	  var matches = [],
	      match = keyReg.exec(str);

	  while (match != null) {
	    matches.push(match[1]);
	    match = keyReg.exec(str);
	  }

	  return matches;
	}

	function storeWatcher(node, watcherUnbind) {
	  var watchers = node.$onetwo;

	  if (!watchers) {
	    node.$onetwo = [watcherUnbind];
	  } else {
	    watchers.push(watcherUnbind);
	  }
	}

	function commonObserverMaker(handler, component, node, exp) {
	  var fn = computeExpression(exp, component);

	  return function () {
	    return handler(node, fn());
	  };
	}

	function toggleClass(name, node, isAdd) {
	  if (isAdd) {
	    node.classList.add(name);
	  } else {
	    node.classList.remove(name);
	  }
	}

	function updateStyle(name, node, value) {
	  if (!value) {
	    value = '';
	  }

	  node.style[name] = value;
	}

	function updateDisplay(node, value) {
	  if (value) {
	    node.style.display = '';
	  } else {
	    node.style.display = 'none';
	  }
	}

	function insertDomContent(node, content) {
	  try {
	    node.innerHTML = content;
	  } catch (e) {
	    // do nothing
	  }
	}

	function updateInputValue(node) {
	  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	  node.value = value;
	}

	function updateCheckbox(node, checked) {
	  node.checked = checked ? true : false;
	}

	function updateRadio(node, value) {
	  node.checked = value === node.value;
	}

	function appendDom(node) {
	  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	  value = ('' + value).trim();

	  if (value === '') {
	    return;
	  }

	  var fragment = document.createDocumentFragment();
	  var div = document.createElement('div');

	  div.innerHTML = value;

	  var childNodes = slice.call(div.childNodes);

	  childNodes.forEach(function (node) {
	    fragment.appendChild(node);
	  });

	  node.appendChild(fragment);
	  compile(parse(childNodes, node));
	}

	function updateDom(node) {
	  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	  slice.call(node.childNodes).forEach(function (childNode) {
	    destroy(childNode, true);
	    node.removeChild(childNode);
	  });

	  appendDom(node, value);
	}

	function tryDestroyComponent(node) {
	  if (node.hasAttribute('x-component') && node.hasAttribute('x-component-id')) {
	    var component = findComponent(node);

	    if (component) {
	      component.destroy();
	    }

	    return true;
	  }
	}

	function detectComponentNode(node) {
	  return node.hasAttribute('x-component') && (0, _factory.hasComponent)(node.getAttribute('x-component'));
	}

	function findComponent(node) {
	  if (!node) {
	    return;
	  }

	  var uuid = node.getAttribute('x-component-id');

	  return (0, _factory.getComponent)(uuid);
	}

	function commonEqual(typeCheck, valueTransform, indexTransform, newValue, oldValue) {
	  if (newValue === oldValue) {
	    return true;
	  }

	  if (typeCheck(newValue) && typeCheck(oldValue)) {
	    var _new = valueTransform(newValue),
	        _old = valueTransform(oldValue);

	    if (_new.length !== _old.length) {
	      return false;
	    }

	    for (var i = 0, l = _new.length; i < l; i++) {
	      if (!equal(newValue[indexTransform(_new[i], i)], oldValue[indexTransform(_old[i], i)])) {
	        return false;
	      }
	    }

	    return true;
	  }
	}

	function equalPrimitive(newValue, oldValue) {
	  return newValue !== newValue && oldValue !== oldValue ? true : isPrimitive(newValue) && isPrimitive(oldValue) && newValue === oldValue;
	}

	var equalArray = commonEqual.bind(null, Array.isArray, function (val) {
	  return val;
	}, function (_, i) {
	  return i;
	});

	var equalPlainObject = commonEqual.bind(null, isPlainObject, function (val) {
	  return Object.keys(val);
	}, function (keys, i) {
	  return keys[i];
	});

	var arrMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

	function decorateArrayMethod(fn, arr) {
	  arrMethods.forEach(function (method) {
	    arr[method] = invokeArrayMethod.bind(arr, method, fn);
	  });
	}

	function invokeArrayMethod(method, fn) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  Array.prototype[method].apply(this, args);

	  fn(this);
	}

	function computeExpression(exp, context) {
	  var keys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	  var fn = new (Function.prototype.bind.apply(Function, [null].concat(_toConsumableArray(keys), [genExpFunction(exp)])))();

	  return function () {
	    for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      values[_key2] = arguments[_key2];
	    }

	    var ret = void 0;

	    if (true) {
	      try {
	        ret = fn.apply(context, values);
	      } catch (e) {
	        console.log('fail to compute expression %c' + exp + '%c, context component ' + ('%c' + context.label), 'color: red;', 'color: black;', 'color: blue;');

	        var args = keys.reduce(function (prev, current, index) {
	          prev[current] = keys[index];

	          return prev;
	        }, {});

	        console.log('component instance', context);
	        console.log('args', args);

	        throw e;
	      }
	    } else {
	      ret = fn.apply(context, values);
	    }

	    return ret;
	  };
	}

	function computeExpressionWithDeps(exp, context) {
	  var deps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  var keys = Object.keys(deps),
	      values = keys.map(function (key) {
	    return deps[key];
	  });

	  return computeExpression(exp, context, keys).apply(null, values);
	}

	function computeDeps(component) {
	  var deps = {};

	  while (component) {
	    if (component.as) {
	      deps[component.as] = component;
	    }

	    component = component.parent;
	  }

	  return deps;
	}

	function equal(newValue, oldValue) {
	  if (equalPrimitive(newValue, oldValue) || equalArray(newValue, oldValue) || equalPlainObject(newValue, oldValue)) {

	    return true;
	  }

	  return false;
	}

	function isPrimitive(val) {
	  return (/\[object (?:String|Number|Undefined|Boolean|Null)\]/.test(toString.call(val))
	  );
	}

	function isPlainObject(val) {
	  return toString.call(val) === '[object Object]';
	}

	function genExpFunction() {
	  var exp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	  return 'return ' + exp + ';';
	}

	function once(fn) {
	  var executed = false;

	  return function () {
	    if (executed) {
	      return;
	    }

	    fn();
	    executed = true;
	  };
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.register = register;
	exports.getInstance = getInstance;
	exports.hasComponent = hasComponent;
	exports.findComponentByLabel = findComponentByLabel;
	exports.getComponent = getComponent;
	exports.removeComponent = removeComponent;
	var ComponentMap = {};

	var components = [];

	function register(label, Ctor) {
	  if (ComponentMap[label]) {
	    return;
	  }

	  Ctor.prototype.label = label;

	  ComponentMap[label] = {
	    Ctor: Ctor,
	    instances: []
	  };

	  return function () {
	    delete ComponentMap[label];
	  };
	}

	function getInstance(label, node, parent) {
	  var component = ComponentMap[label];

	  if (!component) {
	    throw new Error('try to initialize an unregister component: ' + label);
	  }

	  var instance = new component.Ctor(node, parent);

	  if (node) {
	    node.setAttribute('x-component-id', instance.uuid);
	  }

	  components.push(instance);
	  component.instances.push(instance);

	  return instance;
	}

	function hasComponent(label) {
	  return ComponentMap[label] !== undefined;
	}

	function findComponentByLabel(label) {
	  var component = ComponentMap[label];

	  return component && component.instances;
	}

	function getComponent(uuid) {
	  return findComponent(uuid);
	}

	function removeComponent(uuid) {
	  var component = findComponent(uuid),
	      index = components.indexOf(component);

	  if (index > -1) {
	    components.splice(index, 1);
	  }

	  removeFromMap(component);
	}

	function removeFromMap(instance) {
	  var componentData = ComponentMap[instance.label];

	  if (!componentData) {
	    return;
	  }

	  var index = componentData.instances.indexOf(instance);

	  if (index > -1) {
	    componentData.instances.splice(index, 1);
	  }
	}

	function findComponent(uuid) {
	  return components.filter(function (component) {
	    return component.uuid == uuid;
	  })[0];
	}

/***/ }
/******/ ])