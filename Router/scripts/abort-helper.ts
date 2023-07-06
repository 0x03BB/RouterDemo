/**
 * Manages an AbortController. Calls abort() and creates new instances as needed.
 */
class AbortHelper {
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
     * To be called when an operation has run to completion.
     */
    complete() {
        this.#completed = true;
    }

    abort() {
        this.#completed = true;
        this.#abortControler.abort();
    }
}

export { AbortHelper };
