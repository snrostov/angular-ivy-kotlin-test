import * as ng from "@angular/compiler-cli";
import * as ts from "typescript";
import {readCommandLineAndConfiguration} from "@angular/compiler-cli/src/main";

// CLI entry point
if (require.main === module) {
    const args = process.argv.slice(2);
    process.exitCode = compileKotlin(args);
}

export function compileKotlin(args: string[]) {
    let {project, rootNames, options, errors: configErrors, emitFlags} = readCommandLineAndConfiguration(args);

    options.enableIvy = 'ngtsc';
    // let host = ng.createCompilerHost({options});
    // const program = ng.createProgram({rootNames, host, options});
    // const emitResult = program!.emit({emitFlags});

    const {diagnostics: compileDiags} = ng.performCompilation(
        {
            rootNames, options, emitFlags
        }
    );

    return reportErrorsAndExit(compileDiags);

    // return 0;
}

function reportErrorsAndExit(allDiagnostics: ng.Diagnostics): number {
    const errorsAndWarnings = ng.filterErrorsAndWarnings(allDiagnostics);
    if (errorsAndWarnings.length) {
        const formatHost: ts.FormatDiagnosticsHost = {
            getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
            getCanonicalFileName: fileName => fileName,
            getNewLine: () => ts.sys.newLine
        };
        console.error(ng.formatDiagnostics(errorsAndWarnings, formatHost));
    }
    return ng.exitCodeFromResult(allDiagnostics);
}
