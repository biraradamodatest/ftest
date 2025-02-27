
async function handler(page, context) {
    const { request: { userData: { } } } = context
    
    await page.waitForSelector('#products')
    
    const url = await page.url()

    const data = await page.$$eval('.products__item', (productCards) => {
        return productCards.map(productCard => {
            const imageUrl = productCard.querySelector('[data-original]').getAttribute('data-original')
            const title = productCard.querySelector('.product__title').innerHTML.trim()
            const priceNew = productCard.querySelector(".product__price.-actual").textContent.replace('TL', '').replace(/\n/g, '').trim()
            const longlink = productCard.querySelector('[data-product-link]').href
            const link = longlink.substring(longlink.indexOf("https://www.network.com.tr/") + 27)
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://img-network.mncdn.com/mnresize/") + 39)
            return {
                title: 'network ' + title.replace(/İ/g, 'i').toLowerCase(),
                priceNew,
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'network',
            }
        }).filter(f => f.imageUrl !== null && f.title.length > 5)
    })
    
    console.log('data length_____', data.length, 'url:', url)



    const formatprice = data.map((m) => {
        return { ...m, title: m.title + " _" + process.env.GENDER }
    })


    return formatprice

}

async function getUrls(page) {
    
    const url = await page.url()
    await page.waitForSelector('.productCount')

    const productCount = await page.evaluate(() => {
        return parseInt(document.querySelector(".productCount").childNodes[0].textContent.replace(/[^\d]/g, ''))
    })
    const productPerPage = await page.evaluate(() => {
        return parseInt(document.querySelector(".js-product-total-count").childNodes[0].textContent.replace(/[^\d]/g, ''))
    })
    
    const totalPages = Math.ceil(productCount / productPerPage)
    const pageUrls = []
    
    if (totalPages > 1) {
        let pagesLeft = totalPages
        for (let i = 2; i <= totalPages; i++) {
            pageUrls.push(`${url}?page=` + i)
            --pagesLeft
        }
    }


    return { pageUrls, productCount, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }