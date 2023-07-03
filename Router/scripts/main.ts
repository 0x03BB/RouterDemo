import { Router } from './router.js';
import * as home from './templates/home.js';
import * as weather from './templates/weather.js';
import * as about from './templates/about.js';

const appDiv = document.getElementById('app') as HTMLDivElement;
const notFoundTemplate = document.getElementById('not-found') as HTMLTemplateElement;

Router.initialize(
    appDiv,
    (parentElement) => {
        parentElement.replaceChildren(notFoundTemplate.content.cloneNode(true));
    }, [
    home.route,
    weather.route,
    about.route
]);

Router.route();
