import {removeComponent} from './factory';
import {computeExpressionWithDeps, computeDeps, equal, decorateArrayMethod} from './compile';

let slice = Array.prototype.slice;

export class Component {
  constructor(node, parent = null) {
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

  prepareProps(initProps) {
    let props = {},
        attrs, deps, propKeys;

    if (this.node !== null) {
      attrs = slice.call(this.node.attributes);
      propKeys = Object.keys(initProps);

      if (attrs.length) {
        deps = computeDeps(this.parent);
      }

      attrs.forEach((attr) => {
        let name = camelize(attr.name),
            value = attr.value;

        if (name === 'ref') {
          this.ref = value;
          this.parent.refs[this.ref] = this;
        } else if (name === 'as') {
          this.as = value;
        } else if (propKeys.indexOf(name) > -1 && value !== '') {
          props[name] = computeExpressionWithDeps(value, this, deps);
        }
      });
    }

    return mixin({}, initProps, props);
  }

  prepareWatch(prefix, target) {
    Object.keys(target).forEach((name) => {
      let value = target[name];

      if (Array.isArray(value)) {
        decorateArrayMethod(value, newValue => {
          value = newValue;

          this.invokeWatcher(prefix + '.' + name, value);
        });
      }

      Object.defineProperty(target, name, {
        get: () => value,
        set: newValue => {
          let isEqual = equal(newValue, value);

          if (!isEqual) {
            value = newValue;

            this.invokeWatcher(prefix + '.' + name, value);
          }
        },
        configurable: true
      });
    });
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

  invokeWatcher(targetKey, value) {
    this.watchers.forEach(({key, fn}) => {
      if (targetKey === key) {
        fn(value);
      }
    });
  }

  addWatcher(key, fn) {
    let watcherObj = {
      key,
      fn,
      id: ++this.watcherCount
    };

    this.watchers.push(watcherObj);

    return () => {
      let index = this.watchers.indexOf(watcherObj);

      if (index > -1) {
        this.watchers.splice(index, 1);
      }
    };
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

  onInit(fn) {
    this.initQueue.push(fn);
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
