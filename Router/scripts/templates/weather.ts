import { AbortHelper } from '../abort-helper.js';

class Weather implements Page {
    #template: HTMLTemplateElement;
    #rowTemplate: HTMLTemplateElement;
    #errorTemplate: HTMLTemplateElement;
    #callback?: () => Promise<void>;
    #abortHelper: AbortHelper;

    route = '/weather';

    constructor(templateDocument: Document) {
        this.#template = templateDocument.getElementById('weather') as HTMLTemplateElement;
        this.#rowTemplate = templateDocument.getElementById('weather-row') as HTMLTemplateElement;
        this.#errorTemplate = templateDocument.getElementById('weather-error') as HTMLTemplateElement;
        this.#abortHelper = new AbortHelper();
    }

    load(parentElement: HTMLElement) {
        const clone = this.#template.content.cloneNode(true);
        parentElement.replaceChildren(clone);
        const update = document.getElementById('update') as HTMLButtonElement;
        const tableBody = document.getElementById('table-body') as HTMLElement;
        const loadingIndicator = document.getElementById('loading-indicator') as HTMLDivElement;

        update.addEventListener('click', this.#callback = () => this.#fetchWeather(tableBody, loadingIndicator), { passive: true });
        this.#callback();
    }

    async #fetchWeather(tableBody: HTMLElement, loadingIndicator: HTMLDivElement) {
        loadingIndicator.style.display = '';
        this.#abortHelper.start();
        const signal = this.#abortHelper.signal;
        try {
            const response = await fetch('/api/WeatherForecast', { signal });
            if (response.ok) {
                const items = await response.json() as WeatherForecast[];

                tableBody.replaceChildren();
                items.forEach(item => {
                    let newRow = this.#rowTemplate.content.cloneNode(true) as HTMLTableRowElement;
                    let newCells = newRow.firstElementChild!.children;
                    newCells[0].textContent = item.date.toString();
                    newCells[1].textContent = item.temperatureF.toString();
                    if (item.summary !== undefined) {
                        newCells[2].textContent = item.summary;
                    }
                    tableBody.appendChild(newRow);
                });
            } else {
                tableBody.replaceChildren(this.#errorTemplate.content.cloneNode(true));
            }
        } catch (error) {
            if (!(error instanceof DOMException) || error.name !== 'AbortError') {
                tableBody.replaceChildren(this.#errorTemplate.content.cloneNode(true));
            }
        }
        loadingIndicator.style.display = 'none';
        this.#abortHelper.complete();
    }

    reload(parentElement: HTMLElement) {
        this.#callback!();
    }

    unload() {
        this.#abortHelper.abort();
    }
}

export { Weather };

type WeatherForecast = {
    date: Date;
    temperatureC: number;
    temperatureF: number;
    summary?: string;
};
