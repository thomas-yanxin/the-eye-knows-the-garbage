Preceptor-Core
==============

Shared library for the preceptor test runner and aggregator.


[![Build Status](https://img.shields.io/travis/yahoo/preceptor-core.svg)](http://travis-ci.org/yahoo/preceptor-core)
[![Coveralls Coverage](https://img.shields.io/coveralls/yahoo/preceptor-core.svg)](https://coveralls.io/r/yahoo/preceptor-core)
[![Code Climate Grade](https://img.shields.io/codeclimate/github/yahoo/preceptor-core.svg)](https://codeclimate.com/github/yahoo/preceptor-core)

[![NPM version](https://badge.fury.io/js/preceptor-core.svg)](https://www.npmjs.com/package/preceptor-core)
[![NPM License](https://img.shields.io/npm/l/preceptor-core.svg)](https://www.npmjs.com/package/preceptor-core)

[![NPM](https://nodei.co/npm/preceptor-core.png?downloads=true&stars=true)](https://www.npmjs.com/package/preceptor-core)
[![NPM](https://nodei.co/npm-dl/preceptor-core.png?months=3&height=2)](https://www.npmjs.com/package/preceptor-core)

[![Coverage Report](https://img.shields.io/badge/Coverage_Report-Available-blue.svg)](http://yahoo.github.io/preceptor-core/coverage/lcov-report/)
[![API Documentation](https://img.shields.io/badge/API_Documentation-Available-blue.svg)](http://yahoo.github.io/preceptor-core/docs/)

[![Gitter Support](https://img.shields.io/badge/Support-Gitter_IM-yellow.svg)](https://gitter.im/preceptorjs/support)



**Table of Contents**
* [Installation](#installation)
* [Usage](#usage)
    * [Base-Object](#base-object)
        * [Static Properties](#static-properties---defined-on-the-constructor)
        * [Dynamic Properties](#dynamic-properties---defined-on-this-or-prototype)
    * [utils](#utils)
        * [extendApply](#extendapply)
        * [deepExtend](#deepextend)
        * [combine](#combine)
        * [superWrapper](#superwrapper)
    * [log](#log)
* [API-Documentation](#api-documentation)
* [Tests](#tests)
* [Third-party libraries](#third-party-libraries)
* [License](#license)


##Installation

Install this module with the following command:
```shell
npm install preceptor-core
```

Add the module to your ```package.json``` dependencies:
```shell
npm install --save preceptor-core
```
Add the module to your ```package.json``` dev-dependencies:
```shell
npm install --save-dev preceptor-core
```

Require the module in your source-code:
```javascript
var core = require('preceptor-core');
```

##Usage

The module exposes two objects:

* ```Base``` - A base object that every preceptor object should inherit from. See below for more information.
* ```utils``` - Frequently used utility functions
* ```log``` - Centralized log and logger management


###Base-Object

The Base object inherits all features of the EventEmitter and exposes a couple static and dynamic properties:


####Static Properties - Defined on the constructor
#####```TYPE``` {string}
Describes the type of the object. The default value is "Base".
Overwrite this value in sub-objects to help in debugging as the will appear as descriptor of an object.

#####```extend``` {function}
Extends the current object by creating a new constructor and inheriting all static and dynamic properties. Every function will be wrapped in a ```__super``` wrapper that will make the ```__super``` function available in every method call. (See below for more information!)

*Parameters:*
* ```constructFn``` {function} - The function to be used as constructor. This parameter is optional. When no function is given, then a generic function is used.
* ```prototypeProperties``` {object} - Properties that should be assigned the the ```prototype``` property of the constructor. This parameter is required.
* ```staticProperties``` {object} - Properties that should be assigned to the constructor. This parameter is optional.

#####```toString``` {function}
Describes the object. By default, the format is: ```[TYPE]``` where by ```TYPE``` is the value assigned to the constructor.

#####```__parent``` {object}
This is a reference to the parent prototype.



####Dynamic Properties - Defined on ```this``` or ```prototype```
#####```uniqueId``` {string}
Every instance of an object gets a unique-id assigned.

#####```NAME``` {string}
Describes the instance. The default value is "unnamed".
Overwrite this value in instances to help to help identifying instances during run-time.

#####```toString``` {function}
Describes the instance. By default, the format is: ```[TYPE::NAME(uniqueId)]``` where by ```TYPE``` is the value assigned to the constructor, and ```NAME``` is the value assigned to the instance.

#####```__super``` {function}
Accessor function to access the parent implementation of a method. Should there be no parent method, then this method is an empty function.


####Example

```javascript
var Base = require('preceptor-core').Base;

/**
 * @class Pet
 * @extends Base
 * @properties {string} _type Type of pet
 * @properties {string} _name Name of pet
 */
var Pet = Base.extend(

    /**
     * Constructor of Pet
     *
     * @constructor
     * @param {string} type Type of pet
     * @param {string} name Name of pet
     */
     function (type, name) {

        // Call the parent constructor
        this.__super();

        // Save property on the current object
        this._type = type;
        this._name = name;

        // Add instance descriptor
        this.NAME = type + ':' + name;

        // Define here all dynamic values, values that should not be shared between multiple instances of "Pet".
    },

    /** @lends Pet.prototype */
    { // Properties assigned to the prototype of "Pet"

        /**
         * Make sound of pet
         *
         * @param {string} sound
         * @method makeSound
         */
        makeSound: function (sound) {
            this.emit('sound', this.getName(), sound);

            console.log(this.getName() + " says: " + sound);
        },

        /**
         * Gets the name of the pet
         *
         * @return {string}
         */
        getName: function () {
            return this._name;
        }

        // ...
        // Any other functions and values assigned to the prototype.

        // These properties can be accessed after instantiation with ```petInstance.makeSound()```.

        // You can also define here all values that should be available in instances of "Pet" that should be shared
        // across all object instances.
    },

    /** @lends Pet */
    { // Properties assigned to the constructor of "Pet"

        /**
         * @type {string}
         */
        TYPE: "Pet"

        // ...
        // Any other constructor functions and values.

        // These properties can be accessed with ```Pet.TYPE```.
    }
);

/**
 * @class Cat
 * @extends Pet
 */
var Cat = Pet.extend(

    /**
     * Constructor of Cat
     *
     * @constructor
     * @param {string} name Name of pet
     */
    function (name) {
        this.__super("cat", name);
    },

    /** @lends Cat.prototype */
    { // Properties assigned to the prototype of "Cat"
        /**
         * Make sound of cat
         *
         * @method makeSound
         */
        makeSound: function () {
            this.__super("miau");
        }
    },

    /** @lends Cat */
    { // Properties assigned to the constructor of "Cat"
        /**
         * @type {string}
         */
        TYPE: "Cat"
    }
);

/**
 * @class Dog
 * @extends Pet
 */
var Dog = Pet.extend(

    /**
     * Constructor of Dog
     *
     * @constructor
     * @param {string} name Name of pet
     */
        function (name) {
        this.__super("dog", name);
    },

    /** @lends Dog.prototype */
    { // Properties assigned to the prototype of "Dog"
        /**
         * Make sound of cat
         *
         * @method makeSound
         */
        makeSound: function () {
            this.__super("barf");
        }
    },

    /** @lends Dog */
    { // Properties assigned to the constructor of "Dog"
        /**
         * @type {string}
         */
        TYPE: "Dog"
    }
);

var tomTheCat = new Cat("Tom");
var zeusTheDog = new Dog("Zeus");

// Listen to events
tomTheCat.on('sound', function (name, sound) {
    console.log("The cat said " + sound);
});
zeusTheDog.on('sound', function (name, sound) {
    console.log("The dog said " + sound);
});

// Make sounds
tomTheCat.makeSound();
zeusTheDog.makeSound();

// Print instance identifier
console.log("Cat object: " + Cat.toString());
console.log("Cat instance", tomTheCat.toString());

console.log("Dog object: " + Dog.toString());
console.log("Dog instance", zeusTheDog.toString());
```

*Output:*
```shell
The cat said miau
Tom says: miau
The dog said barf
Zeus says: barf
Cat object: [Cat]
Cat instance [Cat::cat:Tom(instance1)]
Dog object: [Dog]
Dog instance [Dog::dog:Zeus(instance2)]
```

---

##utils

Utils exposes the following utility functions:

###extendApply
This extend-function works like any other extend function, except it calls a function on each value and uses the result as value of a property.

Parameters:
* ```obj``` {object} - Destination object to merge values into
* ```objects``` {object[]} - Array of objects that should be copied into the ```obj```.
* ```fn``` {function} - Function that returns a value that should be used in place of the original value. Every property in the objects of the ```objects``` parameter will call this function. This parameter is optional. Should no function be supplied, then the values will be used as-is.

Apply-Function Parameters:
* ```srcValue``` {*} - The original value of a property that should be copied to the ```obj```.
* ```dstValue``` {*} - Current value on the ```obj``` object.
* ```options``` {object} - Additional options
* ```options.key``` {string} - Name of the property that should be copied.
* ```options.currentObject``` {object} _ The object currently processed from the ```objects``` list.
* ```options.objectIndex``` {int} - The index of ```currentObject``` in the ```objects``` list.
* ```options.valueIndex``` {int} - The index of the current property in ```currentObject```.

####Example - Simple extend
```javascript
var utils = require('../../').utils;
var result;

var obj1 = {
    "name": "obj1",
    "entry1": 23,
    "entry2": 46
};

var obj2 = {
    "name": "obj2",
    "entry2": 78,
    "entry3": 2
};

var srcObj = {
    "entry0": 0
};


console.log("Simple extend:");
utils.extendApply(srcObj, [obj1, obj2]);
console.log(srcObj);
```

Output:
```shell
Simple extend:
{ entry0: 0, name: 'obj2', entry1: 23, entry2: 78, entry3: 2 }
```

####Example - Extend with apply function
```javascript
console.log("Extend with function:");
result = utils.extendApply({}, [obj1, obj2], function (value) {
    return value + 1;
});
console.log(result);
```

Output:
```shell
Extend with function:
{ name: 'obj21', entry1: 24, entry2: 79, entry3: 3 }
```

####Example - Logging extend apply calls
```javascript
console.log("Extend logging:");
result = utils.extendApply({}, [obj1, obj2], function (srcValue, dstValue, options) {

    console.log("The value '" + srcValue + "' with key '" + options.key + "' from object with name '" +
        options.currentObject.name +  "' was '" + dstValue + "' in the original object");

    return options.objectIndex + ':' + options.valueIndex;
});
console.log(result);
```

Output:
```shell
Extend logging:
The value 'obj1' with key 'name' from object with name 'obj1' was 'undefined' in the original object
The value '23' with key 'entry1' from object with name 'obj1' was 'undefined' in the original object
The value '46' with key 'entry2' from object with name 'obj1' was 'undefined' in the original object
The value 'obj2' with key 'name' from object with name 'obj2' was '0:0' in the original object
The value '78' with key 'entry2' from object with name 'obj2' was '0:2' in the original object
The value '2' with key 'entry3' from object with name 'obj2' was 'undefined' in the original object
{ name: '1:0', entry1: '0:1', entry2: '1:1', entry3: '1:2' }
```
___
###deepExtend
Extends an object with properties that will be recursively copied.

Parameters:
* ```obj``` {object} - Destination object to merge values into
* ```objects``` {object[]} - Array of objects that should be copied into the ```obj```.
* ```options``` {object} - Additional options.
* ```options.replace``` {boolean} - If set, then array entries in destination will be replaced instead of values appended to the destination list.

####Example: Simple usage
```javascript
var utils = require('preceptor-core').utils;

var obj1 = {
    "entry1": [1, 2, 3],
    "entry2": [5, 6],
    "entry4": 23,
    "entry5": {
        "entry6": 22,
        "entry7": 24,
        "entry8": {
            "entry9": 9
        }
    }
};

var obj2 = {
    "entry2": [8, 9],
    "entry3": 2,
    "entry5": {
        "entry7": 21,
        "entry10": 11
    }
};

var srcObj = {
    "entry0": 0,
    "entry2": [7],
    "entry5": {
        "entry0": "zero"
    }
};

utils.deepExtend(srcObj, [obj1, obj2]);
console.log(srcObj);
```

Output:
```shell
{ entry0: 0,
  entry2: [ 7, 5, 6, 8, 9 ],
  entry5:
   { entry0: 'zero',
     entry6: 22,
     entry7: 21,
     entry8: { entry9: 9 },
     entry10: 11 },
  entry1: [ 1, 2, 3 ],
  entry4: 23,
  entry3: 2 }
```

####Example: Use with replace
```javascript
var utils = require('preceptor-core').utils;
var result;

result = utils.deepExtend({}, [obj1, obj2], { replace: true });
console.log(result);
```

Output:
```shell
{ entry1: [ 1, 2, 3 ],
    entry2: [ 8, 9 ],
    entry4: 23,
    entry5: { entry6: 22, entry7: 21, entry8: { entry9: 9 }, entry10: 11 },
    entry3: 2 }
```
___
###combine
Combines multiple strings by applying a glue-string between them if they are not already available there. This is very similar to the ```path.join``` method, but it doesn't care what the structure of the rest or the string is.

This method is used with the ```extendApply``` function to give object methods the possibility to call the parent method with ```__super()```.

Parameters:
* ```glue``` {string} - Glue string
* ```str, ...``` {string} - Strings that should be glued.

####Example: Simple usage
```javascript
var utils = require('preceptor-core').utils;

console.log(utils.combine('-', '', '', ''));
// Output: -

console.log(utils.combine('-', 'test1', 'test2'));
// Output: test1-test2

console.log(utils.combine('-', '-test1-', '-test2-'));
// Output: -test1-test2-

console.log(utils.combine('-', 'test1-', 'test2'));
// Output: test1-test2

console.log(utils.combine('-', 'test1', '-test2'));
// Output: test1-test2
```
___

###superWrapper
Function that creates a new function that sets the ```__super``` property up to be called from within a function body.

Parameters:
* ```currentItem``` {*} - Value that should be used
* ```previousItem``` {*} - Previous item value

####Example: Simple usage
```javascript
var utils = require('preceptor-core').utils;

var newFn = utils.superWrapper(function (value) {
    this.__super(123, value);
    console.log("Method test in object 2 and value " + value);
}, function (value1, value2) {
    console.log("Method test in object 1 and values " + value1 + " and " + value2);
});
newFn(88);
```

Output:
```shell
Method test in object 1 and values 123 and 88
Method test in object 2 and value 88
```

####Example: Usage with extendApply
```javascript
var utils = require('preceptor-core').utils;

var obj1 = {
    test: function (value1, value2) {
        console.log("Method test in object 1 and values " + value1 + " and " + value2);
    }
};

var obj2 = {
    test: function (value) {
        this.__super(123, value);
        console.log("Method test in object 2 and value " + value);
    }
};

var result = utils.extendApply(obj1, [obj2], utils.superWrapper);
result.test(88);
```

Output:
```shell
Method test in object 1 and values 123 and 88
Method test in object 2 and value 88
```
___
###require
This function does the same thing as the original require function to load modules. However, this function will give you the option to use default values when the module cannot be found.

Parameters:
* ```module``` {string} - Module name or path
* ```defaultValue``` {*} - Default value if the module cannot be found

####Example: Simple usage
```javascript
var utils = require('preceptor-core').utils;

var configuration = utils.require('config', {});
```

---

##log

The ```log``` object exposes a centralize logging interface including buffering for deferred logging.

This object works with two different type of objects:
* ```log``` - The singleton managing multiple loggers
* ```logger``` - Instance for a specific logger

A new logger can be created by calling the ```getLogger``` method on the ```log``` object:
```javascript
var logger = log.getLogger(__filename);
```
For each logger, a filename/identifier can be supplied that will be exported with each log trigger.

When having a logger, then log entries can be triggered, including objects:
```javascript
logger.debug('Debug message: ', { message: 'something something' });
```

There are a couple of log-types available:
* ```logger.trace``` - Trace log entries that could give much more detail on steps through the code
* ```logger.debug``` - Debug values that might be helpful for debugging problems without being too overwhelming like ```logger.trace```
* ```logger.info``` - Info messages that is probably helpful for a user to understand what decisions were made
* ```logger.warn``` - Warning message for missing configuration or other behavior that might be unexpected to the user
* ```logger.error``` - Errors during execution

These log-types may be filtered depending on the log-level set. The log-levels can be requested and set with the following values:
```javascript
log.setLevel('DEBUG');

log.getLevel() // -> DEBUG
```
The default value is ```INFO```.

Following log-levels are available:
* ```ALL``` - All log-types are used which is an alias for ```TRACE```.
* ```TRACE``` - Trace messages and all messages with the log-type below will be used.
* ```DEBUG``` - Trace messages will be filtered
* ```INFO``` - Trace and Debug messages will be filtered
* ```WARN``` - Info and above messages will be filtered
* ```ERROR``` - Only error messages will be used

All loggers are by default centralized buffered to defer log-messages until it is known what level of output the user wants.
That means that the non-buffering mode needs to be activated. This can be done by calling only once:
```javascript
log.flush();
```

---

##API-Documentation

Generate the documentation with following command:
```shell
npm run docs
```
The documentation will be generated in the ```docs``` folder of the module root.

##Tests

Run the tests with the following command:
```shell
npm run test
```
The code-coverage will be written to the ```coverage``` folder in the module root.

##Third-party libraries

The following third-party libraries are used by this module:

###Dependencies
* underscore: http://underscorejs.org
* log4js: https://github.com/stritti/log4js

###Dev-Dependencies
* chai: http://chaijs.com
* codeclimate-test-reporter: https://github.com/codeclimate/javascript-test-reporter
* coveralls: https://github.com/cainus/node-coveralls
* istanbul: https://github.com/gotwarlost/istanbul
* mocha: https://github.com/visionmedia/mocha
* sinon: http://sinonjs.org
* sinon-chai: https://github.com/domenic/sinon-chai
* yuidocjs: https://github.com/yui/yuidoc

##License

The MIT License

Copyright 2014-2015 Yahoo Inc.
