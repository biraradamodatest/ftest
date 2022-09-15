


(async () => {
    const { getGoogleToken } = require('../google/google.oauth')

    const google_access_token = await getGoogleToken()
    const spreadsheetId = '1GLN7_-mqagdV0yoQUIGjBqs4orP9StAGwqlJXYfKwQQ'
    await generateKeyword({ google_access_token, spreadsheetId, range: 'elbise!A:J', node: 'dream', subcategory: 'elbise' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'pantolon!A:J', node: 'dream', subcategory: 'pantolon' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'etek!A:J', node: 'dream', subcategory: 'etek' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'tulum!A:J', node: 'dream', subcategory: 'tulum' })

    await generateKeyword({ google_access_token, spreadsheetId, range: 'tisort!A:J', node: 'dream', subcategory: 'tişört' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'hirka!A:J', node: 'dream', subcategory: 'hırka' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'gomlek!A:J', node: 'dream', subcategory: 'gömlek' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'sweatshirt!A:J', node: 'dream', subcategory: 'sweatshirt' })

    await generateKeyword({ google_access_token, spreadsheetId, range: 'bluz!A:J', node: 'dream', subcategory: 'bluz' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'sort!A:J', node: 'dream', subcategory: 'şort' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'ceket!A:J', node: 'dream', subcategory: 'ceket' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'tunik!A:J', node: 'dream', subcategory: 'tunik' })

    await generateKeyword({ google_access_token, spreadsheetId, range: 'tayt!A:J', node: 'dream', subcategory: 'tayt' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'yagmurluk!A:J', node: 'dream', subcategory: 'yağmurluk' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'mont!A:J', node: 'dream', subcategory: 'mont' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'trenckot!A:J', node: 'dream', subcategory: 'trençkot' })

    await generateKeyword({ google_access_token, spreadsheetId, range: 'kaban!A:J', node: 'dream', subcategory: 'kaban' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'atlet!A:J', node: 'dream', subcategory: 'atlet' })
    await generateKeyword({ google_access_token, spreadsheetId, range: 'abiye!A:J', node: 'dream', subcategory: 'abiye' })

    await generateKeyword({ google_access_token, spreadsheetId, range: 'dis_giyim!A:J', node: 'dream', subcategory: 'dis_giyim' })
    process.exit(0)

})()


async function generateKeyword({ google_access_token, spreadsheetId, range, node, subcategory }) {
    const fs = require('fs')
    const makeDir = require('make-dir');

    const { getSheetValues, appendSheetValues } = require('../google.sheet.js')
    let categoryItems = []

   
    const sheetData = await getSheetValues({ access_token: google_access_token, spreadsheetId, range })
debugger
    for (let value of sheetData.values.filter((c, i) => i > 0)) {
        const keyword = value[0]
        const parentorchild = value[1]
        const parentkey = value[2]
        const title = value[3]
        const negwords = value[4]
        const exactmatch = value[5]
        const state = value[6]
        const group = value[7]
        const index = value[8]
        const groupid = value[9]
       
        console.log('exactmatch...', exactmatch, keyword)
        categoryItems.push({ keyword, parentorchild, parentkey, title, negwords, exactmatch, state, group, index, groupid })

    }

    const data = categoryItems.filter(f => f.state === undefined || f.state !== 'FALSE').filter(f => f.parentorchild === 'parent')

    await makeDir(`projects/${node}/api/_files/nav/${subcategory}`)
    if (fs.existsSync(`projects/${node}/api/_files/nav/${subcategory}/keywords.json`)) {
        fs.unlinkSync(`projects/${node}/api/_files/nav/${subcategory}/keywords.json`)
    }
    fs.appendFileSync(`projects/${node}/api/_files/nav/${subcategory}/keywords.json`, JSON.stringify({ [subcategory]: data }))
    console.log('subcategory',subcategory)

  
  
}