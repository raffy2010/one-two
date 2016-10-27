import {getInstance, hasComponent, getComponent} from './componentFactory';

let slice = Array.prototype.slice;

const EventMap = {
  'x-click': 'click',
  'x-touch': 'touchstart'
};

export function parse(node) {
  if (Array.isArray(node)) {
    node.forEach((singleNode) => {
      parse(singleNode);
    });

    return;
  }

  let parentNode = bottomUp(node, detectComponentNode),
      parentComponent;

  if (parentNode) {
    parentComponent = findComponent(parentNode);
  }

  traverseNode(node, parentComponent, compile);
}

export function destroy(node) {
  if (!node || node.nodeType !== 1) {
    return;
  }

  if (!tryDestroyComponent(node)) {
    let queue = [node];

    while (node = queue.shift()) {
      let childs = childElements(node.childNodes),
          child;

      while (child = childs.shift()) {
        if (!tryDestroyComponent(child)) {
          queue.push(child);
        }
      }
    }
  }
}

function traverseNode(node, parentComponent, fn) {
  if (!node || node.nodeType !== 1) {
    return;
  }

  let component,
      context;

  if (node.hasAttribute('x-component')) {
    component = fn.call(null, node, parentComponent);
  }

  context = component || parentComponent;

  if (context) {
    compileEvent(node, context);
  }

  let childNodes = childElements(node);

  if (childNodes.length) {
    let childNode;

    while (childNode = childNodes.shift()) {
      traverseNode(childNode, component, fn);
    }

    if (component) {
      component.initQueue.forEach((fn) => {
        fn();
      });

      component.initQueue.length = 0;
    }
  }
}

function bottomUp(node, fn) {
  if (!node) {
    throw new Error('bad param');
  }

  while (node = node.parentNode) {
    if (!node || node.nodeType !== 1) {
      return;
    }

    let ret = fn.call(null, node);

    if (ret) {
      return node;
    }
  }
}

function childElements(node) {
  return slice.call(node.childNodes)
    .filter(node => node.nodeType === 1);
}

function compile(node, component) {
  let componentName = node.getAttribute('x-component');

  return compileComponent(componentName, node, component);
}

function compileComponent(component, node, parentComponent) {
  return getInstance(component, node, parentComponent);
}

function compileEvent(node, component) {
  slice.call(node.attributes).forEach((attr) => {
    let name = attr.name,
        value = attr.value,
        eventHandler,
        eventName,
        fn,
        unbind;

    if (eventName = EventMap[name]) {
      fn = computeExpression(value, component);

      if (typeof eventName === 'string') {
        node.addEventListener(eventName, fn);

        unbind = () => node.removeEventListener(eventName, fn);
      } else if (typeof eventName === 'function') {
        eventHandler = eventName;
        unbind = eventHandler(node, fn);

        if (typeof unbind !== 'function') {
          unbind = noop;
        }
      }

      component.onDestroy(unbind);
    }
  });
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
  let uuid = node.getAttribute('x-component-id');

  return getComponent(uuid);
}

export function computeExpression(exp, context) {
  let deps = computeDeps(context),
      keys = Object.keys(deps),
      values = keys.map((key) => deps[key]);

  let fn = new Function(...keys, genExpFunction(exp));

  return fn.apply(context, values);
}

function computeDeps(component) {
  let deps = {};

  while (component) {
    if (component.as) {
      deps[component.as] = component;
    }

    component = component.parent;
  }

  return deps;
}

function genExpFunction(exp = '') {
  return 'return ' + exp + ';';
}

function noop() {
  // do nothing
}

