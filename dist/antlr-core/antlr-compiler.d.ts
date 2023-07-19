export declare class AntlrCompiler {
    private config;
    private jar;
    private grammarFile;
    private language;
    private outputDirectory;
    constructor(config: any);
    compileTypeScriptParser(grammar: string, parser: any): string;
    capitalize: (s: string) => string;
    compileTypeScriptListener(grammar: string, parser: any): string;
    compileTypeScriptLexer(grammar: string): string;
    compileTypeScript(): {
        grammar: string;
        filesGenerated: string[];
    };
    compileJavaScript(): {
        grammar: string;
        filesGenerated: string[];
    };
    command(): string;
    additionalCommandOpts(): string;
}
