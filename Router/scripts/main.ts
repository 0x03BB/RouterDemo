declare global {
    var templatePromise: Promise<Document>;
}
import { Router } from './router.js';
import { Home } from './templates/home.js';
import { Weather } from './templates/weather.js';
import { About } from './templates/about.js';

const appDiv = document.getElementById('app') as HTMLDivElement;
const notFoundTemplate = document.getElementById('not-found') as HTMLTemplateElement;
const templateDocument = await globalThis.templatePromise;

Router.initialize(
    appDiv,
    (parentElement) => {
        parentElement.replaceChildren(notFoundTemplate.content.cloneNode(true));
    },
    [
        new Home(templateDocument),
        new Weather(templateDocument),
        new About(templateDocument)
    ]
);

Router.route();
