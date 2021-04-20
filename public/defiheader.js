import './defipref.js'
import './defimode.js'
import './defiweb3.js'
import './defiwallet.js'

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

            <img id="avalabs" src="assets/images/avalanche.png" width="140" hspace="5"/>

            <menu>
                <defi-pref></defi-pref>

                <defi-mode></defi-mode>

                <defi-web3></defi-web3>

                <defi-wallet></defi-wallet>
            </menu>

        </section>
    </div>
</header>
`

const deficonsent = document.createElement('template');
deficonsent.innerHTML = `
<div class="consent">
    Consent
</div>
`
const deficanvans = document.createElement('template');
deficanvans.innerHTML = `
<canvas id="edge"></canvas>
`

window.customElements.define('defi-header', class DefiHeader extends HTMLElement {

    constructor() {
        super();              
    }

    connectedCallback() {       
        this.appendChild(defiheader.content.cloneNode(true));
        this.firstElementChild.querySelector('.siteicon').addEventListener('click', (e) => {
            document.location.href = 'https://snowball.network';
        });
        let ct = deficanvans.content.cloneNode(true);
        ct.firstElementChild.setAttribute('width', window.innerWidth + 'px');
        ct.firstElementChild.setAttribute('height', '4px');        
        this.appendChild(ct);

        let draw = () => {
            let edge = this.querySelector('canvas#edge');
            let ctx = edge.getContext('2d');
            let color = getComputedStyle(document.documentElement).getPropertyValue('--mdc-theme-primary'); 
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, edge.width, edge.height);    
            return this.querySelector('canvas#edge').toDataURL();
        }

        let resize = () => {
            let resize = this.querySelector('canvas#edge');
            resize.setAttribute('width', window.innerWidth + 'px')
            resize.setAttribute('height', '4px')    
            let url = 'url(' + draw() + ')'
            document.documentElement.style.setProperty('--edge-data-image', url);
        }
        document.querySelector('#theme').addEventListener('click', resize);
        window.addEventListener('resize', resize , false);
        resize()
    }

});