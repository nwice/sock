import websocket
import json
import pprint 

from web3 import Web3 

from eth_abi import decode_single, decode_abi

subs = [{
    'id': 1, 
    'method': 'eth_subscribe', 
    'params': ['logs', {}],
}, {
    'id': 2, 
    'method': 'eth_subscribe', 
    'params': ['newHeads'],
}]

newHeadsSortedKeys = set([])

def result_pendingTransactions(res):
    print('pending tx')

def result_newHeads(res):
    k = ' '.join(res.keys())
    if k not in newHeadsSortedKeys:
        #print('newHeads:', res.keys())
        newHeadsSortedKeys.add(k)

prefix = '000000000000000000000000'

recognized_addr = {
    '0x52e49872153fb72f96a0e4a04356d06d5b4aacd8': 'km',
    '0xfeb7e3fe76a60658221033a5e8f6c652ba8fadf1': 'dl',
    '0x7ceaaddcff77ac786c893109cd8f3d3b0c875f53': 'jd',
    '0x4eaaeef2de237b154fc0f28e26b2a7297f4c435e': 'dm',
    '0x34dCDa77930BF3F47AF478883c6c6b3E473DfAf5': 'km3'
}

static_addr = {
    '0x0000000000000000000000000000000000000000': 'actor 0',
}

common_addr = {
    '0xdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496': 'burn',
    '0x25f8daaa4635a7729927ba3f5b3d59cc3320aca7c32c9db4e7ca7b9574343640': 'proposal',
    '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1': 'signature',
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef': 'transfer',
    '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822': 'swap',
    '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65': 'withdrawal',
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925': 'approval',
    '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f': 'mint',
    '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c': 'deposit',
    '0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15': 'transfer deposit',
    '0x9e71bc8eea02a63969f509818f2dafb9254532904319f9dbda79b67bd34a5f3d': 'stake',
    '0xe2403640ba68fed3a2f88b7557551d1993f84b99bb10ff833f0cf8db0c5e0486': 'reward',
    '0x803c5a12f6bde629cea32e63d4b92d1b560816a6fb72e939d3c89e1cab650417': 'bridge', #chainbridge
    '0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5': 'withdraw',
    '0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568': 'withdraw',    
    '0xb0e0a660b4e50f26f0b7ce75c24655fc76cc66e3334a54ff410277229fa10bd4': 'unkknon 5',
    '0xe3afa8cd238a27a8f92ebe755184336b9fb0d4c364820aa99de0c94770d73242': 'pangolin something',
    '0x05af636b70da6819000c49f85b21fa82081c632069bb626f30932034099107d8': 'unknown 6',
    '0xdbb69440df8433824a026ef190652f29929eb64b4d1d5d2a69be8afe3e6eaed8': 'bridge deposit',
    '0xc7606d21ac05cd309191543e409f0845c016120563783d70e4f41419dc0ef234': 'unknown 2',
    '0x884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364': 'withdraw',
    '0x4ec90e965519d92681267467f775ada5bd214aa92c0dc93d90a5e880ce9ed026': 'claimed',
    '0x04afd2ce457d973046bd54f5d7d36368546da08b88be1bca8ae50e32b451da17': 'multisended',
    '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d': 'role granted',
    '0x577a37fdb49a88d66684922c6f913df5239b4f214b2b97c53ef8e3bbb2034cb5': 'strat harvest',
    '0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258': 'paused',
    '0xb4c637563739b8b888009831a973a33b8232d71a9ff716b9d41d1f38bfd76b6a': 'collect',
    '0x8b1f2e0b684291c560ac86a8c14a3b6ac563399393914be1ec2ccd70269c8470': 'invoke',
    '0x454a59b1e51b1685e697faeca2a404382f4dcb9970aece78299147857e150393': 'for sale',
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
    '0x2499a5330ab0979cc612135e7883ebc3cd5c9f7a8508f042540c34723348f632': 'purchase'
}

defi_addr = {
    '0x5a9710f3f23053573301c2ab5024d0a43a461e80': 'olive master chef',

    '0x9E4AAbd2B3E60Ee1322E94307d0776F2c8e6CFbb': 'elk router',    
    '0xAA8A33E7bcADb52ab4f43152682e483607faC83F': 'elk stake avax/elk',
    '0x8b763519d3e634533b4039491e09f5774281e4b4': 'elk stake elk/png',
    '0xfEbf47CF89F766E6c24317b17F862bA5d4d82f8c': 'elk pair avax/elk ',
    '0xfEbf47CF89F766E6c24317b17F862bA5d4d82f8c': 'elk pair elk/dai ',
    '0x266ed42866b3d2d418C87EbF8b58f22add0E6F8e': 'elk pair elk/png',  
    '0x53e3d3e77b3ed38fdc5156f6ef761d85012850c2': 'elk pair elk/usdt',  
    '0xd661a38708e6544f2d32e302e6e893a97be7314c': 'elk snowball elk/eth',
    '0xF31a76d123dd6b10008F2f096AB0AafBd508A2de': 'elk snowball elk/dai',

    '0xE5Dc9c75D4514A5a7fe370e636560699bA83C702': 'sushi avax/eth',
    '0xa1708efd71e516a2d0ebd7ec8d877c02d4d2de6d': 'sushi avax/png',

    '0x8AC8ED5839ba269Be2619FfeB3507baB6275C257': 'penguin master chef',
    '0x033489768527C7915F35bCEb4Fe084dd5Aecf74b': 'penguin pefi treasury',

    '0x1eC206a9dD85625E1940cD2B0c8e14a894D2e9ac': 'ice',
    '0xf7b8d9f8a82a7a6dd448398afc5c77744bd6cb85': 'controller v4',

    '0x5df42ace37ba4aceb1f3465aad9bbacaa238d652': 'snowball treasury',

    '0xb12531a2d758c7a8bf09f44fc88e646e1bf9d375': 'snowball ice queen',
    '0x4ad3c11b7a05203ba686cb6ceceb67427f6d951c': 'snowball who dat?',
    '0x751089f1bf31b13fa0f0537ae78108088a2253bf': 'ice_avax_sushi',
    '0x586554828ee99811a8ef75029351179949762c26': 'ice_avax_eth',
    '0x621207093d2e65bf3ac55dd8bf0351b980a63815': 'ice_avax_png',
    '0x14ec55f8b4642111a5af4f5ddc56b7be867eb6cc': 'ice_strategy',
    '0x1ec206a9dd85625e1940cd2b0c8e14a894d2e9ac': 'ice_strategy 2',
    '0xc9a51fb9057380494262fd291aed74317332c0a2': 'snowball owner',

    '0x6B41E5c07F2d382B921DE5C34ce8E2057d84C042': 'snowball s3d',

    '0xC9cD088fD5C17d5cbFd1ff331fa6A48F2f5D9Cb1': 'snowball sPGL avax/snob',
    '0xa75af2e0ea2bbda6dc6921b4ee3bb051309d28c9': 'snowball sPGL sushi/avax',
    '0xeec2d8bd006e189a0e53819c670b9c08ee098eb0': 'snowball sPGL avax/png',
    '0x3fcFBCB4b368222fCB4d9c314eCA597489FE8605': 'snowball sPGL avax/usdt',

    '0xe54ca86531e17ef3616d22ca28b0d458b6c89106': 'pangolin router',

    '0xa16381eae6285123c323a665d4d99a6bcfaac307': 'pangolin stake avax/eth',
    '0x797cbcf107519f4b279fc5db372e292cdf7e6956': 'pangolin stake axax/yfi',    
    '0x18c8e1346d26824063706242adb391ddb16c293e': 'pangolin stake avax/sled',
    '0x7a886b5b2f24ed0ec0b3c4a17b930e16d160bd17': 'pangolin stake avax/yfi',
    '0x4f019452f51bbA0250Ec8B69D64282B79fC8BD9f': 'pangolin stake avax/usdt',
    '0x7d7ecd4d370384b17dfc1b4155a8410e97841b65': 'pangolin stake avax/sushi',
    '0x8FD2755c6ae7252753361991bDcd6fF55bDc01CE': 'pangolin stake avax/png',

    '0x7accc6f16bf8c0dce22371fbd914c6b5b402bf9f': 'pangolin stake png/usdt',    
    '0x4ad6e309805cb477010bea9ffc650cb27c1a9504': 'pangolin stake png/link',
    '0x99b06b9673fea30ba55179b1433ce909fdc28723': 'pangolin stake png/wbtc',
    '0x8866077f08b076360c25f4fd7fbc959ef135474c': 'pangolin stake png/dai',
    '0x6955cb85edea63f861c0be39c3d7f8921606c4dc': 'pangolin stake png/sushi',
    '0xb921a3ae9ceda66fa8a74dbb0946367fb14fae34': 'pangolin stake png/aave',
    '0x2061298c76cd76219b9b44439e96a75f19c61f7f': 'pangolin stake png/yfi',
    '0x4e550fefbf888cb43ead73d821f646f43b1f2309': 'pangolin stake png/eth',
    '0x41188b4332fe68135d1524e43db98e81519d263b': 'pangolin stake png/uni',
    
    '0x9ee0a4e21bd333a6bb2ab298194320b8daa26516': 'pangolin pair avax/usdt',
    '0xbbc7fff833d27264aac8806389e02f717a5506c9': 'pangolin pair avax/link',    
    '0x1acf1583bebdca21c8025e172d8e8f2817343d65': 'pangolin pair avax/eth',
    '0x7a6131110b82dacbb5872c7d352bfe071ea6a17c': 'pangolin pair avax/wbtc',
    '0x17a2e8275792b4616befb02eb9ae699aa0dcb94b': 'pangolin pair avax/dai',
    '0x92dc558cb9f8d0473391283ead77b79b416877ca': 'pangolin pair avax/uni',
    '0xd8b262c0676e13100b33590f10564b46eef652ad': 'pangolin pair avax/sushi',
    '0x5f233a14e1315955f48c5750083d9a44b0df8b50': 'pangolin pair avax/aave',
    '0xd7538cabbf8605bde1f4901b47b8d42c61de0367': 'pangolin pair avax/png',
    '0x494Dd9f783dAF777D3fb4303da4de795953592d0': 'pangolin pair avax/pefi',

    '0x7313835802C6e8CA2A6327E6478747B71440F7a4': 'pangolin pair png/link',
    '0xf372ceae6b2f4a2c4a6c0550044a7eab914405ea': 'pangolin pair png/wbtc',
    '0x874685bc6794c8b4befbd037147c2eef990761a9': 'pangolin pair png/uni',
    '0x1bb5541EcCdA68A352649954D4C8eCe6aD68338d': 'pangolin pair png/pefi',
    '0xe8acf438b10a2c09f80aef3ef2858f8e758c98f9': 'pangolin pair png/usdt',
    '0x53b37b9a6631c462d74d65d61e1c056ea9daa637': 'pangolin pair png/eth',    
    '0xf105fb50fc6ddd8a857bbecd296c8a630e8ca857': 'pangolin pair png/sushi',
    '0xD765B31399985f411A9667330764f62153b42C76': 'pangolin pair png/dai',
    '0xa465e953F9f2a00b2C1C5805560207B66A570093': 'pangolin pair png/yfi',

    '0x0b9753d73e1c62933e913e9c2c94f2ffa8236f6c': 'pangolin pair pefi/snob',
    '0xa1c2c3b6b120cbd4cec7d2371ffd4a931a134a32': 'pangolin pair avax/snob',
    '0x0a63179a8838b5729e79d239940d7e29e40a0116': 'pangolin pair avax/spore',
    '0x5122524af267567897cf56ab4389ce20a08194fa': 'pangolin pair snob/spore',
    '0x7692c5f0c87b928981112c4ce5d51c8301acc88c': 'pangolin pair avax/bamboo',
    '0x605424527cFB662Fe65b2e08Bc62e558f3b9400e': 'pangolin pair avax/elk',
    '0x271d62b3cd770f02e08f5fc83dbf9b551ee212ca': 'pangolin pair bamboo/avax',

    '0xa019F49464FCD206d080060CBbCB1A089441a732': 'yieldyak pair avax/eth',
    '0xDF8bFA6c5C8578CdE19D58d6EFf0B39aB2415d83': 'yieldyak pair avax/yak',    
    '0xF0BDE208A05CC0a056B5FAE1a78212Adf7A4AFfe': 'yieldyak pair avax/bambooV1',
    '0x37A83906a69d6236DBcB4d8257D8f62d1f3BBcD5': 'yieldyak pair avax/bamboo',
    '0x7f3BB8dB336ff50120E290e5C8eC78B20f619D01': 'yieldyak pair avax/com',
    '0xB58535A99e2D615df6Ff00AD091D01310Daabda3': 'yieldyak pair avax/uni',
    '0x141bE6e009a0D9a5c0d4e557c0636e97B3de2a7B': 'yieldyak pair zero/zusdc',
    '0xfd410034f88B99E4BeE8Bd7B51Fa323B6678Bf73': 'yieldyak pair xcom/avax',

    '0x9C36eca9309f0CeB5818da889E47D3c3E2ba9F32': 'yieldyak pair avax/wbtc',
    '0xfDffdf6Dc4FB30BeDE8af0f78D42c5468F37324B': 'yieldyak pair olive/avax',

    '0xFa3fF5201C97c54Dd34EE8F21643c28B4De74807': 'yieldyak middleman 4',
    '0xdAaA1Ba6839a7F04061dA8805De5800B152Def2F': 'yieldyak middleman 3',
    '0x68761Ed6263DDfee85A3f5078cFacd8ad26dEAD0': 'yieldyak middleman 2',
    '0xDcEDF06Fd33E1D7b6eb4b309f779a0e9D3172e44': 'yieldyak middleman',
    '0xff8c578f2950c7a497e4c32813f21e1f52d2e7ee': 'yieldyak middleman avax/snob',
    
    '0x171356c0dc284df6bb9e1dad8161b41af97f9116': 'merkle airdrop',

    '0x9309ec8333a65c58b319f4405e199463a2e5c91a': 'complus maestro',
    '0xa329d806fbc80a14415588334ae4b205813c6bb2': 'sudo su complus',
    '0xc5B25a5BEd03bB7c9030Dfe5Be56f21f5c3fCB1B': 'complus mint com+',
    '0x78c18e6be20df11f1f41b9635f3a18b8ad82ddd1': 'complus',
    '0x5d39d66eca8E0033F1919Ff90F640494fe770243': 'complus avax treasury',    
    '0xcd4db0404dea8882ede60cea1b8d186abd7f97df': 'complus pair avax/complus',
    '0xe64bfae83ba234ab85bcef5b7a92427e29b3aa11': 'complus pair avax/usdt',  
    '0x0ca373d27ce17c4804d108afeee0a77efeb33775': 'complus pair avax/eth',
    '0xecee953e187d9e82d57baedaaef1e56e5283f5c3': 'complus pair avax/png',
    '0xf0ed25fd26e0b64c86c6c78b661f2ef283e9b6ff': 'complus pair avax/com',    
    '0xcea22ad29bfcf13fd1576d0994c134406dc58d7e': 'complus pair dai/sfi',
    '0x4153552cbf87686e7b092029c8e08bd1da9b4416': 'complus pair avax/link',
    '0x7583a59a50d761E491d0c9393cA5214dbB613806': 'complus pair avax/dai',

    '0x262dcfb36766c88e6a7a2953c16f8defc40c378a': 'yeti',

    '0xfcE7264Ca738f21CA01FFEDd35C15fe849c22F71': 'yeti stake yts/png',
    '0xd2fa9b7396c2944a897337a00059f4bee8601712': 'yeti stake avax/usdt',

    '0xF1E800Ab9D0D1F6eaFf54E00Ad19710c41b154f2': 'yeti pair yts/usdt',
    '0x07099b26f36fcb7e086d5a879ec1261271319829': 'yeti pair avax/yts',
    '0x9182a23099903c75681416b63f5d0a17f5eb387a': 'yeti pair avax/eth',
    '0x6c2038f09212dac0ad30be822f0eecfb29064814': 'yeti pair avax/usdt',
    '0x94231f103882033B6103785675038347693f9cd8': 'yeti pair yts/png',

    '0x85995d5f8ee9645ca855e92de16fa62d26398060': 'zero',
    '0xd3694aeb35db0d73a4d1e83ffe8f462e8202ed0f': 'zero stake avax/zeth',    
    '0x60f19487bda9c2f8336784110dc5c4d66425402d': 'zero stake avax/zero',
    '0x8754699cf9f32b56654f7da44ff580bdf09f3526': 'zero stake avax/zusdc',
    '0x7b35150abde10f98f44ded0d02e7e942321fbbe0': 'zero stake zero/zeth',
    '0xfa2c38470ad0a970240cf1afd35cd04d9e994e76': 'zero stake zero/zusdt',
    '0x45ed4a1f9d573a6bfec9b9fdce2954add62d8e77': 'zero stake avax/zero 2',
    '0xf164AF933a0c4399bd4634A01E93C97BEe53A1eA': 'zero stake avax/yts',

    '0x332719570155dc61bec2901a06d6b36faf02f184': 'zero pair avax/zeth',
    '0x17766e5dd91fdc14c24cd9847e5e93fd62a05afd': 'zero pair avax/zuscd',
    '0x0751f9a49d921aa282257563c2041b9a0e00eb78': 'zero pair avax/zero',
    '0x0088997d32ced9bf97bd1c7ca0a2a8d92d0ab5cd': 'zero pair zero/zdai',
    '0x45c2755eefa0eb96ce15c2f6fdc48346da7f3a7e': 'zero pair zero/zeth',
    '0x4cea032b4b3f59f31d6d52071258ee0d42b6cc7e': 'zero pair zero/zusdc',
    '0x59a566660024e8f7168cf9e578397e88cd6ba843': 'zero pair zero/zusdt',
    '0x982716379b2372d06df5c461e2c79b24ea80c370': 'zero pair zero/zsushi',
    '0x2A053B0818C5529C89b10AC819Db1C5C439cCEC4': 'zero pair zero/zbtc',
    '0x5Bb52840DA88cEed069ba610787C40Ed425BB311': 'zero pair zero/zuni',
 
    '0x0540E4EE0C5CdBA347C2f0E011ACF8651bB70Eb9': 'crypto seals',    
    
    '0xB5aa594A2DdcBA8AF3EfaFa559C6d73085E80Cd1': 'bamboo v1',    
    '0x67c58c8f01f50589a52c2c0b233db9af6a66a0f0': 'panda',    
    '0xD8C779bD35925fa00ed6c9465964b01686351Aa4': 'bamboo bar',    

    '0x17C2E1c01f240aB347F0097f153855F6Aea2A190': 'panda something',

    '0x1f7e9bB6eA1Da3c4A2647DdAc02cE63A21b5691E': 'panda treasury',
    '0x0a8f69f1551f920522594076887e81d8fcdcf221': 'panda treasury 1',
    '0xd15e8b816f040fb0d7495eba36c16cf0f33c049c': 'panda treasury 2',
    '0xd02859595b0fe2622ae047bf68bcab3bfd3d3522': 'panda treasury 3',
    '0x09fdcfb64c3a89d2a604dc3827b49d72b900d1e7': 'panda treasury 4',
    '0x856155edcd4af131301b11b5c96ad29ed22ad4fd': 'panda treasury 5',
    '0x124737ce6a43a98caaf095accb9a9d6fccbb0e73': 'panda treasury 6',
    '0x466b32051bd71dd4acfaa5ba1a543696be59604c': 'panda treasury 7',

    '0xfd0d5013621bbefc89a7cdfb38ba48280e93ad66': 'panda pair avax/png',
    '0xb3ec35716877c27fe677fc2f8b2bdf9c0a72bf61': 'panda pair avax/eth',
    '0xBc31baFfcc81f7fD8Cc1715fbB8a5f51c862AbcC': 'panda pair avax/sushi',        
    '0xd8c9ed5257b84ca0b93b321967fbdab400bc8162': 'panda pair avax/uni',    
    '0xac3757c2305d6d1ab30f46b9278d7946da2b92f7': 'panda pair avax/bamboo',
    '0xb835f15ed39a5c0e8e1a83df52c4ecd7cacd198e': 'panda pair avax/bambooV1',
    '0xa3D9daDb140E2328E36d9122ef3F8085cFa3D2C2': 'panda pair avax/usdt',  
    '0x6955d4F07233EfAd555CEf8B388704CA6Cab9F35': 'panda pair avax/dai',  
    '0x008c38c756d5CCA327484e7040108DC3e424987d': 'panda pair bamboo/sushi',  
    '0x9eecaac711bdf4be130727b2e97dee80acb019ec': 'panda pair bamboo/dai',
    '0x9D180ee4d3bbf4FDA53677b5833d7f33F04bFA2e': 'panda pair bamboo/usdt',    
    '0x61925434024a8b0ab7ea9ff44e1af7a106cfdbfd': 'panda pair bamboo/link',
    '0x2036b7453814dc785Ab76486f2aA4d3BCDB33a04': 'panda pair bamboo/wbtc',
    '0xa6ff3f71392743c6bc60ff1f308db56e3424172f': 'panda pair bamboo/png',
    '0xb5bD08f034F77874c114c3b0dB80Dd1Fbdda07b2': 'panda pair bamboo/spore',
    '0x11f793f10b4c50c20a7efaf82ea6d8d0aa6beb5e': 'panda pair dai/wbtc',
    '0x083e14c8c0e122e374e4c6ff2169d8db7e6728be': 'panda pair eth/wbtc',
    '0x2545b379dcbb673e36c612cfdb8d6f1d61480bca': 'panda pair usdt/wbtc',


    '0x0c45FB63001b56a21e29c7dcc1727bfDA273a368': 'olive router',
    '0x57cc32Cd7F5a531953E9af25e1C9394093428082': 'olive treasury',
    '0xcdee5108413e80af6c84bdd3ab0d328a3d63dda4': 'olive treasury 2',
    '0x76fbce48d9dce3d04bfac318d1fdeb3a78e903a9': 'olive pair avax/eth',
    '0xbfc3C72Bab7252341dC90A1E85797Ebd8C79c338': 'olive pair usdt/avax',
    '0xF54a719215622f602FCA5BF5a6509734C3574a4c': 'olive pair usdt/olive',
    '0xd3566eC8Cdf8cb4E66B9F958ddb47E225C51E58b': 'olive pair dai/usdt',
    '0x57cc32cd7f5a531953e9af25e1c9394093428082': 'olive pair avax/olive',
    '0x79C1B4Ee613F29a8c0aae563Ef445317D99a6906': 'olive pair avax/wbtc',
}

nft_addr = {
    '0x3c7b682d5da98001a9b8cbda6c647d2c63d698a4184fd1d55e2ce7b66f5d21eb': 'offer punk',
    '0x8a0e37b73a0d9c82e205d4d1a3ff3d0b57ce5f4d7bccf6bac03336dc101cb7ba': 'alavanche punk',
    '0x58e5d5a525e3b40bc15abaa38b5882678db1ee68befd2f60bafe3a7fd06db9e3': 'bought punk',
    '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0': 'ownership transferred',
    '0x5b859394fabae0c1ba88baffe67e751ab5248d2e879028b8c8d6897b0519f56a': 'punk bid entered',
    '0x6f30e1ee4d81dcc7a8a478577f65d2ed2edb120565960ac45fe7c50551c87932': 'punk bid withdrawn',
    '0xb13f3a5a9746619771c98306d0b4e02bf179a21c6f6032c7b22913b933a8fe64': 'snowie bought',
    '0xf5583cf59ac1840eeb914cec3b173e238b6f7127c8417e22b19852c9de5dbb3f': 'snowie not longer for sale',
}

known_addr = {}
for d in [recognized_addr, static_addr, common_addr, defi_addr, nft_addr]:
    for k in d:
        if len(k) == 42:
            known_addr[k[:2].lower() + prefix + k[2:].lower()] = d[k]
        else:
            known_addr[k.lower()] = d[k].lower()

unknown_addr = {}

def is_known(t):
    if t not in unknown_addr and t not in known_addr:
        unknown_addr[t] = 0
    elif t in known_addr.keys() :
        return known_addr[t]
    unknown_addr[t] += 1
    return str(unknown_addr[t]) + '-' + t

def clean_it(k):
    ans = k.split('-')[-1] 
    if len(ans) == 66:
        return ans.replace(prefix,'',1)
    return ans

existing_hash = None
def result_logs(res):
    global existing_hash
    if 'topics' not in res and 'data' not in res:
        ws.close()
    topics = res['topics']
    data = res['data']
    known = [is_known(t) for t in topics]
    tx_hash = res['transactionHash']
    if existing_hash != tx_hash:
        print('')
        print('tx:', 'https://cchain.explorer.avax.network/tx/' + tx_hash)
        existing_hash = tx_hash
    elif known[0] in ['approval', 'signature']:
        pass
    elif known[0] == 'transfer':
        print('\t', known[0] + ':', [clean_it(k) for k in known[1:]], Web3.toInt(hexstr=data) / 10 ** 18 if data != '0x' else data )
    elif '-' not in known[0]:
        print('\t', known[0] + ':', [clean_it(k) for k in known[1:]])
    else:
        print('\t', 'topics:', len(topics), 'known:', known)
        exit(-1)

def on_message(ws, message):
    try:
        msg = json.loads(message)
        if 'params' in msg and 'result' in msg['params']:
            result = msg['params']['result']
            sub = [s for s in subs if s['subscription_id'] == msg['params']['subscription']][0]
            sub['on_result'](result)
        elif 'result' in msg:
            print('subscribed:', msg['id'])
            sub = [s for s in subs if s['id'] == msg['id']][0]
            sub.update({'subscription_id': msg['result'], 'on_result': globals()['result_' + sub['params'][0]]})
            remaining_subs = [s for s in subs if 'subscription_id' not in s]
            if len(remaining_subs) > 0:
                ws.send(json.dumps(remaining_subs[0]))
        else:
            print('unknown:', msg)
    except Exception as e:
        print('msg:', msg)
        print('bad message:', e)
        ws.close()

def on_open(ws):
    def run(*args):
        ws.send(json.dumps(subs[0]))
    thread.start_new_thread(run, ())

def on_error(ws, error):
    print('error:', error)

def on_close(ws):
    print('closed')

try:
    import thread
except ImportError:
    import _thread as thread
import time

if __name__ == '__main__':
    ws = websocket.WebSocketApp('wss://api.avax.network/ext/bc/C/ws',
        on_open = on_open,
        on_message = on_message,
        on_error = on_error,
        on_close = on_close
    )
    ws.run_forever()
