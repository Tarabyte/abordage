Abordage [![Build Status](https://travis-ci.org/Tarabyte/abordage.svg?branch=master)](https://travis-ci.org/Tarabyte/abordage.svg?branch=master)
========

Model generator for sailsjs and some clientside framework I'm about to choose.

Choices are:

- Backbone
- CanJS
- and Plain Old Javascript Objects...

Example
=======
The module should provide some cool configurable object to set model metadata. For example, attributes, validation rules, computed properties, lookup methods etc.

```javascript
//shared/models/user.js
var User = require('abordage')('user');

User.string('firstName').required()
    .string('lastName').required()
    .string('password').length(6, 10)
    .string('passwordConfirmation').equalsTo('password')
    .computed('fullName').get(function() {
        return this.firstName + ' ' + this.lastName;
    }).set(function(fullName) {
        fullName = fullName.split(' ');
        this.firstName = fullName[0];
        this.lastName = fullName[1];
    });
    
//sails/models/user.js
module.exports = require('../shared/models/user.js').toSails();

```
