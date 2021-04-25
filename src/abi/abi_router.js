[
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountA",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountB",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "liquidity",
            "internalType": "uint256"
         }
      ],
      "name": "addLiquidity",
      "inputs": [
         {
            "type": "address",
            "name": "tokenA",
            "internalType": "address"
         },
         {
            "type": "address",
            "name": "tokenB",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "amountADesired",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountBDesired",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAMin",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountBMin",
            "internalType": "uint256"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "payable",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountToken",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAVAX",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "liquidity",
            "internalType": "uint256"
         }
      ],
      "name": "addLiquidityAVAX",
      "inputs": [
         {
            "type": "address",
            "name": "token",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "amountTokenDesired",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountTokenMin",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAVAXMin",
            "internalType": "uint256"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
         {
            "type": "address",
            "name": "",
            "internalType": "address"
         }
      ],
      "name": "factory",
      "inputs": []
   },
   {
      "type": "function",
      "stateMutability": "pure",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountIn",
            "internalType": "uint256"
         }
      ],
      "name": "getAmountIn",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountOut",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "reserveIn",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "reserveOut",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "pure",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountOut",
            "internalType": "uint256"
         }
      ],
      "name": "getAmountOut",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountIn",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "reserveIn",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "reserveOut",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
         {
            "type": "uint256[]",
            "name": "amounts",
            "internalType": "uint256[]"
         }
      ],
      "name": "getAmountsIn",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountOut",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
         {
            "type": "uint256[]",
            "name": "amounts",
            "internalType": "uint256[]"
         }
      ],
      "name": "getAmountsOut",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountIn",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "pure",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountB",
            "internalType": "uint256"
         }
      ],
      "name": "quote",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountA",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "reserveA",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "reserveB",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountA",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountB",
            "internalType": "uint256"
         }
      ],
      "name": "removeLiquidity",
      "inputs": [
         {
            "type": "address",
            "name": "tokenA",
            "internalType": "address"
         },
         {
            "type": "address",
            "name": "tokenB",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "liquidity",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAMin",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountBMin",
            "internalType": "uint256"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountToken",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAVAX",
            "internalType": "uint256"
         }
      ],
      "name": "removeLiquidityAVAX",
      "inputs": [
         {
            "type": "address",
            "name": "token",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "liquidity",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountTokenMin",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAVAXMin",
            "internalType": "uint256"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountAVAX",
            "internalType": "uint256"
         }
      ],
      "name": "removeLiquidityAVAXSupportingFeeOnTransferTokens",
      "inputs": [
         {
            "type": "address",
            "name": "token",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "liquidity",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountTokenMin",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAVAXMin",
            "internalType": "uint256"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountToken",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAVAX",
            "internalType": "uint256"
         }
      ],
      "name": "removeLiquidityAVAXWithPermit",
      "inputs": [
         {
            "type": "address",
            "name": "token",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "liquidity",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountTokenMin",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAVAXMin",
            "internalType": "uint256"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         },
         {
            "type": "bool",
            "name": "approveMax",
            "internalType": "bool"
         },
         {
            "type": "uint8",
            "name": "v",
            "internalType": "uint8"
         },
         {
            "type": "bytes32",
            "name": "r",
            "internalType": "bytes32"
         },
         {
            "type": "bytes32",
            "name": "s",
            "internalType": "bytes32"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountAVAX",
            "internalType": "uint256"
         }
      ],
      "name": "removeLiquidityAVAXWithPermitSupportingFeeOnTransferTokens",
      "inputs": [
         {
            "type": "address",
            "name": "token",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "liquidity",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountTokenMin",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAVAXMin",
            "internalType": "uint256"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         },
         {
            "type": "bool",
            "name": "approveMax",
            "internalType": "bool"
         },
         {
            "type": "uint8",
            "name": "v",
            "internalType": "uint8"
         },
         {
            "type": "bytes32",
            "name": "r",
            "internalType": "bytes32"
         },
         {
            "type": "bytes32",
            "name": "s",
            "internalType": "bytes32"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256",
            "name": "amountA",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountB",
            "internalType": "uint256"
         }
      ],
      "name": "removeLiquidityWithPermit",
      "inputs": [
         {
            "type": "address",
            "name": "tokenA",
            "internalType": "address"
         },
         {
            "type": "address",
            "name": "tokenB",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "liquidity",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountAMin",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountBMin",
            "internalType": "uint256"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         },
         {
            "type": "bool",
            "name": "approveMax",
            "internalType": "bool"
         },
         {
            "type": "uint8",
            "name": "v",
            "internalType": "uint8"
         },
         {
            "type": "bytes32",
            "name": "r",
            "internalType": "bytes32"
         },
         {
            "type": "bytes32",
            "name": "s",
            "internalType": "bytes32"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "payable",
      "outputs": [
         {
            "type": "uint256[]",
            "name": "amounts",
            "internalType": "uint256[]"
         }
      ],
      "name": "swapAVAXForExactTokens",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountOut",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "payable",
      "outputs": [
         {
            "type": "uint256[]",
            "name": "amounts",
            "internalType": "uint256[]"
         }
      ],
      "name": "swapExactAVAXForTokens",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountOutMin",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "payable",
      "outputs": [],
      "name": "swapExactAVAXForTokensSupportingFeeOnTransferTokens",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountOutMin",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256[]",
            "name": "amounts",
            "internalType": "uint256[]"
         }
      ],
      "name": "swapExactTokensForAVAX",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountIn",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountOutMin",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "swapExactTokensForAVAXSupportingFeeOnTransferTokens",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountIn",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountOutMin",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256[]",
            "name": "amounts",
            "internalType": "uint256[]"
         }
      ],
      "name": "swapExactTokensForTokens",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountIn",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountOutMin",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountIn",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountOutMin",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256[]",
            "name": "amounts",
            "internalType": "uint256[]"
         }
      ],
      "name": "swapTokensForExactAVAX",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountOut",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountInMax",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [
         {
            "type": "uint256[]",
            "name": "amounts",
            "internalType": "uint256[]"
         }
      ],
      "name": "swapTokensForExactTokens",
      "inputs": [
         {
            "type": "uint256",
            "name": "amountOut",
            "internalType": "uint256"
         },
         {
            "type": "uint256",
            "name": "amountInMax",
            "internalType": "uint256"
         },
         {
            "type": "address[]",
            "name": "path",
            "internalType": "address[]"
         },
         {
            "type": "address",
            "name": "to",
            "internalType": "address"
         },
         {
            "type": "uint256",
            "name": "deadline",
            "internalType": "uint256"
         }
      ]
   },
   {
      "type": "receive",
      "stateMutability": "payable"
   }
]