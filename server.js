const { response } = require('express');
const express = require('express');
const app = express();
const port = 3000;

// Immport the puppeteer searchGoogle function
const searchGoogle = require('./searchGoogle');

app.get('/search', (request, response) => {
  const searchQuery = request.query.searchquery;

  if (searchQuery) {
    searchGoogle(searchQuery)
      .then(results => {
        // Return a 200 status with Results as JSON back to the client
        response.status(200);
        response.json(results);
      });
  } else {
    console.log('No search query provided');
    response.end();
  }
});

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`No wahala. Listening on port ${port}!`));

