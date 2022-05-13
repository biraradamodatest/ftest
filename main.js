
console.log('main.js is loading...')
require('dotenv').config()
const { getGoogleToken } = require('./google/google.oauth')
const fs = require('fs')

const { getSheetValues, setSheetValue, appendSheetValues } = require('./google.sheet.js')

const Apify = require('apify');



fs.writeFileSync('helloworld.txt', new Date().toDateString())

Apify.main(async () => {
    const startDate = new Date().toLocaleDateString()
    console.log('apify.main.js is loading...')
    let data = []
    const google_access_token = await getGoogleToken(process.env.GOOGLE_REFRESH_TOKEN)


    const { utils: { log } } = Apify;
    const requestQueue = await Apify.openRequestQueue();
    //match(/(?<=www.).*(?=.com)/g)
    if (process.env.male) {
        requestQueue.addRequest({ url: process.env.male, userData: { start: true, gender: 'MALE' } })
    }

    if (process.env.female) {
        requestQueue.addRequest({ url: process.env.female, userData: { start: true, gender: 'FEMALE' } })
    }

    const sheetDataset = await Apify.openDataset(`categorySheet`);
    const productsDataset = await Apify.openDataset(`products`);
    const sheetData = await getSheetValues({ access_token: google_access_token, spreadsheetId: '1TVFTCbMIlLXFxeXICx2VuK0XtlNLpmiJxn6fJfRclRw', range: 'categories!A:C' })

    console.log('sheetData', sheetData)

    for (let value of sheetData.values.filter((c, i) => i > 0)) {
        const subcategory = value[0]
        const category = value[1]
        const regex = value[2]
        await sheetDataset.pushData({ subcategory, category, regex })
    }


    process.env.dataLength = 0
    const handlePageFunction = async (context) => {

        const { page, request: { userData: { start, gender } } } = context

        const pageUrl = await page.url()
        const pageUrldataset = await Apify.openDataset(`${process.env.marka}`);

        await pageUrldataset.pushData({ marka: process.env.marka, pageUrl });
        const { handler, getUrls } = require(`./handlers/${process.env.marka}`);
        const { pageUrls, productCount, pageLength } = await getUrls(page)
        process.env.productCount = productCount

        if (start) {
            let order = 1
            for (let url of pageUrls) {
                if (pageUrls.length === order) {
                    requestQueue.addRequest({ url, userData: { start: false, gender } })
                } else {
                    requestQueue.addRequest({ url, userData: { start: false, gender } })
                }
                ++order;
            }
        }

        const dataCollected = await handler(page, context)
        const categoryData = await sheetDataset.getData()
        const google_access_token1 = await getGoogleToken(process.env.GOOGLE_REFRESH_TOKEN)
        const currentDate = new Date().toLocaleDateString()

        const categoryItems = categoryData.items
        const map1 = dataCollected.map((p, i) => {
            const procutTitle = p.title

            const productCategory = categoryItems.find(c => {
                const regexvar = "(\\s|^|\\b)(" + c.subcategory + ")($)"
                const reg = new RegExp(regexvar, "i")
                const result = reg.test(procutTitle.toLowerCase())
                return result
            })
            if (productCategory) {
                return { ...p, category: productCategory.category, subcategory: productCategory.regex }
            } else {
                return { ...p, category: "undefined", subcategory: "undefined" }
            }
        })
        console.log('map1.length', map1.length)
        const map2 = map1.map((c, i, arr) => {

            const filteredData = arr.filter(obj => obj.subcategory === c.subcategory)
            let index;

            index = filteredData.findIndex(obj => obj.imageUrl === c.imageUrl)
            return { ...c, itemOrder: index }
        })

        console.log('map2.length', map2.length)

        const table = map2.reduce((group, product) => {
            const values = Object.values(product)

            group.push(values);
            return group;
        }, []);



        await productsDataset.pushData(map2)



        console.log('uploading to excell....')

        const groupByCategory = map2.reduce((group, product) => {
            const { subcategory } = product;
            group[subcategory] = group[subcategory] ?? [];
            group[subcategory].push(product);
            return group;
        }, {});

        let colResulValues = []
        for (let cat in groupByCategory) {
            const curr = groupByCategory[cat]
            const gender = curr[0].gender
            const category = curr[0].category
            const subcategory = curr[0].subcategory

            colResulValues.push([`${process.env.marka}`, `${gender}`, `${category}`, `${subcategory}`, `${curr.length}`, startDate, currentDate])

        }

        if (gender === 'MALE') {

            //   const response= await appendSheetValues({ access_token: google_access_token1, spreadsheetId: '1IeaYAURMnrbZAsQA_NO_LA_y_qq8MmwxjSo854vz5YM', range: 'DATA!A:B', values: table })

        }
        if (gender === 'FEMALE') {

            //  const response= await appendSheetValues({ access_token: google_access_token1, spreadsheetId: '12mKtqxu5A-CVoXP_Kw36JxKiC69oPUUXVQmm7LUfh3s', range: 'DATA!A:B', values: table })

        }



        console.log('uploading to excell complete....')

        console.log('items...', map2.length);
        process.env.dataLength = parseInt(process.env.dataLength) + map2.length
        console.log('process.env.dataLength', process.env.dataLength)

    }

    const crawler = new Apify.PuppeteerCrawler({
        //requestList,
        requestQueue,
        maxConcurrency: 10,
        launchContext: {
            // Chrome with stealth should work for most websites.
            // If it doesn't, feel free to remove this.
            // useChrome: true,
            launchOptions: {
                headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', "--disable-web-security",
                    `--window-size=1200,1250`,
                    "--allow-insecure-localhost",
                    //  "--user-data-dir=/tmp/foo",
                    "--ignore-certificate-errors",
                    "--unsafely-treat-insecure-origin-as-secure=https://localhost:8888",
                    '--disable-gpu-rasterization',
                    '--disable-low-res-tiling',
                    '--disable-skia-runtime-opts',
                    '--disable-yuv420-biplanar'
                ]
            }

        },
        handlePageFunction,
        preNavigationHooks: [
            async (crawlingContext, gotoOptions) => {
                const { page } = crawlingContext;
                await page.setDefaultNavigationTimeout(0);
                await page.setRequestInterception(true);
                page.on('request', req => {
                    const resourceType = req.resourceType();
                    if (resourceType === 'image') {
                        req.respond({
                            status: 200,
                            contentType: 'image/jpeg',
                            body: ''
                        });


                    } else {
                        req.continue();
                    }
                });
            },
        ],
        handleFailedRequestFunction: async ({ request: { errorMessages, url, userData: { gender, start } } }) => {
            const google_access_token1 = await getGoogleToken(process.env.GOOGLE_REFRESH_TOKEN)
            if (gender === 'MALE') {

                const response = await appendSheetValues({ access_token: google_access_token1, spreadsheetId: '1IeaYAURMnrbZAsQA_NO_LA_y_qq8MmwxjSo854vz5YM', range: 'ERROR!A:B', values: [[url, errorMessages[0].substring(0, 150), gender, start]] })

            }
            if (gender === 'FEMALE') {

                const response = await appendSheetValues({ access_token: google_access_token1, spreadsheetId: '12mKtqxu5A-CVoXP_Kw36JxKiC69oPUUXVQmm7LUfh3s', range: 'ERROR!A:B', values: [[url, errorMessages[0].substring(0, 150), gender, start]] })

            }
            // This function is called when the crawling of a request failed too many times


        },
    });


    log.info('Starting the crawl.');
    await crawler.run();
    const { items } = await productsDataset.getData()

    const groupByCategory = items.reduce((group, product) => {
        const { subcategory } = product;
        group[subcategory] = group[subcategory] ?? [];
        group[subcategory].push(product);
        return group;
    }, {});
    for (let subcategory in groupByCategory) {
        const withoutunicode = subcategory.toLocaleLowerCase().replace('ç', "c").replace("ö", "o").replace("ü", "u").replace("ş", "s").replace("ı", "i").replace("ğ", "g")
        const current = groupByCategory[subcategory]
        if (fs.existsSync(`./api/_files/${process.env.GENDER}/${withoutunicode}.json`)) {
            fs.unlinkSync(`./api/_files/${process.env.GENDER}/${withoutunicode}.json`)
        }
        //save data to jsson
        fs.appendFileSync(`./api/_files/${process.env.GENDER}/${withoutunicode}.json`, JSON.stringify(current))
        fs.appendFileSync(`./api/${process.env.GENDER}/${withoutunicode}.js`, `require('dotenv').config()
        var TAFFY = require( 'taffy' );

       
       // Create a new database a single object (first record)
       
       const data =require('../_files/${process.env.GENDER}/${withoutunicode}.json')
     
       var products = TAFFY(data);
       module.exports =   (req, res)=> {
           var data = products().limit(100).get()
  
           res.status(200).json({data})
       
       
       }
       `)

        const vercel = require('./vercel.json')

        vercel[`api/${process.env.GENDER}/${withoutunicode}.js`] = { includeFiles: "" }
        vercel[`api/${process.env.GENDER}/${withoutunicode}.js`]['includeFiles'] = `_files/${process.env.GENDER}/${withoutunicode}.json`
        debugger;
       fs.writeFileSync(`vercel.json`,JSON.stringify(vercel))

    }

    console.log('items.length', items.length)


    console.log('Crawl finished.');

});


