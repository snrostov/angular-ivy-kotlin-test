"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var hello_world_1 = require("./hello-world");
var HelloWorldModule = /** @class */ (function () {
    function HelloWorldModule() {
    }
    HelloWorldModule = tslib_1.__decorate([
        core_1.NgModule({
            declarations: [
                hello_world_1.HelloWorld
            ],
            imports: []
        })
    ], HelloWorldModule);
    return HelloWorldModule;
}());
exports.HelloWorldModule = HelloWorldModule;
//# sourceMappingURL=hello-world.module.js.map