class Router {
    static parentElement: HTMLElement;
    static loadDefault: Loader;
    static pages: Map<string, Page>;

    static {
        window.addEventListener('popstate', Router.route);
        window.addEventListener('click', Router.intercept);
    }

    static initialize(parentElement: HTMLElement, loadDefault: Loader, pages: Page[]) {
        Router.parentElement = parentElement;
        Router.loadDefault = loadDefault;
        Router.pages = new Map(pages.map(p => [p.route, p]));
    }

    static intercept(event: MouseEvent) {
        if (event.target instanceof Element) {
            const element = event.target.closest('a[href]') as HTMLAnchorElement | null;
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
        const page = Router.pages.get(window.location.pathname);
        if (page === undefined) {
            Router.loadDefault(Router.parentElement);
        }
        else {
            page.load(Router.parentElement);
        }
    }
}

export { Router };
