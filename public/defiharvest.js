const defiharvest = document.createElement('template');
defiharvest.innerHTML = `
<table>
    <thead><tr><th class="strategy"></th></tr></thead>
</table>
`
const defiharvest_tr = document.createElement('template');
defiharvest_tr.innerHTML = `
<tr>
    <td></td>
</tr>
`     

window.customElements.define('defi-harvest', class DefiTvl extends HTMLElement {

    constructor() {
        super();        
    }

    static get observedAttributes() {
        return ['dex', 'strategy'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'dex':
                console.log('dex:', newValue);
                break;            
            case 'strategy':
                console.log('strategy:', newValue);
                break;
        }
    }

    get strategy() {
        return this.getAttribute('strategy');
    }
      
    set strategy(ns) {
        this.setAttribute('strategy', ns);
    }

    get dex() {
        return this.getAttribute('dex');
    }
      
    set dex(nd) {
        this.setAttribute('dex', nd);
    }
      
    connectedCallback() {       
        this.appendChild(defiharvest.content.cloneNode(true));
    }

});