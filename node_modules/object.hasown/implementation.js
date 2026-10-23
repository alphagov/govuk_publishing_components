'use strict';

var ToObject = require('es-object-atoms/ToObject');
var ToPropertyKey = require('es-abstract/2025/ToPropertyKey');
var HasOwnProperty = require('es-abstract/2025/HasOwnProperty');

module.exports = function hasOwn(O, P) {
	var obj = ToObject(O);
	var key = ToPropertyKey(P);
	return HasOwnProperty(obj, key);
};
