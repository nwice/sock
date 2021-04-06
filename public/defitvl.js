const template = document.createElement('template');
template.innerHTML = `
<table>
    <thead>
        <tr class="header">
            <td>
                <div class="center tvlhead">Total Value Locked</div>
            </td>
            <td class="total right pretty"></td>
        </tr>
    </thead>
    <tbody></tbody>
    <tfoot>
        <tr>
            <td colspan="2" class="center" style="position:relative">
                <div class="arrows hidden">
                    <button id="previous">⬅</button>
                    <button id="next">➡</button>                        
                </div>
                <span class="timestamp"></span>
            </td>
        </tr>            
    </tfoot>
</table>
`
const template2 = document.createElement('template');
template2.innerHTML = `
<tr>
    <td class="center tokens"></td>
    <td class="right pretty"></td>
</tr>
`

const tokenlink = (token) => {
    return `<a target="_blank" href="https://info.pangolin.exchange/#/token/${token.symbol}"><img class="token" src="assets/avalanche-tokens/${token.id}/logo.png"></a>`
}        

const tick = (el, v, clear) => {
    let prior = el.innerHTML.replace(/[^\d.-]/g, '');
    el.innerHTML = prettyNumber(v)
    el.classList.remove('up');            
    el.classList.remove('down');
    if ( !isNaN(parseFloat(prior)) && !clear ) {
        let plus_minus = ''
        if ( parseFloat(prior) > v ) {
            el.classList.add('down')
            plus_minus += '-'
        } else if ( parseFloat(prior) < v ) {
            el.classList.add('up')
            plus_minus += '+'
        }
        let pd = prettyDiff(Math.abs(parseFloat(prior) - v))
        el.setAttribute('tick', pd > 0 ? plus_minus + pd : '' );
    } else {
        el.removeAttribute('tick')
    }
}

document.addEventListener('tvl', (e) => {
    console.log('tvl:', e.detail);
    let tqs = `tvl-${e.detail.symbol.toLowerCase()}`;
    let tab = document.querySelector('#' + tqs)     
    
    tick(tab.querySelector('.total'), e.detail.locked, e.detail.clear)

    e.detail.pairs?.forEach(p => {
        let tk = Object.keys(p).filter(k => k.startsWith('token'));
        let qs = 'pair-' + tk.map(k => { return p[k].symbol.toLowerCase()}).sort().join('-')
        let row = tab.querySelector('#' + qs);
        if ( !row ) {
            let r = template2.content.cloneNode(true)    
            r.firstElementChild.setAttribute('id', qs);
            tk.forEach(k => {
                r.firstElementChild.querySelector('.tokens').innerHTML += '<div class="tokenlink">' + tokenlink(p[k]) + '</div>'
            })
            tab.querySelector('tbody').appendChild(r);
            row = tab.querySelector('#' + qs);
        }
        let row_td = row.querySelectorAll('td');
        tick(row_td[1], p.locked, e.detail.clear)
    })
    let tmp = new Date(e.detail.timestamp)?.toLocaleTimeString() || '';
    tab.querySelector('.timestamp').innerHTML = tmp != 'Invalid Date' ? tmp : '';

})        

const load = (symbol) => {
    fetch(`/tvl/${symbol.toLowerCase()}.json`).then( (res) => { 
        let redirect = res.headers.get('x-amz-website-redirect-location')
        if ( redirect ) {
            let rn = redirect.split('/').pop()
            rn = parseInt(rn.substring(0, rn.length - 5)) - 1
            let previous_url = `/tvl/${symbol.toLowerCase()}/${rn}.json`;
            return fetch(previous_url).then( (res2) => { 
                return res2.json()
            }).then( (previous) => {
                document.querySelector('.arrows').classList.remove('hidden')
                let previous_button = document.querySelector('#previous')
                let next_button = document.querySelector('#next')                
                previous_button.addEventListener('click', () => {                    
                    document.dispatchEvent(new CustomEvent('tvl', {
                        detail: Object.assign(previous, { clear: true })
                    }))
                    previous_button.setAttribute('disabled', 'disabled')
                    next_button.removeAttribute('disabled')
                });    
                previous_button.click();
                return res.json();                
            })                
        } else {
            return res.json();            
        }
    }).then( (info) => {

        if ( !document.querySelector('.arrows').classList.contains('hidden') ) {
            let previous_button = document.querySelector('#previous')
            let next_button = document.querySelector('#next')            
            next_button.addEventListener('click', () => {                    
                document.dispatchEvent(new CustomEvent('tvl', {
                    detail: Object.assign(info, { clear: false })
                }))
                next_button.setAttribute('disabled', 'disabled')
                previous_button.removeAttribute('disabled')
            });
            setTimeout( () => {
                next_button.click()
            }, 666 * 2)            

        } else {
            document.dispatchEvent(new CustomEvent('tvl', {
                detail: info
            }))
        }
    }).catch( (err) => {
        console.log('tvl error:', err)
        document.dispatchEvent(new CustomEvent('tvl', {
            detail: { circulating: "⛷️", symbol: getParameterByName('symbol') || 'SNOB', total: 18000000 }
        }))
    });
};

window.customElements.define('defi-tvl', class DefiTvl extends HTMLElement {

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
        let tvl_table = template.content.cloneNode(true);
        tvl_table.firstElementChild.setAttribute('id', `tvl-${this.symbol.toLowerCase()}`)
        document.body.appendChild(tvl_table);
        load(this.symbol.toLowerCase())            
    }
});        