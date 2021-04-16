const defifooter = document.createElement('template');
defifooter.innerHTML = `
<footer>
    <div class="timestamp"></div>
</footer>
`

window.customElements.define('defi-footer', class DefiFooter extends HTMLElement {

    constructor() {
        super();              
    }

    connectedCallback() {
        this.appendChild(defifooter.content.cloneNode(true));        
    }

});