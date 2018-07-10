import * as i0 from "@angular/core";
import {HelloWorld} from "../lib/src/hello-world";

HelloWorld.ctorParameters = () => [];
HelloWorld.ngComponentDef = i0.ɵdefineComponent({
    type: HelloWorld, tag: "hello-world", factory: function HelloWorld_Factory() {
        return new HelloWorld();
    }, template: function HelloWorld_Template(ctx, cm) {
        if (cm) {
            i0.ɵE(0, "h3");
            i0.ɵT(1);
            i0.ɵe();
        }
        i0.ɵt(1, i0.ɵb2("Hello ", ctx.name, " ", ctx.test(), ""));
    }
});