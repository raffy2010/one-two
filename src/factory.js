let ComponentMap = {};

let components = [];

export function register(label, Ctor) {
  if (ComponentMap[label]) {
    return;
  }

  Ctor.prototype.label = label;

  ComponentMap[label] = {
    Ctor: Ctor,
    instances: []
  };
}

export function getInstance(label, node, parent) {
  let component = ComponentMap[label];

  if (!component) {
    throw new Error('try to initialize an unregister component');
  }

  let instance = new component.Ctor(node, parent);

  if (node) {
    node.setAttribute('x-component-id', instance.uuid);
  }

  components.push(instance);
  component.instances.push(instance);

  return instance;
}

export function hasComponent(label) {
  return ComponentMap[label] !== undefined;
}

export function findComponentByLabel(label) {
  let component = ComponentMap[label];

  return component && component.instances;
}

export function getComponent(uuid) {
  return findComponent(uuid);
}

export function removeComponent(uuid) {
  let component = findComponent(uuid),
      index = components.indexOf(component);

  if (index > -1) {
    components.splice(index, 1);
  }

  removeFromMap(component);
}

function removeFromMap(instance) {
  let componentData = ComponentMap[instance.label];

  if (!componentData) {
    return;
  }

  let index = componentData.instances.indexOf(instance);

  if (index > -1) {
    componentData.instances.splice(index, 1);
  }
}

function findComponent(uuid) {
  return components.filter((component) => component.uuid == uuid )[0];
}
