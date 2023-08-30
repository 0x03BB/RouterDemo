/**
 * Manages an AbortController. Calls abort() and creates new instances as needed.
 */
export class AbortHelper {
    #abortControler: AbortController = new AbortController();
    #completed: boolean = true;

    get signal() {
        return this.#abortControler.signal;
    }

    /**
     * Aborts the signal if complete() hasn't been called, then readies the signal for new use.
     */
    start() {
        // Reuse AbortController if it hasn't been aborted.
        if (this.#completed) {
            if (this.#abortControler.signal.aborted) {
                this.#abortControler = new AbortController();
            }
            this.#completed = false;
        }
        else {
            this.#abortControler.abort();
            this.#abortControler = new AbortController();
        }
    }

    /**
     * Call this when an operation has run to completion.
     */
    complete() {
        this.#completed = true;
    }

    /**
     * Aborts the signal if complete() hasn't been called, but does not ready the signal for new use. start() may be called after this.
     */
    stop() {
        if (!this.#completed) {
            this.#completed = true;
            this.#abortControler.abort();
        }
    }
}
