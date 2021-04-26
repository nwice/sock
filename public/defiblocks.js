import { html, render } from './node_modules/lit-html/lit-html.js';
import { topics } from './avalanche.js';

window.customElements.define('defi-blocks', class DefiBlocks extends HTMLElement {

    static get properties() {
        return {
          blocks: { type: Array }
        };
    }
  
    constructor() {
        super();              
        this.blocks = [];
    }

    doRender() {
        render(html`
            <div id="blocks">
                ${this.blocks.map(txarray => html`
                    <div class="block">
                        <div>${txarray[0].blockNumber / 1}</div>
                        ${txarray.map(tx => { 
                            let topic0 = topics[tx.topics[0]] || 'unknown'
                            return html`
                            <div>${topic0}</div>                         
                        ` 
                        })}
                    </div>
                    `                    
                )}
            </div>
            `,
            this
        )
    }

    connectedCallback() {      
        console.log('loading')  
        document.addEventListener('tx', (e) => {
            console.log('received')
            this.blocks.push(e.detail);
            this.doRender()
        });          
    }

});