"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var _ = require("lodash");
var antlr_compiler_1 = require("./antlr-compiler");
var constants = require("./constants");
function compileWithFunction(config, compileFunction) {
    var compiledResults = {};
    _.each(config.grammarFiles, function (grammar) {
        var opts = _.clone(config);
        opts.grammarFile = path.resolve(grammar);
        opts.outputDirectory = path.resolve(config.outputDirectory);
        if (_.isNil(config.antlrJar)) {
            opts.antlrJar = path.resolve(constants.ANTLR_JAR);
        }
        var compiler = new antlr_compiler_1.AntlrCompiler(opts);
        var results = compileFunction(compiler);
        if (!_.isNil(compiledResults[results.grammar])) {
            _.each(results.filesGenerated, function (val) {
                compiledResults[results.grammar].push(val);
            });
        }
        else {
            compiledResults[results.grammar] = results.filesGenerated;
        }
    });
    // Remove duplicate files
    _.each(compiledResults, function (list, key) {
        compiledResults[key] = _.uniq(list);
    });
    return compiledResults;
}
function compileGrammarAsJavaScript(config) {
    return compileWithFunction(config, function (compiler) { return compiler.compileJavaScript(); });
}
function compileGrammarAsTypeScript(config) {
    config = _.clone(config);
    // Define the language as JavaScript for the Antlr4 Jar
    config.language = 'JavaScript';
    return compileWithFunction(config, function (compiler) { return compiler.compileTypeScript(); });
}
function compile(config) {
    config.outputDirectory = path.resolve(config.outputDirectory);
    switch (config.language) {
        case 'js':
        case 'javascript':
        case 'JavaScript':
            config.language = 'JavaScript';
            return compileGrammarAsJavaScript(config);
        case 'ts':
        case 'typescript':
        case 'TypeScript':
            config.language = 'TypeScript';
            return compileGrammarAsTypeScript(config);
        default:
            throw new Error("Unsupported Language: " + config.language);
    }
}
exports.compile = compile;
//# sourceMappingURL=index.js.map