let _template: HTMLTemplateElement;
let _rowTemplate: HTMLTemplateElement;
let _errorTemplate: HTMLTemplateElement;

await (async function () {
    const parser = new DOMParser();

    const response = await fetch('/templates/weather.html');
    const html = await response.text();
    const parsedDocument = parser.parseFromString(html, 'text/html');

    _template = parsedDocument.getElementById('main') as HTMLTemplateElement;
    _rowTemplate = parsedDocument.getElementById('row') as HTMLTemplateElement;
    _errorTemplate = parsedDocument.getElementById('error') as HTMLTemplateElement;
})();

function load(parentElement: HTMLElement) {
    const clone = _template.content.cloneNode(true);
    parentElement.replaceChildren(clone);
    const update = document.getElementById('update') as HTMLButtonElement;
    const tableBody = document.getElementById('table-body') as HTMLElement;

    update.addEventListener('click', () => fetchWeather(tableBody));
    fetchWeather(tableBody);
}

async function fetchWeather(tableBody: HTMLElement) {
    try {
        const response = await fetch('/api/WeatherForecast');
        if (response.ok) {
            const items = await response.json() as WeatherForecast[];

            tableBody.replaceChildren();
            items.forEach(item => {
                let newRow = _rowTemplate.content.cloneNode(true) as HTMLTableRowElement;
                let newCells = newRow.firstElementChild.children;
                newCells[0].textContent = item.date.toString();
                newCells[1].textContent = item.temperatureF.toString();
                newCells[2].textContent = item.summary;
                tableBody.appendChild(newRow);
            });
        } else {
            tableBody.replaceChildren(_errorTemplate.content.cloneNode(true));
        }
    } catch (error) {
        tableBody.replaceChildren(_errorTemplate.content.cloneNode(true));
    }
}

const route: Route = ['/weather', load];

export { route };

type WeatherForecast = {
    date: Date;
    temperatureC: number;
    temperatureF: number;
    summary?: string;
};
