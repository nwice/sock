import { html, render } from './node_modules/lit-html/lit-html.js';

import './defipref.js'
import './defimode.js'
import './defiweb3.js'
import './defiwallet.js'


const site = (href) => {
    let sl = href.split('.').length
    if ( sl == 2 ) {
        return href.split('.')[0]
    } else if ( sl == 3 ) {
        return href.split('.')[1]
    } else {
        return 'powder'
    }
}

window.customElements.define('defi-header', class DefiHeader extends HTMLElement {

    constructor() {
        super();              
    }

    get theme() {
        if ( localStorage.theme ) {
            return 'dark'
        } else {
            return 'light'
        }    
    }

    doRender() {
        render(
            html`
            <header class="mdc-top-app-bar mdc-top-app-bar--fixed">
                <div class="mdc-top-app-bar__row">
                    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">                        
                        <div><img src="/assets/images/${site(window.location.hostname)}-${this.theme}.png" height="80"/></div>
                        <nav class="menu"></nav>            

                        <img id="avalabs" src="assets/images/avalanche.png" width="140" hspace="5"/>
                        
                        <menu>
                            <defi-mode></defi-mode>
                            <!---
                            <defi-pref></defi-pref>
                            <defi-web3></defi-web3>
                            <defi-wallet></defi-wallet>
                            --->
                        </menu>
                    </section>
                </div>
            </header>
            <canvas id="edge"
            height="4px"
            width="${ window.innerWidth }px"></canvas>
            `,
            this
        )         
    }

    connectedCallback() {   
        this.doRender()
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
            this.doRender()
        }
        this.querySelector('defi-mode').addEventListener('click', resize);
        window.addEventListener('resize', resize , false);
        resize()
    }

});