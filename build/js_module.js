'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['boardroom-contracts'] = (function builder () {
  var environments = {};

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {};
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = environments[env];
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'BoardMemberProxy': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_board',
                'type': 'address'
              },
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_proxy',
                'type': 'address'
              },
              {
                'name': '_debatePeriod',
                'type': 'uint256'
              },
              {
                'name': '_destination',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'newProposal',
            'outputs': [
              {
                'name': 'proposalID',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_board',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_position',
                'type': 'uint256'
              }
            ],
            'name': 'vote',
            'outputs': [
              {
                'name': 'voteWeight',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_factory',
                'type': 'address'
              },
              {
                'name': '_initialAmount',
                'type': 'uint256'
              },
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_decimals',
                'type': 'uint8'
              },
              {
                'name': '_symbol',
                'type': 'string'
              }
            ],
            'name': 'createHumanStandardToken',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_board',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'execute',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_token',
                'type': 'address'
              },
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_freezer',
                'type': 'address'
              },
              {
                'name': '_daysToThaw',
                'type': 'uint256'
              }
            ],
            'name': 'freezeAllowance',
            'outputs': [
              {
                'name': 'amountFrozen',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_token',
                'type': 'address'
              },
              {
                'name': '_spender',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '6060604052610999806100126000396000f36060604052361561007f576000357c010000000000000000000000000000000000000000000000000000000090048063073cc554146100815780632a4a1b731461015f578063a5aa05451461019d578063b61d27f61461027f578063beabacc8146102e7578063d107a5cc14610327578063e1f21c671461035c5761007f565b005b6101496004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190505061039c565b6040518082815260200191505060405180910390f35b6101876004808035906020019091908035906020019091908035906020019091905050610527565b6040518082815260200191505060405180910390f35b6102536004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506105b2565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102e56004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610702565b005b61030f60048080359060200190919080359060200190919080359060200190919050506107d5565b60405180821515815260200191505060405180910390f35b6103466004808035906020019091908035906020019091905050610876565b6040518082815260200191505060405180910390f35b61038460048080359060200190919080359060200190919080359060200190919050506108f8565b60405180821515815260200191505060405180910390f35b60008773ffffffffffffffffffffffffffffffffffffffff1663ef41f95a888888888888604051877c010000000000000000000000000000000000000000000000000000000002815260040180806020018773ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018573ffffffffffffffffffffffffffffffffffffffff168152602001848152602001806020018381038352898181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561048d5780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156104e65780820380516001836020036101000a031916815260200191505b50985050505050505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150905061051c565b979650505050505050565b60008373ffffffffffffffffffffffffffffffffffffffff1663b384abef8484604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015090506105ab565b9392505050565b60008573ffffffffffffffffffffffffffffffffffffffff166308216c0f86868686604051857c010000000000000000000000000000000000000000000000000000000002815260040180858152602001806020018460ff168152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561066c5780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156106c55780820380516001836020036101000a031916815260200191505b5096505050505050506020604051808303816000876161da5a03f115610002575050506040518051906020015090506106f9565b95945050505050565b8273ffffffffffffffffffffffffffffffffffffffff166359efcb158383604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156107ab5780820380516001836020036101000a031916815260200191505b5093505050506000604051808303816000876161da5a03f115610002575050506107d0565b505050565b60008373ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8484604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f1156100025750505060405180519060200150905061086f565b9392505050565b60008273ffffffffffffffffffffffffffffffffffffffff166352ece9be83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808281526020019150506020604051808303816000876161da5a03f115610002575050506040518051906020015090506108f2565b92915050565b60008373ffffffffffffffffffffffffffffffffffffffff1663095ea7b38484604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050610992565b939250505056'
      },
      'BoardRoom': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': 'proposals',
            'outputs': [
              {
                'name': 'name',
                'type': 'string'
              },
              {
                'name': 'destination',
                'type': 'address'
              },
              {
                'name': 'proxy',
                'type': 'address'
              },
              {
                'name': 'value',
                'type': 'uint256'
              },
              {
                'name': 'hash',
                'type': 'bytes32'
              },
              {
                'name': 'executed',
                'type': 'bool'
              },
              {
                'name': 'debatePeriod',
                'type': 'uint256'
              },
              {
                'name': 'created',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'numProposals',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_voter',
                'type': 'address'
              }
            ],
            'name': 'hasVoted',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_voter',
                'type': 'address'
              }
            ],
            'name': 'voteOf',
            'outputs': [
              {
                'name': 'position',
                'type': 'uint256'
              },
              {
                'name': 'weight',
                'type': 'uint256'
              },
              {
                'name': 'created',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'rules',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'execute',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_position',
                'type': 'uint256'
              }
            ],
            'name': 'positionWeightOf',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_destination',
                'type': 'address'
              }
            ],
            'name': 'destructSelf',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_voteID',
                'type': 'uint256'
              }
            ],
            'name': 'voterAddressOf',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'numVoters',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_position',
                'type': 'uint256'
              }
            ],
            'name': 'vote',
            'outputs': [
              {
                'name': 'voterWeight',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_rules',
                'type': 'address'
              }
            ],
            'name': 'changeRules',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_proxy',
                'type': 'address'
              },
              {
                'name': '_debatePeriod',
                'type': 'uint256'
              },
              {
                'name': '_destination',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'newProposal',
            'outputs': [
              {
                'name': 'proposalID',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_rules',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_destination',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'ProposalCreated',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_position',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_voter',
                'type': 'address'
              }
            ],
            'name': 'VoteCounted',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_sender',
                'type': 'address'
              }
            ],
            'name': 'ProposalExecuted',
            'type': 'event'
          }
        ],
        'bytecode': '606060405260405160208061150a833981016040528080519060200190919050505b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b506114ae8061005c6000396000f3606060405236156100c1576000357c010000000000000000000000000000000000000000000000000000000090048063013cf08b146100c3578063400e3949146101d457806343859632146101f757806345ddc85d1461022e57806352f6747a1461027157806359efcb15146102aa5780637a43cb62146103095780639be6d4041461033e578063a294ed7a14610356578063a4b195ff146103a1578063b384abef146103cd578063c3aeacdf14610402578063ef41f95a1461041a576100c1565b005b6100d960048080359060200190919050506104ef565b60405180806020018973ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff16815260200187815260200186600019168152602001851515815260200184815260200183815260200182810382528a8181546001816001161561010002031660029004815260200191508054600181600116156101000203166002900480156101be5780601f10610193576101008083540402835291602001916101be565b820191906000526020600020905b8154815290600101906020018083116101a157829003601f168201915b5050995050505050505050505060405180910390f35b6101e160048050506105a2565b6040518082815260200191505060405180910390f35b61021660048080359060200190919080359060200190919050506105b7565b60405180821515815260200191505060405180910390f35b61024d6004808035906020019091908035906020019091905050610629565b60405180848152602001838152602001828152602001935050505060405180910390f35b61027e60048050506106b1565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103076004808035906020019091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506106d7565b005b6103286004808035906020019091908035906020019091905050610b1f565b6040518082815260200191505060405180910390f35b6103546004808035906020019091905050610b6a565b005b6103756004808035906020019091908035906020019091905050610bbb565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103b76004808035906020019091905050610c28565b6040518082815260200191505060405180910390f35b6103ec6004808035906020019091908035906020019091905050610c61565b6040518082815260200191505060405180910390f35b6104186004808035906020019091905050610fce565b005b6104d96004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050611032565b6040518082815260200191505060405180910390f35b60006000508181548110156100025790600052602060002090600b020160005b9150905080600001600050908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060030160005054908060040160005054908060050160009054906101000a900460ff16908060060160005054908060070160005054905088565b600060006000508054905090506105b4565b90565b6000600060006000508481548110156100025790600052602060002090600b020160005b5060090160005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506002016000505411156106225760019050610623565b5b92915050565b600060006000600060006000508681548110156100025790600052602060002090600b020160005b5060090160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005090508060000160005054935083508060010160005054925082508060020160005054915081505b509250925092565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600082600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166375eeadc382604051827c0100000000000000000000000000000000000000000000000000000000028152600401808281526020019150506020604051808303816000876161da5a03f115610002575050506040518051906020015015610b185760006000508481548110156100025790600052602060002090600b020160005b5091508160050160009054906101000a900460ff1615801561085657508160040160005054600019168260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16836003016000505485604051808473ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018381526020018280519060200190808383829060006004602084601f0104600f02600301f1509050019350505050604051809103902060001916145b15610b175760018260050160006101000a81548160ff02191690830217905550600073ffffffffffffffffffffffffffffffffffffffff168260020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610a0b578160020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639f0b17e38360010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846003016000505486604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156109e55780820380516001836020036101000a031916815260200191505b509450505050506000604051808303816000876161da5a03f11561000257505050610ac1565b8160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16826003016000505484604051808280519060200190808383829060006004602084601f0104600f02600301f150905090810190601f168015610a9c5780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876185025a03f1925050501515610ac057610002565b5b7f9c85b616f29fca57a17eafe71cf9ff82ffef41766e2cf01ea7f8f7878dd3ec248433604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b5b505b505050565b600060006000508381548110156100025790600052602060002090600b020160005b506008016000506000838152602001908152602001600020600050549050610b64565b92915050565b3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415610bb7578073ffffffffffffffffffffffffffffffffffffffff16ff5b5b50565b600060006000508381548110156100025790600052602060002090600b020160005b50600a0160005082815481101561000257906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610c22565b92915050565b600060006000508281548110156100025790600052602060002090600b020160005b50600a01600050805490509050610c5c565b919050565b600082600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166319eb8d483383604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015015610fc657600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166360dddfb13386604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f1156100025750505060405180519060200150915081506060604051908101604052808481526020018381526020014281526020015060006000508581548110156100025790600052602060002090600b020160005b5060090160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008201518160000160005055602082015181600101600050556040820151816002016000505590505060006000508481548110156100025790600052602060002090600b020160005b50600a016000508054806001018281815481835581811511610ee157818360005260206000209182019101610ee09190610ec2565b80821115610edc5760008181506000905550600101610ec2565b5090565b5b5050509190906000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550508160006000508581548110156100025790600052602060002090600b020160005b5060080160005060008581526020019081526020016000206000828282505401925050819055507fcb5cd4ec2855f3bd2af3ac0e4352fc4ad023e52224ddd935aac155855e0d881b848433604051808481526020018381526020018273ffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390a15b505b92915050565b3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561102e5780600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b50565b60006000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166342b4632e33604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150156114a25760006000508054809190600101909081548183558181151161127557600b0281600b0283600052602060002091820191016112749190611121565b8082111561127057600060008201600050805460018160011615610100020316600290046000825580601f106111575750611194565b601f0160209004906000526020600020908101906111939190611175565b8082111561118f5760008181506000905550600101611175565b5090565b5b506001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556002820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600382016000506000905560048201600050600090556005820160006101000a81549060ff021916905560068201600050600090556007820160005060009055600a8201600050805460008255906000526020600020908101906112659190611247565b808211156112615760008181506000905550600101611247565b5090565b5b5050600b01611121565b5090565b5b5050509150815060006000508281548110156100025790600052602060002090600b020160005b50905087816000016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106112f057805160ff1916838001178555611321565b82800160010185558215611321579182015b82811115611320578251826000505591602001919060010190611302565b5b50905061134c919061132e565b80821115611348576000818150600090555060010161132e565b5090565b5050848160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550838160030160005081905550868160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550848484604051808473ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014018381526020018280519060200190808383829060006004602084601f0104600f02600301f15090500193505050506040518091039020816004016000508190555062015180860281600601600050819055504281600701600050819055507f3417b456fad6209c73445d5efd446d686e75e4560f0f50c13b5a5cde976447b4828686604051808481526020018373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a15b5b50969550505050505056'
      },
      'BoardRoomInterface': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_voter',
                'type': 'address'
              }
            ],
            'name': 'hasVoted',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_voter',
                'type': 'address'
              }
            ],
            'name': 'voteOf',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              },
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'execute',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_position',
                'type': 'uint256'
              }
            ],
            'name': 'positionWeightOf',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_voteID',
                'type': 'uint256'
              }
            ],
            'name': 'voterAddressOf',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'numVoters',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_position',
                'type': 'uint256'
              }
            ],
            'name': 'vote',
            'outputs': [
              {
                'name': 'voteWeight',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_rules',
                'type': 'address'
              }
            ],
            'name': 'changeRules',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_proxy',
                'type': 'address'
              },
              {
                'name': '_debatePeriod',
                'type': 'uint256'
              },
              {
                'name': '_destination',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'newProposal',
            'outputs': [
              {
                'name': 'proposalID',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '606060405261038e806100126000396000f360606040523615610095576000357c010000000000000000000000000000000000000000000000000000000090048063438596321461009757806345ddc85d146100ce57806359efcb15146101115780637a43cb6214610170578063a294ed7a146101a5578063a4b195ff146101f0578063b384abef1461021c578063c3aeacdf14610251578063ef41f95a1461026957610095565b005b6100b6600480803590602001909190803590602001909190505061033e565b60405180821515815260200191505060405180910390f35b6100ed6004808035906020019091908035906020019091905050610347565b60405180848152602001838152602001828152602001935050505060405180910390f35b61016e6004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610355565b005b61018f600480803590602001909190803590602001909190505061035a565b6040518082815260200191505060405180910390f35b6101c46004808035906020019091908035906020019091905050610363565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610206600480803590602001909190505061036c565b6040518082815260200191505060405180910390f35b61023b6004808035906020019091908035906020019091905050610374565b6040518082815260200191505060405180910390f35b610267600480803590602001909190505061037d565b005b6103286004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610381565b6040518082815260200191505060405180910390f35b60005b92915050565b6000600060005b9250925092565b5b5050565b60005b92915050565b60005b92915050565b60005b919050565b60005b92915050565b5b50565b60005b969550505050505056'
      },
      'FreezerUserProxy': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_factory',
                'type': 'address'
              },
              {
                'name': '_initialAmount',
                'type': 'uint256'
              },
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_decimals',
                'type': 'uint8'
              },
              {
                'name': '_symbol',
                'type': 'string'
              }
            ],
            'name': 'createHumanStandardToken',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_freezer',
                'type': 'address'
              },
              {
                'name': '_daysToThaw',
                'type': 'uint256'
              }
            ],
            'name': 'freezeAllowance',
            'outputs': [
              {
                'name': 'amountFrozen',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_token',
                'type': 'address'
              },
              {
                'name': '_spender',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '6060604052610419806100126000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063a5aa05451461004f578063d107a5cc14610131578063e1f21c67146101665761004d565b005b6101056004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506101a6565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61015060048080359060200190919080359060200190919050506102f6565b6040518082815260200191505060405180910390f35b61018e6004808035906020019091908035906020019091908035906020019091905050610378565b60405180821515815260200191505060405180910390f35b60008573ffffffffffffffffffffffffffffffffffffffff166308216c0f86868686604051857c010000000000000000000000000000000000000000000000000000000002815260040180858152602001806020018460ff168152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102605780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102b95780820380516001836020036101000a031916815260200191505b5096505050505050506020604051808303816000876161da5a03f115610002575050506040518051906020015090506102ed565b95945050505050565b60008273ffffffffffffffffffffffffffffffffffffffff166352ece9be83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808281526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509050610372565b92915050565b60008373ffffffffffffffffffffffffffffffffffffffff1663095ea7b38484604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050610412565b939250505056'
      },
      'HumanStandardToken': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'name',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_spender',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              },
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'decimals',
            'outputs': [
              {
                'name': '',
                'type': 'uint8'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'version',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'symbol',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              },
              {
                'name': '_spender',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': 'remaining',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_initialAmount',
                'type': 'uint256'
              },
              {
                'name': '_tokenName',
                'type': 'string'
              },
              {
                'name': '_decimalUnits',
                'type': 'uint8'
              },
              {
                'name': '_tokenSymbol',
                'type': 'string'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052604060405190810160405280600481526020017f48302e310000000000000000000000000000000000000000000000000000000081526020015060066000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008c57805160ff19168380011785556100bd565b828001600101855582156100bd579182015b828111156100bc57825182600050559160200191906001019061009e565b5b5090506100e891906100ca565b808211156100e457600081815060009055506001016100ca565b5090565b5050604051610d19380380610d19833981016040528080519060200190919080518201919060200180519060200190919080518201919060200150505b83600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550836002600050819055508260036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101b257805160ff19168380011785556101e3565b828001600101855582156101e3579182015b828111156101e25782518260005055916020019190600101906101c4565b5b50905061020e91906101f0565b8082111561020a57600081815060009055506001016101f0565b5090565b505081600460006101000a81548160ff021916908302179055508060056000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061027757805160ff19168380011785556102a8565b828001600101855582156102a8579182015b828111156102a7578251826000505591602001919060010190610289565b5b5090506102d391906102b5565b808211156102cf57600081815060009055506001016102b5565b5090565b50505b50505050610a31806102e86000396000f3606060405236156100a0576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde03146100a2578063095ea7b31461011d57806318160ddd1461015457806323b872dd14610177578063313ce567146101b757806354fd4d50146101dd57806370a082311461025857806395d89b4114610284578063a9059cbb146102ff578063dd62ed3e14610336576100a0565b005b6100af600480505061036b565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561010f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61013c600480803590602001909190803590602001909190505061040c565b60405180821515815260200191505060405180910390f35b61016160048050506104e0565b6040518082815260200191505060405180910390f35b61019f60048080359060200190919080359060200190919080359060200190919050506104e9565b60405180821515815260200191505060405180910390f35b6101c460048050506106f5565b604051808260ff16815260200191505060405180910390f35b6101ea6004805050610708565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561024a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61026e60048080359060200190919050506107a9565b6040518082815260200191505060405180910390f35b61029160048050506107e7565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102f15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61031e6004808035906020019091908035906020019091905050610888565b60405180821515815260200191505060405180910390f35b61035560048080359060200190919080359060200190919050506109c8565b6040518082815260200191505060405180910390f35b60036000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104045780601f106103d957610100808354040283529160200191610404565b820191906000526020600020905b8154815290600101906020018083116103e757829003601f168201915b505050505081565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190506104da565b92915050565b60026000505481565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410158015610583575081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410155b801561058f5750600082115b156106e45781600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506106ee566106ed565b600090506106ee565b5b9392505050565b600460009054906101000a900460ff1681565b60066000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107a15780601f10610776576101008083540402835291602001916107a1565b820191906000526020600020905b81548152906001019060200180831161078457829003601f168201915b505050505081565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506107e2565b919050565b60056000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108805780601f1061085557610100808354040283529160200191610880565b820191906000526020600020905b81548152906001019060200180831161086357829003601f168201915b505050505081565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101580156108c95750600082115b156109b85781600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506109c2566109c1565b600090506109c2565b5b92915050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610a2b565b9291505056'
      },
      'HumanStandardTokenDispersal': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_accounts',
                'type': 'address[]'
              },
              {
                'name': '_accountAmounts',
                'type': 'uint256[]'
              },
              {
                'name': '_tokenName',
                'type': 'string'
              },
              {
                'name': '_decimalUnits',
                'type': 'uint8'
              },
              {
                'name': '_tokenSymbol',
                'type': 'string'
              }
            ],
            'name': 'createHumanStandardToken',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_token',
                'type': 'address'
              }
            ],
            'name': 'TokenCreated',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052611116806100126000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063949b9e101461003957610037565b005b610165600480803590602001908201803590602001919190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509090919080359060200190820180359060200191919080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050909091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610191565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600060006000600060009350600092505b89518310156101d6578883815181101561000257906020019060200201518401935083505b82806001019350506101a4565b83888888604051610d19806103fd83390180858152602001806020018460ff168152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102575780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102b05780820380516001836020036101000a031916815260200191505b509650505050505050604051809103906000f091507f2e2b3f61b70d2d131b2a807371103cc98d51adcaa5e9a8f9c32658ad8426e74e82604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a1600090505b89518110156103e8578173ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8b83815181101561000257906020019060200201518b8481518110156100025790602001906020020151604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f1156100025750505060405180519060200150505b8080600101915050610317565b8194506103f0565b5050505095945050505050566060604052604060405190810160405280600481526020017f48302e310000000000000000000000000000000000000000000000000000000081526020015060066000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008c57805160ff19168380011785556100bd565b828001600101855582156100bd579182015b828111156100bc57825182600050559160200191906001019061009e565b5b5090506100e891906100ca565b808211156100e457600081815060009055506001016100ca565b5090565b5050604051610d19380380610d19833981016040528080519060200190919080518201919060200180519060200190919080518201919060200150505b83600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550836002600050819055508260036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101b257805160ff19168380011785556101e3565b828001600101855582156101e3579182015b828111156101e25782518260005055916020019190600101906101c4565b5b50905061020e91906101f0565b8082111561020a57600081815060009055506001016101f0565b5090565b505081600460006101000a81548160ff021916908302179055508060056000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061027757805160ff19168380011785556102a8565b828001600101855582156102a8579182015b828111156102a7578251826000505591602001919060010190610289565b5b5090506102d391906102b5565b808211156102cf57600081815060009055506001016102b5565b5090565b50505b50505050610a31806102e86000396000f3606060405236156100a0576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde03146100a2578063095ea7b31461011d57806318160ddd1461015457806323b872dd14610177578063313ce567146101b757806354fd4d50146101dd57806370a082311461025857806395d89b4114610284578063a9059cbb146102ff578063dd62ed3e14610336576100a0565b005b6100af600480505061036b565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561010f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61013c600480803590602001909190803590602001909190505061040c565b60405180821515815260200191505060405180910390f35b61016160048050506104e0565b6040518082815260200191505060405180910390f35b61019f60048080359060200190919080359060200190919080359060200190919050506104e9565b60405180821515815260200191505060405180910390f35b6101c460048050506106f5565b604051808260ff16815260200191505060405180910390f35b6101ea6004805050610708565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561024a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61026e60048080359060200190919050506107a9565b6040518082815260200191505060405180910390f35b61029160048050506107e7565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102f15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61031e6004808035906020019091908035906020019091905050610888565b60405180821515815260200191505060405180910390f35b61035560048080359060200190919080359060200190919050506109c8565b6040518082815260200191505060405180910390f35b60036000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104045780601f106103d957610100808354040283529160200191610404565b820191906000526020600020905b8154815290600101906020018083116103e757829003601f168201915b505050505081565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190506104da565b92915050565b60026000505481565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410158015610583575081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410155b801561058f5750600082115b156106e45781600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506106ee566106ed565b600090506106ee565b5b9392505050565b600460009054906101000a900460ff1681565b60066000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107a15780601f10610776576101008083540402835291602001916107a1565b820191906000526020600020905b81548152906001019060200180831161078457829003601f168201915b505050505081565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506107e2565b919050565b60056000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108805780601f1061085557610100808354040283529160200191610880565b820191906000526020600020905b81548152906001019060200180831161086357829003601f168201915b505050505081565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101580156108c95750600082115b156109b85781600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506109c2566109c1565b600090506109c2565b5b92915050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610a2b565b9291505056'
      },
      'HumanStandardTokenFactory': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_initialAmount',
                'type': 'uint256'
              },
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_decimals',
                'type': 'uint8'
              },
              {
                'name': '_symbol',
                'type': 'string'
              }
            ],
            'name': 'createHumanStandardToken',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'address'
              },
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': 'created',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'humanStandardByteCode',
            'outputs': [
              {
                'name': '',
                'type': 'bytes'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'createdByMe',
            'outputs': [
              {
                'name': '',
                'type': 'address[]'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_tokenContract',
                'type': 'address'
              }
            ],
            'name': 'verifyHumanStandardToken',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040525b6000610088612710604060405190810160405280600c81526020017f56657269667920546f6b656e00000000000000000000000000000000000000008152602001506003604060405190810160405280600381526020017f565458000000000000000000000000000000000000000000000000000000000081526020015061014f565b9050610093816103a0565b60016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100e157805160ff1916838001178555610112565b82800160010185558215610112579182015b828111156101115782518260005055916020019190600101906100f3565b5b50905061013d919061011f565b80821115610139576000818150600090555060010161011f565b5090565b50505b5061156c806103de6000396000f35b6000600085858585604051610d198061194a83390180858152602001806020018460ff168152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101d45780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561022d5780820380516001836020036101000a031916815260200191505b509650505050505050604051809103906000f090508073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb3388604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015050600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080548060010182818154818355818115116103505781836000526020600020918201910161034f9190610331565b8082111561034b5760008181506000905550600101610331565b5090565b5b5050509190906000526020600020900160005b83909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555050809150610397565b50949350505050565b6020604051908101604052806000815260200150813b6040519150601f19601f602083010116820160405280825280600060208401853c505b9190505660606040526000357c01000000000000000000000000000000000000000000000000000000009004806308216c0f146100655780635f8dead31461013e578063acad94ae14610189578063dc3f65d314610204578063fc94dd181461025b57610063565b005b6101126004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610289565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61015d60048080359060200190919080359060200190919050506104da565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610196600480505061052c565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101f65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61021160048050506105cd565b60405180806020018281038252838181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050019250505060405180910390f35b6102716004808035906020019091905050610689565b60405180821515815260200191505060405180910390f35b6000600085858585604051610d198061085383390180858152602001806020018460ff168152602001806020018381038352868181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561030e5780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156103675780820380516001836020036101000a031916815260200191505b509650505050505050604051809103906000f090508073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb3388604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015050600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805480600101828181548183558181151161048a57818360005260206000209182019101610489919061046b565b80821115610485576000818150600090555060010161046b565b5090565b5b5050509190906000526020600020900160005b83909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550508091506104d1565b50949350505050565b600060005060205281600052604060002060005081815481101561000257906000526020600020900160005b915091509054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60016000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105c55780601f1061059a576101008083540402835291602001916105c5565b820191906000526020600020905b8154815290600101906020018083116105a857829003601f168201915b505050505081565b6020604051908101604052806000815260200150600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080548060200260200160405190810160405280929190818152602001828054801561067a57602002820191906000526020600020905b8160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681526020019060010190808311610646575b50505050509050610686565b90565b6000602060405190810160405280600081526020015060006106aa84610815565b9150600160005080546001816001161561010002031660029004905082511415156106d8576000925061080e565b600090505b815181101561080557600160005081815460018160011615610100020316600290048110156100025790908154600116156107275790600052602060002090602091828204019190065b9054901a7f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191682828151811015610002579060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161415156107f7576000925061080e565b5b80806001019150506106dd565b6001925061080e565b5050919050565b6020604051908101604052806000815260200150813b6040519150601f19601f602083010116820160405280825280600060208401853c505b919050566060604052604060405190810160405280600481526020017f48302e310000000000000000000000000000000000000000000000000000000081526020015060066000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008c57805160ff19168380011785556100bd565b828001600101855582156100bd579182015b828111156100bc57825182600050559160200191906001019061009e565b5b5090506100e891906100ca565b808211156100e457600081815060009055506001016100ca565b5090565b5050604051610d19380380610d19833981016040528080519060200190919080518201919060200180519060200190919080518201919060200150505b83600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550836002600050819055508260036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101b257805160ff19168380011785556101e3565b828001600101855582156101e3579182015b828111156101e25782518260005055916020019190600101906101c4565b5b50905061020e91906101f0565b8082111561020a57600081815060009055506001016101f0565b5090565b505081600460006101000a81548160ff021916908302179055508060056000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061027757805160ff19168380011785556102a8565b828001600101855582156102a8579182015b828111156102a7578251826000505591602001919060010190610289565b5b5090506102d391906102b5565b808211156102cf57600081815060009055506001016102b5565b5090565b50505b50505050610a31806102e86000396000f3606060405236156100a0576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde03146100a2578063095ea7b31461011d57806318160ddd1461015457806323b872dd14610177578063313ce567146101b757806354fd4d50146101dd57806370a082311461025857806395d89b4114610284578063a9059cbb146102ff578063dd62ed3e14610336576100a0565b005b6100af600480505061036b565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561010f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61013c600480803590602001909190803590602001909190505061040c565b60405180821515815260200191505060405180910390f35b61016160048050506104e0565b6040518082815260200191505060405180910390f35b61019f60048080359060200190919080359060200190919080359060200190919050506104e9565b60405180821515815260200191505060405180910390f35b6101c460048050506106f5565b604051808260ff16815260200191505060405180910390f35b6101ea6004805050610708565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561024a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61026e60048080359060200190919050506107a9565b6040518082815260200191505060405180910390f35b61029160048050506107e7565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102f15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61031e6004808035906020019091908035906020019091905050610888565b60405180821515815260200191505060405180910390f35b61035560048080359060200190919080359060200190919050506109c8565b6040518082815260200191505060405180910390f35b60036000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104045780601f106103d957610100808354040283529160200191610404565b820191906000526020600020905b8154815290600101906020018083116103e757829003601f168201915b505050505081565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190506104da565b92915050565b60026000505481565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410158015610583575081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410155b801561058f5750600082115b156106e45781600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506106ee566106ed565b600090506106ee565b5b9392505050565b600460009054906101000a900460ff1681565b60066000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107a15780601f10610776576101008083540402835291602001916107a1565b820191906000526020600020905b81548152906001019060200180831161078457829003601f168201915b505050505081565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506107e2565b919050565b60056000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108805780601f1061085557610100808354040283529160200191610880565b820191906000526020600020905b81548152906001019060200180831161086357829003601f168201915b505050505081565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101580156108c95750600082115b156109b85781600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506109c2566109c1565b600090506109c2565b5b92915050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610a2b565b92915050566060604052604060405190810160405280600481526020017f48302e310000000000000000000000000000000000000000000000000000000081526020015060066000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061008c57805160ff19168380011785556100bd565b828001600101855582156100bd579182015b828111156100bc57825182600050559160200191906001019061009e565b5b5090506100e891906100ca565b808211156100e457600081815060009055506001016100ca565b5090565b5050604051610d19380380610d19833981016040528080519060200190919080518201919060200180519060200190919080518201919060200150505b83600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550836002600050819055508260036000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101b257805160ff19168380011785556101e3565b828001600101855582156101e3579182015b828111156101e25782518260005055916020019190600101906101c4565b5b50905061020e91906101f0565b8082111561020a57600081815060009055506001016101f0565b5090565b505081600460006101000a81548160ff021916908302179055508060056000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061027757805160ff19168380011785556102a8565b828001600101855582156102a8579182015b828111156102a7578251826000505591602001919060010190610289565b5b5090506102d391906102b5565b808211156102cf57600081815060009055506001016102b5565b5090565b50505b50505050610a31806102e86000396000f3606060405236156100a0576000357c01000000000000000000000000000000000000000000000000000000009004806306fdde03146100a2578063095ea7b31461011d57806318160ddd1461015457806323b872dd14610177578063313ce567146101b757806354fd4d50146101dd57806370a082311461025857806395d89b4114610284578063a9059cbb146102ff578063dd62ed3e14610336576100a0565b005b6100af600480505061036b565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561010f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61013c600480803590602001909190803590602001909190505061040c565b60405180821515815260200191505060405180910390f35b61016160048050506104e0565b6040518082815260200191505060405180910390f35b61019f60048080359060200190919080359060200190919080359060200190919050506104e9565b60405180821515815260200191505060405180910390f35b6101c460048050506106f5565b604051808260ff16815260200191505060405180910390f35b6101ea6004805050610708565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561024a5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61026e60048080359060200190919050506107a9565b6040518082815260200191505060405180910390f35b61029160048050506107e7565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102f15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61031e6004808035906020019091908035906020019091905050610888565b60405180821515815260200191505060405180910390f35b61035560048080359060200190919080359060200190919050506109c8565b6040518082815260200191505060405180910390f35b60036000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104045780601f106103d957610100808354040283529160200191610404565b820191906000526020600020905b8154815290600101906020018083116103e757829003601f168201915b505050505081565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190506104da565b92915050565b60026000505481565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410158015610583575081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410155b801561058f5750600082115b156106e45781600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506106ee566106ed565b600090506106ee565b5b9392505050565b600460009054906101000a900460ff1681565b60066000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107a15780601f10610776576101008083540402835291602001916107a1565b820191906000526020600020905b81548152906001019060200180831161078457829003601f168201915b505050505081565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506107e2565b919050565b60056000508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108805780601f1061085557610100808354040283529160200191610880565b820191906000526020600020905b81548152906001019060200180831161086357829003601f168201915b505050505081565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101580156108c95750600082115b156109b85781600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506109c2566109c1565b600090506109c2565b5b92915050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610a2b565b9291505056'
      },
      'MemberProxy': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_board',
                'type': 'address'
              },
              {
                'name': '_name',
                'type': 'string'
              },
              {
                'name': '_proxy',
                'type': 'address'
              },
              {
                'name': '_debatePeriod',
                'type': 'uint256'
              },
              {
                'name': '_destination',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'newProposal',
            'outputs': [
              {
                'name': 'proposalID',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_board',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_position',
                'type': 'uint256'
              }
            ],
            'name': 'vote',
            'outputs': [
              {
                'name': 'voteWeight',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_board',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'execute',
            'outputs': [],
            'type': 'function'
          }
        ],
        'bytecode': '60606040526104bc806100126000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063073cc5541461004f5780632a4a1b731461012d578063b61d27f61461016b5761004d565b005b6101176004808035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019091908035906020019091908035906020019091908035906020019091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506101d3565b6040518082815260200191505060405180910390f35b610155600480803590602001909190803590602001909190803590602001909190505061035e565b6040518082815260200191505060405180910390f35b6101d16004808035906020019091908035906020019091908035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506103e9565b005b60008773ffffffffffffffffffffffffffffffffffffffff1663ef41f95a888888888888604051877c010000000000000000000000000000000000000000000000000000000002815260040180806020018773ffffffffffffffffffffffffffffffffffffffff1681526020018681526020018573ffffffffffffffffffffffffffffffffffffffff168152602001848152602001806020018381038352898181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102c45780820380516001836020036101000a031916815260200191505b508381038252848181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f16801561031d5780820380516001836020036101000a031916815260200191505b50985050505050505050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050610353565b979650505050505050565b60008373ffffffffffffffffffffffffffffffffffffffff1663b384abef8484604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015090506103e2565b9392505050565b8273ffffffffffffffffffffffffffffffffffffffff166359efcb158383604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156104925780820380516001836020036101000a031916815260200191505b5093505050506000604051808303816000876161da5a03f115610002575050506104b7565b50505056'
      },
      'OpenRegistry': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_someMember',
                'type': 'address'
              }
            ],
            'name': 'register',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'numMembers',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': 'members',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'name': 'isMember',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '6060604052610259806100126000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480634420e4861461005a5780634698d110146100725780635daf08ca14610095578063a230c524146100d757610058565b005b6100706004808035906020019091905050610105565b005b61007f60048050506101dd565b6040518082815260200191505060405180910390f35b6100ab60048080359060200190919050506101f2565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100ed6004808035906020019091905050610234565b60405180821515815260200191505060405180910390f35b60006000508054806001018281815481835581811511610157578183600052602060002091820191016101569190610138565b808211156101525760008181506000905550600101610138565b5090565b5b5050509190906000526020600020900160005b83909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550506001600160005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055505b50565b600060006000508054905090506101ef565b90565b600060005081815481101561000257906000526020600020900160005b9150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160005060205280600052604060002060009150909054906101000a900460ff168156'
      },
      'OpenRegistryRules': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_sender',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'canVote',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_sender',
                'type': 'address'
              }
            ],
            'name': 'canPropose',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_sender',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'votingWeightOf',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'hasWon',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'registry',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_registry',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040526040516020806106c0833981016040528080519060200190919050505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b506106648061005c6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806319eb8d481461006557806342b4632e1461009c57806360dddfb1146100ca57806375eeadc3146100ff5780637b1039991461012d57610063565b005b6100846004808035906020019091908035906020019091905050610166565b60405180821515815260200191505060405180910390f35b6100b26004808035906020019091905050610301565b60405180821515815260200191505060405180910390f35b6100e960048080359060200190919080359060200190919050506103c2565b6040518082815260200191505060405180910390f35b61011560048080359060200190919050506103d3565b60405180821515815260200191505060405180910390f35b61013a600480505061063e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60006000600060006000600060006000600060003398508873ffffffffffffffffffffffffffffffffffffffff1663013cf08b8c604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050610100604051808303816000876161da5a03f115610002575050506040518051906020018051906020018051906020018051906020018051906020018051906020018051906020018051906020015097509750975097509750975097509750600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a230c5248d604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f115610002575050506040518051906020015080156102e3575081810142105b156102f157600199506102f2565b5b50505050505050505092915050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a230c52483604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150156103bc57600190506103bd565b5b919050565b6000600190506103cd565b92915050565b6000600060006000600060006000600060006000600060006000339b508b73ffffffffffffffffffffffffffffffffffffffff1663013cf08b8f604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050610100604051808303816000876161da5a03f11561000257505050604051805190602001805190602001805190602001805190602001805190602001805190602001805190602001805190602001509a509a509a509a509a509a509a509a508b73ffffffffffffffffffffffffffffffffffffffff16637a43cb628f6000604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015092508b73ffffffffffffffffffffffffffffffffffffffff16637a43cb628f6001604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015091508b73ffffffffffffffffffffffffffffffffffffffff1663a4b195ff8f604051827c0100000000000000000000000000000000000000000000000000000000028152600401808281526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150905060008111801561061e57508282115b1561062c5760019c5061062d565b5b505050505050505050505050919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'OwnedProxy': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_destination',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'forward_transaction',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              }
            ],
            'name': 'transfer_ownership',
            'outputs': [],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          }
        ],
        'bytecode': '6060604052604051602080610390833981016040528080519060200190919050505b5b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50610307806100896000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480638da5cb5b1461004f5780639f0b17e314610088578063f0350c04146100f05761004d565b005b61005c6004805050610108565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100ee6004808035906020019091908035906020019091908035906020019082018035906020019191908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505090909190505061012e565b005b610106600480803590602001909190505061024b565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806101b55750600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15610245578273ffffffffffffffffffffffffffffffffffffffff168282604051808280519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156102205780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876185025a03f192505050151561024457610002565b5b5b505050565b3073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806102d25750600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b156103035780600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5b5056'
      },
      'Proxy': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_destination',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              },
              {
                'name': '_calldata',
                'type': 'bytes'
              }
            ],
            'name': 'forward_transaction',
            'outputs': [],
            'type': 'function'
          }
        ],
        'bytecode': '606060405260a38060106000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480639f0b17e3146037576035565b005b609b6004808035906020019091908035906020019091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050609d565b005b5b50505056'
      },
      'Rules': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_sender',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'canVote',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_sender',
                'type': 'address'
              }
            ],
            'name': 'canPropose',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_sender',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'votingWeightOf',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'hasWon',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': ''
      },
      'StandardToken': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_spender',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              },
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              },
              {
                'name': '_spender',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': 'remaining',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052610678806100126000396000f360606040523615610074576000357c010000000000000000000000000000000000000000000000000000000090048063095ea7b31461007657806318160ddd146100ad57806323b872dd146100d057806370a0823114610110578063a9059cbb1461013c578063dd62ed3e1461017357610074565b005b61009560048080359060200190919080359060200190919050506101a8565b60405180821515815260200191505060405180910390f35b6100ba600480505061027c565b6040518082815260200191505060405180910390f35b6100f86004808035906020019091908035906020019091908035906020019091905050610285565b60405180821515815260200191505060405180910390f35b6101266004808035906020019091905050610491565b6040518082815260200191505060405180910390f35b61015b60048080359060200190919080359060200190919050506104cf565b60405180821515815260200191505060405180910390f35b610192600480803590602001909190803590602001909190505061060f565b6040518082815260200191505060405180910390f35b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a360019050610276565b92915050565b60026000505481565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015801561031f575081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410155b801561032b5750600082115b156104805781600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905061048a56610489565b6000905061048a565b5b9392505050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506104ca565b919050565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101580156105105750600082115b156105ff5781600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a36001905061060956610608565b60009050610609565b5b92915050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610672565b9291505056'
      },
      'StandardTokenFreezer': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_days',
                'type': 'uint256'
              }
            ],
            'name': 'extendFreezeBy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_daysToThaw',
                'type': 'uint256'
              }
            ],
            'name': 'freezeAllowance',
            'outputs': [
              {
                'name': 'amountFrozen',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'withdrawBalance',
            'outputs': [
              {
                'name': 'amountWithdrawn',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              }
            ],
            'name': 'frozenUntil',
            'outputs': [
              {
                'name': 'thawDate',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'token',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_token',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_owner',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_daysToThaw',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': '_amountFrozen',
                'type': 'uint256'
              }
            ],
            'name': 'AllowanceFrozen',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_owner',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_days',
                'type': 'uint256'
              }
            ],
            'name': 'FreezeExtended',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': '_owner',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_amountWithdrawn',
                'type': 'uint256'
              }
            ],
            'name': 'BalanceWithdrawn',
            'type': 'event'
          }
        ],
        'bytecode': '606060405260405160208061076d833981016040528080519060200190919050505b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b506107118061005c6000396000f360606040523615610074576000357c0100000000000000000000000000000000000000000000000000000000900480633d456aa51461007657806352ece9be1461008e5780635fd8c710146100ba57806370a08231146100dd578063c215290a14610109578063fc0c546a1461013557610074565b005b61008c600480803590602001909190505061016e565b005b6100a46004808035906020019091905050610212565b6040518082815260200191505060405180910390f35b6100c760048050506104b2565b6040518082815260200191505060405180910390f35b6100f3600480803590602001909190505061066f565b6040518082815260200191505060405180910390f35b61011f60048080359060200190919050506106ad565b6040518082815260200191505060405180910390f35b61014260048050506106eb565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600081111561020e57620151808102600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507fe96f81a9463591a735651d3463d8f26e2df6f11fe9a7238a00469947de11ab043382604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b5b50565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663dd62ed3e3330604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff168152602001925050506020604051808303816000876161da5a03f1156100025750505060405180519060200150905080506000811180156102f15750600082115b80156103ca5750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd333084604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001505b156104a7576201518082024201600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000508190555080600160005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055507e7497457e586312f6d6d90ccc2ce2f44a30dfa1a8fe03f1000b8bdd46a03900338383604051808473ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a16104ac565b610002565b5b919050565b6000600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505442111561066257600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054905080506000600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb3383604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f1156100025750505060405180519060200150507fddc398b321237a8d40ac914388309c2f52a08c134e4dc4ce61e32f57cb7d80f13382604051808373ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a161066b565b6000905061066c565b5b90565b6000600160005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506106a8565b919050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506106e6565b919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'StandardTokenFreezerInterface': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_days',
                'type': 'uint256'
              }
            ],
            'name': 'extendFreezeBy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_daysToThaw',
                'type': 'uint256'
              }
            ],
            'name': 'freezeAllowance',
            'outputs': [
              {
                'name': 'amountFrozen',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'withdrawBalance',
            'outputs': [
              {
                'name': 'amountWithdrawn',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              }
            ],
            'name': 'frozenUntil',
            'outputs': [
              {
                'name': 'thawDate',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '6060604052610146806100126000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480633d456aa51461006557806352ece9be1461007d5780635fd8c710146100a957806370a08231146100cc578063c215290a146100f857610063565b005b61007b6004808035906020019091905050610124565b005b6100936004808035906020019091905050610128565b6040518082815260200191505060405180910390f35b6100b66004805050610130565b6040518082815260200191505060405180910390f35b6100e26004808035906020019091905050610136565b6040518082815260200191505060405180910390f35b61010e600480803590602001909190505061013e565b6040518082815260200191505060405180910390f35b5b50565b60005b919050565b60005b90565b60005b919050565b60005b91905056'
      },
      'Token': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': '_spender',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': 'supply',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_from',
                'type': 'address'
              },
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': '_to',
                'type': 'address'
              },
              {
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'success',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_owner',
                'type': 'address'
              },
              {
                'name': '_spender',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': 'remaining',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': '_owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': '_spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': '_value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526101db806100126000396000f360606040523615610074576000357c010000000000000000000000000000000000000000000000000000000090048063095ea7b31461007657806318160ddd146100ad57806323b872dd146100d057806370a0823114610110578063a9059cbb1461013c578063dd62ed3e1461017357610074565b005b61009560048080359060200190919080359060200190919050506101a8565b60405180821515815260200191505060405180910390f35b6100ba60048050506101b1565b6040518082815260200191505060405180910390f35b6100f860048080359060200190919080359060200190919080359060200190919050506101b7565b60405180821515815260200191505060405180910390f35b61012660048080359060200190919050506101c1565b6040518082815260200191505060405180910390f35b61015b60048080359060200190919080359060200190919050506101c9565b60405180821515815260200191505060405180910390f35b61019260048080359060200190919080359060200190919050506101d2565b6040518082815260200191505060405180910390f35b60005b92915050565b60005b90565b60005b9392505050565b60005b919050565b60005b92915050565b60005b9291505056'
      },
      'TokenFreezerRules': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '_sender',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'canVote',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_sender',
                'type': 'address'
              }
            ],
            'name': 'canPropose',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_sender',
                'type': 'address'
              },
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'votingWeightOf',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '_proposalID',
                'type': 'uint256'
              }
            ],
            'name': 'hasWon',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'token',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_freezer',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040526040516020806108a7833981016040528080519060200190919050505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5061084b8061005c6000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806319eb8d481461006557806342b4632e1461009c57806360dddfb1146100ca57806375eeadc3146100ff578063fc0c546a1461012d57610063565b005b6100846004808035906020019091908035906020019091905050610166565b60405180821515815260200191505060405180910390f35b6100b260048080359060200190919050506103ba565b60405180821515815260200191505060405180910390f35b6100e9600480803590602001909190803590602001909190505061047e565b6040518082815260200191505060405180910390f35b6101156004808035906020019091905050610538565b60405180821515815260200191505060405180910390f35b61013a6004805050610825565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60006000600060006000600060006000600060003398508873ffffffffffffffffffffffffffffffffffffffff1663013cf08b8c604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050610100604051808303816000876161da5a03f11561000257505050604051805190602001805190602001805190602001805190602001805190602001805190602001805190602001805190602001509750975097509750975097509750975060006102378d8d61047e565b118015610245575081810142105b80156102fc5750818101600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c215290a8e604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150115b801561039c5750600015158973ffffffffffffffffffffffffffffffffffffffff1663438596328d8f604051837c0100000000000000000000000000000000000000000000000000000000028152600401808381526020018273ffffffffffffffffffffffffffffffffffffffff168152602001925050506020604051808303816000876161da5a03f11561000257505050604051805190602001501515145b156103aa57600199506103ab565b5b50505050505050505092915050565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a0823184604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f115610002575050506040518051906020015011156104785760019050610479565b5b919050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a0823184604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509050610532565b92915050565b600060006000600060006000600060006000600060006000339a508a73ffffffffffffffffffffffffffffffffffffffff1663013cf08b8e604051827c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050610100604051808303816000876161da5a03f1156100025750505060405180519060200180519060200180519060200180519060200180519060200180519060200180519060200180519060200150995099509950995099509950995099508a73ffffffffffffffffffffffffffffffffffffffff16637a43cb628e6000604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015091508a73ffffffffffffffffffffffffffffffffffffffff16637a43cb628e6001604051837c010000000000000000000000000000000000000000000000000000000002815260040180838152602001828152602001925050506020604051808303816000876161da5a03f115610002575050506040518051906020015090506014600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663fc0c546a604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f115610002575050506040518051906020015073ffffffffffffffffffffffffffffffffffffffff166318160ddd604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f11561000257505050604051805190602001500482820111801561080657508181115b156108145760019b50610815565b5b5050505050505050505050919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      },
      'owned': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b609480603d6000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480638da5cb5b146037576035565b005b60426004805050606e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      this.objects[i] = this.classes[obj['class']].at(obj.address);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['boardroom-contracts'];
}
