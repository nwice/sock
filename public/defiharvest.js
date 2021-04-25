import './defiprice.js'

const defiharvest = document.createElement('template');
defiharvest.innerHTML = `
<table>
    <thead>
    <tr>
        <th colspan="2">
            <a class="nickname"></a>
        </th>        
        <th class="relative">
            <a colspan="2" class="ox json"></a>
        </th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td class="total"></td><td colspan="2" style="display: flex" class="pair"></td>            
        </tr>
    </tbody>
    <tfoot>
    <tr>
        <td colspan="3" class="relative">
            <a colspan="2" class="ox strategy"></a>            
        </td>
    </tr>
    </tfoot>    
</table>
`

window.customElements.define('defi-harvest', class DefiTvl extends HTMLElement {

    get strategy() {
        return this.getAttribute('strategy');
    }

    set strategy(strategy) {
        this.setAttribute('strategy', strategy);
    }

    get dex() {
        return this.getAttribute('dex');
    }

    set dex(dex) {
        this.setAttribute('dex', dex);
    }

    wavax(harvest) {
        return harvest.claim.pair.token1;
    }

    multiplier(harvest) {
        return harvest.reinvest ? 1 : 2;
    }

    other(harvest) {
        if (harvest.reinvest) {
            if (harvest.reinvest.pair.token0.symbol.toLowerCase() === 'wavax') {
                return harvest.reinvest.pair.token1;
            }
            return harvest.reinvest.pair.token0;
        }        
        return harvest.claim.pair.token0;
    }

    nickname(harvest) {
        return 'wavax-' + this.other(harvest).symbol.toLowerCase()        
    }

    connectedCallback() {
        getversions(this.dex, this.strategy).then(results => {
            console.log('results:', results)
            let json = results[results.length - 1];                    
            this.appendChild(defiharvest.content.cloneNode(true));
            let table = this.firstElementChild;
            
            table.querySelector('.strategy').innerHTML = this.strategy
            table.querySelector('.strategy').setAttribute('href', `https://cchain.explorer.avax.network/address/${this.strategy}`);
            table.querySelector('.json').setAttribute('href', `https://analytics.snowball.network/dex/snob/harvest/${this.strategy}.json`);
            table.querySelector('.json').innerHTML = 'json'
                
            table.querySelector('.nickname').innerHTML = this.nickname(json);
    
            let token0 = document.createElement('defi-price')            
            let token1 = document.createElement('defi-price')
                
            token0.setAttribute('price', this.wavax(json).price)
            token0.setAttribute('symbol', 'wavax')            
            token0.setAttribute('id', this.wavax(json).id.toLowerCase())
                
            token1.setAttribute('symbol', this.other(json).symbol.toLowerCase())
            token1.setAttribute('price', this.other(json).price)
            token1.setAttribute('id', this.other(json).id.toLowerCase())
    
            table.querySelector('.pair').appendChild(token0)
            table.querySelector('.pair').appendChild(token1)
            table.querySelector('.total').innerHTML = prettyNumber(json.claim.amountUSD * this.multiplier(json), 2)
            
            document.dispatchEvent(new CustomEvent('harvests', { detail: results }))
        })
    }

});