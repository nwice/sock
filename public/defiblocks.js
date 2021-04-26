import { html, render } from './node_modules/lit-html/lit-html.js';
import { topics } from './avalanche.js';
import Web3 from 'web3';

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
        document.addEventListener('tx', (e) => {
            this.blocks.push(e.detail);
            this.doRender()
        });
        new Web3('wss://api.avax.network/ext/bc/C/ws').eth.getBlockNumber().then(bn => {
            
        })
    }

});