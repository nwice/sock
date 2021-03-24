const puppeteer = require('puppeteer');
const WebSocket = require('ws');

console.log('price service')

let specific_dex = {
    value: 0, 
    token: 'PNG',
    info: {
        tokens: 'https://info.pangolin.exchange/#/tokens',
        trigger_div: 'WAVAX'
    }
}

const server = new WebSocket.Server({
  port: 8081,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

server.on('connection', function connection(ws) {
    ws.on('message', (message) => {
        console.log('message:', message);
    });      
});

let forever_after = true;

(async () => {

    const width = 1920
    const height = 1080
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', `--window-size=${ width },${ height }`],
    })
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage()
    await page.setViewport({ width: 1920, height: 1080});
    await page.goto(specific_dex.info.tokens, { waitUntil: 'domcontentloaded' });
    let div_altitude = 0;
    let level_flight = 500;
    while(div_altitude < level_flight) {
        await new Promise(function (resolve) {
            setTimeout(resolve, 3000)
        });
        try {
            console.log('pre-eval div altitude:', div_altitude)
            div_altitude = await page.evaluate( (dex) => {
                let divs = document.querySelectorAll('div');
                if ( divs.length < 500 ) {
                    return divs.length
                } else {
                    let token_divs = [];
                    for (var x = 0; x < divs.length; x++) {
                        if ( divs[x].innerHTML === dex.info.trigger_div ) {
                            token_divs = [...divs[x].parentNode.parentNode.parentNode.parentNode.querySelectorAll(':scope > div:not(:first-of-type)')];
                            break;
                        }
                    }
                    if ( token_divs.length == 0 ) {
                        return divs.length
                    }
                    return new Promise ((resolve, reject) => {
                        const client = new WebSocket('ws://localhost:8081');
                        client.addEventListener('open', function (event) {
                            client.send(`in tower with ${token_divs.length} tokens`);
                        });
                    });                    
                };
                return divs.length;
            }, specific_dex);
        } catch (err) {
            console.log('error:', err)    
        }
    }
    if (forever_after) {
        console.log('forever after');
        await new Promise ((resolve, reject) => {});
    }
    await browser.close();
})()
