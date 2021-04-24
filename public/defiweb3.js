import { html, render } from './node_modules/lit-html/lit-html.js';

window.customElements.define('defi-web3', class DefiWeb3 extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {       
        render(html`<button class="mdc-button--outlined" id="web3">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">
            <ion-icon name="pulse-outline"></ion-icon>
        </span>
        </button>
        `, this);
    }

});