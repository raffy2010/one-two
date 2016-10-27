import {removeComponent} from './componentFactory';
import {computeExpression} from './compile';

let slice = Array.prototype.slice;

export default class Component {
  constructor(node, parent = null) {
    this.uuid = Date.now() + Math.round(Math.random() * 100000);
    this.data = {};
    this.props = {};
    this.refs = {};
    this.ref = '';
    this.as = '';
    this.childs = [];
    this.parent = parent;
    this.destroyQueue = this.initQueue = [];
    this.node = node;

    if (this.parent !== null) {
      this.parent.childs.push(this);
    }

    let props = {},
        data = {},
        initProps = this.getProps(),
        initData = this.getData(),
        attrs, propKeys, dataKeys;

    if (this.node !== null) {
      attrs = slice.call(this.node.attributes);
      propKeys = Object.keys(initProps);
      dataKeys = Object.keys(initData);

      attrs.forEach((attr) => {
        let name = camelize(attr.name);

        if (name === 'ref') {
          this.ref = attr.value;
          this.parent.refs[this.ref] = this;
        }

        if (name === 'as') {
          this.as = attr.value;
        }

        if (propKeys.indexOf(name) > -1 && attr.value !== '') {

          props[name] = computeExpression(attr.value, this.parent);
        } else if (dataKeys.indexOf(name) > -1 && attr.value !== '')  {

          data[name] = computeExpression(attr.value, this.parent);
        }
      });
    }

    mixin(this.props, initProps, props);
    mixin(this.data, initData, data);

    this.init();
  }

  init() {
    // do something
  }

  getProps() {
    return {};
  }

  getData() {
    return {};
  }

  deref(childComponent) {
    let index = this.childs.indexOf(childComponent),
        ref = childComponent.ref;

    if (index > -1) {
      this.childs.splice(index, 1);
    }

    if (this.refs[ref]) {
      delete this.refs[ref];
    }
  }

  destroy() {
    let child,
        parent = this.parent;

    if (parent) {
      parent.deref(this);
    }

    this.refs = this.parent = this.node = this.props = this.data = null;

    this.destroyQueue.forEach((fn) => {
      fn();
    });

    this.destroyQueue.length = 0;

    removeComponent(this.uuid);

    while (child = this.childs.pop()) {
      child.destroy();
    }
  }

  onDestroy(fn) {
    this.destroyQueue.push(fn);
  }

  onInit() {
    // do something
  }
}

function camelize(str) {
  if (typeof str !== 'string') {
    throw new Error('invalid param');
  }

  let items = str.split('-');

  if (items.length === 1) {
    return items[0];
  }

  return items.slice(0, 1).concat(
    items.slice(1).map(item => item[0].toUpperCase() + item.substr(1))
  ).join('');
}

function mixin(dest, ...sources) {
  sources.forEach(source => extend(dest, source, true));

  return dest;
}

function extend(dest, src, force = false) {
  let prop;

  for (prop in src) {
    if (force || !dest[prop]) {
      dest[prop] = src[prop];
    }
  }
}
