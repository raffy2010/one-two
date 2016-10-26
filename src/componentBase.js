import {removeComponent} from './componentFactory';

let slice = Array.prototype.slice;

export default class Component {
  constructor(node, parent = null) {
    this.uuid = Date.now() + Math.round(Math.random() * 100000);
    this.data = {};
    this.props = {};
    this.refs = {};
    this.childs = [];
    this.parent = parent;
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
          this.parent.refs[attr.value] = this;
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
    let index = this.childs.indexOf(childComponent);

    if (index > -1) {
      this.childs.splice(index, 1);
    }
  }

  destroy() {
    let child,
        parent = this.parent;

    if (parent) {
      parent.deref(this);
    }

    this.onDestroy();

    while (child = this.childs.pop()) {
      child.destroy();
    }
  }

  onDestroy() {
    this.refs = this.parent = this.node = null;

    removeComponent(this.uuid);
  }

  onInit() {
    // do something
  }
}

function computeExpression(exp, context) {
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
