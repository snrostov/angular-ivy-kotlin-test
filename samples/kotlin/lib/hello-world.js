import * as i0 from "@angular/core";

// BEGIN class generated by kotlin compiler 
export const HelloWorld = /* @constructor */ function() {};
// END class generated by kotlin compiler 

HelloWorld.ngComponentDef = i0.ɵdefineComponent({ type: HelloWorld, selectors: [["hello-world"]], factory: function HelloWorld_Factory() { return new HelloWorld(i0.ɵdirectiveInject(HttpClient)); }, inputs: { testInput: "testInput" }, template: function HelloWorld_Template(rf, ctx) { if (rf & 1) {
        i0.ɵE(0, "h3");
        i0.ɵT(1);
        i0.ɵe();
    } if (rf & 2) {
        i0.ɵt(1, i0.ɵi3("Hello ", ctx.name, " ", ctx.test(), " ", ctx.testInput, ""));
    } } });