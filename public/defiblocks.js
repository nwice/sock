import { html, render } from './node_modules/lit-html/lit-html.js';
import { topics } from './avalanche.js';


const safedata = (data, t) => {    
    if ( t === 'sync') {
        let rv = data / 1e12
        console.log(t)
    }
    try {
        return data / 1e18        

    } catch (err) {
        try {
            return data / 1e21
        } catch (err2) {
            return 'bad data'
        }
    }
}

window.customElements.define('defi-blocks', class DefiBlocks extends HTMLElement {

    static get properties() {
        return {
          blocks: { type: Array },
          visibleblocks: { type: Number },
          loadonstart: { type: Number }
        };
    }
  
    constructor() {
        super();              
        this.blocks = [];
        this.visibleblocks = 4;
        this.loadonstart = 4;
    }

    doRender() {
        render(html`
            <div>
                <details>
                    <summary>Live Ticker</summary>
                    <p class="right" id="blockspreferences">
                        Visible Blocks: <input type="text">
                        Load on Start: <input type="text">
                    </p>
                </details>        
            <div>
            <div id="blocks">
                ${this.blocks.filter( (b,i,a) => { return i > a.length - this.visibleblocks }).map(txarray => html`
                    <div class="block">
                        <div><a target="_blank" href="https://cchain.explorer.avax.network/blocks/${txarray[0].blockNumber / 1}">${txarray[0].blockNumber / 1}</a></div>
                        <div><a target="_blank" href="https://cchain.explorer.avax.network/tx/${txarray[0].transactionHash}"><span style="font-size:smaller">${txarray[0].transactionHash.substring(0,20)}…</span></a></div>
                        ${txarray.map( (tx,i) => { 
                            let topic0 = topics[tx.topics[0]] || 'unknown'
                            return html`
                            <div class="topic" style="margin: 2px 0 2px 0">
                                <div style="white-space: nowrap;">${tx.logIndex}</div>
                                <div style="white-space: nowrap; flex:0; margin: 0 2px 0 2px">${topic0}</div>
                                <div style="flex:1;" class="right">${safedata(tx.data, topic0)}</div>
                            </div>                         
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

    async onstart() {
        let web3 = new Web3('wss://api.avax.network/ext/bc/C/ws')
        let startsblocks = []
        let bn = await web3.eth.getBlockNumber();
        console.log('bn:', bn);
        //while ( startsblocks.length < this.loadonstart ) {
            let txcount = await web3.eth.getBlockTransactionCount(bn)
            console.log('txcount:', txcount);
            if ( txcount > 0 ) {
                let block = await web3.eth.getBlock(bn)
                await Promise.all(block.transactions.map(async txhash => {
                    let tx = await web3.eth.getTransaction(txhash)
                    startsblocks.push(tx)
                    console.log('tx:', tx);
                }));                
            }            
            bn -= 1;
            console.log('new bn:', bn);
        //}
        return startsblocks
    }

    connectedCallback() {      
        document.addEventListener('tx', (e) => {
            this.blocks.push(e.detail);
            this.doRender()
        });        
        this.onstart().then(results => {
            console.log('results:', results)
        })
        this.doRender()
    }

});