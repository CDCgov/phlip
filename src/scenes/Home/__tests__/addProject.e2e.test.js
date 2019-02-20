const admin = { email: 'admin@cdc.gov' }
const email_selector = '#email'
const host = 'http://localhost:5200'
const errorMsg = 'body > div > div > form > div > div > div:nth-child(1) > div > p'

// find the link, by going over all links on the page
describe('project creation', () => {
  test('add new project', async () => {
    const date = new Date().toLocaleTimeString()
    await page.goto(`${host}/login`)
    await page.click(email_selector)
    await page.keyboard.type(admin.email)
    await page.click('button[type=submit]')
    await page.waitForNavigation()

    // Add project button
    await page.waitForSelector('#root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > a')
    await page.click('#root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > a')
    await page.waitForNavigation()
    await page.waitFor(1000)

    await page.waitForSelector('body > div.MuiModal-root-0243.MuiDialog-root-0231.MuiDialog-scrollPaper-0232 > div.MuiPaper-root-0317.MuiPaper-elevation24-0343.MuiPaper-rounded-0318.MuiDialog-paper-0234.MuiDialog-paperScrollPaper-0235.MuiDialog-paperWidthSm-0238 > form', { visible: true })
    const name = await page.$('input[name="name"]')
    await name.click()
    await page.type('input[name="name"]', `Project - ${date}`)
    const button = '#modal-action-1'
    await page.waitForSelector(button)
    await page.click(button)
    await page.waitForNavigation()

    const projectTxt = await findByLink(page, `Project - ${date}`)
    expect(projectTxt).not.toBe(null)
  }, 600000)

  test('add project firstDoc if needed', async () => {
    await page.goto(`${host}/home`)
    //    await page.waitForNavigation()
    await page.waitForSelector('#root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > a')
    await page.click('#root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > a')
    await page.waitForNavigation()

    await page.waitForSelector('body > div > div > form', { visible: true })
    const name = await page.$('input[name="name"]')
    await name.click()
    await page.type('input[name="name"]', 'FirstDoc')
    const button = '#modal-action-1'
    await page.waitForSelector(button)
    await page.click(button)
    await page.waitForSelector(errorMsg)
    try {
      let errorMessageText = await page.$eval(errorMsg, el => el.textContent)
      console.log('actual message: ' + errorMessageText)
      if (errorMessageText === 'There is already a project with this name.') {
        await page.waitForSelector('#modal-action-0')
        await page.click('#modal-action-0')
        await page.waitFor(1000)
      }
    } catch (e) {
      //    await browser.close()
    } finally {
      //     await browser.close()
    }
  },60000)
  test('add project zero dawn if eeded', async () => {
    await page.goto(`${host}/home`)
    //    await page.waitForNavigation()
    //check if project already exists
    await page.waitForSelector('#root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > a')
    await page.click('#root > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > a')
    await page.waitForNavigation()

    await page.waitForSelector('body > div > div > form', { visible: true })
    const name = await page.$('input[name="name"]')
    await name.click()
    await page.type('input[name="name"]', 'Zero dawn')
    const button = '#modal-action-1'
    await page.waitForSelector(button)
    await page.click(button)
    await page.waitForSelector(errorMsg)
    try {
      let errorMessageText = await page.$eval(errorMsg, el => el.textContent)
      console.log('actual message: ' + errorMessageText)
      if (errorMessageText === 'There is already a project with this name.') {
        await page.waitForSelector('#modal-action-0')
        await page.click('#modal-action-0')
        await page.waitFor(1000)
      }
    } catch (e) {
      //    await browser.close()
    } finally {
      //     await browser.close()
    }
  },60000)

})

function getText(linkText) {
  linkText = linkText.replace(/\r\n|\r/g, '\n')
  linkText = linkText.replace(/\+/g, ' ')

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
      return links[i]
    }
  }
  return null
}