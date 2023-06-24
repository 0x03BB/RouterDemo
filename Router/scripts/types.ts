type Route = [
    pattern: string,
    load: Loader
]

type Loader = (parentElement: HTMLElement) => void;
