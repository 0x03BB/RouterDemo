let _template: HTMLTemplateElement;

await (async function () {
    const parser = new DOMParser();

    const response = await fetch('/templates/home.html');
    const html = await response.text();
    const parsedDocument = parser.parseFromString(html, 'text/html');
    _template = parsedDocument.getElementById('main') as HTMLTemplateElement;
})();

function load(parentElement: HTMLElement) {
    parentElement.replaceChildren(_template.content.cloneNode(true));
}

const route: Route = ['/', load];

export { route };
