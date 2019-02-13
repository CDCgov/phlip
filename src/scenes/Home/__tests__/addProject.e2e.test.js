const puppeteer = require('puppeteer')
const userList = ['tester1', 'trung']

const admin = { email: 'admin@cdc.gov' }
const email_selector = '#email'
const login_button_selector = '#root > form > button'
const host = 'http://localhost:5200'

// find the link, by going over all links on the page
describe('project creation', () => {
  test('add new project', async () => {
    const browser = await puppeteer.launch({
      headless: true
    })
    const page = await browser.newPage()

    await page.goto(`${host}/login`)
    await page.click(email_selector)
    await page.keyboard.type(admin.email)
    await page.click('button[type=submit]')
    await page.waitForNavigation()

    await page.waitForSelector('#root > div > div:nth-child(2) > div > div.MuiGrid-container-01.MuiGrid-align-items-xs-center-09 > div:nth-child(3) > div > a')
    await page.click('#root > div > div:nth-child(2) > div > div.MuiGrid-container-01.MuiGrid-align-items-xs-center-09 > div:nth-child(3) > div > a')

    await page.waitFor('input[name=name]')
    await page.click('#name')
    await page.$eval('input[name=name]', el => el.value = 'project 1')
    // await page.keyboard.press('Tab')
    // await page.keyboard.press('Tab')
    // await page.keyboard.press('Tab')
    await page.waitFor('button[type=submit]')
    await page.click('button[type=submit]')
    await page.waitForNavigation()

    let projectTxt = await findByLink(page, 'Project 1')
    try {
      expect(projectTxt).not.toBe(null)
    } catch (e) {
      //  console.log(e);
      throw new Error('Project does not exist')
    } finally {
      await browser.close()
    }
  }, 16000)

  function getText(linkText) {
    linkText = linkText.replace(/\r\n|\r/g, '\n')
    linkText = linkText.replace(/\ +/g, ' ')

    // Replace &nbsp; with a space
    const nbspPattern = new RegExp(String.fromCharCode(160), 'g')
    return linkText.replace(nbspPattern, ' ')
  }

  async function findByLink(page, linkString) {
    const links = await page.$$('a')
    for (let i = 0; i < links.length; i++) {
      let valueHandle = await links[i].getProperty('innerText')
      let linkText = await valueHandle.jsonValue()
      const text = getText(linkText)
      if (linkString === text) {
        console.log(linkString)
        console.log(text)
        console.log('Found')
        return links[i]
      }
    }
    return null
  }
})