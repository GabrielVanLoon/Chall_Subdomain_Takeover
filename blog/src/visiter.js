const puppeteer = require('puppeteer')
const fs = require('fs')

async function visit(url) {
	const browser = await puppeteer.launch({ args: ['--no-sandbox']})
	
    var page = await browser.newPage()
	await page.setCookie({
		name: 'flag',
		value: process.env.FLAG || 'flag{admin_s3cr3t}',
		domain: process.env.SERVER_DOMAIN || 'localhost',
		samesite: 'strict'
	})
	await page.goto(url)

	await new Promise(resolve => setTimeout(resolve, 2000));
	await page.close()
	await browser.close()
}

module.exports = { visit }
