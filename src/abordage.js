/*jshint node:true*/
/*global console, require*/

var types = 'string|text|integer|float|date|time|datetime|boolean|binary|array|json'.split('|');

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
}



var configuratorProto = Configurator.prototype,
    attrConfiguratorProto = AttrConfigurator.prototype;

/**
 * Defines an attr without type.
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

attrConfiguratorProto.attr = function(name) {
    if(!this.$type) {
        console.warn('Attribute with name "' + this.$name + '" has no type');
    }
    return this.$model.attr(name);
};

attrConfiguratorProto.ofType = function(type) {
    if(!type) {
        throw new Error('Unable to set empty type.');
    }
    
    this.$type = type;
    return this;
};

module.exports = Configurator;