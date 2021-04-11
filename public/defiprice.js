const defiprice = document.createElement('template');
defiprice.innerHTML = `
<table>
    <tbody>
        <tr>
            <td rowspan="2" class="logowrap">
                <span class="hash" onClick="clippy(this)"></span>
            </td>
            <td class="pricesymbol"></td>            
        </tr>
        <tr class="pricing">
            <td class="pricetd pretty"></td>
        </tr>
    </tbody>
</table>
`

const numberformat = (price) => {
    if ( isNaN(price) ) return price
    if ( price > 1000 ) return price.toFixed(0)
    if ( price > 100 ) return price.toFixed(1)
    if ( price > 10 ) return price.toFixed(2)
    if ( price > 1 ) return price.toFixed(3)
    if ( price < .01 ) return  price.toFixed(8)
    return price.toFixed(4)    
}

window.customElements.define('defi-price', class DefiPrice extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return ['hash', 'symbol', 'price'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'price':
                let pricetd = this.querySelector('.pricetd');
                if ( pricetd ) {
                    let new_price = parseFloat(newValue);
                    pricetd.innerHTML = numberformat(new_price);                                
                    let old_price = parseFloat(oldValue);
                    if (old_price) {
                        if (parseFloat(old_price) < new_price) {
                            pricetd.classList.remove('down')
                            pricetd.classList.add('up')
                        } else if (parseFloat(old_price) > new_price) {
                            pricetd.classList.remove('up')
                            pricetd.classList.add('down')
                        }
                    } else {
                        pricetd.classList.remove('up')
                        pricetd.classList.remove('down')
                    }                    
                }                
                break;            
            case 'symbol':
                if ( this.querySelector('.pricesymbol') ) {
                    this.querySelector('.pricesymbol').innerHTML = newValue;
                }                
                break;
            case 'hash':
                if ( this.querySelector('.logowrap img') ) return;                
                let logo = new Image()
                logo.classList.add('pricelogo')
                this.querySelector('.logowrap').appendChild(logo)
                logo.onerror = () => {
                    logo.src = 'data:image/png;base64,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';
                }
                logo.src = `/assets/avalanche-tokens/${newValue.toLowerCase()}/logo.png`;
                this.querySelector('.hash').innerHTML = newValue
                break;
        }
    }

    maybefirst(price) {
        this.hash = price.id
        this.symbol = price.symbol
    }

    priceload() {
        fetch(`/dex/${this.dex.toLowerCase()}/price/${this.symbol.toLowerCase()}.json`).then((res) => {
            let redirect = res.headers.get('x-amz-website-redirect-location')
            if (redirect && getParameterByName('noticks') == null) {
                let rn = redirect.split('/').pop()
                rn = parseInt(rn.substring(0, rn.length - 5)) - 1
                let previous_url = `/dex/${this.dex.toLowerCase()}/price/${this.symbol.toLowerCase()}/${rn}.json`;
                return fetch(previous_url).then((res2) => {
                    return res2.json()
                }).then((previous) => {
                    this.maybefirst(previous);
                    document.dispatchEvent(new CustomEvent(this.listento(), {
                        detail: previous
                    }))
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(res.json());
                        }, 666 * 2);
                    })
                }).catch( err => {
                    return res.json();    
                })
            } else {
                return res.json();
            }
        }).then((now) => {
            this.maybefirst(now)            
            document.dispatchEvent(new CustomEvent(this.listento(), {
                detail: now
            }))
        }).catch((err) => {
            document.dispatchEvent(new CustomEvent(this.listento(), {
                detail: { price: "⛷️", symbol: this.symbol, id: "⛷️", dex: 'png' }
            }))
        });
    }

    listento() {
        return `price-${this.symbol.toLowerCase()}-${this.dex.toLowerCase()}`;
    }

    get symbol() {
        return this.getAttribute('symbol');
    }

    set symbol(symbol) {
        this.setAttribute('symbol', symbol);
    }

    get dex() {
        return this.getAttribute('dex') ? this.getAttribute('dex') : 'png';
    }

    set dex(nd) {
        this.setAttribute('dex', nd);
    }

    get hash() {
        return this.getAttribute('hash');
    }

    set hash(hash) {
        this.setAttribute('hash', hash);
    }

    connectedCallback() {
        this.appendChild(defiprice.content.cloneNode(true));        
        document.addEventListener(this.listento(), (e) => {
            this.setAttribute('price', e.detail.price)
        })

        this.priceload()
    }
});