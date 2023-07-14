class Router {
    static #currentPage?: Page;

    static parentElement: HTMLElement;
    static loadDefault: Loader;
    static pages: Map<string, Page>;

    static {
        window.addEventListener('popstate', Router.#popStateHandler, { passive: true });
        window.addEventListener('click', Router.#intercept);
    }

    static initialize(parentElement: HTMLElement, loadDefault: Loader, pages: Page[]) {
        Router.parentElement = parentElement;
        Router.loadDefault = loadDefault;
        Router.pages = new Map(pages.map(p => [p.path, p]));
        Router.#route(false, false);
    }

    /**
     * Navigates to the specified URL. Does not call reload() or load() if the new path is the same as the current path.
     * @param url The URL to navigate to.
     * @param replaceState If true, use replaceState(). Otherwise use pushState(). The default is false.
     */
    static navigate(url: string, replaceState: boolean = false) {
        if (!replaceState) {
            history.pushState(undefined, '', url);
        }
        else {
            history.replaceState(undefined, '', url);
        }

        const samePage = new URL(url, window.location.origin).pathname === Router.#currentPage?.path;
        if (!samePage) {
            Router.#route(false, false);
        }
    }

    static #intercept(ev: MouseEvent) {
        if (ev.target instanceof Element) {
            const element = ev.target.closest('a[href]') as HTMLAnchorElement | null;
            if (element !== null) {
                const href = element.href;

                // This will create an absolute URL if the first parameter
                // is relative, otherwise the second paramter is ignored.
                const url = new URL(href, window.location.origin);

                if (url.pathname === Router.#currentPage?.path) { // A link to the current page was clicked.
                    ev.preventDefault();
                    Router.#route(true, false);
                }
                else if (url.origin === window.location.origin) { // A link to elsewhere on the curent site was clicked.
                    ev.preventDefault();
                    history.pushState(undefined, '', href);
                    Router.#route(false, false);
                }
                else { // A link to an external site was clicked.
                    Router.#currentPage?.unload?.();
                }
            }
        }
    }

    static #popStateHandler() {
        const samePage = window.location.pathname === Router.#currentPage?.path;
        Router.#route(samePage, true);
    }

    static #route(samePage: boolean, popState: boolean) {
        if (samePage) {
            // reload() the page if the function is defined, otherwise unload() and load().
            if (Router.#currentPage!.reload !== undefined) {
                Router.#currentPage!.reload(Router.parentElement, popState);
            }
            else {
                Router.#currentPage!.unload?.();
                Router.#currentPage!.load(Router.parentElement, popState);
            }
        }
        else {
            Router.#currentPage?.unload?.();
            Router.#currentPage = Router.pages.get(window.location.pathname);
            if (Router.#currentPage !== undefined) {
                Router.#currentPage.load(Router.parentElement, popState);
            }
            else {
                Router.loadDefault(Router.parentElement, popState);
            }
        }
    }
}

export { Router };
