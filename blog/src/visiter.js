const puppeteer = require('puppeteer')
const fs = require('fs')
const { config } = require('./config')

async function visit(url) {
	const browser = await puppeteer.launch({ args: ['--no-sandbox']})
	
    var page = await browser.newPage()
	await page.setCookie({
		name: 'flag',
		value: config.FLAG,
		domain: config.SERVER_BLOG_HOSTNAME,
		samesite: 'lax',
		httpOnly: false,
		secure: false,
	})
	await page.goto(url)

	await new Promise(resolve => setTimeout(resolve, 2000));
	await page.close()
	await browser.close()
}

module.exports = { visit }
