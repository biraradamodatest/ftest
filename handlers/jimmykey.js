
async function handler(page, context) {
    const { request: { userData: { subcategory, category, start,node } } } = context
    debugger;
    const url = await page.url()

    debugger;

    await page.waitForSelector('.PrdContainer')
    await autoScroll(page);
    await page.waitFor(5000)
    debugger;
    const data = await page.$$eval('.row.ProductList', (productCards, _subcategory, _category,_node) => {

        return productCards.map(productCard => {

            const imageUrl = productCard.querySelector('.PImage').src && productCard.querySelector('.PImage').src
            const title = productCard.querySelector('.PName').innerHTML.trim()
            const priceNew = productCard.querySelector('.PPrice') && productCard.querySelector('.PPrice').textContent.trim().replace('₺', '')
            const longlink = productCard.querySelector('.PrdImgsBox a').href
            const link = longlink.substring(longlink.indexOf("https://www.jimmykey.com/tr/") + 28)
            const imageUrlshort = imageUrl && imageUrl.substring(imageUrl.indexOf("https://cdn.sorsware.com/") + 25)

            return {
                title: 'jimmykey ' + title,
                priceNew,//:priceNew.replace(',','.'),
                imageUrl: imageUrlshort,
                link,
                timestamp: Date.now(),
                marka: 'jimmykey',
             //   subcategory: _subcategory,
                category: _category,
                node: _node
            }
        })//.filter(f => f.imageUrl !== null)
    }, subcategory, category,node)

    //----------



    //----------

    console.log('data length_____', data.length, 'url:', url)



    debugger;
    const withSub = data.map(m => {
        const { title } = m
        const subcatmatches = subcategory.filter(f => title.toLowerCase().includes(f))
        const subcat = subcatmatches.length > 0 ? subcatmatches[0] : subcategory[subcategory.length-1]
        debugger
        return { ...m, subcategory: subcat }
    })
    return withSub
}

async function getUrls(page) {

    return { pageUrls: [], productCount: 0, pageLength: 0 }
}

async function autoScroll(page) {
    await page.evaluate(async () => {


        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            let inc = 0
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;

                window.scrollBy(0, distance);
                totalHeight += distance;
                inc = inc + 1
                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });
}
module.exports = { handler, getUrls }

