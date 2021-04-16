import './defipref.js'

const defiheader = document.createElement('template');
defiheader.innerHTML = `
<header class="mdc-top-app-bar mdc-top-app-bar--fixed">
    <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">                        
            <div class="siteicon"></div>
            <nav class="menu">

                <a href="/tvl">TVL</a>
                
                <a href="/price">Pricing</a>

                <a href="/harvest">Harvest</a>

                <a href="/supply">Supply</a>

                <!---

                <a href="/compound/">Compound</a>

                <a href="/earn/">Earn SNOB</a>

                <a href="/governance/">Governance</a>

                <a href="/earn/">FAQ</a>
                --->

            </nav>            

            <img src="assets/images/avalanche.png" width="140" hspace="5"/>

            <button class="mdc-button--outlined" id="theme">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">
                    <ion-icon class="moon" name="moon-outline" role="img" class="md hydrated"></ion-icon>
                </span>
            </button>

            <defi-pref></defi-pref>

        </section>
    </div>
</header>
`

window.customElements.define('defi-header', class DefiHeader extends HTMLElement {

    constructor() {
        super();              
    }

    toggleMode(e) {
        if ( e ) {
            if ( localStorage.theme ) {
                delete localStorage.theme
            } else {                
                localStorage.theme = 'light';
            }
        }
        if ( localStorage.theme ) {
            document.documentElement.setAttribute('data-theme', 'light')                        
            this.querySelector('ion-icon').setAttribute('name', 'moon-outline')            
        } else {
            document.documentElement.removeAttribute('data-theme')
            this.querySelector('ion-icon').setAttribute('name', 'sunny')            
        }        
    }

    connectedCallback() {       
        this.appendChild(defiheader.content.cloneNode(true), document.body.firstChild);
        document.querySelector('#theme').addEventListener('click', this.toggleMode);     
        this.firstElementChild.querySelector('.siteicon').addEventListener('click', (e) => {
            document.location.href = 'https://snowball.network';
        });     
        this.toggleMode()
    }
});