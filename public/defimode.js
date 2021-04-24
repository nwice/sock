import { html, render } from './node_modules/lit-html/lit-html.js';

window.customElements.define('defi-mode', class DefiMode extends HTMLElement {
    
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
        render(
            html`
                <button class="mdc-button--outlined" id="theme">
                    <div class="mdc-button__ripple"></div>
                    <span class="mdc-button__label">
                        <ion-icon class="moon" name="moon-outline" role="img" class="md hydrated"></ion-icon>
                    </span>
                </button>
            `,
            this
        )
        this.addEventListener('click', this.toggleMode);     
        this.toggleMode()
    }

});
