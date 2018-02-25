const puppeteer = require('puppeteer')

async function getLatestDoller(page, url){
  await page.goto(url) // ページへ移動
  // 任意のJavaScriptを実行
//*[@id="USDJPY_bid"]
//return await page.evaluate(() => 'USDJPY : ' + document.querySelector('span#USDJPY_bid').textContent.trim() + ' - ' + document.querySelector('span#USDJPY_ask').textContent.trim())
return await page.evaluate(() => 'USD/JPY(ask) : ' + document.querySelector('span#USDJPY_ask').textContent.trim())
}

!(async() => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    //Yahoo Financeで ドル円レートを スクレイピング
    const latestDoller = await getLatestDoller(page, 'https://info.finance.yahoo.co.jp/fx/detail/?code=USDJPY=FX')
    //console.log(`{"text":"最新為替レート(bid-ask) ${latestDoller}","color":"info"}`)
    browser.close()
    
    //tocaroに JSONを Post
    var request = require('request');
    var options = {
        uri: "https://hooks.tocaro.im/integrations/inbound_webhook/nwje8mqjy0dvpfcpylr4y4xbzslsfgl5",
        headers: {
            "Content-type": "application/json",
        },
        json: {
            "text": `${latestDoller}`,
            "color":"info"
        }
    };
    request.post(options, function(error, response, body){});

  } catch(e) {
    console.error(e)
  }
})()