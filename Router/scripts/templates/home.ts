class Home implements Page {
    #template: HTMLTemplateElement;

    constructor(templateDocument: Document) {
        this.#template = templateDocument.getElementById('home') as HTMLTemplateElement;
    }

    route = '/';

    load(parentElement: HTMLElement) {
        parentElement.replaceChildren(this.#template.content.cloneNode(true));
    }

    reload(parentElement: HTMLElement) {
    }

    unload() {
    }
}

export { Home };
