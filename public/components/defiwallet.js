const defiwallet = document.createElement('template');
defiwallet.innerHTML = `
<button class="mdc-button--outlined" id="wallet">
    <div class="mdc-button__ripple"></div>
    <span class="mdc-button__label">
        <ion-icon name="wallet-outline"></ion-icon>
    </span>
</button>
`

window.customElements.define('defi-wallet', class DefiWallet extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {       
        this.appendChild(defiwallet.content.cloneNode(true));
    }

});