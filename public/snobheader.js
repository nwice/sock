const template = document.createElement('template');
template.innerHTML = `
<header class="mdc-top-app-bar mdc-top-app-bar--fixed">
    <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">                        
            <div class="logo"></div>
            <p>v0.3</p>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">

            <div class="menu">

                <a href="/stablevault/">StableVault</a>
                <a href="/compound/">Compound</a>
                <a href="/earn/">Earn</a>
                <a href="/earn/">FAQ</a>                

            </div>

            <img src="assets/images/poweredbyavalanche.png"/>

            <button class="mdc-button--outlined" id="theme">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label"><ion-icon name="moon-outline" role="img" class="md hydrated" aria-label="moon outline"></ion-icon></span>
            </button>

        </section>
    </div>
</header>
`

window.customElements.define('snob-header', class SnobHeader extends HTMLElement {

    constructor() {
        super();              
    }

    toggle(e) {
        var currentTheme = document.documentElement.getAttribute("data-theme");
        var targetTheme = "light";
    
        if (currentTheme === "light") {
            targetTheme = "dark";
        }
    
        document.documentElement.setAttribute('data-theme', targetTheme)
        localStorage.setItem('theme', targetTheme);
    };
    

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
        let snob_header = template.content.cloneNode(true);
        document.body.insertBefore(snob_header, document.body.firstChild);
        document.querySelector('#theme').addEventListener('click', this.toggleMode);     
        this.toggleMode()
    }

});