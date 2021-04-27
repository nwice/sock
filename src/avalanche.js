const topics = {
    
    '0xb0e0a660b4e50f26f0b7ce75c24655fc76cc66e3334a54ff410277229fa10bd4': 'punk no longer for sale',
    '0x05af636b70da6819000c49f85b21fa82081c632069bb626f30932034099107d8': 'punk transfer',
    '0x3c7b682d5da98001a9b8cbda6c647d2c63d698a4184fd1d55e2ce7b66f5d21eb': 'offer punk',
    '0x8a0e37b73a0d9c82e205d4d1a3ff3d0b57ce5f4d7bccf6bac03336dc101cb7ba': 'alavanche punk',
    '0x58e5d5a525e3b40bc15abaa38b5882678db1ee68befd2f60bafe3a7fd06db9e3': 'bought punk',
    '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0': 'ownership transferred',
    '0x5b859394fabae0c1ba88baffe67e751ab5248d2e879028b8c8d6897b0519f56a': 'punk bid entered',
    '0x6f30e1ee4d81dcc7a8a478577f65d2ed2edb120565960ac45fe7c50551c87932': 'punk bid withdrawn',
    '0xb13f3a5a9746619771c98306d0b4e02bf179a21c6f6032c7b22913b933a8fe64': 'snowie bought',
    '0xf5583cf59ac1840eeb914cec3b173e238b6f7127c8417e22b19852c9de5dbb3f': 'snowie not longer for sale',
    '0x454a59b1e51b1685e697faeca2a404382f4dcb9970aece78299147857e150393': 'for sale',

    '0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496': 'burn',
    '0x25f8daaa4635a7729927ba3f5b3d59cc3320aca7c32c9db4e7ca7b9574343640': 'proposal',
    '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1': 'sync',
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': 'transfer',
    '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822': 'swap',
    '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65': 'withdrawal',
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925': 'approval',
    '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f': 'mint',
    '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c': 'deposit',
    '0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15': 'trans. deposit',
    '0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d': 'staked',
    '0xc9b748d6f2ab5de13ada6ff27bbb8c98b242f905362e94d557bf89999c693b11': 'vote',

    '0xe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486': 'reward paid',
    '0x803c5a12f6bde629cea32e63d4b92d1b560816a6fb72e939d3c89e1cab650417': 'bridge',
    '0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5': 'withdrawn',
    '0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568': 'withdraw',    
    
    '0xe3afa8cd238a27a8f92ebe755184336b9fb0d4c364820aa99de0c94770d73242': 'pangolin something',
    
    '0xdbb69440df8433824a026ef190652f29929eb64b4d1d5d2a69be8afe3e6eaed8': 'bridge deposit',
    '0xc7606d21ac05cd309191543e409f0845c016120563783d70e4f41419dc0ef234': 'reinvest',
    '0x884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364': 'withdraw',
    '0x4ec90e965519d92681267467f775ada5bd214aa92c0dc93d90a5e880ce9ed026': 'claimed',
    '0x04afd2ce457d973046bd54f5d7d36368546da08b88be1bca8ae50e32b451da17': 'multisended',
    '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d': 'role granted',
    '0x577a37fdb49a88d66684922c6f913df5239b4f214b2b97c53ef8e3bbb2034cb5': 'strat harvest',
    '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258': 'paused',
    '0xb4c637563739b8b888009831a973a33b8232d71a9ff716b9d41d1f38bfd76b6a': 'collect',
    '0x8b1f2e0b684291c560ac86a8c14a3b6ac563399393914be1ec2ccd70269c8470': 'invoke',    
    '0x2ff144109a7f2e09a2d4c8cf997ec5b07f0948421b6513d23cba33412004a0dd': 'create pool',
    '0x3ccb2ab6980b218b1dd4974b07365cd90a191e170c611da46262fecc208bd661': 'bought',
    '0x5a06dd9f78016ca70e1d5b6fcef780fc94fff4e270aa11d2fc88d77a31d053cf': 'bet',
    '0xf9317dc3bc6dda0e00e43855c2c30847aeafb8dcea9d2ce86e9ce7a83d549f01': 'set price',
    '0x189c623b666b1b45b83d7178f39b8c087cb09774317ca2f53c2d3c3726f222a2': 's3d transfer',
    '0x88d38ed598fdd809c2bf01ee49cd24b7fdabf379a83d29567952b60324d58cef': 'remove liquidity',
    '0xbb757047c2b5f3974fe26b7c10f732e7bce710b0952a71082702781e62ae0595': 'emergency withdraw', 
    '0xe2492e003bbe8afa53088b406f0c1cb5d9e280370fc72a74cf116ffd343c4053': 'update emission rate',
    '0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9': 'pair created',
    '0xc6c1e0630dbe9130cc068028486c0d118ddcea348550819defd5cb8c257f8a38': 'token swap',
    '0x277d5afb43bf7105f031c47c411e874903f073633432bbe9f5b50c848a0349e1': 'tokens vested',
    '0x03580ee9f53a62b7cb409a2cb56f9be87747dd15017afc5cef6eef321e4fb2c5': 'bridge add relay',
    '0xdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724': 'delegate votes changed',
    '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f': 'delegate changed',
    '0xde88a922e0d3b88b24e9623efeb464919c6bf9f66857a65e2bfcf2ce87a9433d': 'calculate and distribute',
    '0x9cfa33fa3a49e361ae868b5f1262b6e8d3eeaa1cbe5c0f5589ddf4b4a9576bb1': 'transfer',
    '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0': 'ownership transfer',
    '0x43fb02998f4e03da2e0e6fff53fdbf0c40a9f45f145dc377fc30615d7d7a8a64': 'remove liquidity one',
    '0xb1233017d63154bc561d57c16f7b6a55e2e1acd7fcac94045a9f35fb31a850ca': 'minting',
    '0x12cb4648cf3058b17ceeb33e579f8b0bc269fe0843f3900b8e24b6c54871703c': 'unknown x',
    '0x2499a5330ab0979cc612135e7883ebc3cd5c9f7a8508f042540c34723348f632': 'purchase',
    '0xa3312e017326e164a10d63d908cac89e16da0f77c3540dc0ad9bf208399bfc75': 'swapin',
    '0x481f79ac3a523b6d6db3c5a720e190e986d1cc1b41adcdf50f9caef849901100': 'update min tokens to reinvest',
    '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62': 'transfer single',
    '0xa560e3198060a2f10670c1ec5b403077ea6ae93ca8de1c32b451dc1a943cd6e7': 'execute transaction',
    '0x1a2b6f9ef83035573e51aab1c386f711ea592e6fdf7bb0d7b346c1dd70d3dcc7': 'shares staked',
    '0x8bf178dcdd2a6012ec21be7cdac6119597012d18eb92007f216ec7bcee35103c': 'shares withdrawn',
    '0xab2246061d7b0dd3631d037e3f6da75782ae489eeb9f6af878a4b25df9b07c77': 'sweep',
    '0x414b0454a52507c753948f2002246a3358eaea8464b41c2143f88b100306eee6': 'unknown',
    '0x05d0634fe981be85c22e2942a880821b70095d84e152c3ea3c17a4e4250d9d61': 'log swap in',
    '0x1b9ddf8f7c45e0567932349c127951357a3f9b5a821eeeec6e44d771debbb490': 'unknown',
    '0xa684ef88136a415ed987c0b39bc528a16b3e83b511c414590bbe613f38f1a072': 'unknown 2',
    '0xf8a0462f666b427ea753848be7e91f9ce413975906f6f39950be296ca9a4d524': 'ownership transferred',
    '0xe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb66692': 'minter removed',
    '0x0a8eb35e5ca14b3d6f28e4abf2f128dbab231a58b56e89beb5d636115001e165': 'minter added',
    '0x877856338e13f63d0c36822ff0ef736b80934cd90574a3a5bc9262c39d217c46': 'cast vote'
}

const addresses = {
    '0x0000000000000000000000000000000000000000': 'root',

    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7': 'WAVAX',
    '0x4c9b4e1ac6f24cde3660d5e4ef1ebf77c710c084': 'LYD',
    '0xe896cdeaac9615145c0ca09c8cd5c25bced6384c': 'PEFI',
    '0xde3a24028580884448a5397872046a019649b084': 'USDT',
    '0xf20d962a6c8f70c731bd838a3a388d7d48fa6e15': 'ETH',
    '0x617724974218a18769020a70162165a539c07e8a': 'OLIVE',
    '0x408d4cd0adb7cebd1f1a1c33a0ba2098e1295bab': 'WBTC',
    '0x60781c2586d68229fde47564546784ab3faca982': 'PNG',
    '0x814409abbc142fa5824c034d564d8d738b20cd51': 'ElectrumBar',
    '0x9a928d7dcd8d7e5cb6860b7768ec2d87b8934267': 'BambooToken v2',
    '0x008e26068b3eb40b443d3ea88c1ff99b789c10f7': 'Zero',
    '0xba7deebbfc5fa1100fb055a87773e1e99cd3507a': 'Dai',
    '0xa0a924dcb97a597351a5c3787234b706845e7510': 'Bonfire',
    '0x474bb79c3e8e65dcc6df30f9de68592ed48bbfdb': 'zUSDC',
    '0x488f73cddda1de3664775ffd91623637383d6404': 'YTS',
    '0x6e7f5c0b9f4432716bdd0a77a3601291b9d9e985': 'Spore',
    '0xc38f41a296a4493ff429f1238e030924a1542e50': 'SNOB',

    '0x93fEB07f2823600DD3b9EFFd9356de10C387d9d7': 'Unifty',

    '0x52e49872153fb72f96a0e4a04356d06d5b4aacd8': 'km',
    '0xfeb7e3fe76a60658221033a5e8f6c652ba8fadf1': 'dl',
    '0x7ceaaddcff77ac786c893109cd8f3d3b0c875f53': 'jd',
    '0x4eaaeef2de237b154fc0f28e26b2a7297f4c435e': 'dm',
    '0x34dcda77930bf3f47af478883c6c6b3e473dfaf5': 'km3',
}

const bamboo = {
    '0xb5aa594a2ddcba8af3efafa559c6d73085e80cd1': 'bamboo v1',    
    '0x67c58c8f01f50589a52c2c0b233db9af6a66a0f0': 'panda',    
    '0xd8c779bd35925fa00ed6c9465964b01686351aa4': 'bamboo bar',    

    '0x17c2e1c01f240ab347f0097f153855f6aea2a190': 'panda something',

    '0x1f7e9bb6ea1da3c4a2647ddac02ce63a21b5691e': 'panda treasury',
    '0x0a8f69f1551f920522594076887e81d8fcdcf221': 'panda treasury 1',
    '0xd15e8b816f040fb0d7495eba36c16cf0f33c049c': 'panda treasury 2',
    '0xd02859595b0fe2622ae047bf68bcab3bfd3d3522': 'panda treasury 3',
    '0x09fdcfb64c3a89d2a604dc3827b49d72b900d1e7': 'panda treasury 4',
    '0x856155edcd4af131301b11b5c96ad29ed22ad4fd': 'panda treasury 5',
    '0x124737ce6a43a98caaf095accb9a9d6fccbb0e73': 'panda treasury 6',
    '0x466b32051bd71dd4acfaa5ba1a543696be59604c': 'panda treasury 7',

    '0xd2bc845ff9ab003c00b4cb5fc897aac22f748743': 'panda pair snow/bamboo-v2',
    '0xfd0d5013621bbefc89a7cdfb38ba48280e93ad66': 'panda pair avax/png',
    '0xb3ec35716877c27fe677fc2f8b2bdf9c0a72bf61': 'panda pair avax/eth',
    '0xbc31baffcc81f7fd8cc1715fbb8a5f51c862abcc': 'panda pair avax/sushi',        
    '0xd8c9ed5257b84ca0b93b321967fbdab400bc8162': 'panda pair avax/uni',    
    '0xac3757c2305d6d1ab30f46b9278d7946da2b92f7': 'panda pair avax/bamboo',
    '0xb835f15ed39a5c0e8e1a83df52c4ecd7cacd198e': 'panda pair avax/bamboov1',
    '0xa3d9dadb140e2328e36d9122ef3f8085cfa3d2c2': 'panda pair avax/usdt',  
    '0x6955d4f07233efad555cef8b388704ca6cab9f35': 'panda pair avax/dai',  
    '0x008c38c756d5cca327484e7040108dc3e424987d': 'panda pair bamboo/sushi',  
    '0x9eecaac711bdf4be130727b2e97dee80acb019ec': 'panda pair bamboo/dai',
    '0x9d180ee4d3bbf4fda53677b5833d7f33f04bfa2e': 'panda pair bamboo/usdt',    
    '0x61925434024a8b0ab7ea9ff44e1af7a106cfdbfd': 'panda pair bamboo/link',
    '0x2036b7453814dc785ab76486f2aa4d3bcdb33a04': 'panda pair bamboo/wbtc',
    '0xa6ff3f71392743c6bc60ff1f308db56e3424172f': 'panda pair bamboo/png',
    '0xb5bd08f034f77874c114c3b0db80dd1fbdda07b2': 'panda pair bamboo/spore',
    '0x11f793f10b4c50c20a7efaf82ea6d8d0aa6beb5e': 'panda pair dai/wbtc',
    '0x083e14c8c0e122e374e4c6ff2169d8db7e6728be': 'panda pair eth/wbtc',
    '0x2545b379dcbb673e36c612cfdb8d6f1d61480bca': 'panda pair usdt/wbtc'
}

const beefy = {
    '0x71b5852857b85d5096d4288ad6d293f217d8e162': 'beefy vault3',
    '0xf0d26842c3935a618e6980c53fda3a2d10a02eb7': 'beefy strategy pangolin lp',
}

const complus = {
    '0x9309ec8333a65c58b319f4405e199463a2e5c91a': 'complus maestro',
    '0xa329d806fbc80a14415588334ae4b205813c6bb2': 'sudo su complus',
    '0xc5b25a5bed03bb7c9030dfe5be56f21f5c3fcb1b': 'complus mint com+',
    '0x78c18e6be20df11f1f41b9635f3a18b8ad82ddd1': 'complus',
    '0x5d39d66eca8e0033f1919ff90f640494fe770243': 'complus avax treasury',    
    '0xcd4db0404dea8882ede60cea1b8d186abd7f97df': 'complus pair avax/complus',
    '0xe64bfae83ba234ab85bcef5b7a92427e29b3aa11': 'complus pair avax/usdt',  
    '0x0ca373d27ce17c4804d108afeee0a77efeb33775': 'complus pair avax/eth',
    '0xecee953e187d9e82d57baedaaef1e56e5283f5c3': 'complus pair avax/png',
    '0xf0ed25fd26e0b64c86c6c78b661f2ef283e9b6ff': 'complus pair avax/com',    
    '0xcea22ad29bfcf13fd1576d0994c134406dc58d7e': 'complus pair dai/sfi',
    '0x4153552cbf87686e7b092029c8e08bd1da9b4416': 'complus pair avax/link',
    '0x7583a59a50d761e491d0c9393ca5214dbb613806': 'complus pair avax/dai',
}

const elk = {
    '0x9e4aabd2b3e60ee1322e94307d0776f2c8e6cfbb': 'elk router',

    '0x5311ea28df83703fde89797a56a39e30f09a2016': 'elk stake elk/eth',
    '0xa8eb0fdfa77185c20beb05f40863226cd74b3d5b': 'elk stake elk/eth',
    '0x819bbc76fd65a385a7b727723df5e636fc3e877f': 'elk stake elk/link',
    '0x97fb1a0d7cfe3bef6c2edbe1fcefd41a91318407': 'elk stake avax/wbtc',
    '0xaa8a33e7bcadb52ab4f43152682e483607fac83f': 'elk stake avax/elk',
    '0x8b763519d3e634533b4039491e09f5774281e4b4': 'elk stake elk/png',

    '0xe4b269b61471d81898be034dab496910a5796154': 'elk pair eth/wbtc',
    '0x5bae3110066890d0bdb9837c14c2461168a3407e': 'elk pair elk/wbtc',
    '0x3fbd7dd99ca32f98a56ddee57b6b96e1152668f5': 'elk pair elk/eth',
    '0x9f125fe210b27199229221be5f8e0ebb9094af37': 'elk pair elk/olive',
    '0xfebf47cf89f766e6c24317b17f862ba5d4d82f8c': 'elk pair avax/elk',
    '0x288ffb87fc69dc652f9b564faf05db7468013544': 'elk pair avax/wbtc',  
    '0xfebf47cf89f766e6c24317b17f862ba5d4d82f8c': 'elk pair elk/dai',
    '0x266ed42866b3d2d418c87ebf8b58f22add0e6f8e': 'elk pair elk/png',  
    '0x53e3d3e77b3ed38fdc5156f6ef761d85012850c2': 'elk pair elk/usdt',

    '0xd661a38708e6544f2d32e302e6e893a97be7314c': 'elk snowball elk/eth',
    '0xf31a76d123dd6b10008f2f096ab0aafbd508a2de': 'elk snowball elk/dai',
}

const lyd = {
    '0x9209adf091dea173b4e8c47b9441275b9e423f59': 'lyd treasury',
    '0xa52abe4676dbfd04df42ef7755f01a3c41f28d27': 'lyd router',
    '0xfb26525b14048b7bb1f3794f6129176195db7766': 'lyd croesus',

    '0xf1d9d971ab9231759d952b22223b4d76d8b181e5': 'lyd pair avax/sushi',
    '0x9cfb46d0b92ac83aaa9ed0913f3f01cdbe22176d': 'lyd pair wavax/wbtc',
    '0x752c59f22faaa861108649f4596034796c69bc3f': 'lyd pair usdt/lyd',
    '0xe22a65204726f102d9e3539b85d3999dee2e421f': 'lyd pair avax/usdt',
    '0xfba4edaad3248b03f1a3261ad06ad846a8e50765': 'lyd pair avax/lyd',
    '0x58128ab3ecbf703682ede72f341944bffe3524b9': 'lyd pair avax/eth',
    '0x161f750b753c7120599d07c352607f458ecb918e': 'lyd pair lyd/png',
}

const olive = {
    '0x5a9710f3f23053573301c2ab5024d0a43a461e80': 'olive master chef',
    '0x0c45fb63001b56a21e29c7dcc1727bfda273a368': 'olive router',

    '0x57cc32cd7f5a531953e9af25e1c9394093428082': 'olive treasury',
    '0xcdee5108413e80af6c84bdd3ab0d328a3d63dda4': 'olive treasury 2',    
    '0xe5350ad10f9f9341cd5a761b845eff25ddafddba': 'olive pair avax/snob',
    '0xbcd81aaa76d9c1e3aed31c315761c0d9779751b5': 'olive pair avax/sushi',
    '0x76fbce48d9dce3d04bfac318d1fdeb3a78e903a9': 'olive pair avax/eth',
    '0xbfc3c72bab7252341dc90a1e85797ebd8c79c338': 'olive pair usdt/avax',
    '0xf54a719215622f602fca5bf5a6509734c3574a4c': 'olive pair usdt/olive',
    '0xd3566ec8cdf8cb4e66b9f958ddb47e225c51e58b': 'olive pair dai/usdt',
    '0x57cc32cd7f5a531953e9af25e1c9394093428082': 'olive pair avax/olive',
    '0x79c1b4ee613f29a8c0aae563ef445317d99a6906': 'olive pair avax/wbtc',
    '0x107f59a1a067d464c10969759132d78b1844f946': 'olive pair avax/elk',
    '0xad786dfe6ac4a68dd3f9a5400ddee5dedd20d109': 'olive pair avax/png',
    '0x0fa496c08d2b6f449cd6a2d72cea76b3ea8c703a': 'olive pair avax/spore',
}


const pangolin = {
    '0xe54ca86531e17ef3616d22ca28b0d458b6c89106': 'pangolin router',

    '0xb921a3ae9ceda66fa8a74dbb0946367fb14fae34': 'pangolin stake old',
    '0x7accc6f16bf8c0dce22371fbd914c6b5b402bf9f': 'pangolin stake old',

    '0xda354352b03f87f84315eef20cdd83c49f7e812e': 'pangolin staking rewards avax/sushi',
    '0xa16381eae6285123c323a665d4d99a6bcfaac307': 'pangolin staking rewards avax/eth',
    '0x701e03fad691799a8905043c0d18d2213bbcf2c7': 'pangolin staking rewards avax/dai',
    '0x94c021845efe237163831dac39448cfd371279d6': 'pangolin staking rewards avax/usdt',
    '0x417c02150b9a31bcacb201d1d60967653384e1c6': 'pangolin staking rewards avax/eth', 
    '0xe968e9753fd2c323c2fe94caff954a48afc18546': 'pangolin staking rewards avax/wbtc',
    '0x4df32f1f8469648e89e62789f4246f73fe768b8e': 'pangolin staking rewards avax/aave',
    '0x574d3245e36cf8c9dc86430eadb0fdb2f385f829': 'pangolin staking rewards avax/png',
    '0xbda623cdd04d822616a263bf4edbbce0b7dc4ae7': 'pangolin staking rewards avax/link',
        
    '0xe2510a1fcccde8d2d1c40b41e8f71fb1f47e5bba': 'pangolin staking rewards png/usdt',
    '0xfd9acec0f413ca05d5ad5b962f3b4de40018ad87': 'pangolin staking rewards png/aave',
    '0x633f4b4db7dd4fa066bd9949ab627a551e0ecd32': 'pangolin staking rewards png/sushi',
    '0x7ac007afb5d61f48d1e3c8cc130d4cf6b765000e': 'pangolin staking rewards png/eth',

    '0x9ee0a4e21bd333a6bb2ab298194320b8daa26516': 'pangolin pair avax/usdt',
    '0xbbc7fff833d27264aac8806389e02f717a5506c9': 'pangolin pair avax/link',    
    '0x1acf1583bebdca21c8025e172d8e8f2817343d65': 'pangolin pair avax/eth',
    '0x7a6131110b82dacbb5872c7d352bfe071ea6a17c': 'pangolin pair avax/wbtc',
    '0x17a2e8275792b4616befb02eb9ae699aa0dcb94b': 'pangolin pair avax/dai',
    '0x92dc558cb9f8d0473391283ead77b79b416877ca': 'pangolin pair avax/uni',
    '0xd8b262c0676e13100b33590f10564b46eef652ad': 'pangolin pair avax/sushi',
    '0x5f233a14e1315955f48c5750083d9a44b0df8b50': 'pangolin pair avax/aave',
    '0xd7538cabbf8605bde1f4901b47b8d42c61de0367': 'pangolin pair avax/png',
    '0x494dd9f783daf777d3fb4303da4de795953592d0': 'pangolin pair avax/pefi',
    '0x7a886b5b2f24ed0ec0b3c4a17b930e16d160bd17': 'pangolin pair avax/yfi',

    '0xddfcef1081b8eeabe3935817b9625c9b89848a56': 'pangolin pair usdt/ether',

    '0x7313835802c6e8ca2a6327e6478747b71440f7a4': 'pangolin pair png/link',
    '0xf372ceae6b2f4a2c4a6c0550044a7eab914405ea': 'pangolin pair png/wbtc',
    '0x874685bc6794c8b4befbd037147c2eef990761a9': 'pangolin pair png/uni',
    '0x1bb5541eccda68a352649954d4c8ece6ad68338d': 'pangolin pair png/pefi',
    '0xe8acf438b10a2c09f80aef3ef2858f8e758c98f9': 'pangolin pair png/usdt',
    '0x53b37b9a6631c462d74d65d61e1c056ea9daa637': 'pangolin pair png/eth',    
    '0xf105fb50fc6ddd8a857bbecd296c8a630e8ca857': 'pangolin pair png/sushi',
    '0xd765b31399985f411a9667330764f62153b42c76': 'pangolin pair png/dai',
    '0xa465e953f9f2a00b2c1c5805560207b66a570093': 'pangolin pair png/yfi',

    '0xbb40bc7364a04e59050f66d0a83eeb6a85c8399c': 'pangolin pair avax/penis',
    '0x0160ab62c5d92b7862a5bf48a39bf08ddfe69552': 'pangolin pair avax/vagina',
    

    '0x8912a0fadf3588c6791e42310b549a7bc0047b0e': 'pangolin pair pefi/sushi',
    '0x0b9753d73e1c62933e913e9c2c94f2ffa8236f6c': 'pangolin pair pefi/snob',
    
    '0xa1c2c3b6b120cbd4cec7d2371ffd4a931a134a32': 'pangolin pair avax/snob',
    '0x97b4957df08e185502a0ac624f332c7f8967ee8d': 'pangolin pair png/snob',

    '0x0a63179a8838b5729e79d239940d7e29e40a0116': 'pangolin pair avax/spore',
    '0x5122524af267567897cf56ab4389ce20a08194fa': 'pangolin pair snob/spore',    
    '0x7692c5f0c87b928981112c4ce5d51c8301acc88c': 'pangolin pair avax/bamboo',
    '0x605424527cfb662fe65b2e08bc62e558f3b9400e': 'pangolin pair avax/elk',
    '0x271d62b3cd770f02e08f5fc83dbf9b551ee212ca': 'pangolin pair avax/bamboo',
    '0x8fd2755c6ae7252753361991bdcd6ff55bdc01ce': 'pango old stake avax/png'
}

const penguin = {
    '0x8ac8ed5839ba269be2619ffeb3507bab6275c257': 'penguin master chef',
    '0x033489768527c7915f35bceb4fe084dd5aecf74b': 'penguin pefi treasury',
    '0xd79a36056c271b988c5f1953e664e61416a9820f': 'penguin nest',
}

const snowball = {

    '0x1ec206a9dd85625e1940cd2b0c8e14a894d2e9ac': 'ice',
    '0xf7b8d9f8a82a7a6dd448398afc5c77744bd6cb85': 'controller v4',
    '0x5df42ace37ba4aceb1f3465aad9bbacaa238d652': 'snowball treasury',
    '0xa362a10ba6b59ee113faa00e41e01c0087dd9ba1': 'snowball stategy avax/wbtc',
    '0xb12531a2d758c7a8bf09f44fc88e646e1bf9d375': 'snowball ice queen',
    '0x4ad3c11b7a05203ba686cb6ceceb67427f6d951c': 'snowball who dat?',
    '0x751089f1bf31b13fa0f0537ae78108088a2253bf': 'ice_avax_sushi',
    '0x586554828ee99811a8ef75029351179949762c26': 'ice_avax_eth',
    '0x621207093d2e65bf3ac55dd8bf0351b980a63815': 'ice_avax_png',
    '0x14ec55f8b4642111a5af4f5ddc56b7be867eb6cc': 'ice_strategy',
    '0x1ec206a9dd85625e1940cd2b0c8e14a894d2e9ac': 'ice_strategy 2',
    '0xc9a51fb9057380494262fd291aed74317332c0a2': 'snowball owner',

    '0x12a7738315624f6e112452E0eCFf29cE08d4992D': 'snowball strategy 3 pool',

    '0x6b41e5c07f2d382b921de5c34ce8e2057d84c042': 'snowball s3d',
    '0x846e79a9d8ccc6bbafc3939177a3d53e51c634fc': 'snowball spgl png/link',
    '0xc9cd088fd5c17d5cbfd1ff331fa6a48f2f5d9cb1': 'snowball spgl avax/snob',
    '0xa75af2e0ea2bbda6dc6921b4ee3bb051309d28c9': 'snowball spgl sushi/avax',
    '0xeec2d8bd006e189a0e53819c670b9c08ee098eb0': 'snowball spgl avax/png',
    '0x3fcfbcb4b368222fcb4d9c314eca597489fe8605': 'snowball spgl avax/usdt'
}

const sushi = {
    '0xe5dc9c75d4514a5a7fe370e636560699ba83c702': 'sushiswap avax/eth',
    '0xa1708efd71e516a2d0ebd7ec8d877c02d4d2de6d': 'sushiswap avax/png',
    '0x47f1c2a9c9027a10c3b13d1c40dd976c5014339b': 'sushiswap usdt/wavax',
}

const yak = {

    '0x8d36c5c6947adccd25ef49ea1aac2ceacfff0bd7': 'yak timelock strategy v3',

    '0x197e2ae97a783b9a7958eafd01e2467b875989d7': 'yieldyak lyd avax/wbtc',    
    '0x069e889d729d4d96dae10c86a4d1f629ad81adef': 'yieldyak lyd lyd/usdt',    
    '0x104a9f8c3a1f3bf0814105e1fd457cd7775979ce': 'yieldyak lyd lyd/png',    
    '0xffbe3f2b1ff3f595e3059cca8a7fcd3eb4d71949': 'yieldyak lyd lyd/avax',
    '0x7346502437c9f09ab040855f756edea2a2ac0912': 'yieldyak lyd avax/usdt',
    '0xda875a511860f2752b891677489d08caedac00ea': 'yieldyak png avax/eth',
    '0xb58535a99e2d615df6ff00ad091d01310daabda3': 'yieldyak png avax/uni',
    
    '0x37a83906a69d6236dbcb4d8257d8f62d1f3bbcd5': 'yieldyak panda avax/bamboo-v2',    
    '0x7f3bb8db336ff50120e290e5c8ec78b20f619d01': 'yieldyak com avax/com',
    '0xfd410034f88b99e4bee8bd7b51fa323b6678bf73': 'yieldyak com xcom/avax',    
    '0x141be6e009a0d9a5c0d4e557c0636e97b3de2a7b': 'yieldyak zero zero/zusdc',
    '0x4dd36b27e038e5c479d8bec440c8f4ee89b6df5d': 'yieldyak olive olive',
    '0x3a8d3fbab8b87473b9b2d78393200b099fa98497': 'yieldyak olive avax/sushi',
    '0xc82ad2eab7ee0b9226ae884255ca9c1cb33d9e2c': 'yieldyak olive dai/usdt',
    '0xa019f49464fcd206d080060cbbcb1a089441a732': 'yieldyak olive avax/eth',
    '0xec2258cc4b75ad0a013c7346c07f7470aea7f0e4': 'yieldyak olive olive/png',
    '0x9c36eca9309f0ceb5818da889e47d3c3e2ba9f32': 'yieldyak olive avax/wbtc',
    '0xfdffdf6dc4fb30bede8af0f78d42c5468f37324b': 'yieldyak olive olive/avax',
    '0x89a806347b0814a265dc17afc343866b2214dd0f': 'yieldyak olive olive/usdt',    

    '0xdf8bfa6c5c8578cde19d58d6eff0b39ab2415d83': 'yieldyak pair avax/yak',    
    '0xf0bde208a05cc0a056b5fae1a78212adf7a4affe': 'yieldyak pair avax/bamboov1',

    '0xc430d5d50aab29f8752a3607bfe01322c6cae8fa': 'yieldyak middleman 12',
    '0x92ea5536b1de385175d67bb6024a98e48edb8aae': 'yieldyak middleman 11',
    '0xffffe6c261fac5ea28c41e71672b482efbad8e4b': 'yieldyak middleman 10',
    '0x57596ea15be8f36e4104ba570144d154d604b0c5': 'yieldyak middleman 9',
    '0x0e569d21238a29d82acbee5e51c717bac80a2dd8': 'yieldyak middleman 8',
    '0xfdcac864f48e76d752be4f809a668cb5ea2fb453': 'yieldyak middleman 7',
    '0xd4da7da717b72d4ce74eac28617295b2f14b191a': 'yieldyak middleman 6',
    '0xdea591345c15ce24abe0ac9ceb47ef618650b9da': 'yieldyak middleman 5',
    '0xfa3ff5201c97c54dd34ee8f21643c28b4de74807': 'yieldyak middleman 4',
    '0xdaaa1ba6839a7f04061da8805de5800b152def2f': 'yieldyak middleman 3',
    '0x68761ed6263ddfee85a3f5078cfacd8ad26dead0': 'yieldyak middleman 2',
    '0xdcedf06fd33e1d7b6eb4b309f779a0e9d3172e44': 'yieldyak middleman 1',
    '0xff8c578f2950c7a497e4c32813f21e1f52d2e7ee': 'yieldyak middleman avax/snob'
}

const yeti = {
    '0x262dcfb36766c88e6a7a2953c16f8defc40c378a': 'yeti',

    '0xa3cb9e0f8e49cb42ae93a3ba9a2db4c337502096': 'yeti stake png/yts',
    '0xfce7264ca738f21ca01ffedd35c15fe849c22f71': 'yeti stake yts/png',
    '0xd2fa9b7396c2944a897337a00059f4bee8601712': 'yeti stake avax/usdt',
    '0xbc86ba14027d4ff47a9fc1ed333c0a9c5635036f': 'yeti stake avax/yts',
    '0x2b5d69ea9c586219e98b4f993488c143c338b271': 'yeti stake avax/eth',

    '0x2f4c1f54d0ac8e8ef545a91f040fb4c35bb36097': 'yeti pair yts/eth',
    '0xf1e800ab9d0d1f6eaff54e00ad19710c41b154f2': 'yeti pair yts/usdt',
    '0x07099b26f36fcb7e086d5a879ec1261271319829': 'yeti pair avax/yts',
    '0x9182a23099903c75681416b63f5d0a17f5eb387a': 'yeti pair avax/eth',
    '0x6c2038f09212dac0ad30be822f0eecfb29064814': 'yeti pair avax/usdt',
    '0x94231f103882033b6103785675038347693f9cd8': 'yeti pair png/yts',
}

const zero = {
    '0x85995d5f8ee9645ca855e92de16fa62d26398060': 'zero router 02',
    
    '0xa8aa762a6529d7a875d0195fad8572aad5c697bc': 'zero stake zero/zusdt',
    '0xafe2d3154bd3ec5601b610145923cb0eca1937de': 'zero stake zero/zdai',
    '0xd3694aeb35db0d73a4d1e83ffe8f462e8202ed0f': 'zero stake avax/zeth',    
    '0x60f19487bda9c2f8336784110dc5c4d66425402d': 'zero stake avax/zero',
    '0x8754699cf9f32b56654f7da44ff580bdf09f3526': 'zero stake avax/zusdc',
    '0x7b35150abde10f98f44ded0d02e7e942321fbbe0': 'zero stake zero/zeth',
    '0xfa2c38470ad0a970240cf1afd35cd04d9e994e76': 'zero stake zero/zusdt',
    '0x45ed4a1f9d573a6bfec9b9fdce2954add62d8e77': 'zero stake avax/zero 2',
    '0xf164af933a0c4399bd4634a01e93c97bee53a1ea': 'zero stake avax/yts',
    '0x46609d1a08fad26a52f4d84bb58523c6598352a5': 'zero stake zero/zsushi',
    '0x617ee464d13f871fadd6d3be428cf452299f7a3b': 'zero stake zero/zusdc',

    '0x332719570155dc61bec2901a06d6b36faf02f184': 'zero pair avax/zeth',
    '0x17766e5dd91fdc14c24cd9847e5e93fd62a05afd': 'zero pair avax/zuscd',
    '0x0751f9a49d921aa282257563c2041b9a0e00eb78': 'zero pair avax/zero',
    '0x0088997d32ced9bf97bd1c7ca0a2a8d92d0ab5cd': 'zero pair zero/zdai',
    '0x45c2755eefa0eb96ce15c2f6fdc48346da7f3a7e': 'zero pair zero/zeth',
    '0x4cea032b4b3f59f31d6d52071258ee0d42b6cc7e': 'zero pair zero/zusdc',
    '0x59a566660024e8f7168cf9e578397e88cd6ba843': 'zero pair zero/zusdt',
    '0x982716379b2372d06df5c461e2c79b24ea80c370': 'zero pair zero/zsushi',
    '0x2a053b0818c5529c89b10ac819db1c5c439ccec4': 'zero pair zero/zbtc',
    '0x5bb52840da88ceed069ba610787c40ed425bb311': 'zero pair zero/zuni',
    
}
    
const unknown = {
    '0x0540e4ee0c5cdba347c2f0e011acf8651bb70eb9': 'crypto seals',
    '0x05c5db43db72b6e73702eeb1e5b62a03a343732a': 'swap flash loan',
    '0xb14a4b9bc056bb2deea9fb4cc886d4cb249385f7': 'cycle vault shares',
    '0x171356c0dc284df6bb9e1dad8161b41af97f9116': 'merkle airdrop'
}

Object.assign(addresses, bamboo, beefy, complus, elk, lyd, olive, pangolin, penguin, snowball, sushi, yak, yeti, zero, unknown)

export { topics, addresses }