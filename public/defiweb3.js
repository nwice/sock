const defiweb3 = document.createElement('template');
defiweb3.innerHTML = `
<button class="mdc-button--outlined" id="web3">
    <div class="mdc-button__ripple"></div>
    <span class="mdc-button__label">
        <ion-icon name="pulse-outline"></ion-icon>
    </span>
</button>
`

window.customElements.define('defi-web3', class DefiWeb3 extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {       
        this.appendChild(defiweb3.content.cloneNode(true));
    }

});