const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
app.use(cors({
  origin:'*'
}))
const puppeteer = require('puppeteer')
app.listen(process.env.PORT||4000)
var new_url;
var i = 0
app.get('/',async (req,res)=>{
  new_url = `https://www.amazon.in/s?k=${req.query.item}&ref=nb_sb_noss`;
  await main()
  await res.send(data)
})
var data = []
const main = async ()=>{
  data = []
  var obj = {
    p_title:"",
    p_asin:"",
    p_price:""
  }
  const browser = await puppeteer.launch({
     headless:false 
  })
  const pages = await browser.newPage()
  await pages.goto(new_url,{timeout: 0})
  while(i!==7){
    await pages.waitForSelector('.s-main-slot > .s-asin')
    await pages.waitForSelector('h2 > a > span')
    await pages.waitForSelector('.a-price > span>.a-price-whole')
    await pages.waitForSelector('.a-icon-alt')
    await pages.waitForSelector('.a-text-price>.a-offscreen')
    await pages.waitForSelector('.s-image')
    const products = await pages.$$('.s-main-slot > .s-asin')
    for(const product of products){
      try{
        const title = await pages.evaluate((el)=>el.querySelector('h2 > a > span').textContent,product)
        const asin = await pages.evaluate((el)=>el.getAttribute('data-asin'),product)
        const price = await pages.evaluate((el)=>el.querySelector('.a-price > span>.a-price-whole').textContent,product)
        const rating = await pages.evaluate((el)=>el.querySelector('.a-icon-alt').textContent,product) 
        const mrp = await pages.evaluate((el)=>el.querySelector('.a-text-price>.a-offscreen').textContent,product) 
        const image = await pages.evaluate((el)=>el.querySelector('.s-image').getAttribute('src'),product) 

        data.push({
          ptitle:title,
          pasin:asin,
          pprice:strtonum(price),
          prating:rate(rating),
          pmrp:strtonum(mrp),
          pdiscount : (100-((strtonum(price)/strtonum(mrp))*100))|0,
          purl : 'https://www.amazon.in/dp/'+asin,
          pimg:image
        })
      }catch(err){
        if(err){
          data.push(
            {
              error:'failed!',
              message :err
            }
          )
        }
      }
    }
    await pages.waitForSelector(".s-pagination-next")
    await pages.click('.s-pagination-next')
    await i++;
  }
  await browser.close()
}
function strtonum(string){
  return parseInt(string.replace(/,/g,'').replace('₹',"").replace('.',''))
}
function rate(string){
  return parseFloat(string.split(" ")[0])
}