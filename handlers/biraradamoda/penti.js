
async function handler(page, context) {
    const { request: { userData: { } } } = context
    debugger;
    const url = await page.url()

    await page.waitForSelector('.products')


    const data = await page.$$eval('[data-page]', (productCards, _subcategory, _category,_node) => {
        return productCards.map(productCard => {
            const obj = JSON.parse(productCard.querySelector('.prd-link').getAttribute('data-gtm-product'))


            const longlink = productCard.querySelector('.prd-link').href.trim()
            const link = longlink.substring(longlink.indexOf("https://www.penti.com/tr/") + 25)
            const longImgUrl = obj.dimension19
            const imageUrlshort = longImgUrl.substring(longImgUrl.indexOf("https://file-penti.mncdn.com/mnresize/") + 38)
            return {
                title: 'penti '+ obj.name.replace(/İ/g,'i').toLowerCase(),
                priceNew: obj.price,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'penti',



            }
        })
    })

    console.log('data length_____', data.length, 'url:', url)

    debugger;


    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
}

async function getUrls(page) {
    const url = await page.url()
    debugger;
    await page.waitForSelector('.plp-info')
    const productCount = await page.$eval('.plp-info', element => parseInt(element.innerText.replace(/[^\d]/g, "")))
    debugger;
    const totalPages = Math.ceil(productCount / 20)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?page=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }