import {Component} from '../component';
import {parse, compile} from '../compile';
import {
  register,
  getInstance,
  hasComponent,
  findComponentByLabel,
  getComponent,
  removeComponent
} from '../factory';

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

test('register should work', () => {
  fooUnregister = register('Foo', class Foo extends Component {});

  expect(hasComponent('Foo')).toBe(true);
});

test('register should add label to target prototype', () => {
  class Foo extends Component {}
  fooUnregister = register('Foo', Foo);

  expect(Foo.prototype.label).toBe('Foo');
});

test('register can be remove by the function it return', () => {
  fooUnregister = register('Foo', class Foo extends Component {});

  expect(hasComponent('Foo')).toBe(true);

  fooUnregister();

  expect(hasComponent('Foo')).toBe(false);
});

test('register can not be overwrite', () => {
  fooUnregister = register('Foo', class Foo extends Component {});

  expect(register('Foo', class Bar extends Component {})).toBeUndefined();
});

test('register can not be overwrite', () => {
  fooUnregister = register('Foo', class Foo extends Component {});

  expect(register('Foo', class Bar extends Component {})).toBeUndefined();
});

test('getInstance should throw', () => {
  document.body.innerHTML = `
    <div id="Foo" x-component="Foo"></div>
  `;

  let node = document.querySelector('#foo');

  expect(() => {
    getInstance('Foo', node);
  }).toThrow();
});

test('getInstance should work', () => {
  document.body.innerHTML = `
    <div id="foo"></div>
  `
  class Foo extends Component {}

  fooUnregister = register('Foo', Foo);

  fooComponent = getInstance('Foo', document.querySelector('#foo'));

  expect(fooComponent).toBeInstanceOf(Foo);
});

test('findComponentByLabel should work', () => {
  document.body.innerHTML = `
    <div id="foo"></div>
  `;

  class Foo extends Component {}

  fooUnregister = register('Foo', Foo);

  fooComponent = getInstance('Foo', document.querySelector('#foo'));

  expect(findComponentByLabel('Foo').length).toBe(1);
  expect(findComponentByLabel('Foo')[0]).toBe(fooComponent);
});

test('getComponent should work', () => {
  document.body.innerHTML = `
    <div id="foo"></div>
  `;

  class Foo extends Component {}

  fooUnregister = register('Foo', Foo);

  fooComponent = getInstance('Foo', document.querySelector('#foo'));

  expect(getComponent(fooComponent.uuid)).toBe(fooComponent);
});

test('removeComponent should work', () => {
  document.body.innerHTML = `
    <div id="foo"></div>
  `;

  class Foo extends Component {}

  fooUnregister = register('Foo', Foo);

  fooComponent = getInstance('Foo', document.querySelector('#foo'));

  expect(findComponentByLabel('Foo').length).toBe(1);
  expect(findComponentByLabel('Foo')[0]).toBe(fooComponent);

  removeComponent(fooComponent.uuid);
  fooComponent = null;
  expect(findComponentByLabel('Foo').length).toBe(0);
});

