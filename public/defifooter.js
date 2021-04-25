import { html, render } from './node_modules/lit-html/lit-html.js';

window.customElements.define('defi-footer', class DefiFooter extends HTMLElement {

    constructor() {
        super();              
    }

    connectedCallback() {
        render(
            html`
                <footer>
                    <div class="timestamp"></div>
                </footer>
            `
        , this)
    }

});