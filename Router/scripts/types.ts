interface Page {
    route: string,
    load: Loader,
    reload?: Loader,
    unload?: () => void
}

type Loader = (parentElement: HTMLElement) => void;
