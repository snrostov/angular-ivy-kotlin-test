"use strict";
exports.__esModule = true;
var compiler_cli_1 = require("@angular/compiler-cli");
function compileKotlin(args) {
    var compileDiags = compiler_cli_1.performCompilation({
        rootNames: [],
        options: {},
        emitFlags: compiler_cli_1.EmitFlags.All
    }).diagnostics;
}
exports.compileKotlin = compileKotlin;
//# sourceMappingURL=ktngc.js.map