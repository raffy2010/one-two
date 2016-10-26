import {getInstance, hasComponent, getComponent} from './componentFactory';

let slice = Array.prototype.slice;

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

  if (node.hasAttribute('x-component') && node.hasAttribute('x-component-id')) {
    let component = findComponent(node);

    component.destroy();
  }
}

function traverseNode(node, component, fn) {
  if (!node || node.nodeType !== 1) {
    return;
  }

  if (node.hasAttribute('x-component')) {
    component = fn.call(null, node, component);
  }

  let childNodes = slice.call(node.childNodes).filter((node) => {
    return node.nodeType === 1;
  });

  if (childNodes.length) {
    let childNode;

    while (childNode = childNodes.shift()) {
      traverseNode(childNode, component, fn);
    }
  }
}

function compile(node, component) {
  let componentName = node.getAttribute('x-component');

  return compileComponent(componentName, node, component);
}

function compileComponent(component, node, parentComponent) {
  return getInstance(component, node, parentComponent);
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

function detectComponentNode(node) {
  return node.hasAttribute('x-component') &&
    hasComponent(node.getAttribute('x-component'));
}

function findComponent(node) {
  let uuid = node.getAttribute('x-component-id');

  return getComponent(uuid);
}
