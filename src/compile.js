import {getInstance, hasComponent, getComponent} from './factory';

let slice = Array.prototype.slice,
    toString = Object.prototype.toString;

const compileAttrMap = {};
const keyReg = /this\.((?:props|data)\.[a-zA-Z]+)/g;

export function parse(node, existNode) {
  if (Array.isArray(node)) {
    return node.filter(node => node.nodeType === 1)
      .map(singleNode => parse(singleNode, existNode))
      .filter(node => node)
      .reduce((prev, current) => prev.concat(current), []);
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

  let parseTree = traverseDomNode(node, existNode);

  if (!parseTree.node && !parseTree.parent) {
    return parseTree.childs.map(node => {
      node.parent = null;

      return node;
    });
  } else {
    return parseTree;
  }
}

export function compile(parseTree) {
  if (!parseTree ||
    (Array.isArray(parseTree) && !parseTree.length)) {

    return;
  }

  if (Array.isArray(parseTree)) {
    parseTree.forEach((singleTree) => compile(singleTree));

    return;
  }

  let parentComponent = contextComponent(parseTree.node);

  genComponent(parseTree, parentComponent);
}

export function destroy(node) {
  if (!node || node.nodeType !== 1) {
    return;
  }

  if (!tryDestroyComponent(node)) {
    let queue = [node];

    while (node = queue.shift()) {
      let childs = childElements(node),
          child;

      destroyAttr(node);

      while (child = childs.shift()) {
        if (!tryDestroyComponent(child)) {
          queue.push(child);
        }
      }
    }
  }
}

function genComponent(node, parentComponent = null) {
  let child,
      component,
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
    component.initQueue.forEach(fn => fn());
    component.initQueue.length = 0;
  }
}

function traverseDomNode(nodes, currentNode = null) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  if (!nodes.length) {
    return currentNode ?
      rootNode(currentNode) :
      currentNode;
  }

  let node = nodes.shift(),
      hasComponent = false,
      attrs;

  if (node.hasAttribute('x-component')) {
    if (currentNode) {
      currentNode = commonParrentComponent(currentNode, node);
    }

    let newComponentNode = {
      node,
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

  attrs = slice.call(node.attributes)
    .filter(({name}) => name in compileAttrMap)
    .map(attr => ({
      attr,
      node
    }));

  if (attrs.length && currentNode) {
    currentNode = hasComponent ?
      currentNode :
      commonParrentComponent(currentNode, node);

    currentNode.attrs = currentNode.attrs.concat(attrs);
  }

  let childs = childElements(node);

  if (childs.length) {
    nodes = childs.concat(nodes);
  }

  return traverseDomNode(nodes, currentNode);
}

function commonParrentComponent(currentNode, domNode) {
  do {
    if ((!currentNode.node && !currentNode.parent) ||
      currentNode.node.contains(domNode)) {

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

    let ret = fn.call(null, node);

    if (ret) {
      return node;
    }
  } while (node = node.parentNode);
}

function childElements(node) {
  return slice.call(node.childNodes)
    .filter(node => node.nodeType === 1);
}

function contextComponent(node) {
  return findComponent(bottomUp(node, detectComponentNode));
}

function compileComponent(node, component) {
  let componentName = node.getAttribute('x-component');

  return getInstance(componentName, node, component);
}

function compileAttr(component, attrs) {
  attrs.forEach(({node, attr}) => {
    let {name, value} = attr,
        attrHandler;

    if (attrHandler = compileAttrMap[name]) {
      attrHandler(node, value, component);
    }
  });
}

function destroyAttr(node) {
  slice.call(node.attributes).forEach(({name}) => {
    if (compileAttrMap[name]) {
      node.$onetwo.forEach(fn => fn());

      delete node.$onetwo;
    }
  });
}

function registerAttr(name, fn) {
  if (compileAttrMap[name]) {
    throw new Error(`attr: ${name} has been registered`);
  } else {
    compileAttrMap[name] = fn;
  }
}

const originEventMap = {
  'x-click': 'click',
  'x-touch': 'touchstart'
};

Object.keys(originEventMap).forEach((key) => {
  let name = originEventMap[key];

  registerAttr(key, bindEventListener.bind(null, name));
});

function bindEventListener(eventName, node, value, component) {
  /*
   * <div x-click="this.greet()">click me!</div>
   */
  let originFn = computeExpression(value, component, ['$event']),
      fn = e => originFn(e),
      unbind;

  node.addEventListener(eventName, fn);

  unbind = once(() => node.removeEventListener(eventName, fn));

  storeWatcher(node, unbind);
  component.onDestroy(unbind);
}

registerAttr('x-class', (node, value, component) => {
  value.split(';').forEach(exp => {
    let classPair = exp.split(':');

    if (classPair.length === 2) {
      /*
       * <div x-class="star:this.props.star"></div>
       */
      let watchKey = extractWatchName(classPair[1]);

      if (watchKey && watchKey.length) {
        watchKey.forEach(key => {
          let unbindWatch = component.addWatcher(
            key,
            commonObserverMaker(
              toggleClass.bind(null, classPair[0]),
              component,
              node,
              classPair[1]
            )
          );

          storeWatcher(node, unbindWatch);
        });
      }
    }
  });
});

registerAttr('x-style', (node, value, component) => {
  value.split(';').forEach(exp => {
    let stylePair = exp.split(':');

    if (stylePair.length === 2) {
      /*
       * <div x-style="color:this.data.color">6666666</div>
       */
      let watchKey = extractWatchName(stylePair[1]);

      if (watchKey && watchKey.length) {
        watchKey.forEach(key => {
          let unbindWatch = component.addWatcher(
            key,
            commonObserverMaker(
              updateStyle.bind(null, stylePair[0]),
              component,
              node,
              stylePair[1]
            )
          );

          storeWatcher(node, unbindWatch);
        });
      }
    }
  });
});

registerAttr('x-show', (node, value, component) => {
  /*
   * <div x-show="this.data.logCount === 0">no logs!</div>
   */
  let watchKey = extractWatchName(value);

  if (watchKey && watchKey.length) {
    watchKey.forEach(key => {
      let unbindWatch = component.addWatcher(
        key,
        commonObserverMaker(
          updateDisplay,
          component,
          node,
          value
        )
      );

      storeWatcher(node, unbindWatch);
    });
  }
});

registerAttr('x-html', (node, value, component) => {
  /*
   * <div x-html="this.props.comment">6666666</div>
   */
  let watchKey = extractWatchName(value);

  if (watchKey) {
    let unbindWatch = component.addWatcher(
      watchKey[0],
      commonObserverMaker(
        insertDomContent,
        component,
        node,
        value
      )
    );

    storeWatcher(node, unbindWatch);
  }
});

registerAttr('x-model', (node, value, component) => {
  /*
   * <input x-model="this.props.name">
   */
  let watchKey = extractWatchName(value);

  if (watchKey) {
    let assignFn = computeExpression(
      value + '= newValue',
      component,
      ['newValue']
    );

    let isRadioOrCheckbox;

    if (/(radio|checkbox)/i.test(node.type)) {
      isRadioOrCheckbox = true;
    }

    let bindFn = () => {
      let newValue = isRadioOrCheckbox ?
        node.checked :
        node.value;

      assignFn(newValue);
    };

    node.addEventListener('change', bindFn);

    component.onDestroy(() => {
      node.removeEventListener('change', bindFn);
    });

    let unbindWatch = component.addWatcher(
      watchKey[0],
      commonObserverMaker(
        isRadioOrCheckbox ?
          updateCheckboxOrRadio :
          updateInputValue,
        component,
        node,
        value
      )
    );

    storeWatcher(node, unbindWatch);
  }
});

registerAttr('x-append', (node, value, component) => {
  /*
   * <div x-html="this.props.comment">6666666</div>
   */
  let watchKey = extractWatchName(value);

  if (watchKey) {
    let unbindWatch = component.addWatcher(
      watchKey[0],
      commonObserverMaker(
        appendDom,
        component,
        node,
        value
      )
    );

    storeWatcher(node, unbindWatch);
  }
});

registerAttr('x-update', (node, value, component) => {
  /*
   * <ul x-update="this.updateLogs(this.data.logs)">
   *
   * </ul>
   */
  let watchKey = extractWatchName(value);

  if (watchKey) {
    let unbindWatch = component.addWatcher(
      watchKey[0],
      commonObserverMaker(
        updateDom,
        component,
        node,
        value
      )
    );

    storeWatcher(node, unbindWatch);
  }
});

function extractWatchName(str) {
  let matches = [],
      match = keyReg.exec(str);

  while (match != null) {
    matches.push(match[1]);
    match = keyReg.exec(str);
  }

  return matches;
}

function storeWatcher(node, watcherUnbind) {
  let watchers = node.$onetwo;

  if (!watchers) {
    node.$onetwo = [watcherUnbind];
  } else {
    watchers.push(watcherUnbind);
  }
}

function commonObserverMaker(handler, component, node, exp) {
  let fn = computeExpression(exp, component);

  return () => handler(node, fn());
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

function updateInputValue(node, value = '') {
  node.value = value;
}

function updateCheckboxOrRadio(node, checked) {
  node.checked = checked ? true : false;
}

function appendDom(node, value = '') {
  value = ('' + value).trim();

  if (value === '') {
    return;
  }

  let fragment = document.createDocumentFragment();
  let div = document.createElement('div');

  div.innerHTML = value;

  let childNodes = slice.call(div.childNodes);

  childNodes.forEach(node => {
    fragment.appendChild(node);
  });

  node.appendChild(fragment);
  compile(parse(childNodes, node));
}

function updateDom(node, value = '') {
  slice.call(node.childNodes)
    .forEach((childNode) => {
      destroy(childNode, true);
      node.removeChild(childNode);
    });

  appendDom(node, value);
}

function tryDestroyComponent(node) {
  if (node.hasAttribute('x-component') && node.hasAttribute('x-component-id')) {
    let component = findComponent(node);

    if (component) {
      component.destroy();
    }

    return true;
  }
}

function detectComponentNode(node) {
  return node.hasAttribute('x-component') &&
    hasComponent(node.getAttribute('x-component'));
}

function findComponent(node) {
  if (!node) {
    return;
  }

  let uuid = node.getAttribute('x-component-id');

  return getComponent(uuid);
}

function commonEqual(typeCheck, valueTransform, indexTransform, newValue, oldValue) {
  if (newValue === oldValue) {
    return true;
  }

  if (typeCheck(newValue) && typeCheck(oldValue)) {
    let _new = valueTransform(newValue),
        _old = valueTransform(oldValue);

    if (_new.length !== _old.length) {
      return false;
    }

    for (var i = 0, l = _new.length; i < l; i++) {
      if (!equal(
        newValue[indexTransform(_new[i], i)],
        oldValue[indexTransform(_old[i], i)]
      )) {
        return false;
      }
    }

    return true;
  }
}

function equalPrimitive(newValue, oldValue) {
  return newValue !== newValue && oldValue !== oldValue ?
    true :
    isPrimitive(newValue) &&
    isPrimitive(oldValue) &&
    newValue === oldValue;
}

const equalArray = commonEqual.bind(
  null,
  Array.isArray,
  val => val,
  (_, i) => i
);

const equalPlainObject = commonEqual.bind(
  null,
  isPlainObject,
  val => Object.keys(val),
  (keys, i) => keys[i]
);

const arrMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

export function decorateArrayMethod(arr, fn) {
  arrMethods.forEach(method => {
    arr[method] = invokeArrayMethod.bind(arr, method, fn);
  });
}

function invokeArrayMethod(method, fn, ...args) {
  Array.prototype[method].apply(this, args);

  fn(this);
}

export function computeExpression(exp, context, keys = []) {
  let fn = new Function(...keys, genExpFunction(exp));

  return (...values) => {
    let ret;

    if (process.env.NODE_ENV === 'development') {
      try {
        ret = fn.apply(context, values);
      } catch (e) {
        console.log(
          `fail to compute expression %c${exp}` +
            '%c, context component ' +
            `%c${context.label}`,
            'color: red;',
            'color: black;',
            'color: blue;'
        );

        let args = keys.reduce((prev, current, index) => {
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

export function computeExpressionWithDeps(exp, context, deps = {}) {
  let keys = Object.keys(deps),
      values = keys.map((key) => deps[key]);

  return computeExpression(exp, context, keys).apply(null, values);
}

export function computeDeps(component) {
  let deps = {};

  while (component) {
    if (component.as) {
      deps[component.as] = component;
    }

    component = component.parent;
  }

  return deps;
}

export function equal(newValue, oldValue) {
  if (equalPrimitive(newValue, oldValue) ||
    equalArray(newValue, oldValue) ||
    equalPlainObject(newValue, oldValue)) {

    return true;
  }

  return false;
}

function isPrimitive(val) {
  return /\[object (?:String|Number|Undefined|Boolean|Null)\]/.test(toString.call(val));
}

function isPlainObject(val) {
  return toString.call(val) === '[object Object]';
}

function genExpFunction(exp = '') {
  return 'return ' + exp + ';';
}

function once(fn) {
  let executed = false;

  return () => {
    if (executed) {
      return;
    }

    fn();
    executed = true;
  };
}

