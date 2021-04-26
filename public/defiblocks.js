import { html, render } from './node_modules/lit-html/lit-html.js';

document.addEventListener('tx', (e) => {
    let tx = e.detail;
    let blocks = document.querySelector('#blocks');
    let block = blocks.querySelector(`[blockNumber="${ tx[0].blockNumber / 1 }"]`)
    if ( !block ) {
        render(
            html`
                <div blockNumber=${tx[0].blockNumber / 1}>
                    <span>${tx[0].blockNumber / 1}<span>
                </div>
            `,
            blocks,
        );        
    }
});

window.customElements.define('defi-blocks', class DefiBlocks extends HTMLElement {

    constructor() {
        super();              
    }

    connectedCallback() {
        this.appendChild(defifooter.content.cloneNode(true));        
    }

});