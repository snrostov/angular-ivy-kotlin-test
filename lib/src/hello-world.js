import * as i0 from '@angular/core';
import {Component, ɵrenderComponent as renderComponent} from '@angular/core';

export class HelloWorld {
    constructor() {
        this.name = 'World!';
        this.size = 20;
    }

    test() {
        return 'Test';
    }
}

HelloWorld.decorators = [
    {
        type: Component, args: [{
            selector: 'hello-world',
            template: `<h3>Hello {{name}} {{test()}}</h3>`
        },]
    },
];
/** @nocollapse */
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
renderComponent(HelloWorld);
