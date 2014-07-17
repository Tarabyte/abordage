/*jshint node:true*/
function convertAttr(attr) {
    var result = {},
        type = attr.$type.toLowerCase(),
        shouldUseObject = false;

    if('$default' in attr) {
        shouldUseObject = true;
        result = {
            type: type,
            defaultsTo: attr.$default
        };
    }

    if(!shouldUseObject) {
        result = type;
    }

    return result;
}

module.exports = function sails() {
    var model = {},
        config = this,
        attrs = config.$attrs,
        proto = config.$proto;

    Object.keys(attrs).forEach(function(key) {
        var attr = attrs[key];

        model[key] = convertAttr(attr);
    });

    Object.keys(proto).forEach(function(key) {
        model[key] = proto[key];
    });

    return model;
};
