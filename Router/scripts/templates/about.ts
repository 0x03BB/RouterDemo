export class About implements Page {
    readonly #template: HTMLTemplateElement;

    path = '/about';

    constructor(templateDocument: Document) {
        this.#template = templateDocument.getElementById('about') as HTMLTemplateElement;
    }

    load(parentElement: HTMLElement) {
        parentElement.replaceChildren(this.#template.content.cloneNode(true));
    }

    reload() {
    }
}
