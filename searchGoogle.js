const puppeteer = require('puppeteer-extra');
const { performance } = require('perf_hooks');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({blockTrackers: true}));

const searchGoogle = async (searchQuery) => {
  const browser = await puppeteer.launch({headless: true});

  const page = await browser.newPage();

  // Avoid requests for images and stylesheets
  // await page.setRequestInterception(true);
  // page.on('request', request => {
  //   if (request.resourceType() === 'image' || request.resourceType() === 'stylesheet') {
  //     request.abort();
  //   } else {
  //     request.continue();
  //   }
  // });

  await page.goto('https://www.google.com/search?q='+searchQuery);

  // Wait for the dev with id 'search' to load
  await page.waitForSelector('div[id=search]');

  // Get and loop through each div with class 'g'
  // To-do: update to include Youtube results
  const searchResults = await page.$$eval('div[class="g"]', divs => {
    const results = [];
    divs.forEach(div => {
      const result = {
        title: div.querySelector('h3').innerText,
        link: div.querySelector('a').getAttribute('href'),
        description: div.querySelector('div[class="IsZvec"]').textContent
      };
      results.push(result);
    });
    return results;
  });
  
  await browser.close();

  return searchResults;
};

const averageTime = async () => {
  const durationList = [];
  
  // Calculate the average time by running the searchGoogle function 20 times
  for (let i = 0; i < 20; i++) {
    const startTime = performance.now();
    await searchGoogle('node.js');
    const endTime = performance.now();
    durationList.push(endTime - startTime);
  }

  // Calculate the average time
  const averageTime = durationList.reduce((total, time) => total + time, 0) / durationList.length;

  console.log(`Average time: ${averageTime}ms`);
};

// Export the searchGoogle function so it can be used in server.js
module.exports = searchGoogle;
