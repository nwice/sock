const template = document.createElement('template');
template.innerHTML = `
    <table>
        <tbody>
            <tr>
                <td rowspan="2" class="token"></td>            
                <td>Circulating Supply</td>
                <td class="right circulating pretty"></td>
            </tr>
            <tr>
                <td>Max Supply</td>
                <td class="right total pretty"></td>
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
                return fetch(previous_url).then( (res2) => { 
                    return res2.json()
                }).then( (previous) => {
                    document.dispatchEvent(new CustomEvent('supply', {
                        detail: previous
                    }))
                    return new Promise( (resolve) => {
                        setTimeout( () => {
                            resolve(res.json());        
                        }, 666 * 3 );
                    })
                })                
            } else {
                return res.json();            
            }
        }).then( (info) => {
            document.dispatchEvent(new CustomEvent(`supply-${this.symbol.toLowerCase()}`, {
                detail: info
            }))
        }).catch( (err) => {
            document.dispatchEvent(new CustomEvent(`supply-${this.symbol.toLowerCase()}`, {
                detail: { circulating: "⛷️", symbol: getParameterByName('symbol') || 'SNOB', total: 18000000 }
            }))
        });
    };

    get symbol() {
        return this.getAttribute('symbol');
    }
      
    set symbol(ns) {
        this.setAttribute('symbol', ns);
    }

    connectedCallback() {       
        this.appendChild(template.content.cloneNode(true));
        this.firstElementChild.querySelector('.token').innerHTML = `<defi-price symbol="${this.symbol.toLowerCase()}"></defi-price>`
        document.addEventListener(`supply-${this.symbol.toLowerCase()}`, (e) => {
            this.firstElementChild.querySelector('.circulating').innerHTML = prettyNumber(e.detail.circulating);
            this.firstElementChild.querySelector('.total').innerHTML = prettyNumber(e.detail.total);
        })
        this.loadsupply()            
    }
});        