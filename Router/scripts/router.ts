class Router {
    parentElement: HTMLElement;
    loadNotFound: Loader;
    routes: Map<string, Loader>;

    constructor(parentElement: HTMLElement, loadNotFound: Loader, routes: Route[]) {
        this.parentElement = parentElement;
        this.loadNotFound = loadNotFound;
        this.intercept = this.intercept.bind(this);
        this.route = this.route.bind(this);
        this.routes = new Map(routes);

        window.addEventListener('popstate', this.route);
        window.addEventListener('click', this.intercept);
    }

    intercept(event) {
        const element = event.target.closest('a[href]');
        if (element !== null) {
            const href = element.href;
            const url = new URL(href, window.location.origin);
            if (url.origin === window.location.origin) {
                event.preventDefault();
                history.pushState(null, '', href);

                this.route();
            }
        }
    }

    route() {
        const load = this.routes.get(window.location.pathname);
        if (load === undefined) {
            this.loadNotFound(this.parentElement);
        }
        else {
            load(this.parentElement);
        }
    }
}

export { Router };
