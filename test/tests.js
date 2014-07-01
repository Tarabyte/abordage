'use strict';
/*jslint node:true*/
/*global require, describe, it*/
var abordage = require('../');
var t = require('assert');

var makeName = (function(i){
    return function() {
        return 'test_name_' + i++;    
    };
}(0));

describe('abondage', function () {
    it('should be defined', function () {
        t.ok(abordage);
    });
    
    it('should be a function', function () {
        t.equal(typeof abordage, 'function');
    });
    
    it('should throw without name', function() {
        t.throws(function() {
            var model = new abordage();
            return model;
        });
    });
    
    it('should acts as contructor without new', function() {
        var model = abordage(makeName());
        t.ok(model instanceof abordage);
    });
    
    describe('configuration', function() {
        var model = abordage(makeName());
        
        describe('attr method', function() {
            it('should be a function', function() {
                t.equal(typeof model.attr, 'function');  
            });
            
            it('should throw when called without name', function() {
                t.throws(function() {
                    model.attr();    
                });    
            });
            
            it('should warn when attr is already defined', function() {
                var warn = console.warn,
                    name = makeName(),
                    called = 0;
                
                console.warn = function() {
                    t.ok(true);
                    warn.apply(this, arguments);
                    called++;
                };
                
                model.attr(name);
                model.attr(name);
                t.equal(called, 1);
                console.warn = warn;
            });
            
            it('should return attr configurator', function() {
                var attr = model.attr(makeName());
                t.ok(attr);                
            });
            
            describe('attr configurator', function() {
                var attr = model.attr(makeName());
                
                it('should allow to specify its type', function() {
                    t.equal(typeof attr.ofType, 'function');
                });
                
                it('should chain itself when setting a type', function() {
                    t.equal(attr.ofType('string'), attr);
                });
                
                it('should throw on empty type', function() {
                    t.throws(function() {
                        attr.ofType();    
                    });
                });
                
                var next; 
                it('should have attr method', function() {
                    next = attr.attr(makeName());
                    t.ok(next);
                });
                
                it('should warn when type was not specified', function() {
                    var warn = console.warn,
                        called = 0;
                    
                    console.warn = function() {
                        t.ok(true);
                        warn.apply(this, arguments);
                        called++;
                    };
                    
                    next.attr(makeName());
                    console.warn = warn;
                    t.equal(called, 1);
                });
            });
        });        
    });
    
});
