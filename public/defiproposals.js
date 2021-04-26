import { html, render } from './node_modules/lit-html/lit-html.js';
import { abi_proposals } from './abi/abi_gov.js';
import { dexes } from './state.js'
import './defiprice.js'

const range = (size, startAt = 0) => {
  return [...Array(size).keys()].map(i => i + startAt);
}

window.customElements.define('defi-proposals', class DefiProposals extends HTMLElement {

    static get properties() {
      return {
        proposals: { type: Array }
      };
    }

    constructor() {
      super();              
      this.proposals = [];
    }

    doRender() {
      render(html`<table id="governance">
        <thead>
            <tr>
                <th></th>
                <th>ID</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Proposer</th>
                <th>Votes For</th>
                <th>Votes Against</th>
                <th>Canceled</th>
                <th>Executed</th>            
                <th></th>
            </tr>
        </thead>
        <tbody>
        ${this.proposals.map(po => html`
            <tr class="governance"><td rowspan="${po.proposals.length + 1}">
                <defi-price hash=${po.gov.id}></defi-price>                
                <div style="text-align:center">
                  <a href="https://cchain.explorer.avax.network/address/${po.gov.governance}">Governane Contract</a>
                </div>
            </td></tr>
            ${po.proposals.map(proposal => {
              let now = new Date();
              let st = new Date(parseInt(proposal.startTime) * 1000);
              let et = new Date(parseInt(proposal.endTime) * 1000);
              let open = false;
              if ( st.getTime() < now.getTime() && now.getTime() < et.getTime() ) {
                open = true
              }
              return html` 
                <tr>                  
                  <td>${proposal.id} <img src="/assets/images/json-file.svg" width="20" class="json"></td>
                  <td class="right">${st.toLocaleDateString() }</td>
                  <td class="right">${et.toLocaleDateString() }</td>
                  <td><a href="https://cchain.explorer.avax.network/address/${proposal.proposer}">${proposal.proposer.toLowerCase()}</a></td>
                  <td class="right">${(parseInt(proposal.forVotes) / 1e18).toFixed(2) }</td>
                  <td class="right">${(parseInt(proposal.againstVotes) / 1e18).toFixed(2)}</td>
                  <td class="center">${proposal.canceled}</td>
                  <td class="center">${proposal.executed}</td>                  
                  <td class="bold center">${open?'vote':''}</td>
                </tr>`})}          
        </tr>`)}            
        </tbody>            
        </table>`, 
        this 
      )      
    }

    connectedCallback() {      
      let web3 = new Web3('wss://api.avax.network/ext/bc/C/ws');            
      dexes.filter(d => d?.governance).forEach(d => {       
        console.log('governance contract:', d.governance)
        let contract = new web3.eth.Contract(abi_proposals, d.governance );
        
        contract.methods.proposalCount().call().then(result => {
          
          return Promise.all(range(parseInt(result), 1).map( (proposalId) => {
              return contract.methods.proposals(proposalId).call()
          }));
        }).then(res => {
          console.log(res)
          this.proposals.push({proposals: res, gov: d })
          this.doRender()
        })
      })              
    }
});