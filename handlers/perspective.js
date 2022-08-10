
async function handler(page, context) {
    const { request: { userData: { subcategory, category } } } = context

    const url = await page.url()
    debugger
    await page.waitForSelector('.ProductList')


    const data = await page.$$eval('.Prd', (productCards, _subcategory, _category) => {
        return productCards.map(productCard => {

            const longImgUrl = productCard.querySelector('.PImage').src
            const title = productCard.querySelector('.PImage') ? productCard.querySelector('.PImage').alt : productCard.innerHTML
            const priceNew = productCard.querySelector('.PriceArea').querySelectorAll('span').length === 1 ? productCard.querySelector('.PriceArea').querySelectorAll('span')[0].innerHTML.trim().replace('₺', '').trim() : productCard.querySelector('.PriceArea').querySelectorAll('span')[1].innerHTML.trim().replace('₺', '').trim()
            const longlink = productCard.querySelector('.carousel-item a').href
            const link = longlink.substring(longlink.indexOf("https://www.perspective.com.tr/") + 31)
   
            const imageUrlshort = longImgUrl && longImgUrl.substring(longImgUrl.indexOf("https://cdn.sorsware.com/") + 25)
            return {
                title: 'perspective ' + title,

                priceNew,

                imageUrl: imageUrlshort,
                link,

                timestamp: Date.now(),

                marka: 'perspective',
                subcategory: _subcategory,
                category: _category


            }
        })//.filter(f => f.imageUrl !== null)
    }, subcategory, category)

    console.log('data length_____', data.length, 'url:', url)


    debugger
    return data
}

async function getUrls(page) {
    const url = await page.url()

    await page.waitForSelector('.Pages a')

    const totalPages = await page.$eval('.Pages', element => element.querySelectorAll('a').length)
    const pageUrls = []

    let pagesLeft = totalPages
    for (let i = 2; i <= totalPages; i++) {



        pageUrls.push(`${url}?p=` + i)
        --pagesLeft


    }

    return { pageUrls, productCount: 0, pageLength: pageUrls.length + 1 }
}
module.exports = { handler, getUrls }