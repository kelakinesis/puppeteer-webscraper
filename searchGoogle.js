const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');

const searchGoogle = async (searchQuery) => {
  // const browser = await puppeteer.launch({headless: false}); // headless: false to see the browser
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto('https://www.google.com');

  // Find input element with name 'q' and type in searchQuery
  await page.type('input[name="q"]', searchQuery);

  // Click Enter to submit the form
  // await page.keyboard.press('Enter');
  
  // Find the first input with name 'btnK' and use the click DOM Event Method to click it
  await page.$eval('input[name="btnK"]', button => button.click());
  
  // Wait for the div with id 'search' to be visible
  // await page.waitForSelector('#search');
  await page.waitForSelector('div[id="search"]');

  // Get and loop through each div with class 'g'
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

  // console.dir(searchResults);

  // await page.screenshot({ path: 'q-search-query-check.png' });
  
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

// averageTime();  // Average time: 1971.284685051441ms (1.97s)
// searchGoogle('save my succulent'); // Test the searchGoogle function

// Export the searchGoogle function so it can be used in server.js
module.exports = searchGoogle;
