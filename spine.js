


(async () => {
  //require('dotenv').config()
const {cloudinaryUploader}=require('./utils/cloudinaryUploader')
debugger
await cloudinaryUploader(JSON.stringify({hello:'yes'}),'hello')
debugger

  debugger
})()














































// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const fs = require('fs')
// const html = fs.readFileSync('./htmls/joinus.html').toString()
// const dom = new JSDOM(html)

// debugger;

// const list = Array.from(dom.window.document.querySelectorAll('[data-json-product]'))
// debugger;
// const prods = list.map(element => {
// debugger;
//   const obj =JSON.parse(element.getAttribute('data-json-product'))
// debugger;
//  // const title = element.querySelector('.lazy-image.product-name.track-link').getAttribute('title')
//  // const img= element.querySelector('.lazy-image.product-name.track-link img').src
//  // const priceNew =element.querySelector('.product-price')?element.querySelector('.product-price').innerHTML.replace('TL','').trim() :element.querySelector('.product-new-price').innerHTML.replace('TL','').trim()
// //  const link = element.querySelector('.lazy-image.product-name.track-link').href

//   return {
//    // title,
//   //  priceNew,
//    // imageUrl: img,
//    // link,
//     timestamp: Date.now(),
//     marka: 'joinus',

//   }
// })

// debugger;
// let products = []



































