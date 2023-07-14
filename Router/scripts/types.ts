interface Page {
    /** The path of this Page. Routing is determined by path matching alone. */
    path: string,
    /** This method is called when a Page is navigated to. */
    load: Loader,
    /** If defined, this method is called when navigation via an anchor or history traversal results in the same path as is already loaded. If not defined, unload() is called, followed by load(). */
    reload?: Loader,
    /** If defined, this method is called when navigating away from a page. */
    unload?: () => void
}

type Loader = (parentElement: HTMLElement, popState: boolean) => void;
