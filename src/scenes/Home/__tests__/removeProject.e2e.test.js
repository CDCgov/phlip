const puppeteer = require('puppeteer')
//import { isDebugging } from "./src/testingInit"

const jasmineTimeout = 60000
const admin = {
  email: 'admin@cdc.gov'
}
const email_selector = '#email'
const login_button_selector = '#root > form > button'
//const host = 'https://phlip2dev.phiresearchlab.org';
const host = 'http://localhost:5200'
const uploadNewButton = '#uploadNewBtn'
const uploadGoButton = '#uploadFilesBtn'
const uploadAlertMessage = '#uploadAlert > div> div:nth-child(1) > div > div > h2 > div'
const uploadAlertCloseButton = '#uploadAlert > div > div > button'
const documentManagementBtn = '#root > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)'
const uploadCloseButton = '#uploadCloseBtn'
const uploadCloseConfirm = '#uploadCloseContBtn'
const documentTable = '#documentTable'
const bulkDropdown = '#action > div'
const bulkDelete = '#menu- > div > ul > li:nth-child(2)'
const bulkProject = '#menu- > div > ul > li:nth-child(3)'
const bulkJurisdiction = '#menu- > div > ul > li:nth-child(4)'
const testFiles = ['/Users/trungnguyen/Downloads/demo/file1.pdf','/Users/trungnguyen/Downloads/demo/file2.pdf','/Users/trungnguyen/Downloads/demo/file3.pdf']
const bulkProjectSearch = '#project-name'
const bulkJurisdictionSearch = '#jurisdiction-name'
const bulkConfirmBtn = '#bulkConfirmBtn'
const bulkConfirmBox = '#bulkConfirmBox'
const testProject = 'Zero dawn'
const testProject2 = 'Delete'
const testProject3 = 'FirstDoc'
const testJurisdiction = 'Yauco Municipio, Puerto Rico'
const testJurisdiction2 = 'Hapeville, Fulton County, Georgia (city)'
const homeSearchBox = '#project-search'
const projectEditBtn = '#root > div > div:nth-child(2) > div > div:nth-child(2) > div > div > div > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > button:nth-child(3)'
const projectDeleteBtn = 'body > div.MuiModal-root-0147.MuiDialog-root-0135.MuiDialog-scrollPaper-0136 > div.MuiPaper-root-0280.MuiPaper-elevation24-0306.MuiPaper-rounded-0281.MuiDialog-paper-0138.MuiDialog-paperScrollPaper-0139.MuiDialog-paperWidthLg-0144 > form > div:nth-child(1) > div > div:nth-child(2) > div > button'
const projDelConfirm ='body > div:nth-child(14) > div.MuiPaper-root-0280.MuiPaper-elevation24-0306.MuiPaper-rounded-0281.MuiDialog-paper-0138.Modal-paperNormal-0133.MuiDialog-paperScrollPaper-0139.MuiDialog-paperWidthSm-0142 > div.MuiDialogActions-root-0327.ModalActions-root-0325 > #modal-action-1'
const projectList = '#project-list'
const errorMsg = 'body > div > div > form > div > div > div:nth-child(1) > div > p'

let data=null
let page
let browser
let projectsToDelete = [testProject3,testProject]

// beforeAll(async () => {
// //   browser = await puppeteer.launch(
// //     // isDebugging().puppeteer
// //     { headless: false }
// //   )
// //   page = await browser.newPage()
// // })

export const removeProject = () => {
  describe('project management', () => {
    test('login', async () => {
      jest.setTimeout(8000)
      await page.goto(`${host}/login`)
      //await page.screenshot({path: 'login.png'})
      await clickObject(email_selector)
      await page.keyboard.type(admin.email)
      await page.click('button[type=submit]')
      await page.waitForNavigation()
    }, jasmineTimeout)
    test.each(projectsToDelete)('remove project %s if needed', async (project) => {
      await page.waitFor(1000)
      await page.goto(`${host}/home`)

      //await page.waitForNavigation()
      //check if project exists
      await clickObject(homeSearchBox)
      // await page.waitForSelector(homeSearchBox)
      // await page.click(homeSearchBox)
      await page.keyboard.type(project)
      await page.waitFor(500)
      let data = await page.evaluate((projectList) => {
        //   debugger
        const rows = Array.from(document.querySelectorAll(projectList + ' div'))
        return {
          rowCount: rows.length
        }
      }, projectList)
      if (data.rowCount >= 1) {
        console.log(`#${project.replace(' ', '_')}`)
        await clickObject(`#${project.replace(' ', '_')}`)
        await clickObject(projectEditBtn)
        await clickObject(projectDeleteBtn)
        await page.waitFor(200)
        await clickObject(projDelConfirm)
        data = await page.evaluate((projectList) => {
          //   debugger
          const rows = Array.from(document.querySelectorAll(projectList + ' div'))
          return {
            rowCount: rows.length
          }
        }, projectList)
        expect(data.rowCount).toBe(0)
      } else {
        // do nothing
      }
    }, 30000)
  })
}

// afterAll(async () => {
//   browser.close()
// })

let clickObject = async (selector) => {

  const waitTime = 300
  await page.waitForSelector(selector)
  await page.waitFor(waitTime)
  await page.click(selector)
  await page.waitFor(waitTime)
}
