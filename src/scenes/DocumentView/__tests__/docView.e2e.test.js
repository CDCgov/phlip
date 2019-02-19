const puppeteer = require('puppeteer')

const jasmineTimeout = 60000
const admin = {
  email: 'admin@cdc.gov'
}
const email_selector = '#email'
const host = 'http://localhost:5200'
const documentManagementBtn = '#root > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)'
//const testProject = 'zero dawn'
//const uploadNewButton = '#uploadNewBtn'
//const uploadGoButton = '#uploadFilesBtn'
const documentTable = '#documentTable'
//const testProject3 = 'firstDoc'
const refDocMeta = {
  docName: 'YOUNGSTOWN MUNICIPAL COURTMAYORS COURTSTEXT MESSAGING.pdf',
  uploadedDate: '2/13/2019',
  uploadedBy: 'Admin',
  citation: 'Minn. Stat. Ann. § 144.9501',
  effDate: '7/1/2016',
  status: 'Draft'
}

//const docContainer = '#docContainer'
const docName = '#docName'
const docMeta = '#docMeta'

let page
let browser

beforeAll(async () => {
  browser = await puppeteer.launch(
    //  isDebugging().puppeteer
    { headless: false }
  )
  page = await browser.newPage()
})

xdescribe('doc view', () => {
  // dummy test.  run login for the rest of the tests
  test('login', async () => {
    jest.setTimeout(80000)
    await page.goto(`${host}/login`)
    await page.screenshot({ path: 'login.png' })
    await page.waitForSelector(email_selector)
    await page.click(email_selector)
    await page.keyboard.type(admin.email)
    await page.click('button[type=submit]')
    await page.waitForNavigation()
  }, jasmineTimeout)

  test('check if document open', async () => {
    await page.goto(`${host}/home`)
    // click on document management button
    await page.waitForSelector(documentManagementBtn)
    await page.click(documentManagementBtn)
    await page.waitFor(1000)
    await page.waitForSelector(documentTable)
    // click on upload new to upload a test document
    // await page.waitForSelector(uploadNewButton)
    // await page.click(uploadNewButton)
    //
    // await page.waitForSelector('form > div > div > input[type="file"]')
    // const fileEle = await page.$('form > div > div > input[type="file"]')
    // // wait for excel file
    // await page.waitForSelector('form:nth-child(3) > div > div > input[type="file"]')
    // const excelEle = await page.$('form:nth-child(3) > div > div > input[type="file"]')
    // const files = ['/Users/trungnguyen/Downloads/demo/OAC 3701-52-04 eff. 5-3-07.pdf'];
    // await fileEle.uploadFile(...files)
    // await page.waitFor(3000)
    // await excelEle.uploadFile('/Users/trungnguyen/Downloads/demo/demo.xlsx')
    // await page.waitFor(3000)
    // await page.waitForSelector('#project-name')
    // await page.click('#project-name')
    // await page.keyboard.type(testProject3)
    // await page.waitForSelector('#react-autowhatever-1--item-0')
    // await page.click('#react-autowhatever-1--item-0')
    // await page.waitFor(2000)
    // // upload file
    // await page.waitForSelector(uploadGoButton)
    // await page.click(uploadGoButton)
    // await page.waitFor(1000)

    // check uploaded file
    // let data = await page.evaluate((documentTable) => {
    //   //   debugger
    //   const rows = Array.from(document.querySelectorAll(documentTable +' tr'));
    //   const tds = Array.from(document.querySelectorAll(documentTable + ' tr td'))
    //   return { txtData:  tds.map(td => td.textContent.toLowerCase()).join('|'), rowCount: rows.length
    //   }
    // },documentTable);
    //  debugger
    // console.log(data);
    try {
      //  expect(data.txtData.toLowerCase()).toEqual(expect.stringContaining('firstDoc'.toLowerCase()))
      // click the first element
      await page.evaluate((refDocMeta) => {
        let docLinks = document.querySelectorAll('#documentTable a')
        docLinks.forEach(link => {
          let el = link.parentElement.querySelector('a')
          if (el.innerText === refDocMeta.docName) {
            el.click()
          }
        })
      }, refDocMeta)
      //await page.waitForNavigation()
      await page.waitFor(5000)
      await page.waitForSelector(docName)
      // const actualDocName = page.evaluate(docName)
      expect(await page.$eval(docName, (element) => {
        return element.innerText.toLowerCase()
      })).toMatch(refDocMeta.docName.toLowerCase())
      const docMetaText = await page.$eval(docMeta, (element) => {
        //console.log(element.innerText)
        return element.innerText.toLowerCase()
      })
      //  console.log(docMetaText)
      Object.keys(refDocMeta).forEach((key) => {
        if (key !== 'docName') {
          expect(docMetaText.toLowerCase()).toEqual(expect.stringContaining(refDocMeta[key].toLowerCase()))
        }
      })
    } catch (e) {
      console.log(e)
      throw new Error('test failed')
    } finally {
      //    browser.close()
    }
  }, jasmineTimeout)
})

afterAll(() => {
  browser.close()
})