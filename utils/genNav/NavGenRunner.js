(async () => {

    const fs = require('fs')
    const path = require('path')
    const plimit = require('p-limit')
    const makeDir = require('make-dir')
    // const placeholders = require('../../src/drawer/imageComponent/placeholders.json')
    const { workerPromise } = require('./workerPromiseNavGen')
    // const { fetchImages } = require('../fetchImages')


    const limit = plimit(5);

    function generateRandomInteger(max) {
        return Math.floor(Math.random() * max);
    }

    try {
        fs.rmSync(path.join(process.cwd(), `public/image-indexes`), { recursive: true, force: true });
     const fnNames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'diger']

        //const fnNames = ['seven']
        const result = await Promise.all(fnNames.map((functionName) => {

            console.log('functionName', functionName)
            if (fs.existsSync(path.join(process.cwd(), `api/_files/data/${functionName}`))) {
                return limit(async () => await workerPromise({ functionName }))
            }
            else return null

        }))

        const catCounter = result.filter(f => f !== null).reduce((prev, curr, i) => {
            const nxt = JSON.parse(curr).catCounter

            return { ...prev, ...nxt }
        }, {})


        const categoryNav = require(path.join(process.cwd(), `src/category-nav.json`))
        for (let c in catCounter) {

            const current = catCounter[c]

            for (let v in current) {
                const { count, imageUrls } = current[v]

                const curNav = categoryNav[c].map(m => {

                    if (m.title === v) {

                        return { ...m, count: m.count ? m.count + count : count, imageUrls: m.imageUrls ? [...m.imageUrls, ...imageUrls] : [...imageUrls] }

                    } else {

                        return m
                    }

                })

                categoryNav[c] = curNav

            }

        }



        if (fs.existsSync(path.join(process.cwd(), `src/category-nav-counter.json`))) {
            fs.unlinkSync(path.join(process.cwd(), `src/category-nav-counter.json`))
        }
        if (fs.existsSync(path.join(process.cwd(), `public/category-nav-counter.json`))) {
            fs.unlinkSync(path.join(process.cwd(), `public/category-nav-counter.json`))
        }
        for (let c in categoryNav) {
            const current = categoryNav[c]
            let updatedArray=[]
            for await (let f of current) {
   
            if( f.imageUrls){
                f.imageUrls.filter((f,i)=> i<2)
                updatedArray.push({...f,imageUrls:f.imageUrls.filter((f,i)=> i<2)})
            }
             
                // if (f.imageUrls && f.imageUrls.length > 0) {
                //     const filterApplicable=f.imageUrls.filter(j => {
                //         debugger
                //         const result = j.title.split(' ')[j.title.split(' ').length - 1] === f.title && !j.src.includes('main')

                //         return result
                //     })
                //     const filtered = filterApplicable.length > 0 ? filterApplicable : f.imageUrls

                //     const randomImage1 = filtered.length === 1 ? 0 : generateRandomInteger(filtered.length - 1)
                //     const randomImage2 = filtered.length === 1 ? 0 : generateRandomInteger(filtered.length - 1)
                //     const randomImageOne = filtered[randomImage1]
                //     const randomImageTwo = filtered[randomImage2]
                //     // const { marka } = imageUrls
                //     // const imagePrefixCloudinary = 'https://res.cloudinary.com/codergihub/image/fetch/h_200/'
                //     // const imageSource = imagePrefixCloudinary + placeholders[marka].imageHost.trim() + imageUrls.src 

                //     // const filename =path.basename(imageUrls.src)
                //     // debugger
                //     // await fetchImages({ url: imageSource, filepath: `${process.cwd()}/sprites/${filename}` })
                //     debugger

                //    delete f.imageUrls// [randomImageOne, randomImageTwo]
                // }
            }

            categoryNav[c]=updatedArray



         }

        fs.appendFileSync(path.join(process.cwd(), `src/category-nav-counter.json`), JSON.stringify(categoryNav));
        fs.appendFileSync(path.join(process.cwd(), `public/category-nav-counter.json`), JSON.stringify(categoryNav));
        const catImages = result.filter(f => f !== null).reduce((prev, curr, i) => {
            const nxt = JSON.parse(curr).catImages
            const upd = {}
            for (let c in nxt) {
                const exist = prev[c]
                if (upd[c] === undefined) {
                    upd[c] = {}
                }
                if (exist) {
                    upd[c] = { ...exist, ...nxt[c] }
                } else {
                    upd[c] = { ...nxt[c] }
                }

            }
       
            return { ...prev, ...upd }
        }, {})
    

        for (let cimage in catImages) {

            try {

                const imageIndexPath = path.join(process.cwd(), `public/image-indexes`, `${cimage}.json`)
                makeDir.sync(path.join(process.cwd(), `public/image-indexes`))
                if (fs.existsSync(imageIndexPath)) {

                    fs.unlinkSync(imageIndexPath)
                }
                fs.appendFileSync(imageIndexPath, JSON.stringify({ ...catImages[cimage] }));

            } catch (error) {
                console.log('image-indexes', error)
                throw error
            }

        }

        console.log('all workers complete')
    //  process.exit(0)

    } catch (error) {
        console.log('error.', error)
    }

})()