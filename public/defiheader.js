import { html, render } from './node_modules/lit-html/lit-html.js';

import './defipref.js'
import './defimode.js'
import './defiweb3.js'
import './defiwallet.js'

const defiheader = html`
<header class="mdc-top-app-bar mdc-top-app-bar--fixed">
    <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">                        
            <div class="sniglet">Powder</div>
            <nav class="menu"></nav>            

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
<canvas id="edge"
height="4px"
width="${ window.innerWidth }px"></canvas>
`

window.customElements.define('defi-header', class DefiHeader extends HTMLElement {

    constructor() {
        super();              
    }

    connectedCallback() {   

        render(
            defiheader,
            this
        ) 

        let draw = () => {
            let edge = this.querySelector('canvas#edge');
            let ctx = edge.getContext('2d');
            let color = getComputedStyle(document.documentElement).getPropertyValue('--mdc-theme-primary'); 
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, edge.width, edge.height);    
            return this.querySelector('canvas#edge').toDataURL();
        }

        let resize = () => {
            let url = 'url(' + draw() + ')'
            document.documentElement.style.setProperty('--edge-data-image', url);
        }
        this.querySelector('defi-mode').addEventListener('click', resize);
        window.addEventListener('resize', resize , false);
        resize()
    }

});