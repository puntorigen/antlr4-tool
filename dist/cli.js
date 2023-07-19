"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var _ = require("lodash");
var chalk = require("chalk");
var fs = require("fs");
var compile_1 = require("./compile");
var log = console.log;
var finder = require('find-package-json');
var antlrGrammars;
var finderIterator = finder(__dirname);
var packageJson = finderIterator.next().value;
var opts = commander.name(packageJson.name)
    .version(packageJson.version)
    .arguments('<grammars...>')
    .option('-o --output-dir [output_dir]', 'Output Directory (Default: Current Directory)')
    .option('-l --language [language]', 'Antlr Language Target: ts, typescript, js, javascript (Default: typescript)')
    .option('--listener', 'Generate parse tree listener (Default)')
    .option('--no-listener', 'Don\'t generate parse tree listener')
    .option('--visitor', 'Generate parse tree visitor (Default)')
    .option('--no-visitor', 'Don\'t generate parse tree visitor')
    .action(function () {
    var grammars = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        grammars[_i] = arguments[_i];
    }
    return antlrGrammars = _.flatten(grammars.slice(0, -1));
})
    .parse(process.argv);
var config = {};
if (_.isNil(antlrGrammars)) {
    opts.help(function (str) { return "Please specify grammar files.\n" + str; });
    process.exit(1);
}
config.language = (_.isNil(opts['language'])) ? 'TypeScript' : opts['language'];
config.grammarFiles = antlrGrammars;
config.outputDirectory = _.isNil(opts['outputDir']) ? '.' : opts['outputDir'];
config.visitor = opts['visitor'];
config.listener = opts['listener'];
log("Compiling " + antlrGrammars.join(', ') + "...");
_.each(antlrGrammars, function (file) {
    if (fs.existsSync(file) === false) {
        log("The file " + file + " doesn't exists.");
        process.exit(1);
    }
    else if (fs.statSync(file).isFile() === false) {
        log(file + " is not a file.");
        process.exit(1);
    }
});
var compileResults = compile_1.compile(config);
_.each(compileResults, function (files, grammar) {
    _.each(files, function (file) {
        log("Generated " + chalk.blue.underline(file));
    });
});
//# sourceMappingURL=cli.js.map