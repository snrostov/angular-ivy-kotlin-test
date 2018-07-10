import * as i0 from '@angular/core';
import {Component, Input} from "@angular/core";
import {HttpClient} from "@angular/common/http";
export class HelloWorld {
    constructor(myClient: HttpClient)

    name: String;

    @Input()
    testInput: String;

    test(): String;
    static ngComponentDef: i0.ComponentDef<HelloWorld, 'hello-world'>;
}