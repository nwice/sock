const template = document.createElement('template');
template.innerHTML = `
    <table>
        <tbody>
            <tr>
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

document.addEventListener('supply', (e) => {
    console.log(e)
    let pe = document.querySelector(`#supply-${e.detail.symbol.toLowerCase()}`)
    pe.querySelector('.circulating').innerHTML = prettyNumber(e.detail.circulating);
    pe.querySelector('.total').innerHTML = prettyNumber(e.detail.total);
})        

const load = (symbol) => {
    fetch(`/supply/${symbol.toLowerCase()}.json`).then( (res) => { 
        let redirect = res.headers.get('x-amz-website-redirect-location')
        if ( redirect ) {
            let rn = redirect.split('/').pop()
            rn = parseInt(rn.substring(0, rn.length - 5)) - 1
            let previous_url = `/supply/${symbol.toLowerCase()}/${rn}.json`;
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
        document.dispatchEvent(new CustomEvent('supply', {
            detail: info
        }))
    }).catch( (err) => {
        document.dispatchEvent(new CustomEvent('supply', {
            detail: { circulating: "⛷️", symbol: getParameterByName('symbol') || 'SNOB', total: 18000000 }
        }))
    });
};

window.customElements.define('defi-supply', class DefiSupply extends HTMLElement {

    constructor() {
        super();        
    }

    get symbol() {
        return this.getAttribute('symbol');
    }
      
    set symbol(ns) {
        this.setAttribute('symbol', ns);
    }

    connectedCallback() {       
        let supply_table = template.content.cloneNode(true);
        supply_table.firstElementChild.setAttribute('id', `supply-${this.symbol.toLowerCase()}`)
        document.body.appendChild(supply_table);
        load(this.symbol.toLowerCase())            
    }
});        