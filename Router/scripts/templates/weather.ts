import { AbortHelper } from '../abort-helper.js';

export class Weather implements Page {
    readonly #template: HTMLTemplateElement;
    readonly #rowTemplate: HTMLTemplateElement;
    readonly #errorTemplate: HTMLTemplateElement;
    readonly #abortHelper: AbortHelper = new AbortHelper();

    #updateCallback?: () => Promise<void>;

    path = '/weather';

    constructor(templateDocument: Document) {
        this.#template = templateDocument.getElementById('weather') as HTMLTemplateElement;
        this.#rowTemplate = templateDocument.getElementById('weather-row') as HTMLTemplateElement;
        this.#errorTemplate = templateDocument.getElementById('weather-error') as HTMLTemplateElement;
    }

    load(parentElement: HTMLElement) {
        const clone = this.#template.content.cloneNode(true);
        parentElement.replaceChildren(clone);
        const update = document.getElementById('update') as HTMLButtonElement;
        const tableBody = document.getElementById('table-body') as HTMLElement;
        const loadingIndicator = document.getElementById('loading-indicator') as HTMLDivElement;

        update.addEventListener('click', this.#updateCallback = () => this.#update(tableBody, loadingIndicator), { passive: true });
        this.#updateCallback();
    }

    async #update(tableBody: HTMLElement, loadingIndicator: HTMLDivElement) {
        loadingIndicator.style.display = '';
        this.#abortHelper.start();
        const signal = this.#abortHelper.signal;
        try {
            const response = await fetch('/api/WeatherForecast', { signal });
            if (response.ok) {
                const weatherForecasts = await response.json() as WeatherForecast[];
                this.#updatePage(tableBody, weatherForecasts);
                
            } else {
                this.#updatePageWithError(tableBody);
            }
            this.#abortHelper.complete();
            loadingIndicator.style.display = 'none';
        } catch (error) {
            if (!(error instanceof DOMException) || error.name !== 'AbortError') {
                this.#abortHelper.complete();
                this.#updatePageWithError(tableBody);
                loadingIndicator.style.display = 'none';
            }
        }
    }

    reload() {
        this.#updateCallback!();
    }

    unload() {
        this.#abortHelper.stop();
        this.#updateCallback = undefined;
    }

    #updatePage(tableBody: HTMLElement, weatherForecasts: WeatherForecast[]) {
        tableBody.replaceChildren();
        for (let weatherForecast of weatherForecasts) {
            tableBody.appendChild(this.#createRow(weatherForecast));
        }
    }

    #createRow(weatherForecast: WeatherForecast) {
        let newRow = this.#rowTemplate.content.cloneNode(true) as HTMLTableRowElement;
        let newCells = newRow.firstElementChild!.children;
        newCells[0].textContent = new Date(weatherForecast.date).toLocaleString();
        newCells[1].textContent = weatherForecast.temperatureF.toString();
        newCells[2].textContent = weatherForecast.summary;
        return newRow;
    }

    #updatePageWithError(tableBody: HTMLElement) {
        tableBody.replaceChildren(this.#errorTemplate.content.cloneNode(true));
    }
}

type WeatherForecast = {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string | null;
};
