const puppeteer = require('puppeteer')
const fs = require('fs')
const { config } = require('./config')

async function visit(url) {
	console.log(`visit() ~ lauching browser...`)
	const browser = await puppeteer.launch({ 
		executablePath: '/usr/bin/google-chrome-stable', // Find exec path with "$ which google-chrome-stable"
		headless: true, 
		timeout: 5000, 
		args: ['--no-sandbox']
	})
	
	console.log(`visit() ~ browser open new page... ${browser}`)
    var page = await browser.newPage()
	
	console.log(`visit() ~ setting cookies...`)
	await page.setCookie({
		name: 'flag',
		value: config.FLAG,
		domain: config.SERVER_BLOG_HOSTNAME,
		samesite: 'lax',
		httpOnly: false,
		secure: false,
	})

	console.log(`visit() ~ url ${url}`)
	await page.goto(url)

	console.log(`visit() ~ waiting 2sec`)
	await new Promise(resolve => setTimeout(resolve, 10000));
	
	console.log(`Closing page at ${page.url()}`)
	await page.close()

	await browser.close()
}

module.exports = { visit }
