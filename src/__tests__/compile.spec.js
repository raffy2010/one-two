import {parse, compile} from '../compile';
import {register, getComponent, removeComponent} from '../factory';
import {Component} from '../component';

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

test('parse should return an empty array if no relevant-attr match', () => {
  document.body.innerHTML = `
    <div id="foo"></div>
  `;

  let tree = parse(document.body);

  expect(tree.length).toBe(0);
});


test('parse should recognize x-component', () => {
  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
  `;

  let tree = parse(document.body);
  expect(tree[0].node.id).toBe('foo');
});

test('parse multiple child Nodes is also allow', () => {
  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
    <div id="bar" x-component="Bar"></div>
  `;

  let tree = parse(document.body);

  expect(tree.length).toBe(2);
  expect(tree[0].node.id).toBe('foo');
  expect(tree[1].node.id).toBe('bar');
});

test('parse an array of Dom Nodes is also allow', () => {
  document.body.innerHTML = `
    <div id="foo" x-component="Foo"></div>
    <div id="bar" x-component="Bar"></div>
  `;

  let tree = parse(Array.from(document.body.childNodes));

  expect(tree.length).toBe(2);
  expect(tree[0].node.id).toBe('foo');
  expect(tree[1].node.id).toBe('bar');
});

test('parse should recognize x-html attr', () => {
  document.body.innerHTML = `
    <div x-component="Foo" x-html="'hello world'">
      hello world
    </div>
  `;

  let tree = parse(document.body);
  expect(tree[0].attrs.length).toBe(1);
});

test('parse should recognize x-class attr', () => {
  document.body.innerHTML = `
    <div x-component="Foo" x-class="foo:bar"></div>
  `;

  let tree = parse(document.body);

  expect(tree[0].attrs.length).toBe(1);
});

test('parse should recognize x-style attr', () => {
  document.body.innerHTML = `
    <div x-component="Foo" x-style="color:bar"></div>
  `;

  let tree = parse(document.body);

  expect(tree[0].attrs.length).toBe(1);
});

test('parse should recognize x-update attr', () => {
  document.body.innerHTML = `
    <div x-component="Foo" x-update="'empty'"></div>
  `;

  let tree = parse(document.body);

  expect(tree[0].attrs.length).toBe(1);
});

test('parse should recognize x-append attr', () => {
  document.body.innerHTML = `
    <div x-component="Foo" x-append="'append it'"></div>
  `;

  let tree = parse(document.body);
  expect(tree[0].attrs.length).toBe(1);
});

test('attr should have a context component, or it will be ignored', () => {
  document.body.innerHTML = `
    <div x-append="'append it'"></div>
  `;

  let tree = parse(document.body);

  expect(tree.length).toBe(0);
});

test('parse should recognize child component', () => {
  document.body.innerHTML = `
    <div id="foo" x-component="Foo">
      <div id="bar" x-component="Bar"></div>
    </div>
  `;

  let tree = parse(document.body);

  expect(tree[0].node.id).toBe('foo');
  expect(tree[0].childs.length).toBe(1);
  expect(tree[0].childs[0].node.id).toBe('bar');
});

test('attr should belongs to child component if they are on the same node', () => {
  document.body.innerHTML = `
    <div id="foo" x-component="Foo">
      <div id="bar" x-component="Bar" x-class="bar:true"></div>
    </div>
  `;

  let tree = parse(document.body);

  expect(tree[0].attrs.length).toBe(0);
  expect(tree[0].childs[0].attrs.length).toBe(1);
});

test('attrs structure should be correct', () => {
  document.body.innerHTML = `
    <div id="foo" x-component="Foo" x-html="'hello onetwo'"></div>
  `;

  let tree = parse(document.body);

  expect(tree[0].attrs[0].attr.name).toBe('x-html');
  expect(tree[0].attrs[0].attr.value).toBe("'hello onetwo'");
});


test('should add attr x-component-id to component node', () => {
  class Foo extends Component {}

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" x-html="this.props.greet"></div>
  `;

  fooUnregister = register('Foo', Foo);

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  expect(node.getAttribute('x-component-id')).toBeNull();

  compile(tree);

  expect(node.getAttribute('x-component-id')).not.toBeNull();
});

test('should add watchers to component', () => {
  class Foo extends Component {}

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" x-html="this.props.greet"></div>
  `;

  fooUnregister = register('Foo', Foo);

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  expect(fooComponent.watchers.length).toBe(1);
});

test('x-html should update dom content automatically', () => {
  class Foo extends Component {
    getData() {
      return {
        greet: ''
      };
    }
  }

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" x-html="this.data.greet"></div>
  `;

  fooUnregister = register('Foo', Foo);

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  expect(node.innerHTML).toBe('');

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  fooComponent.data.greet = 'onetwo';

  expect(node.innerHTML).toBe('onetwo');
});


test('x-class should update dom class automatically', () => {
  class Foo extends Component {
    getData() {
      return {
        error: false
      };
    }
  }

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" x-class="red:this.data.error"></div>
  `;

  fooUnregister = register('Foo', Foo);

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  expect(node.classList.contains('red')).toBe(false);

  compile(tree);

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  fooComponent.data.error = true;

  expect(node.classList.contains('red')).toBe(true);
});

test('reparse is also allow after compile', () => {
  class Foo extends Component {}
  class Bar extends Component {}
  class FooBar extends Component {}

  fooUnregister = register('Foo', Foo);
  barUnregister = register('Bar', Bar);
  let foobarUnregister = register('FooBar', FooBar);

  document.body.innerHTML = `
    <div id="foo" x-component="Foo">
      <div id="bar" x-component="Bar"></div>
    </div>
  `;

  let tree = parse(document.body);

  compile(tree);

  let foo = document.querySelector('#foo');
  let div = document.createElement('div');

  fooComponent = getComponent(foo.getAttribute('x-component-id'));

  div.innerHTML = '<div id="foobar" x-component="FooBar"></div>';

  let newNodes = Array.from(div.childNodes);

  newNodes.forEach(node =>
    foo.appendChild(node)
  );

  let newTree = parse(newNodes, foo);

  expect(newTree[0].node.id).toBe('foo');
  expect(newTree[0].childs.length).toBe(1);
  expect(newTree[0].childs[0].node.id).toBe('foobar');

  compile(newTree);

  let foobar = document.querySelector('#foobar');

  let foobarComponent = getComponent(foobar.getAttribute('x-component-id'));

  expect(foobarComponent.parent).toBe(fooComponent);
  expect(fooComponent.childs.indexOf(foobarComponent)).toBeGreaterThan(-1);

  removeComponent(foobarComponent.uuid);
  foobarUnregister();
});

test('x-update should update the content to target dom', () => {
  class Foo extends Component {
    getData() {
      return {
        moreText: ''
      };
    }
  }

  document.body.innerHTML = `
    <div id="foo" x-component="Foo" x-update="this.data.moreText"></div>
  `;

  fooUnregister = register('Foo', Foo);

  let tree = parse(document.body),
      node = document.body.querySelector('#foo');

  compile(tree);

  expect(document.querySelector('.more-text')).toBeNull();

  fooComponent = getComponent(node.getAttribute('x-component-id'));

  fooComponent.data.moreText = '<div id="moretext1" class="more-text"></div>';

  expect(document.querySelectorAll('.more-text').length).toBe(1);
  expect(document.querySelectorAll('.more-text')[0].id).toBe('moretext1');

  fooComponent.data.moreText = '<div id="moretext2" class="more-text"></div>';

  expect(document.querySelectorAll('.more-text')[0].id).toBe('moretext2');
});

