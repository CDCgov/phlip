// const puppeteer = require("puppeteer")
//import { isDebugging } from "./src/testingInit"
const commonElements = require('./commonElement')
const jasmineTimeout = 80000
const admin = {
  email: 'admin@cdc.gov'
}
const email_selector = '#email'
const login_button_selector = '#root > form > button'
//const host = 'https://phlip2dev.phiresearchlab.org';
const host = 'http://localhost:5200'

let data=null
let page
let browser
let projectsToAdd = [commonElements.testProject3, commonElements.testProject]

// beforeAll(async () => {
//   browser = await puppeteer.launch(
//     // isDebugging().puppeteer
//     {headless: false}
//   )
//   page = await browser.newPage();
// })

export const addProject = () => {
  describe('project management', () => {
    test('login', async () => {
      const date = new Date().toLocaleTimeString()
      await page.goto(`${host}/login`)
      await page.waitForSelector(email_selector)
      await page.click(email_selector)
      await page.keyboard.type(admin.email)
      await page.click('button[type=submit]')
      await page.waitForNavigation()
    }, jasmineTimeout)
    test.each(projectsToAdd)('add project %s if needed', async (project) => {
      await page.waitFor(1000)
      //    await page.waitForNavigation()
      //check if project already exists
      await clickObject(commonElements.homeSearchBox)
      await page.keyboard.type(project)
      await page.waitFor(1000)
      let data = await page.evaluate((projectList) => {
        //   debugger
        const rows = Array.from(document.querySelectorAll(projectList + ' div'))
        return {
          rowCount: rows.length
        }
      }, commonElements.projectList)
      console.log(data.rowCount)
      if (data.rowCount === 0) {
        // await page.waitForSelector('#root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > a')
        // await page.click('#root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > a')
        // await page.waitForNavigation()
        await page.waitForSelector(commonElements.addProjectButton)
        await page.click(commonElements.addProjectButton)
        await page.waitForSelector('body > div > div > form', { visible: true })
        const name = await page.$('input[name="name"]')
        await name.click()
        await page.type('input[name="name"]', project)
        const button = '#modal-action-1'
        await page.waitForSelector(button)
        await page.click(button)
        await page.waitForSelector(commonElements.errorMsg, { timeout: 3000 })
        try {
          let errorMessageText = await page.$eval(commonElements.errorMsg, el => el.textContent)
          console.log('actual message: ' + errorMessageText)
          if (errorMessageText === 'There is already a project with this name.') {
            await clickObject('#modal-action-0')
            await page.waitFor(2000)
            await clickObject(commonElements.continueButton)
          }
        } catch (e) {
          //    await browser.close()
        } finally {
          //     await browser.close()
        }
      }
    }, jasmineTimeout)
  })

  let clickObject = async (selector) => {

    const waitTime = 300
    await page.waitForSelector(selector)
    await page.waitFor(waitTime)
    await page.click(selector)
    await page.waitFor(waitTime)
  }
}

