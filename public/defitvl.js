const defitvl = document.createElement('template');
defitvl.innerHTML = `
<table>
    <thead>
        <tr class="header">
            <td>
                <div class="center tvlhead">Total Value Locked</div>
            </td>
            <td class="total right pretty"></td>
            <!---
            <td class="1hour"></td>
            <td class="1day"></td>
            <td class="1week"></td>
            --->
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
            <!---
            <td class="1hour"></td>
            <td class="1day"></td>
            <td class="1week"></td>
            --->
        </tr>            
    </tfoot>
</table>
`
const defitvl_tr = document.createElement('template');
defitvl_tr.innerHTML = `
<tr>
    <td class="pairtokens"></td>
    <td class="right pretty"></td>
</tr>
`

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

window.customElements.define('defi-tvl', class DefiTvl extends HTMLElement {

    constructor() {
        super();        
    }

    loadtvl() {
        fetch(`/dex/${this.hash.toLowerCase()}/tvl.json?cb=${ new Date().getTime() }`).then( (res) => { 
            let redirect = res.headers.get('x-amz-website-redirect-location')
            if ( redirect && false ) {
                let rn = redirect.split('/').pop()
                rn = parseInt(rn.substring(0, rn.length - 5)) - 6
                let previous_url = `/tvl/${this.hash.toLowerCase()}/${rn}.json`;
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
                detail: { somethin: "⛷️", hash: getParameterByName('hash') || '0xC38f41A296A4493Ff429F1238e030924A1542e50' }
            }))
        });
    } 

    listento() {
        return `tvl-${this.hash.toLowerCase()}`;
    }
    
    get hash() {
        return this.getAttribute('hash');
    }
      
    set hash(hash) {
        this.setAttribute('hash', hash);
    }    

    connectedCallback() {       
        this.appendChild(defitvl.content.cloneNode(true));
        document.addEventListener('tvl', (e) => {
            console.log('tvl:', e.detail);
            let table = this.firstElementChild;
            
            tick(table.querySelector('.total'), e.detail.locked, e.detail.clear)        
            
            e.detail.pairs?.forEach(p => {
                console.log('p:', p)
                let tk = Object.keys(p).filter(k => { return k.startsWith('token') && !k.endsWith('Price') });
                console.log(tk)
                let qs = 'pair-' + tk.map(k => { return p[k].id.toLowerCase()}).sort().join('-')
                let row = table.querySelector('#' + qs);
                if ( !row ) {
                    let tr = defitvl_tr.content.cloneNode(true)    
                    tr.firstElementChild.setAttribute('id', qs);
                    tk.forEach(k => {
                        tr.firstElementChild.querySelector('.pairtokens').innerHTML += `<defi-price hash="${p[k].id}"></defi-price>`
                    })
                    table.querySelector('tbody').appendChild(tr);
                    row = table.querySelector('#' + qs);
                }
                let row_td = row.querySelectorAll(':scope > td');
                tick(row_td[1], p.locked.toFixed(0), e.detail.clear)
            })
            let tmp = new Date(e.detail.timestamp)?.toLocaleTimeString() || '';
            table.querySelector('.timestamp').innerHTML = tmp != 'Invalid Date' ? tmp : '';
        
        })        
        this.loadtvl()        
    }
});        