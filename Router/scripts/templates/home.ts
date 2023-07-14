class Home implements Page {
    #template: HTMLTemplateElement;

    path = '/';

    constructor(templateDocument: Document) {
        this.#template = templateDocument.getElementById('home') as HTMLTemplateElement;
    }

    load(parentElement: HTMLElement) {
        parentElement.replaceChildren(this.#template.content.cloneNode(true));
    }

    reload(parentElement: HTMLElement) {
    }
}

export { Home };
