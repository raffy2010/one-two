import {Component} from '../component';
import {parse, compile} from '../compile';
import {register, getComponent, removeComponent} from '../factory';

let fooUnregister,
    barUnregister,
    fooComponent,
    barComponent;

beforeEach(() => {

});

afterEach(() => {
  if (typeof fooUnregister === 'function') {
    fooUnregister();
    fooUnregister = null;
  }

  if (typeof barUnregister === 'function') {
    barUnregister();
    barUnregister = null;
  }

  if (fooComponent) {
    removeComponent(fooComponent.uuid);
    fooComponent = null;
  }

  if (barComponent) {
    removeComponent(barComponent.uuid);
    barComponent = null;
  }
});

test('Component should be registered before usage', () => {
  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
  `;

  let tree = parse(document.body);

  expect(() => {
    compile(tree);
  }).toThrow();
});

test('Component props should be declare before use', () => {
  fooUnregister = register('Foo', class Foo extends Component {});

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" status="1"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  expect(fooComponent.props.hasOwnProperty('status')).toBe(false);
});

test('dom prop string value should be quotes surrounded', () => {
  fooUnregister = register('Foo', class Foo extends Component {
    getProps() {
      return {
        name: ''
      };
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" name="'foo'"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  expect(fooComponent.props.name).toBe('foo');
});

test('override getProps and getData methods will override props/data map instead extending it', () => {
  class Foo extends Component {
    getData() {
      return {
        status: 'ok'
      };
    }
    getProps() {
      return {
        name: ''
      };
    }
  }

  fooUnregister = register('Foo', Foo);

  barUnregister = register('Bar', class Bar extends Foo {
    getData() {
      return {};
    }

    getProps() {
      return {};
    }
  });

  document.body.innerHTML = `
    <div id="bar" x-component="Bar" name="'foo'"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#bar');

  compile(tree);

  barComponent = getComponent(node.getAttribute('x-component-id'));

  expect(barComponent.props.name).toBeUndefined();
  expect(barComponent.data.status).toBeUndefined();
});

test('setIn method should work', () => {
  class Foo extends Component {
    getData() {
      return {
        status: {
          detail: {
            real: 'foo'
          }
        }
      };
    }
    getProps() {
      return {
        bar: {}
      };
    }
  }

  fooUnregister = register('Foo', Foo);

  let json = JSON.stringify({
    list: [{
      id: 123,
      name: 'bar123'
    }, {
      id: 456,
      name: 'bar456'
    }]
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" bar='${json}'></div>
  `;

  let dataMock = jest.fn(),
      propsMock = jest.fn();

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  fooComponent.addWatcher('props.bar', propsMock);
  fooComponent.addWatcher('data.status', dataMock);

  fooComponent.setIn('props.bar.list', list => list.filter(
    item => item.name === 'bar123'
  ));

  expect(propsMock).toHaveBeenCalledTimes(1);
  expect(fooComponent.props.bar.list.length).toBe(1);
  expect(fooComponent.props.bar.list[0].id).toBe(123);
  expect(propsMock).toHaveBeenCalledTimes(1);

  fooComponent.setIn('data.status.detail.real', 'bar');

  expect(fooComponent.data.status.detail.real).toBe('bar');
  expect(dataMock).toHaveBeenCalledTimes(1);
});

test('setting ref attr will set reference to parent refs property', () => {
  class Foo extends Component {}
  class Bar extends Component {}

  fooUnregister = register('Foo', Foo);
  barUnregister = register('Bar', Bar);

  document.body.innerHTML = `
    <div id="foo" x-component="Foo">
      <div id="bar" ref="bar" x-component="Bar"></div>
    </div>
  `;

  compile(parse(document.body));

  let nodeFoo = document.body.querySelector('#foo'),
      nodeBar = document.body.querySelector('#bar');

  fooComponent = getComponent(nodeFoo.getAttribute('x-component-id'));
  barComponent = getComponent(nodeBar.getAttribute('x-component-id'));

  expect(Object.keys(fooComponent.refs).length).toBe(1);
  expect(fooComponent.refs.bar).toBe(barComponent);
  expect(barComponent.ref).toBe('bar');
});

test('setting as attr will be allow child component access', () => {
  class Foo extends Component {
    getData() {
      return {
        name: 'onetwo'
      };
    }
  }
  class Bar extends Component {
    getProps() {
      return {
        name: ''
      };
    }
  }

  fooUnregister = register('Foo', Foo);
  barUnregister = register('Bar', Bar);

  document.body.innerHTML = `
    <div id="foo" as="foo" x-component="Foo">
      <div id="bar" x-component="Bar" name="foo.data.name"></div>
    </div>
  `;

  compile(parse(document.body));

  let nodeFoo = document.body.querySelector('#foo'),
      nodeBar = document.body.querySelector('#bar');

  fooComponent = getComponent(nodeFoo.getAttribute('x-component-id'));
  barComponent = getComponent(nodeBar.getAttribute('x-component-id'));

  expect(barComponent.props.name).toBe('onetwo');
});

test('prop name in dom with dash split should convert to camel-case name', () => {
  fooUnregister = register('Foo', class Foo extends Component {
    getProps() {
      return {
        status: '',
        fullName: ''
      };
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" status="'ok'" full-name="'onetwo'"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  expect(fooComponent.props.status).toBe('ok');
  expect(fooComponent.props.fullName).toBe('onetwo');
});

test('Component props can have default value', () => {
  fooUnregister = register('Foo', class Foo extends Component {
    getProps() {
      return {
        status: 0
      };
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  expect(fooComponent.props.status).toBe(0);
});

test('Component props default value can be overwrite', () => {
  fooUnregister = register('Foo', class Foo extends Component {
    getProps() {
      return {
        status: 0
      };
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" status="1"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  expect(fooComponent.props.status).toBe(1);
});

test('dom property can not affect component data', () => {
  fooUnregister = register('Foo', class Foo extends Component {
    getData() {
      return {
        status: 0
      };
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" status="1"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  expect(fooComponent.data.status).toBe(0);
});

test('different component data/props assignment will trigger watcher invoke', () => {
  fooUnregister = register('Foo', class Foo extends Component {
    getData() {
      return {
        status: 0
      };
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  let mockFn = jest.fn();

  fooComponent.addWatcher('data.status', mockFn);

  fooComponent.data.status = 0;

  expect(mockFn).toHaveBeenCalledTimes(0);

  fooComponent.data.status = 1;

  expect(mockFn).toHaveBeenCalledTimes(1);
});

test('same value data/props assignment can also trigger watcher invoke', () => {
  fooUnregister = register('Foo', class Foo extends Component {
    getData() {
      return {
        status: 0
      };
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  let mockFn = jest.fn();

  let unbindWatcher = fooComponent.addWatcher('data.status', mockFn);

  fooComponent.data.status = 0;

  expect(mockFn).toHaveBeenCalledTimes(0);

  unbindWatcher();

  unbindWatcher = fooComponent.addWatcher('data.status', mockFn, true);

  fooComponent.data.status = 0;

  expect(mockFn).toHaveBeenCalledTimes(1);
});

test('component parent and childs property should work', () => {
  class Foo extends Component {}
  class Bar extends Component {}

  fooUnregister = register('Foo', Foo);
  barUnregister = register('Bar', Bar);

  document.body.innerHTML = `
    <div id="foo" x-component="Foo">
      <div id="bar" x-component="Bar"></div>
    </div>
  `;

  compile(parse(document.body));

  let nodeFoo = document.body.querySelector('#foo'),
      nodeBar = document.body.querySelector('#bar');

  fooComponent = getComponent(nodeFoo.getAttribute('x-component-id'));
  barComponent = getComponent(nodeBar.getAttribute('x-component-id'));

  expect(fooComponent.childs.length).toBe(1);
  expect(fooComponent.childs[0]).toBeInstanceOf(Bar);
  expect(barComponent.parent).toBeInstanceOf(Foo);
});

test('initQueue will be executed after all sub component init', () => {
  let fooMockFn = jest.fn();
  let barMockFn = jest.fn();

  fooUnregister = register('Foo', class Foo extends Component {
    init() {
      this.onInit(() => {
        fooMockFn(Date.now());
        expect(barMockFn.mock.calls.length).toBe(1);
      });
    }
  });

  barUnregister = register('Bar', class Bar extends Component {
    init() {
      this.onInit(() => {
        barMockFn();
        expect(fooMockFn.mock.calls.length).toBe(0);
      });
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo">
      <div id="bar" x-component="Bar"></div>
    </div>
  `;

  compile(parse(document.body));

  expect(fooMockFn.mock.calls.length).toBe(1);
  expect(barMockFn.mock.calls.length).toBe(1);
});

test('destroy should work', () => {
  let fooMockFn = jest.fn();

  fooUnregister = register('Foo', class Foo extends Component {
    init() {
      this.onDestroy(() => {
        fooMockFn();
      });
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
  `;

  compile(parse(document.body));

  let uuid = document.querySelector('#foo').getAttribute('x-component-id');

  fooComponent = getComponent(uuid);

  fooComponent.destroy();
  fooComponent = null;

  expect(fooMockFn).toHaveBeenCalled();
  expect(getComponent(uuid)).toBeUndefined();
});


test('component destroy should work for component tree', () => {
  let fooMockFn = jest.fn();
  let barMockFn = jest.fn();

  fooUnregister = register('Foo', class Foo extends Component {
    init() {
      this.onDestroy(() => {
        fooMockFn(Date.now());
        expect(barMockFn).not.toHaveBeenCalled();
      });
    }
  });

  barUnregister = register('Bar', class Bar extends Component {
    init() {
      this.onDestroy(() => {
        barMockFn();
        expect(fooMockFn).toHaveBeenCalled();
      });
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo">
      <div id="bar" x-component="Bar"></div>
    </div>
  `;

  compile(parse(document.body));

  let uuidFoo = document.querySelector('#foo').getAttribute('x-component-id'),
      uuidBar = document.querySelector('#bar').getAttribute('x-component-id');

  fooComponent = getComponent(uuidFoo);
  barComponent = getComponent(uuidBar);

  fooComponent.destroy();

  expect(barComponent.parent).toBeNull();
  expect(fooComponent.childs.length).toBe(0);
  expect(getComponent(uuidBar)).toBeUndefined();

  fooComponent = barComponent = null;
});

test('destroy child component should also work well', () => {
  let fooMockFn = jest.fn();
  let barMockFn = jest.fn();

  fooUnregister = register('Foo', class Foo extends Component {
    init() {
      this.onDestroy(() => {
        fooMockFn(Date.now());
      });
    }
  });

  barUnregister = register('Bar', class Bar extends Component {
    init() {
      this.onDestroy(() => {
        barMockFn();
      });
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo">
      <div id="bar" ref="bar" x-component="Bar"></div>
    </div>
  `;

  compile(parse(document.body));

  let uuidFoo = document.querySelector('#foo').getAttribute('x-component-id'),
      uuidBar = document.querySelector('#bar').getAttribute('x-component-id');

  fooComponent = getComponent(uuidFoo);
  barComponent = getComponent(uuidBar);

  expect(fooComponent.refs.bar).toBe(barComponent);
  expect(fooComponent.childs.length).toBe(1);

  barComponent.destroy();

  expect(fooComponent.refs.bar).toBeUndefined();
  expect(fooComponent.childs.length).toBe(0);

  barComponent = null;
});

test('component watcher should work', () => {
  let fooMockFn = jest.fn();

  fooUnregister = register('Foo', class Foo extends Component {
    getData() {
      return {
        status: 0
      };
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  let unbind = fooComponent.addWatcher('data.status', fooMockFn);
  fooComponent.data.status = 1;

  expect(fooComponent.watchers.length).toBe(1);
  expect(fooMockFn).toHaveBeenCalledTimes(1);

  unbind();

  fooComponent.data.status = 1;

  expect(fooComponent.watchers.length).toBe(0);
  expect(fooMockFn).toHaveBeenCalledTimes(1);
});


test('component watcher should work with array', () => {
  let fooMockFn = jest.fn();

  fooUnregister = register('Foo', class Foo extends Component {
    getData() {
      return {
        status: []
      };
    }
  });

  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
  `;

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  fooComponent.addWatcher('data.status', fooMockFn);

  fooComponent.data.status.push(1);

  expect(fooMockFn).toHaveBeenCalledTimes(1);
});

