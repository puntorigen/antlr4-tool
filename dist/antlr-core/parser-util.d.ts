export declare function readLexer(grammar: string, lexerFile: string): any;
export declare function readParser(grammar: string, parserFile: string): any;
export declare function contextRuleNames(parser: any): string[];
export declare function contextRules(parser: any): any[];
export declare function classContextRules(parserClass: any): any[];
export declare function contextToRuleMap(parser: any): Map<any, any>;
export declare function ruleToContextTypeMap(parser: any): Map<any, any>;
export declare function symbolSet(parser: any): Set<unknown>;
export declare function parserMethods(parser: any): any[];
/**
 *
 * @param parser
 * @returns {string[]}
 */
export declare function exportedContextTypes(parser: any): string[];
/**
 * Return all modules AST of all the rules
 * @param parser
 * @returns [...,{id: string, type: string}]
 */
export declare function contextObjectAst(parser: any): any[];
