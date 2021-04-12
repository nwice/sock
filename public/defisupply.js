const template = document.createElement('template');
template.innerHTML = `
    <table>
        <tbody>
            <tr>
                <td rowspan="3" class="token"></td>            
                <td>Circulating Supply</td>
                <td class="right circulating pretty"></td>
            </tr>
            <tr>
                <td>Max Supply</td>
                <td class="right total pretty"></td>
            </tr>
            <tr>
                <td>Market Cap</td>
                <td class="right cap pretty"></td>
            </tr>            
        </tbody>
    </table>
`

window.customElements.define('defi-supply', class DefiSupply extends HTMLElement {

    constructor() {
        super();        
    }

    loadsupply() {
        fetch(`/supply/${this.symbol.toLowerCase()}.json`).then( (res) => { 
            let redirect = res.headers.get('x-amz-website-redirect-location')
            if ( redirect ) {
                let rn = redirect.split('/').pop()
                rn = parseInt(rn.substring(0, rn.length - 5)) - 1
                let previous_url = `/supply/${this.symbol.toLowerCase()}/${rn}.json`;
                console.log('previous url:', previous_url);
                return res.json();                
            } else {
                return res.json();            
            }
        }).then( (info) => {
            document.dispatchEvent(new CustomEvent(`supply-${this.symbol.toLowerCase()}-${this.dex.toLowerCase()}`, {
                detail: info
            }))
        }).catch( (err) => {
            document.dispatchEvent(new CustomEvent(`supply-${this.symbol.toLowerCase()}`, {
                detail: { circulating: "⛷️", symbol: getParameterByName('symbol') || 'SNOB', total: 18000000 }
            }))
        });
    };

    checkcap() {
        if ( this.getAttribute('circulating') != null && this.getAttribute('price') != null  ) {
            let mc = parseFloat(this.getAttribute('circulating')) * parseFloat(this.getAttribute('price'));
            this.firstElementChild.querySelector('.cap').innerHTML = '$' + prettyNumber(mc)
        }        
    }

    get symbol() {
        return this.getAttribute('symbol');
    }
      
    set symbol(ns) {
        this.setAttribute('symbol', ns);
    }

    get dex() {
        return this.getAttribute('dex');
    }
      
    set dex(ns) {
        this.setAttribute('dex', ns);
    }

    get price() {
        return this.getAttribute('price');
    }
      
    set price(np) {
        this.setAttribute('price', np);
    }

    get circulating() {
        return this.getAttribute('circulating');
    }
      
    set circulating(np) {
        this.setAttribute('circulating', np);
    }    

    connectedCallback() {       
        this.appendChild(template.content.cloneNode(true));
        this.firstElementChild.querySelector('.token').innerHTML = `<defi-price symbol="${this.symbol.toLowerCase()}"></defi-price>`
        document.addEventListener(`supply-${this.symbol.toLowerCase()}-${this.dex.toLowerCase()}`, (e) => {
            this.setAttribute('circulating', e.detail.circulating);
            this.checkcap()
            this.firstElementChild.querySelector('.circulating').innerHTML = prettyNumber(e.detail.circulating);
            this.firstElementChild.querySelector('.total').innerHTML = prettyNumber(e.detail.total);
        })
        document.addEventListener(`price-${this.symbol.toLowerCase()}-${this.dex.toLowerCase()}`, (e) => {
            this.setAttribute('price', e.detail.price);
            this.checkcap()
        })        
        this.loadsupply()            
    }
});