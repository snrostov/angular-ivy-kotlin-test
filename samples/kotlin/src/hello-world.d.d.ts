import {Component, Input} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: "hello-world",
    template: `<h3>Hello {{name}} {{test()}} {{testInput}}</h3>`
})
export class HelloWorld {
    constructor(myClient: HttpClient)

    name: String;

    @Input()
    testInput: String;

    test(): String;
}