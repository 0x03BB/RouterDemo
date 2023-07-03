class About implements Page {
    #template: HTMLTemplateElement;

    constructor(templateDocument: Document) {
        this.#template = templateDocument.getElementById('about') as HTMLTemplateElement;
    }

    route = '/about';

    load(parentElement: HTMLElement) {
        parentElement.replaceChildren(this.#template.content.cloneNode(true));
    }

    reload(parentElement: HTMLElement) {
    }

    unload() {
    }
}

export { About };
