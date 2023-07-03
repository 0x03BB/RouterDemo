class Weather implements Page {
    #template: HTMLTemplateElement;
    #rowTemplate: HTMLTemplateElement;
    #errorTemplate: HTMLTemplateElement;
    #callback?: () => Promise<void>;

    route = '/weather';

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

        update.addEventListener('click', this.#callback = () => this.#fetchWeather(tableBody), { passive: true });
        this.#callback();
    }

    async #fetchWeather(tableBody: HTMLElement) {
        try {
            const response = await fetch('/api/WeatherForecast');
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
            tableBody.replaceChildren(this.#errorTemplate.content.cloneNode(true));
        }
    }

    reload(parentElement: HTMLElement) {
        this.#callback!();
    }

    unload() {
    }
}

export { Weather };

type WeatherForecast = {
    date: Date;
    temperatureC: number;
    temperatureF: number;
    summary?: string;
};
