# one-two

A simple web micro framework

It's small(4kb min+gzip) but powerful. It help you write much more declarative code,
through Component system you can make your code much reusable without pain.
You can use it with any tech stack, no Node.js environment needed, no server render
needed, just ship with your html content, parse and compile.


However, it isn't a full-feature MVVM framework. there's no render feature in it,
you should handle that by yourself no matter server render or client template.


## Installation
```sh
$ npm install one-two --save
```

## Example
```html
<html>
  <head>
    <title>Onetwo Greet Example</title>
    <script src="greet.bundle.js"></script>
  </head>
  <body>
    <div x-component="Greet">
      word: <input type="text" x-model="this.props.word">
      <p>hello, <span x-html="this.props.word"></span></p>
    </div>
  </body>
</html>
```
```js
import {
  compile,
  parse,
  Component,
  register
} from 'one-two';

class Greet extends Component {
  getProps() {
    return {
      word: ""
    };
  }
}

register('Greet', Greet);

document.addEventListener('DOMContentLoaded', () => {
  compile(parse(document.body));
});
```

## Attrs
there are nine builtin attrs to help you to build app. Almost include all features
you need, Component, DOM Event, interpolation, DOM tree update, DOM style and class update.
### x-component
declare a component, the component should be register first via register(string, class) method
the dom node will be the root node of component, this.node will point to it.
```html
<div x-component="Foo"></div>
```

### x-html
insert expression value into dom node, not support interpolation flag(like {{}}) now
```html
<div x-html="this.data.text"></div>
```

### x-model
link input value to component property, it's bidirection link
```html
<input x-model="this.data.name" type="text" />
```

### x-update
the attr replace the dom child nodes with the content generated by the expression,
after replacement it will parse the new section and compile if attr was found.
```html
<div x-update="this.renderLogs(this.data.logs)"></div>
```

### x-append
x-append is like x-update, the only difference is the dom operation, x-append append
content to that node, whereas x-update replace it
```html
<div x-append="this.data.moreText"></div>
```

### x-event
x-event can help you bind dom event handler, $event is the origin dom event inject to
the expression scope
```html
<div x-click="this.clickIt($event)"></div>
```

### x-class
x-class help you manipulate dom class, format className:expression[;className:expression]
```html
<div x-class="foo:this.data.isFoo"></div>
```

### x-style
x-class help you manipulate dom style, format style:expression[;style:expression]
```html
<div x-style="fontSize:this.data.fontSize"></div>
```

### x-show
x-show help you display dom node conditionally
```html
<div x-show="this.data.isOk"></div>
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

