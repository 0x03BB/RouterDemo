class Router {
    static #currentPage?: Page;

    static parentElement: HTMLElement;
    static loadDefault: Loader;
    static pages: Map<string, Page>;

    static {
        window.addEventListener('popstate', Router.route, { passive: true });
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

                // This will create an absolute URL if the first parameter
                // is relative, otherwise the second paramter is ignored.
                const url = new URL(href, window.location.origin);

                if (url.pathname === Router.#currentPage?.route) {
                    // A link to the current page was clicked. reload the page
                    // if the function is defined, otherwise unload and load.
                    event.preventDefault();
                    if (Router.#currentPage.reload !== undefined) {
                        Router.#currentPage.reload(Router.parentElement);
                    }
                    else {
                        Router.#currentPage.unload?.();
                        Router.#currentPage.load(Router.parentElement);
                    }
                }
                else if (url.origin === window.location.origin) {
                    // A link elsewhere on the curent site was clicked. pushState and route.
                    event.preventDefault();
                    history.pushState(undefined, '', href);

                    Router.route();
                }
                // A link to an external site was clicked. Do nothing.
            }
        }
    }

    static route() {
        Router.#currentPage = Router.pages.get(window.location.pathname);
        if (Router.#currentPage !== undefined) {
            Router.#currentPage.load(Router.parentElement);
        }
        else {
            Router.loadDefault(Router.parentElement);
        }
    }
}

export { Router };
