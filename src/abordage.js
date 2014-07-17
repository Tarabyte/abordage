/*jshint node:true*/
/*global console, require*/

var types = 'string|text|integer|float|date|time|datetime|boolean|binary|array|json'.split('|'),
    validators = 'empty|required|protected|notEmpty|undefined|object|json|mediumtext|text|string|alpha|alphadashed|numeric|alphanumeric|alphanumericdashed|email|url|urlish|ip|ipv4|ipv6|creditcard|uuid|uuidv3|uuidv4|int|integer|number|finite|decimal|float|falsey|truthy|null|notNull|boolean|array|binary|date|datetime|hexadecimal|hexColor|lowercase|uppercase|after|before|equals|contains|notContains|len|in|notIn|max|min|greaterThan|lessThan|minLength|maxLength|regex|notRegex'.split('|');


/**
 * @class
 * Model configurator.
 * Provides methods to configure attributes etc.
 */
function Configurator(name) {
    if(!name) {
        throw new Error('Model name is required.');
    }
    if(!(this instanceof Configurator)) {
        return new Configurator(name);    
    }
    
    this.$attrs = {};
}

/**
 * @class
 * Attribute configurator.
 * Provides methods to configure an attribute.
 */
function AttrConfigurator(name, model) {
    this.$name = name;
    this.$model = model;
    this.$validators = [];
}

/**
 * @class
 * Validator configuration object.
 */
function ValidatorConfigurator(type, options) {
    var validator = this;
    this.$type = type;
    if(options) {
        Object.keys(options).forEach(function(key) {
            validator[key] = options[key];
        });    
    }
}


var configuratorProto = Configurator.prototype,
    attrConfiguratorProto = AttrConfigurator.prototype;

/**
 * Defines an attr without type.
 * @param {string} name - Attribute name.
 * @returns {AttrConfigurator} new attribute configurator instance.
 */
configuratorProto.attr = function(name) {
    var attr;
    if(!name) {
        throw new Error('Can\'t define an attr without name.');
    }
    
    attr = this.$attrs[name];
    if(attr) {
        console.warn('Attribute with name "' + name + '" is already defined.');    
    }
    else {
        attr = this.$attrs[name] = new AttrConfigurator(name, this);    
    }
    
    return attr;    
};

types.forEach(function(type) {
    //shortcut for model
    configuratorProto[type] = function(name) {
        return this.attr(name).ofType(type);    
    };
    
    //shortcut for attr
    attrConfiguratorProto[type] = function(name) {
        return this.$model.attr(name).ofType(type);    
    };
});

/**
 * Finalize current attr configuration and start next.
 * @param {string} name - new attribute name.
 */
attrConfiguratorProto.attr = function(name) {
    if(!this.$type) {
        console.warn('Attribute with name "' + this.$name + '" has no type');
    }
    return this.$model.attr(name);
};

/**
 * Set current attribute type.
 * @param {string} type - Actuall type
 */
attrConfiguratorProto.ofType = function(type) {
    if(!type) {
        throw new Error('Unable to set empty type.');
    }
    
    this.$type = type;
    return this;
};

/**
 * Add validator to current attribute.
 * @param {string} type - Type of validator
 * @param {Object} [options] - Additional options
 */
attrConfiguratorProto.validator = function(type, options) {
    if(!type) {
        throw new Error('Validator name is required.');
    }
    
    this.$validators.push(new ValidatorConfigurator(type, options));
    
    return this;
};

function isObject(test) {
    return Object.prototype.toString.call(test) === '[object Object]';  
}

validators.forEach(function(validator) {
    attrConfiguratorProto['is' + validator[0].toUpperCase() + validator.substr(1)] = function(message, options) {
        if(isObject(message)) {
            options = message;
        }
        else {
            options = isObject(options) ? options : {};
            
            options.message = message;
        }
        
        return this.validator(validator, options);
    };
});

module.exports = Configurator;