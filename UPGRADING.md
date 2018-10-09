## Upgrading from < 1.0
Now that this module is utilizing ES6 classes in place of storing methods and properties in a JSON object, the way on how to import and start using the library has slightly changed. However, all the other methods still follow the same syntax and logic. Additionally, the minimum version for node.js is 6.0 and above, due to the recent changes.

### Old Syntax
```javascript
const vex4pi = require('vex4pi');

vex4pi.init();
```

### New Syntax
```javascript
const { Vex4Pi } = require('vex4pi');

let robot = new Vex4Pi();
robot.init();
```