const defiheader = document.createElement('template');
defiheader.innerHTML = `
<header class="mdc-top-app-bar mdc-top-app-bar--fixed">
    <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">                        
            <div class="logo"></div>
            <p>v0.3</p>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">

            <nav class="menu">

                <a href="/stablevault/">StableVault</a>

                <a href="/compound/">Compound</a>

                <a href="/earn/">Earn</a>

                <a href="/earn/">FAQ</a>                

            </nav>

            <img src="assets/images/poweredbyavalanche.png"/>

            <button class="mdc-button--outlined" id="theme">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label"><ion-icon name="moon-outline" role="img" class="md hydrated" aria-label="moon outline"></ion-icon></span>
            </button>

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
        } else {
            document.documentElement.removeAttribute('data-theme')
        }        
    }

    connectedCallback() {       
        

        document.body.insertBefore(defiheader.content.cloneNode(true), document.body.firstChild);
        document.querySelector('#theme').addEventListener('click', this.toggleMode);     
        this.toggleMode()
    }

});

window.addEventListener('load', () => {
    let style = document.createElement('style');
    style.appendChild(document.createTextNode(`
    .logo {
        background-image: var(--logo-image);
        height: 80px;
        width: 240px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
    nav {
        width: 100%;            
    }
    .mdc-top-app-bar {
        padding-left: var(--header-padding);
        padding-right: var(--header-padding);
        background-color: var(--header-bg-color);
        color: var(--header-color);
    }
    .mdc-top-app-bar a {
        font-weight: 700;
        font-size: var(--header-fontsize);
        color: var(--header-link-color);
        text-decoration: none;            
    }
    .mdc-top-app-bar a:hover {
        color: var(--header-link-color-hover)
    }
    
    .mdc-top-app-bar--fixed .mdc-top-app-bar__row {
        height: 95px;
    }
    
    ion-icon {
        font-size: 20px;
    }
    `));
    document.head.appendChild(style)
});