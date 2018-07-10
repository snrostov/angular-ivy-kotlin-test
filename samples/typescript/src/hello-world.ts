import {Component, ɵComponentType as ComponentType, ɵrenderComponent as renderComponent} from '@angular/core'

@Component({
    selector: 'hello-world',
    template: `<h3>Hello {{name}} {{test()}}</h3>`
})
export class HelloWorld {
    name = 'World!';
    size = 20;

    test() {
        return 'Test'
    }
}

renderComponent(HelloWorld as ComponentType<HelloWorld>);
