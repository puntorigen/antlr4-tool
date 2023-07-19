"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
function getMethods(obj) {
    var result = [];
    /* tslint:disable */
    for (var id in obj) {
        try {
            if (typeof (obj[id]) === 'function' && obj[id].length === 0) {
                var mth = { name: id, args: '' };
                result.push(mth);
            }
        }
        catch (err) {
        }
    }
    return result;
}
exports.getMethods = getMethods;
function grammar(config) {
    var grammarFile = config.grammar;
    return path.basename(grammarFile, '.g4');
}
exports.grammar = grammar;
function capitalizeFirstLetter(val) {
    return val.charAt(0).toUpperCase() + val.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
//# sourceMappingURL=util.js.map