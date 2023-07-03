class Router {
    static parentElement: HTMLElement;
    static loadDefault: Loader;
    static routes: Map<string, Loader>;

    static {
        window.addEventListener('popstate', Router.route);
        window.addEventListener('click', Router.intercept);
    }

    static initialize(parentElement: HTMLElement, loadDefault: Loader, routes: Route[]) {
        Router.parentElement = parentElement;
        Router.loadDefault = loadDefault;
        Router.routes = new Map(routes);
    }

    static intercept(event) {
        const element = event.target.closest('a[href]');
        if (element !== null) {
            const href = element.href;
            const url = new URL(href, window.location.origin);
            if (url.origin === window.location.origin) {
                event.preventDefault();
                history.pushState(null, '', href);

                    Router.route();
                }
            }
        }
    }

    static route() {
        const load = Router.routes.get(window.location.pathname);
        if (load === undefined) {
            Router.loadDefault(Router.parentElement);
        }
        else {
            load(Router.parentElement);
        }
    }
}

export { Router };
