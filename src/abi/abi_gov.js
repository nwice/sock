const abi_proposals = [{
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "proposals",
    "outputs": [
      {
        "name": "id",
        "type": "uint256"
      },
      {
        "name": "proposer",
        "type": "address"
      },
      {
        "name": "eta",
        "type": "uint256"
      },
      {
        "name": "startTime",
        "type": "uint256"
      },
      {
        "name": "endTime",
        "type": "uint256"
      },
      {
        "name": "startBlock",
        "type": "uint256"
      },
      {
        "name": "forVotes",
        "type": "uint256"
      },
      {
        "name": "againstVotes",
        "type": "uint256"
      },
      {
        "name": "canceled",
        "type": "bool"
      },
      {
        "name": "executed",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "proposalCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
  "constant": true,
  "inputs": [],
  "name": "name",
  "outputs": [{
          "name": "",
          "type": "string"
  }],
  "payable": false,
  "stateMutability": "view",
  "type": "function"
}]
export { abi_proposals }