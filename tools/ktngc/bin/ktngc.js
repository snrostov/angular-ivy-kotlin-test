"use strict";
exports.__esModule = true;
var ng = require("@angular/compiler-cli");
var ts = require("typescript");
var main_1 = require("@angular/compiler-cli/src/main");
// CLI entry point
if (require.main === module) {
    var args = process.argv.slice(2);
    process.exitCode = compileKotlin(args);
}
function compileKotlin(args) {
    var _a = main_1.readCommandLineAndConfiguration(args), project = _a.project, rootNames = _a.rootNames, options = _a.options, configErrors = _a.errors, emitFlags = _a.emitFlags;
    options.enableIvy = 'ngtsc';
    // let host = ng.createCompilerHost({options});
    // const program = ng.createProgram({rootNames, host, options});
    // const emitResult = program!.emit({emitFlags});
    var compileDiags = ng.performCompilation({
        rootNames: rootNames, options: options, emitFlags: emitFlags
    }).diagnostics;
    return reportErrorsAndExit(compileDiags);
    // return 0;
}
exports.compileKotlin = compileKotlin;
function reportErrorsAndExit(allDiagnostics) {
    var errorsAndWarnings = ng.filterErrorsAndWarnings(allDiagnostics);
    if (errorsAndWarnings.length) {
        var formatHost = {
            getCurrentDirectory: function () { return ts.sys.getCurrentDirectory(); },
            getCanonicalFileName: function (fileName) { return fileName; },
            getNewLine: function () { return ts.sys.newLine; }
        };
        console.error(ng.formatDiagnostics(errorsAndWarnings, formatHost));
    }
    return ng.exitCodeFromResult(allDiagnostics);
}
//# sourceMappingURL=ktngc.js.map