// src/StringSchema.js

class StringSchema {
  constructor() {
    this.checks = [];
  }

  isValid(value) {
    if (typeof value !== 'string') return false;
    return this.checks.every(check => check(value));
  }

  hasSpaces() {
    this.checks.push(value => value.includes(' '));
    return this;
  }
}

export default StringSchema;
src/FunctionSchema.js
javascript
Копировать код
// src/FunctionSchema.js

class FunctionSchema {
  constructor() {
    this.checks = [];
    this.context = null;
    this.args = [];
    this.expectedValue = undefined;
  }

  isValid(value) {
    if (typeof value !== 'function') return false;
    if (this.context !== null) {
      value = value.bind(this.context);
    }
    const result = value(...this.args);
    return this.checks.every(check => check(result));
  }

  callWith(context) {
    this.context = context;
    return this;
  }

  expect(expectedValue) {
    this.expectedValue = expectedValue;
    this.checks.push(value => value === this.expectedValue);
    return this;
  }

  arguments(args) {
    this.args = args;
    return this;
  }
}

export default FunctionSchema;
src/ObjectSchema.js
javascript
Копировать код
// src/ObjectSchema.js

class ObjectSchema {
  constructor() {
    this.schema = {};
  }

  shape(schema) {
    this.schema = schema;
    return this;
  }

  isValid(obj) {
    return this.validateObject(obj, this.schema);
  }

  validateObject(obj, schema) {
    for (const key in schema) {
      const value = obj[key];
      const validator = schema[key];
      if (validator instanceof ObjectSchema) {
        if (!validator.isValid(value)) return false;
      } else if (typeof validator === 'object' && !(validator instanceof StringSchema || validator instanceof FunctionSchema)) {
        if (!this.validateObject(value, validator)) return false;
      } else {
        if (!validator.isValid(value)) return false;
      }
    }
    return true;
  }
}

export default ObjectSchema;
src/Validator.js
javascript
Копировать код
// src/Validator.js

import StringSchema from './StringSchema.js';
import FunctionSchema from './FunctionSchema.js';
import ObjectSchema from './ObjectSchema.js';

class Validator {
  string() {
    return new StringSchema();
  }

  function() {
    return new FunctionSchema();
  }

  object() {
    return new ObjectSchema();
  }
}

export default Validator;
src/index.js
javascript
Копировать код
// src/index.js
import Validator from './Validator.js';

export default Validator;
Example usage
javascript
Копировать код
// example.js
import Validator from './src/index.js';

const v = new Validator();

const schema = v.object().shape({
  string: v.string(),
  obj: {
    func: v.function(),
    innerObj: {
      string: v.string().hasSpaces(),
      deepestObj: {
        func: v.function().arguments(['hello']).expect('hell'),
      }
    }
  }
});

console.log(schema.isValid({
  string: '54',
  obj: {
    func: () => {},
    innerObj: {
      string: 'he he he',
      deepestObj: {
        func: (arg) => arg.slice(0, arg.length - 1).join('')
      }
    }
  }
})); // true
