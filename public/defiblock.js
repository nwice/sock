const defiblock = document.createElement('template');
defiblock.innerHTML = `
<div>
    <div class="blockNumber"></div>
</div>
`

window.customElements.define('defi-block', class DefiFooter extends HTMLElement {

    constructor() {
        super();              
    }

    connectedCallback() {
        this.appendChild(defifooter.content.cloneNode(true));        
    }

});