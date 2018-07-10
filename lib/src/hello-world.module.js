import { NgModule } from '@angular/core';
import { HelloWorld } from './hello-world';
export class HelloWorldModule {
}
HelloWorldModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    HelloWorld
                ],
                imports: []
            },] },
];
/** @nocollapse */
HelloWorldModule.ctorParameters = () => [];
