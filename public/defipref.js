const defipref = document.createElement('template');
defipref.innerHTML = `
<button class="mdc-button--outlined" id="pref">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">
            <ion-icon name="settings-outline"></ion-icon>
        </span>
</button>
`

const defimodal = document.createElement('template');
defimodal.innerHTML = `
<div class="mdc-dialog">
  hello 3
  <div class="mdc-dialog__container">
    hello 2
    <div class="mdc-dialog__surface"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="preferences"
      aria-describedby="preferences-content">
      <div class="mdc-dialog__content" id="preferences-content">
        hello
        <button onClick="localStorage.clear()">Clear</button>
      </div>
      <div class="mdc-dialog__actions">
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Close</span>
        </button>        
      </div>
    </div>
  </div>
  <div class="mdc-dialog__scrim">hello 4</div>
</div>
`

window.customElements.define('defi-pref', class DefiPref extends HTMLElement {
    
    constructor() {
        super();
    }

    checking() {
        console.log('checking')
    }

    get prefix() {
        return this.getAttribute('prefix') ? this.getAttribute('prefix') : '/';
    }

    set prefix(np) {
        this.setAttribute('prefix', np);
    }

    connectedCallback() {
        this.appendChild(defipref.content.cloneNode(true));        
        this.appendChild(defimodal.content.cloneNode(true));  

        const dialog = new mdc.dialog.MDCDialog(document.querySelector('.mdc-dialog'));

        this.firstElementChild.addEventListener('click', (e) => {
            dialog.open()
        })
    }

});
