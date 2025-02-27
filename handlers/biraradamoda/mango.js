
const Apify = require('apify');
async function handler(page, context) {
    const { request: { userData: {  } } } = context
    debugger;

    const dataset = await Apify.openDataset();
    const url = await page.url()

    debugger;

    await page.waitForSelector('.catalog')
    await autoScroll(page);

    const { items } = await dataset.getData()
    debugger
    const data = items.filter(f=>f.version && f.groups).map(m => {

        return [...m.groups]
    }).map(m => {


        return [...m]
    }).map((m) => {

        return m[0].garments
    }).map(m => {


        return Object.values(m)
    }).flat().map(m => {

        return [m.colors.map(c => {

            return { shortDescription: m.shortDescription, ...c }
        })]
    }).flat(2).map(m => {

        const imageUrl = m.images[0].img1Src
        const link = m.linkAnchor
        return {
            title: 'mango ' + m.shortDescription + ' ' + m.label,
            priceNew: m.price.salePrice.replace('TL', '').trim(),//.replace('.','').replace(',','.').trim(),

            imageUrl: imageUrl.substring(imageUrl.indexOf('https://st.mngbcn.com/') + 22),
            link: link.substring(link.indexOf('/') + 1),
            timestamp: Date.now(),
            marka: 'mango',

        }
    })
    debugger;




    //----------

    console.log('data length_____', data.length, 'url:', url)


    return data.map(m=>{return {...m,title:m.title+" _"+process.env.GENDER }})
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
            }, 150);
        });
    });
}
module.exports = { handler, getUrls }

