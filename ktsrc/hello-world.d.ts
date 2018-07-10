import {Component} from "@angular/core";

@Component({
    selector: "hello-world",
    template: `<h3>Hello {{name}} {{test()}}</h3>`
})
export class HelloWorld {
    name: String;

    test(): String
}