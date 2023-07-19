"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var _ = require("lodash");
var util = require("./util");
var vm = require("vm");
function readLexer(grammar, lexerFile) {
    var code = fs.readFileSync(lexerFile).toString();
    var vmRequire = function (request) {
        return require(require.resolve(request, { paths: [path.dirname(lexerFile)] }));
    };
    var context = { require: vmRequire, exports: {}, __dirname: path.dirname(lexerFile), __filename: path.resolve(lexerFile) };
    vm.createContext(context);
    vm.runInContext(code, context);
    var Lexer = context.exports[grammar + "Lexer"];
    var lexer = new Lexer(null);
    return lexer;
}
exports.readLexer = readLexer;
function readParser(grammar, parserFile) {
    var code = fs.readFileSync(parserFile).toString();
    var vmRequire = function (request) {
        return require(require.resolve(request, { paths: [path.dirname(parserFile)] }));
    };
    var context = { require: vmRequire, exports: {}, __dirname: path.dirname(parserFile), __filename: path.resolve(parserFile) };
    var newCtx = vm.createContext(context);
    vm.runInContext(code, newCtx);
    var Parser = context.exports[grammar + "Parser"];
    var parser = new Parser(null);
    return parser;
}
exports.readParser = readParser;
function contextRuleNames(parser) {
    return _.map(parser.ruleNames, function (rule) { return util.capitalizeFirstLetter(rule) + "Context"; });
}
exports.contextRuleNames = contextRuleNames;
function contextRules(parser) {
    var rules = contextRuleNames(parser);
    return _.map(rules, function (context) {
        return parser.constructor[context];
    });
}
exports.contextRules = contextRules;
function classContextRules(parserClass) {
    return Object.keys(parserClass)
        .map(function (key) { return parserClass[key]; })
        .filter(function (value) { return typeof value === 'function'; });
}
exports.classContextRules = classContextRules;
function contextToRuleMap(parser) {
    var map = new Map();
    _.each(parser.ruleNames, function (rule) {
        var context = util.capitalizeFirstLetter(rule) + "Context";
        map.set(context, rule);
    });
    return map;
}
exports.contextToRuleMap = contextToRuleMap;
function ruleToContextTypeMap(parser) {
    var map = new Map();
    _.each(parser.ruleNames, function (rule) {
        var context = util.capitalizeFirstLetter(rule) + "Context";
        map.set(rule, context);
    });
    return map;
}
exports.ruleToContextTypeMap = ruleToContextTypeMap;
function symbolSet(parser) {
    var set = new Set();
    _.each(parser.symbolicNames, function (name) {
        set.add(name);
    });
    return set;
}
exports.symbolSet = symbolSet;
function parserMethods(parser) {
    var ruleToContextMap = ruleToContextTypeMap(parser);
    var symbols = symbolSet(parser);
    var obj = {};
    var methods = util.getMethods(parser);
    var ownMethods = _.filter(methods, function (method) { return (ruleToContextMap.has(method.name) || symbols.has(method.name)); });
    return _.map(ownMethods, function (method) {
        var methodObj = {};
        methodObj.name = method.name;
        if (ruleToContextMap.has(method.name)) {
            methodObj.type = ruleToContextMap.get(method.name);
            methodObj.args = method.args;
        }
        else if (symbols.has(method.name)) {
            methodObj.type = 'TerminalNode';
            methodObj.args = method.args;
        }
        return methodObj;
    });
}
exports.parserMethods = parserMethods;
/**
 *
 * @param parser
 * @returns {string[]}
 */
function exportedContextTypes(parser) {
    var ParserClass = parser.constructor;
    var classCtxNames = classContextRules(ParserClass).map(function (rule) { return rule.name; });
    var instanceCtxNames = contextRuleNames(parser);
    var ctxNames = _.union(instanceCtxNames, classCtxNames);
    var exportsStatements = _.map(ctxNames, function (ctxType) {
        return "exports." + ctxType + " = " + ctxType + ";\n" + ParserClass.name + "." + ctxType + " = " + ctxType + ";\n";
    });
    return exportsStatements;
}
exports.exportedContextTypes = exportedContextTypes;
/**
 * Return all modules AST of all the rules
 * @param parser
 * @returns [...,{id: string, type: string}]
 */
function contextObjectAst(parser) {
    var types = classContextRules(parser.constructor);
    var ruleToContextMap = ruleToContextTypeMap(parser);
    var symbols = symbolSet(parser);
    var rules = contextRuleNames(parser);
    return _.map(types, function (context) {
        var obj = {};
        obj.name = context.name;
        var methods = _.filter(util.getMethods(context.prototype), function (mth) { return mth !== 'depth'; });
        var ownMethods = _.filter(methods, function (method) { return (ruleToContextMap.has(method.name) || symbols.has(method.name)); });
        obj.methods = _.map(ownMethods, function (method) {
            var methodObj = {};
            methodObj.name = method.name;
            methodObj.args = method.args;
            if (ruleToContextMap.has(method.name)) {
                methodObj.type = ruleToContextMap.get(method.name);
            }
            else if (symbols.has(method.name)) {
                methodObj.type = 'TerminalNode';
            }
            return methodObj;
        });
        return obj;
    });
}
exports.contextObjectAst = contextObjectAst;
//# sourceMappingURL=parser-util.js.map